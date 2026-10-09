import { NextResponse } from "next/server";

const CONTACT_TO = process.env.CONTACT_TO || "info@tiltedneedle.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM = process.env.CONTACT_FROM;

const SUBJECTS: Record<string, string> = {
  contact: "New enquiry — Tilted Needle",
  application: "New application — Tilted Needle",
};

// Longest value we'll accept per field, and the overall body cap.
const MAX_FIELD = { name: 200, email: 320, company: 200, role: 200, experience: 200, link: 2000, message: 5000 };
const MAX_BODY_BYTES = 16 * 1024;

// Per-IP sliding window. In-memory, so it's per server instance — a real
// deployment behind multiple instances should use a shared store.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

// A browser always sends Origin with a POST from a page. One from another
// site's page is refused: this endpoint only serves the site's own forms.
// Requests with no Origin at all (scripts, curl) still meet the limits below.
function fromAnotherSite(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

// On Vercel the platform overwrites X-Forwarded-For with the real client
// address, so its first entry cannot be forged from outside.
function clientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  type?: string;
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  role?: string;
  experience?: string;
  link?: string;
  /** The hidden field (lib/honeypot). Only bots fill it in. */
  trap?: string;
};

function renderBody(payload: Payload) {
  const rows: string[] = [];
  const add = (label: string, value?: string) => {
    if (value && value.trim()) rows.push(`${label}: ${value.trim()}`);
  };

  if (payload.type === "application") {
    add("Name", payload.name);
    add("Email", payload.email);
    add("Role", payload.role);
    add("Experience", payload.experience);
    add("Portfolio / CV", payload.link);
  } else {
    add("Name", payload.name);
    add("Email", payload.email);
    add("Company", payload.company);
  }
  add("Message", payload.message);

  return rows.join("\n");
}

export async function POST(request: Request) {
  if (fromAnotherSite(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 403 });
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Message too large." }, { status: 413 });
  }

  let payload: Payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // A bot filled the hidden field. Answer as if it went, so it learns
  // nothing, and send nothing.
  if (typeof payload.trap === "string" && payload.trap.trim()) {
    return NextResponse.json({ ok: true });
  }

  // Coerce to strings and enforce per-field caps.
  for (const [field, limit] of Object.entries(MAX_FIELD) as Array<
    [keyof typeof MAX_FIELD, number]
  >) {
    const value = payload[field];
    if (value === undefined || value === null) continue;
    if (typeof value !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }
    if (value.length > limit) {
      return NextResponse.json(
        { ok: false, error: `That ${field} is too long.` },
        { status: 400 }
      );
    }
  }

  // Own keys only: `in` also accepted inherited names such as "toString",
  // which made the subject a function and the send fail.
  const type = typeof payload.type === "string" && Object.hasOwn(SUBJECTS, payload.type) ? payload.type : "contact";
  const subject = SUBJECTS[type];

  // Applications carry their detail in role/experience/link, and the careers
  // form presents Message as optional — so only the contact form requires it.
  const needsMessage = type !== "application";
  if (
    !payload.name?.trim() ||
    !payload.email?.trim() ||
    (needsMessage && !payload.message?.trim())
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: needsMessage
          ? "Please fill in your name, email, and message."
          : "Please fill in your name and email.",
      },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(payload.email.trim())) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // No transport configured: tell the client to fall back to a mailto: link so
  // the enquiry still reaches us rather than silently failing.
  if (!RESEND_API_KEY || !CONTACT_FROM) {
    return NextResponse.json({ ok: false, fallback: true, to: CONTACT_TO, subject });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      // A provider that hangs must not hang the visitor: past this the client
      // gets the mailto fallback, which is the same outcome as a 5xx.
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: payload.email.trim(),
        subject,
        text: renderBody(payload),
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, fallback: true, to: CONTACT_TO, subject });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, fallback: true, to: CONTACT_TO, subject });
  }
}
