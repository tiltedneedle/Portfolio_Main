"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Odometer } from "@/components/room/Odometer";
import { CutLink } from "@/components/room/CutLink";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * The title card. The studio, said once, in the condensed face, followed by
 * the three numbers set as readouts with precision mechanical odometers:
 * the proof is measurable, so it is shown the way an instrument displays it.
 */
export function TitleCard() {
  const reduced = useReducedMotion();
  const rise = {
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  };

  return (
    <section className="bg-[color:var(--stage-2)] pt-24 pb-10 md:pt-36 md:pb-14">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <motion.p {...rise} className="mono">
          02 &mdash; The studio
        </motion.p>

        <motion.h2 {...rise} className="display mt-8 max-w-[12ch] text-[clamp(56px,9vw,150px)] md:mt-12">
          A formula, not a <span className="em-serif">fluke.</span>
        </motion.h2>

        <motion.p {...rise} className="mt-10 max-w-[52ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]">
          We make short-form for founders, brands and creators who need to be seen.
          Thousands of published videos, decoded into one repeatable method: a hook
          that stops the thumb, a story that holds it, and a cut that earns the
          second watch.
        </motion.p>

        <motion.div {...rise} className="mt-20 grid grid-cols-1 divide-y divide-[color:var(--rule)] border-y border-[color:var(--rule)] lg:grid-cols-3 lg:divide-x lg:divide-y-0 md:mt-28">
          <div className="py-8 sm:py-10 lg:pr-8">
            <span className="display tabular flex items-baseline text-[clamp(38px,3.8vw,68px)] leading-none">
              <Odometer value={5000000000} />
              <span className="odo-sep text-[color:var(--ink-mid)]">+</span>
            </span>
            <span className="mono mt-4 block text-[13px] tracking-widest text-[color:var(--ink-soft)]">
              Organic views
            </span>
          </div>

          <div className="py-8 sm:py-10 lg:px-8">
            <span className="display tabular flex items-baseline text-[clamp(38px,3.8vw,68px)] leading-none">
              <span className="odo-sep text-[color:var(--ink-mid)]">$</span>
              <Odometer value={250000000} />
              <span className="odo-sep text-[color:var(--ink-mid)]">+</span>
            </span>
            <span className="mono mt-4 block text-[13px] tracking-widest text-[color:var(--ink-soft)]">
              Revenue generated
            </span>
          </div>

          <div className="py-8 sm:py-10 lg:pl-8">
            <span className="display tabular flex items-baseline text-[clamp(38px,3.8vw,68px)] leading-none">
              <Odometer value={11} />
              <span className="odo-sep text-[color:var(--ink-mid)]">+</span>
            </span>
            <span className="mono mt-4 block text-[13px] tracking-widest text-[color:var(--ink-soft)]">
              Flagship clients
            </span>
          </div>
        </motion.div>

        <motion.div {...rise} className="mt-8 border-t border-[color:var(--rule)] pt-5">
          <CutLink href="/services" className="slate-link text-[13px]" data-cursor="Cut">
            What the studio does &#8599;
          </CutLink>
        </motion.div>
      </div>
    </section>
  );
}
