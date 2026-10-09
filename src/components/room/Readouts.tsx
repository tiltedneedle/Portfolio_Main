"use client";

import { useEffect, useRef, useState } from "react";
import { timecode } from "@/lib/films";

/**
 * Small live instruments used around the room: a running timecode and the
 * two studio clocks. Both are filled by effects so the server never guesses
 * a time and the client never has to correct one.
 */

// Redraws every frame, but only while it is on screen: it used to run for
// as long as the page was open, scrolled away or not.
export function RunningTimecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      el.textContent = timecode((performance.now() - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry?.isIntersecting) raf = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <span ref={ref} className={"tc " + className}>
      00:00:00:00
    </span>
  );
}

// London and Dubai worked out by hand, not with Intl.DateTimeFormat: the
// first Intl formatter a page creates loads ICU's time-zone data, about
// 400ms of main thread on a slow phone, during hydration (and these clocks
// are not even shown on phones). Dubai keeps UTC+4 all year; the UK moves
// to UTC+1 at 01:00 UTC on the last Sunday of March and back on the last
// Sunday of October. Checked against Intl at every quarter hour, 2024-2030.
const pad = (n: number) => (n < 10 ? "0" : "") + n;

function lastSundayUTC(year: number, month: number) {
  const d = new Date(Date.UTC(year, month + 1, 0, 1)); // the month's last day, 01:00 UTC
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.getTime();
}

function londonOffset(now: Date) {
  const y = now.getUTCFullYear();
  const t = now.getTime();
  return t >= lastSundayUTC(y, 2) && t < lastSundayUTC(y, 9) ? 1 : 0;
}

function clock(now: Date, offsetHours: number) {
  const d = new Date(now.getTime() + offsetHours * 3600000);
  return pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
}

const ZONES = [
  { code: "LDN", offset: londonOffset },
  { code: "DXB", offset: () => 4 },
];

export function StudioClocks({ className = "" }: { className?: string }) {
  const [times, setTimes] = useState<string[]>(ZONES.map(() => "--:--"));
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes(ZONES.map((z) => clock(now, z.offset(now))));
    };
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={"mono " + className}>
      {ZONES.map((z, i) => (
        <span key={z.code} className={i > 0 ? "ml-4" : ""}>
          {z.code} <span className="tc text-[color:var(--ink-soft)]">{times[i]}</span>
        </span>
      ))}
    </span>
  );
}
