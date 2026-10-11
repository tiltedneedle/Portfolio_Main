"use client";

import { setStill } from "@/lib/still";
import { useStill } from "@/lib/use-still";

/**
 * Pause motion / Play motion: the visitor's switch for every endless loop on
 * the site (lib/still.ts), in the footer on every page and on the client
 * logos' crawl. `short` shows only the verb, for tight spots; its accessible
 * name stays the whole phrase. Hidden under reduced motion, where nothing
 * loops to begin with.
 */
export function MotionToggle({ short = false, className = "" }: { short?: boolean; className?: string }) {
  const still = useStill();
  const label = still ? "Play motion" : "Pause motion";
  return (
    <button
      type="button"
      onClick={() => setStill(!still)}
      aria-label={short ? label : undefined}
      className={"slate-link inline-flex min-h-6 items-center gap-2 motion-reduce:hidden " + className}
    >
      {short ? (still ? "Play" : "Pause") : label}
      <span aria-hidden="true">{still ? "▶" : "‖"}</span>
    </button>
  );
}
