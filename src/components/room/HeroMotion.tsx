"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/**
 * The strip's motion. It drifts left, a row every 160 seconds, and the
 * scroll pushes it: scrolling down speeds it up and skews it with the
 * speed, scrolling up runs it back. Scrolled away, it sinks, softens and
 * dims as the page takes over.
 *
 * The drift is a CSS animation (globals.css, .hero-drift), so it runs on the
 * compositor and keeps moving while the page loads and hydrates; the scroll
 * changes its playback rate rather than moving it. It used to be advanced by
 * script every frame, which froze it through every long task (the hydration
 * of a phone's first seconds, on the first thing anyone sees) and kept the
 * main thread drawing for as long as the hero was on screen. Where the
 * browser has scroll-driven animations the sink-and-soften runs in CSS too
 * (.hero-band); elsewhere it is done here, from the scroll.
 *
 * Reduced motion: no drift, no skew, no parallax. The strip stands.
 */

// The push tops out at 25 times the resting pace, the old mapping's value
// at 2,400px a second: a jump to an anchor reads as a huge velocity, and
// unbounded it whipped the strip across the screen.
const MAX_RATE = 25;
// Ten loops of the drift (160s each), banked on its clock: see below.
const BANKED_MS = 10 * 160 * 1000;

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
  const drift = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skewX = useTransform(smooth, [-2400, 0, 2400], [-5, 0, 5]);

  // The page's own CSS does the sink where it can (decided after hydration,
  // so the server's markup and the first render agree).
  const [cssSink, setCssSink] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCssSink(typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()"));
  }, []);

  // The drift's CSS animation starts at 0 with the first paint, and the
  // scroll can run it backwards. Run back past its own start, an animation
  // is finished and gone: one quick scroll back to the top stopped the reel
  // for good. So once the page is live its clock is moved ten loops on,
  // which looks the same (every loop ends where it began) and is more than
  // any scrolling can spend: backwards it uses a hundredth of a second per
  // pixel scrolled up with the hero in view, and it is held off screen.
  // Held off screen and let go through the animation itself, so one API
  // drives it from here on.
  useEffect(() => {
    const el = drift.current;
    const a = el?.getAnimations()[0];
    if (!el || !a) return;
    const now = typeof a.currentTime === "number" ? a.currentTime : 0;
    a.currentTime = now + BANKED_MS;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) a.play();
      else a.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const out = useTransform(scrollY, (v) => (v <= 0 ? 0 : Math.min(1, v / screenHeight())));
  const y = useTransform(out, [0, 1], [0, 100]);
  const filter = useTransform(out, [0, 1], ["blur(0px)", "blur(8px)"]);
  const opacity = useTransform(out, [0, 1], [1, 0.4]);

  // The scroll's push: the drift's playback rate, 1 at rest. One plus the
  // spring's speed over 100 is what the old per-frame drift added; below
  // zero it runs back.
  useMotionValueEvent(smooth, "change", (v) => {
    const a = drift.current?.getAnimations()[0];
    if (!a || reduced) return;
    const rate = Math.max(-MAX_RATE, Math.min(MAX_RATE, 1 + v / 100));
    if (typeof a.updatePlaybackRate === "function") a.updatePlaybackRate(rate);
    else a.playbackRate = rate;
  });

  return (
    <m.div className="hero-band" style={reduced || cssSink ? undefined : { y, filter, opacity }}>
      <m.div className="opacity-40" style={reduced ? undefined : { skewX }}>
        {/* -ml-4: the strip starts 16px past the left edge, more than the
            hardest scroll skew (5 degrees, 11px at a frame's half height)
            moves its corner, so the skew never opens a sliver there. */}
        <div ref={drift} className="hero-drift -ml-4 flex w-max">
          {children}
        </div>
      </m.div>
    </m.div>
  );
}
