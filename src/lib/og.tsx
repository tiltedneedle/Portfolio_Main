import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The pieces every share image is built from: the site's colours as plain
 * values, its three faces, the clapper stripe and a slate row. Shared by the
 * home card (app/opengraph-image) and each film's (app/(site)/film/[slug]).
 *
 * Satori (which renders these at build time) reads TTF/OTF/WOFF only, so the
 * three faces here are static WOFF copies of the variable woff2 the site uses.
 * Flexbox and inline styles only; no CSS variables, no repeating gradients.
 */
export const STAGE = "#0b0b0c";
export const INK = "#f2efe9";
export const MID = "#8e8a82";
export const FAINT = "#56534e";
export const RULE = "rgba(242,239,233,0.24)";
export const TALLY = "#e2422b";

async function font(file: string) {
  return readFile(join(process.cwd(), "src/app/fonts", file));
}

/** The three faces, ready for ImageResponse's `fonts` option. */
export async function ogFonts() {
  const [display, serif, mono] = await Promise.all([
    font("big-shoulders-display-800.woff"),
    font("instrument-serif-italic.woff"),
    font("jetbrains-mono-500.woff"),
  ]);
  return [
    { name: "Display", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Serif", data: serif, weight: 400 as const, style: "italic" as const },
    { name: "Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

/** The clapper stripe: alternating blocks, since Satori has no repeating gradient. */
export function Stripe() {
  return (
    <div style={{ display: "flex", overflow: "hidden", width: "100%", gap: 0 }}>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} style={{ width: 50, height: 18, background: i % 2 === 0 ? INK : "transparent", transform: "skewX(-30deg)" }} />
      ))}
    </div>
  );
}

/** One line of the slate: a key and value at each end. */
export function SlateRow({ left, right }: { left: [string, string]; right: [string, string] }) {
  const cell = (k: string, v: string, align: "flex-start" | "flex-end") => (
    <div style={{ display: "flex", gap: 14, justifyContent: align, fontFamily: "Mono", fontSize: 20, letterSpacing: "0.12em", color: MID }}>
      <span style={{ color: FAINT }}>{k}</span>
      <span>{v}</span>
    </div>
  );
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      {cell(left[0], left[1], "flex-start")}
      {cell(right[0], right[1], "flex-end")}
    </div>
  );
}
