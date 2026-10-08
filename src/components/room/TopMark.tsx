"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** A mono "top" mark, bottom right, once the page has scrolled. Nothing floats; this is a label. */
export function TopMark() {
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShown(window.scrollY > 600);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      aria-label="Back to top"
      data-cursor="Top"
      className={
        "group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-[2px] border border-[color:var(--rule-strong)] bg-[rgba(11,11,12,0.85)] px-3.5 py-2 mono backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)] md:right-14 " +
        (shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0")
      }
    >
      <span className="lamp-off transition-colors duration-300 group-hover:bg-[color:var(--tally)]" aria-hidden="true" />
      <span>Top</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">&#8593;</span>
    </button>
  );
}
