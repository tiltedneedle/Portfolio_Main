"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { films, pad2 } from "@/lib/films";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * The results, as slate lines: number, who, what came true, when. Every row
 * cuts to its film. This is the studio's awards list; the awards are numbers.
 */
export function ResultsSlate() {
  const reduced = useReducedMotion();

  return (
    <section id="results" className="scroll-mt-16 bg-[color:var(--stage)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <p className="mono">04 &mdash; Results</p>
        <h2 className="display mt-8 text-[clamp(48px,7vw,120px)] md:mt-12">
          What came <span className="em-serif">true.</span>
        </h2>

        <ul className="mt-14 md:mt-20">
          {films.map((f, i) => (
            <motion.li
              key={f.slug}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE_OUT_EXPO }}
              className="border-t border-[color:var(--rule)]"
            >
              <CutLink
                href={"/film/" + f.slug}
                className="group relative grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 py-6 transition-colors duration-300 hover:text-[color:var(--ink)] sm:grid-cols-[auto_1fr_auto_auto] sm:gap-x-10 md:py-8"
                data-cursor="Open"
              >
                <span className="mono self-center transition-colors duration-300 group-hover:text-[color:var(--tally)]">{pad2(f.index)}</span>
                <span className="flex items-center gap-6 text-[22px] font-medium text-[color:var(--ink)] transition-transform duration-300 group-hover:translate-x-2 md:text-[28px]">
                  {f.poster && (
                    <span className="relative inline-block h-24 w-16 shrink-0 overflow-hidden rounded-[3px] border border-[color:var(--rule-strong)] shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-[color:var(--ink)] sm:h-28 sm:w-20 md:h-32 md:w-[86px]">
                      <img src={f.poster} alt={f.client} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                  )}
                  <span>{f.client}</span>
                </span>
                <span className="em-serif col-start-2 self-center text-[20px] text-[color:var(--ink-soft)] sm:col-start-3 md:text-[24px]">
                  {f.highlight.toLowerCase()}
                </span>
                <span className="mono max-sm:hidden self-center transition-colors duration-300 group-hover:text-[color:var(--ink)]">{f.year} &#8599;</span>
              </CutLink>
            </motion.li>
          ))}
          <li className="border-t border-[color:var(--rule)]" />
        </ul>
      </div>
    </section>
  );
}
