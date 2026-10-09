"use client";

import { useState } from "react";
import { EmbedModal } from "@/components/room/EmbedModal";
import { RunningTimecode, StudioClocks } from "@/components/room/Readouts";
import picksData from "@/lib/published-picks.json";
import type { Published } from "@/lib/published";
import { HeroDust } from "@/components/room/HeroDust";
import { HeroBackdrop } from "@/components/room/HeroBackdrop";

/**
 * The cold open. No slate, no title: a strip of the studio's published cuts
 * drifts behind the statement (HeroBackdrop), dimmed to the point where the
 * type reads. The statement is the studio's claim, set in the condensed face
 * with one word dropped to the serif italic. Two controls, both mono.
 *
 * The backdrop used to be a running film with a sound toggle. When the strip
 * replaced it (2ed6f47) the video element went but its loader, its playing
 * and sound state and the Sound button stayed behind, wired to nothing; they
 * are gone now. The lamp reads "Rec" while the reel is open.
 */

// The reel behind "play reel": the studio's own week-in-the-life short from
// the published index, until a cut showreel exists.
const reel = (picksData as unknown as Record<string, Published | null>)["__reel"];

// The statement's lines rise out of a mask. CSS (globals.css, .enter-mask),
// not Framer Motion, so the rise starts with the first paint instead of
// after hydration; reduced motion shows the line at rest.
function Masked({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span className="enter-mask block" style={{ animationDelay: delay + "s" }}>
        {children}
      </span>
    </span>
  );
}

export function ColdOpen() {
  const [reelOpen, setReelOpen] = useState(false);
  const live = reelOpen;

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[color:var(--stage)]">
      {/* the film backdrop behind everything */}
      <div aria-hidden="true" className="absolute inset-0">
        <HeroBackdrop />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,11,12,0.95)] via-[rgba(11,11,12,0.6)] to-[rgba(11,11,12,0.7)]" />
        <HeroDust />
      </div>

      {/* HUD: the room's instruments */}
      <div className="absolute inset-x-0 top-20 flex items-center justify-between px-6 md:px-14 mono">
        <p className="flex items-center gap-2">
          <span className={live ? "lamp" : "lamp-off"} aria-hidden="true" />
          <span>{live ? "Rec" : "Standby"}</span>
          <RunningTimecode className="ml-2 text-[color:var(--ink-soft)]" />
        </p>
        <StudioClocks className="max-md:hidden" />
      </div>

      {/* the statement */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-14 md:pb-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display text-[clamp(64px,12.5vw,208px)]">
              <Masked>Cut for the</Masked>
              <Masked delay={0.12}>
                <span className="em-serif">scroll.</span>
              </Masked>
            </h1>
            <p
              className="enter-fade mt-6 max-w-[42ch] text-[17px] leading-relaxed text-[color:var(--ink-soft)]"
              style={{ animationDelay: "0.7s" }}
            >
              A short-form studio in London and Dubai. Eight films below, five billion views
              between them, and $250M+ in revenue for the people on screen.
            </p>
          </div>

          <div className="enter-fade flex flex-wrap items-center gap-x-8 gap-y-3 mono-lg" style={{ animationDelay: "0.9s" }}>
            <a href="#work" className="slate-link text-[13px]" data-cursor="Cut">
              View work &darr;
            </a>
            {reel?.videoId && (
              <button type="button" onClick={() => setReelOpen(true)} className="slate-link text-[13px]" data-cursor="Play">
                Play reel &#9654;
              </button>
            )}
          </div>
        </div>
      </div>

      {reel && <EmbedModal videoId={reel.videoId} title={reel.title} open={reelOpen} onClose={() => setReelOpen(false)} />}
    </section>
  );
}
