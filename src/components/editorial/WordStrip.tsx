// The reference closes on a slow serif-italic crawl over dark. Decorative,
// hidden from assistive tech, frozen under reduced motion. Our own words.
//
// The crawl is CSS (globals.css, .marquee): it runs on the compositor rather
// than as a Framer Motion script every frame, pauses on hover, and stops
// under reduced motion, so this needs no client code of its own.
const WORDS = "hook. shoot. cut. post. repeat. ";

export function WordStrip() {
  const run = WORDS.repeat(4);
  const duration = { "--marquee-duration": "26s" } as React.CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="marquee bg-[color:var(--slab-deep)] border-y border-white/10 py-5 overflow-hidden"
    >
      <div className="flex overflow-hidden whitespace-nowrap">
        <span className="marquee-track em-serif shrink-0 text-[32px] md:text-[44px] text-white/90" style={duration}>
          {run}
        </span>
        <span className="marquee-track em-serif shrink-0 text-[32px] md:text-[44px] text-white/90" style={duration}>
          {run}
        </span>
      </div>
    </div>
  );
}
