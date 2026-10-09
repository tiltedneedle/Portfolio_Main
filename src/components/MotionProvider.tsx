"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Framer Motion's lightweight path. Components are `m.*` (not `motion.*`),
 * and the animation features the site uses (animate, exit, in-view, hover,
 * tap, focus) come once from `domAnimation` here. The full `motion.*` put
 * every feature into every page and gave each animated element layout
 * projection bookkeeping, for layout and drag animations the site never uses.
 *
 * Write new animated elements as `m.div` and so on. In development `strict`
 * throws on a stray `motion.*` so it gets noticed; in production it would
 * only bring the full bundle back, so it is not allowed to break the page.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict={process.env.NODE_ENV !== "production"}>
      {children}
    </LazyMotion>
  );
}
