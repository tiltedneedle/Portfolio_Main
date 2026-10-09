import Image, { type StaticImageData } from "next/image";
import tjb from "../../../public/logos/white/tjb.png";
import astonMartin from "../../../public/logos/white/aston-martin.png";
import koenigsegg from "../../../public/logos/white/koenigsegg.png";
import jetex from "../../../public/logos/white/jetex.png";
import youmiBeauty from "../../../public/logos/white/youmi-beauty.png";
import euroeyes from "../../../public/logos/white/euroeyes.png";
import ohana from "../../../public/logos/white/ohana.png";
import shafikGabr from "../../../public/logos/white/shafik-gabr.png";

// The only brand assets are white PNGs, cut for a dark ground. Here they are
// finally on one. Heights are set explicitly and the width follows the
// image's own ratio: the Toyota mark is nearly square and the Jetex mark is
// a wide strip, and a fixed box would crop one or starve the other.
//
// The PNGs are imported so their real dimensions are known at build time and
// the optimizer can serve each at the size it is drawn. Three of them are
// full-resolution artwork (Aston Martin's is 3762px wide, 109 KB) shown at
// 22 to 36px tall; as files they were most of the strip's weight. The Toyota
// mark is an SVG and stays as it is.
const brands: { name: string; src: StaticImageData | string; h: number }[] = [
  { name: "The Jet Business", src: tjb, h: 36 },
  { name: "Aston Martin", src: astonMartin, h: 28 },
  { name: "Toyota", src: "/logos/white/toyota.svg", h: 26 },
  { name: "Koenigsegg", src: koenigsegg, h: 36 },
  { name: "Jetex", src: jetex, h: 24 },
  { name: "Youmi Beauty", src: youmiBeauty, h: 26 },
  { name: "EuroEyes", src: euroeyes, h: 22 },
  { name: "Ohana Developments", src: ohana, h: 36 },
  { name: "Shafik Gabr Foundation", src: shafikGabr, h: 32 },
];

const markClass = "max-w-[170px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100";

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {brands.map((b) => (
        <div key={b.name} className="flex h-14 items-center justify-center px-8 md:h-16 md:px-12">
          {typeof b.src === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.src} alt={ariaHidden ? "" : b.name} style={{ height: b.h, width: "auto" }} className={markClass} draggable={false} />
          ) : (
            // Eager: the strip slides, and a lazy mark clipped by the section
            // would pop in as it arrives. Each is a few KB at this size.
            <Image
              src={b.src}
              alt={ariaHidden ? "" : b.name}
              width={Math.round((b.h * b.src.width) / b.src.height)}
              height={b.h}
              loading="eager"
              className={markClass}
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * The brand strip: A clean, seamless full-bleed ribbon of partner brand marks.
 */
// A server component: the strip scrolls by CSS (globals.css, .marquee),
// which also pauses it on hover and stops it under reduced motion, so there
// is nothing here to hydrate.
export function CreditsRoll() {
  const duration = { "--marquee-duration": "32s" } as React.CSSProperties;
  return (
    <section className="marquee relative overflow-hidden border-y border-[color:var(--rule)] bg-black py-2 md:py-3">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent md:w-36" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent md:w-36" />
      <div className="flex overflow-hidden">
        <div className="marquee-track flex shrink-0" style={duration}>
          <Row />
        </div>
        <div className="marquee-track flex shrink-0" style={duration}>
          <Row ariaHidden />
        </div>
      </div>
    </section>
  );
}
