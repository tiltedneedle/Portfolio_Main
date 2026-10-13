// The reference closes on a slow serif-italic crawl over dark. Decorative,
// hidden from assistive tech, frozen under reduced motion. Our own words.
//
// The crawl is CSS (globals.css, .marquee): it runs on the compositor rather
// than as a Framer Motion script every frame, pauses on hover, and stops
// under reduced motion, so this needs no client code of its own.
//
// The run ends on a no-break space: an ordinary one is dropped at the end of
// a line that cannot wrap, so where one copy met the next the strip read
// "repeat.hook.".
const WORDS = "hook. shoot. cut. post. repeat. ";

// Copies side by side, each sliding its own width; together they must stay
// wider than the screen at every point of the loop. Two (1,818px each on a
// desktop) ran out from about 1,830px; four cover screens to ~5,400px.
const COPIES = 4;

export function WordStrip() {
  const run = WORDS.repeat(4);
  const duration = { "--marquee-duration": "26s" } as React.CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="marquee bg-[color:var(--slab-deep)] border-y border-white/10 py-5 overflow-hidden"
    >
      <div className="flex overflow-hidden whitespace-nowrap">
        {Array.from({ length: COPIES }, (_, i) => (
          <span key={i} className="marquee-track em-serif shrink-0 text-[32px] md:text-[44px] text-white/90" style={duration}>
            {run}
          </span>
        ))}
      </div>
    </div>
  );
}
