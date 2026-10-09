import { ImageResponse } from "next/og";
import { INK, MID, RULE, STAGE, TALLY, SlateRow, Stripe, ogFonts } from "@/lib/og";

export const alt = "Tilted Needle. Cut for the scroll.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const readouts = [
  { value: "5B+", label: "ORGANIC VIEWS" },
  { value: "$250M+", label: "REVENUE GENERATED" },
  { value: "11+", label: "FLAGSHIP CLIENTS" },
];

// The colours, faces, stripe and slate rows live in lib/og, shared with each
// film's card (app/(site)/film/[slug]/opengraph-image).
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: STAGE,
          padding: "44px 72px 48px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <Stripe />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: "14px 0" }}>
            <SlateRow left={["PROD.", "TILTED NEEDLE"]} right={["REEL", "2026"]} />
            <SlateRow left={["SCENE", "01"]} right={["TAKE", "01"]} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Display", fontSize: 150, lineHeight: 0.86, color: INK, letterSpacing: "0.01em", display: "flex", whiteSpace: "nowrap" }}>
            CUT FOR THE
          </div>
          <div style={{ fontFamily: "Serif", fontSize: 132, lineHeight: 0.9, color: INK, display: "flex", marginTop: 6 }}>scroll.</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1px solid ${RULE}`, paddingTop: 18 }}>
          <div style={{ display: "flex", gap: 56 }}>
            {readouts.map((r) => (
              <div key={r.label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "Display", fontSize: 54, lineHeight: 1, color: INK, display: "flex" }}>{r.value}</div>
                <div style={{ marginTop: 8, fontFamily: "Mono", fontSize: 16, letterSpacing: "0.12em", color: MID, display: "flex" }}>{r.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "Mono", fontSize: 18, letterSpacing: "0.12em", color: MID }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: TALLY, display: "flex" }} />
            LONDON · DUBAI
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() }
  );
}
