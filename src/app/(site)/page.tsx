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
// already knows whether to show it: returning visitors and reduced motion
// skip it (globals.css, data-slate-root). Static and developer-written.
const SKIP_SLATE =
  'try{if(localStorage.getItem("tn-slate-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-slate","skip")}catch(e){}';

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
