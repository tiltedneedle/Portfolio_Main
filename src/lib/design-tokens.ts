/**
 * Layout and motion values that are shared across components.
 *
 * These exist because both had drifted: the home page ran two different
 * section rhythms at >=1024px, and reveal distances had accumulated eight
 * distinct values (6, 8, 10, 15, 16, 20, 30, 40) with no scale behind them.
 */

/* ------------------------------------------------------------------ layout */

/**
 * Vertical rhythm for full-width sections on the home page.
 * CaseStudyCards and PortfolioLibrary already used this; ServicesShowcase,
 * ProcessTimeline and ContactForm stopped at `md:py-20`, so above 1024px three
 * sections breathed 80px while two breathed 96px.
 */
export const SECTION_Y = "py-16 md:py-20 lg:py-24";

/** Inner pages (services, careers) run a more generous rhythm than the home page. */
export const SECTION_Y_INNER = "py-28 md:py-40";

/** Interstitials that should read as a break rather than a section — the logo strip. */
export const SECTION_Y_TIGHT = "py-12 md:py-16";

/* ------------------------------------------------------------------ motion */

/**
 * How far a section-level element travels as it reveals on scroll.
 * Scales with the weight of the thing revealing, not with nesting depth.
 */
export const REVEAL = {
  /** Body copy, cards, list items. */
  sm: 20,
  /** Section headings and lead paragraphs. */
  md: 30,
  /** Hero-scale blocks. */
  lg: 40,
} as const;

/**
 * How far a UI element travels on a state change. Deliberately much shorter
 * than REVEAL — a dropdown that slides as far as a section reveal feels slow.
 */
export const SHIFT = {
  /** Dropdowns, form status messages, tab-panel swaps. */
  sm: 8,
  /** Expanding panels that push surrounding content. */
  md: 16,
} as const;

/** The signature easing curve. Matches `--ease-out-expo` in globals.css. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * A reveal's two ends, as whole transforms. Framer hands `opacity` and a
 * whole `transform` to the browser (Web Animations, run on the compositor)
 * but steps an independent `y` from script on every frame; the site's
 * reveals all moved by `y`, so every one ran on the main thread, and a tap
 * made while they played waited behind them. `lifted(16)` is where a reveal
 * starts (clear, 16px low), SETTLED where it ends: no transform left behind
 * to make a containing block of the revealed box. Under reduced motion it
 * only fades.
 */
export function lifted(px: number, reduced?: boolean | null) {
  return { opacity: 0, transform: reduced ? "none" : "translateY(" + px + "px)" };
}
export const SETTLED = { opacity: 1, transform: "none" };
