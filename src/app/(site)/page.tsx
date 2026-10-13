import type { Metadata } from "next";
import { Slate } from "@/components/room/Slate";
import { ColdOpen } from "@/components/room/ColdOpen";
import { Sequence } from "@/components/room/Sequence";
import { TitleCard } from "@/components/room/TitleCard";
import { CreditsRoll } from "@/components/room/CreditsRoll";
import { ResultsSlate } from "@/components/room/ResultsSlate";
import { EndSlate } from "@/components/room/EndSlate";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Parsed and run before the slate's markup, so the browser's first paint
// already knows whether to show it (globals.css, data-slate-root). It is
// skipped for returning visitors, for reduced motion, where nothing can be
// remembered (it would play on every visit), and where the visit began on
// another page of this site: the slate opens the site, it does not cut into
// a visit. The nav's section links (Work, Contact) load this page afresh,
// hence the referrer; the site's other links arrive without a page load, so
// this never runs and the missing mark (window.__tnSlate) tells Slate the
// same. Static and developer-written.
const SKIP_SLATE =
  'try{var a=!document.referrer||new URL(document.referrer).origin!==location.origin;if(!a||localStorage.getItem("tn-slate-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-slate","skip");else window.__tnSlate=1}catch(e){document.documentElement.setAttribute("data-slate","skip")}';

// The reel, in running order: slate (once), cold open, the sequence of eight
// films, the studio as a title card, the clients as credits, the results as
// slate lines, and contact as the end slate. The footer is the tail leader.
export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SKIP_SLATE }} />
      <Slate />
      <ColdOpen />
      <Sequence />
      <TitleCard />
      <CreditsRoll />
      <ResultsSlate />
      <EndSlate />
    </>
  );
}
