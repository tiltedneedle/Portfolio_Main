import { ImageResponse } from "next/og";
import { filmBySlug, films, pad2 } from "@/lib/films";
import { INK, MID, RULE, STAGE, TALLY, SlateRow, Stripe, ogFonts } from "@/lib/og";

/**
 * Each film's share card, in the same slate as the home card: the film's
 * number, client and year, its title, the line it is known for, and its two
 * numbers. Film pages used to share with no image at all, because setting
 * their own share title replaced the inherited card instead of adding to it.
 *
 * Drawn only from the film's own record, never from the address: an unknown
 * slug gets a 404 (and dynamicParams is off, so only the eight are built).
 */
export const alt = "A Tilted Needle film: the title, the client and the results.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return films.map((f) => ({ slug: f.slug }));
}

/** Two balanced lines for a longer title; one line when it is short. */
function titleLines(title: string): string[] {
  const words = title.toUpperCase().split(" ");
  if (title.length <= 14 || words.length < 2) return [words.join(" ")];
  let best: string[] = [title.toUpperCase()];
  let bestLongest = Infinity;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const longest = Math.max(...lines.map((l) => l.length));
    if (longest < bestLongest) {
      best = lines;
      bestLongest = longest;
    }
  }
  return best;
}

export default async function FilmCard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const film = filmBySlug(slug);
  if (!film) return new Response("Not found", { status: 404 });

  const lines = titleLines(film.title);
  // Two lines at 120px touched the slate's rules above and below; 104 leaves
  // the same air as the one-line cards.
  const titleSize = lines.length === 1 ? 150 : 104;
  const highlightSize = lines.length === 1 ? 52 : 46;

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
            <SlateRow left={["PROD.", "TILTED NEEDLE"]} right={["FILM", pad2(film.index)]} />
            <SlateRow left={["CLIENT", film.client.toUpperCase()]} right={["YEAR", film.year]} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {lines.map((line) => (
            <div key={line} style={{ fontFamily: "Display", fontSize: titleSize, lineHeight: 0.86, color: INK, letterSpacing: "0.01em", display: "flex", whiteSpace: "nowrap" }}>
              {line}
            </div>
          ))}
          <div style={{ fontFamily: "Serif", fontSize: highlightSize, lineHeight: 1, color: INK, display: "flex", marginTop: 18 }}>{film.highlight}</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1px solid ${RULE}`, paddingTop: 18 }}>
          <div style={{ display: "flex", gap: 56 }}>
            {film.metrics.slice(0, 3).map((m) => (
              <div key={m.label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "Display", fontSize: 54, lineHeight: 1, color: INK, display: "flex" }}>{m.value}</div>
                <div style={{ marginTop: 8, fontFamily: "Mono", fontSize: 16, letterSpacing: "0.12em", color: MID, display: "flex" }}>{m.label.toUpperCase()}</div>
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
