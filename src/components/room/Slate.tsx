"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { pad2 } from "@/lib/films";

/**
 * The slate. Once per device the site opens on a clapperboard: production,
 * reel, scene, take, and a timecode that is actually running. It plays the
 * way a slate does on set: held up with the clapper open, the clapper snaps
 * shut, the board is pulled out of frame, one black beat, then the cold open
 * is simply there.
 *
 * The whole run is CSS (globals.css, "slate"), timed from the first paint,
 * so it leaves on time however late the page's JavaScript arrives, and even
 * if it never does. It used to be a timer started once the page had
 * hydrated: on a slow phone the slate held the screen for four and a half
 * seconds, and with a script that failed to load it never left at all, only
 * Skip (itself a script) could clear it. This component cuts the run short
 * (Escape, click, Skip), remembers it was seen, and takes it out of the page
 * once it has played.
 *
 * Rendered by the server so there is never a flash of the page beneath it;
 * the home page's inline script and the layout effect below keep it from
 * anyone who has seen it and anyone who prefers reduced motion.
 */
const KEY = "tn-slate-seen";
// Where the pull out of frame begins in the CSS run (globals.css, keep in step).
const EXIT_MS = 1850;
// The run's own animations; the timecode's endless reels are left alone.
const RUN = new Set(["slate-fade", "slate-cut", "slate-board", "slate-clap"]);

export function Slate() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem(KEY));
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deliberately synchronous: this must land before first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (seen || reduced) setDone(true);
  }, []);

  // Jump the run to the pull-out, so a skip still leaves the way the slate
  // always leaves, just sooner.
  const skip = useCallback(() => {
    const el = root.current;
    if (!el) return;
    for (const a of el.getAnimations({ subtree: true })) {
      const name = (a as CSSAnimation).animationName;
      if (RUN.has(name) && Number(a.currentTime) < EXIT_MS) a.currentTime = EXIT_MS;
    }
  }, []);

  useEffect(() => {
    const el = root.current;
    if (done || !el) return;
    const finish = () => {
      try {
        localStorage.setItem(KEY, "1");
      } catch {
        // private mode: the slate simply plays again next time
      }
      setDone(true);
    };
    const cut = el.getAnimations().find((a) => (a as CSSAnimation).animationName === "slate-cut");
    // Hydrated after the run had already ended: it is off screen; tidy up.
    if (!cut || cut.playState === "finished") {
      finish();
      return;
    }
    document.body.style.overflow = "hidden";
    const end = (e: AnimationEvent) => {
      if (e.animationName === "slate-cut") finish();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    el.addEventListener("animationend", end);
    window.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("animationend", end);
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [done, skip]);

  if (done) return null;

  // data-slate-root: hidden by CSS from the first paint for anyone the
  // home page's inline script marks (seen it, or reduced motion). The layout
  // effect above runs only once the JavaScript has loaded, which on a slow
  // phone is seconds after that paint.
  return (
    <div ref={root} data-slate-root="" className="slate fixed inset-0 z-[9996] bg-black text-[color:var(--ink)]" onClick={skip}>
      <div className="flex h-full w-full items-center justify-center px-6">
        <div className="slate-board w-full max-w-[760px]">
          {/* the clapper: the top stick is hinged at the left and claps
              shut onto the base; its stripes run the other way, so shut
              they meet in chevrons */}
          <div aria-hidden="true" className="slate-clapper">
            <span className="slate-stick slate-stick-top" />
            <span className="slate-stick slate-stick-base" />
            <span className="slate-hinge" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-[color:var(--rule-strong)] py-4 mono-lg text-[color:var(--ink-soft)]">
            <div>
              <span className="text-[color:var(--ink-mid)]">Prod.</span> Tilted Needle
            </div>
            <div className="text-right">
              <span className="text-[color:var(--ink-mid)]">Reel</span> 2026
            </div>
            <div>
              <span className="text-[color:var(--ink-mid)]">Scene</span> 01
            </div>
            <div className="text-right">
              <span className="text-[color:var(--ink-mid)]">Take</span> 01
            </div>
          </div>

          <p className="display mt-8 text-[clamp(72px,16vw,220px)] leading-[0.86]">
            Tilted
            <br />
            Needle
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-[color:var(--rule-strong)] pt-4">
            <p className="mono-lg text-[color:var(--ink-soft)]">
              <span className="text-[color:var(--ink-mid)]">TC</span> <Timecode />
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skip();
              }}
              className="slate-link"
            >
              Skip &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// The timecode rolls in CSS from the first paint (globals.css, .tc-run):
// a strip of numbers per field, stepped one line at a time, frames at 25 a
// second and seconds beneath them. It used to be written by script, so on a
// slow phone it sat at 00:00:00:00 until the page had hydrated.
const strip = (n: number) => Array.from({ length: n }, (_, i) => pad2(i)).join("\n");

function Timecode() {
  return (
    <span className="tc tc-run" aria-hidden="true">
      <span>00:00:</span>
      <span className="tc-col">
        <span className="tc-reel tc-sec">{strip(10)}</span>
      </span>
      <span>:</span>
      <span className="tc-col">
        <span className="tc-reel tc-frame">{strip(25)}</span>
      </span>
    </span>
  );
}
