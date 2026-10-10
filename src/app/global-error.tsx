"use client";

/**
 * The last resort: shown when the root layout itself fails, so it cannot use
 * the site's stylesheet, fonts or components (Next renders it as its own
 * document). The room's colours as plain values, system type, and the same
 * two ways out as app/error.tsx.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en-GB">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", background: "#0b0b0c", color: "#f2efe9", fontFamily: "system-ui, -apple-system, Segoe UI, Arial, sans-serif" }}>
        <title>Something went wrong | Tilted Needle</title>
        <main style={{ padding: "0 24px", maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8e8a82" }}>Error / Cut short</p>
          <h1 style={{ fontSize: "clamp(40px, 9vw, 88px)", lineHeight: 0.95, margin: "24px 0 0", fontWeight: 800, textTransform: "uppercase" }}>This take broke.</h1>
          <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.6, color: "#8e8a82" }}>Something went wrong on our side while this page loaded. Try it again, or go back to the reel.</p>
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 32 }}>
            <button type="button" onClick={() => retry()} style={{ background: "#f2efe9", color: "#0b0b0c", border: 0, borderRadius: 999, padding: "12px 28px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
              Try again
            </button>
            {/* A plain link, a full load: here the app shell is what failed,
                so client-side navigation cannot be trusted. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ color: "#f2efe9", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Back to the reel
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
