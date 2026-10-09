"use client";

import { useRef, type ReactNode } from "react";
import { m, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

const DRIFT = -50 / 160;

const wrap = (v: number) => {
  const r = v % 50;
  return r > 0 ? r - 50 : r;
};

let screenH = 0;
function screenHeight() {
  if (typeof window === "undefined") return 900;
  if (!screenH) {
    screenH = window.innerHeight;
    window.addEventListener("resize", () => (screenH = 0), { once: true });
  }
  return screenH;
}

export function HeroMotion({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-2400, 0, 2400], [-24, 0, 24], { clamp: false });
  const skewX = useTransform(smooth, [-2400, 0, 2400], [-5, 0, 5]);

  const out = useTransform(scrollY, (v) => (v <= 0 ? 0 : Math.min(1, v / screenHeight())));
  const y = useTransform(out, [0, 1], [0, 100]);
  const filter = useTransform(out, [0, 1], ["blur(0px)", "blur(8px)"]);
  const opacity = useTransform(out, [0, 1], [1, 0.4]);
  const xPercent = useTransform(x, (v) => v + "%");

  useAnimationFrame((_, delta) => {
    if (reduced || !onScreen) return;
    const dt = Math.min(delta, 64) / 1000;
    x.set(wrap(x.get() + DRIFT * (1 + boost.get()) * dt));
  });

  return (
    <m.div className="hero-band" style={{ y, filter, opacity }}>
      <m.div ref={ref} className="flex w-max opacity-40" style={{ x: xPercent, skewX }}>
        {children}
      </m.div>
    </m.div>
  );
}
