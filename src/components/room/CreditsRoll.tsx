"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { films } from "@/lib/films";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// The only brand assets are white PNGs, cut for a dark ground. Here they are
// finally on one. Heights are set explicitly and the width follows the
// image's own ratio: the Toyota mark is nearly square and the Jetex mark is
// a wide strip, and a fixed box would crop one or starve the other.
const brands = [
  { name: "The Jet Business", src: "/logos/white/tjb.png", h: 36 },
  { name: "Aston Martin", src: "/logos/white/aston-martin.png", h: 28 },
  { name: "Toyota", src: "/logos/white/toyota.svg", h: 26 },
  { name: "Koenigsegg", src: "/logos/white/koenigsegg.png", h: 36 },
  { name: "Jetex", src: "/logos/white/jetex.png", h: 24 },
  { name: "Youmi Beauty", src: "/logos/white/youmi-beauty.png", h: 26 },
  { name: "EuroEyes", src: "/logos/white/euroeyes.png", h: 22 },
  { name: "Ohana Developments", src: "/logos/white/ohana.png", h: 36 },
  { name: "Shafik Gabr Foundation", src: "/logos/white/shafik-gabr.png", h: 32 },
];

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {brands.map((b) => (
        <div key={b.name} className="flex h-14 items-center justify-center px-8 md:h-16 md:px-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.src}
            alt={ariaHidden ? "" : b.name}
            style={{ height: b.h, width: "auto" }}
            className="max-w-[170px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * The brand strip: A clean, seamless full-bleed ribbon of partner brand marks.
 */
export function CreditsRoll() {
  const reduced = useReducedMotion();
  const scroll = reduced
    ? {}
    : {
        animate: { x: ["0%", "-100%"] },
        transition: { duration: 32, ease: "linear" as const, repeat: Infinity },
      };

  return (
    <section className="relative overflow-hidden border-y border-[color:var(--rule)] bg-black py-2 md:py-3">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent md:w-36" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent md:w-36" />
      <div className="flex overflow-hidden">
        <motion.div className="flex shrink-0" {...scroll}>
          <Row />
        </motion.div>
        <motion.div className="flex shrink-0" {...scroll}>
          <Row ariaHidden />
        </motion.div>
      </div>
    </section>
  );
}
