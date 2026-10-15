import type { Metadata } from "next";
import { ApplyLink } from "@/components/ApplyLink";
import { pageMeta } from "@/lib/page-meta";
import { CITIES, NO, PRICE_LINE, YES } from "@/lib/apply-data";
import { applyUrl } from "@/lib/apply-host";

/**
 * The apply funnel's first page: the one question the old apply site
 * asked, and its two answers, each a cut to a form. The words are the old
 * site's (lib/apply-data). Served at apply.tiltedneedle.com (its own
 * address, the canonical). In search since 2026-10-15, as the old apply
 * site was: the question is the studio's public price line.
 */
export const metadata: Metadata = {
  ...pageMeta({
    title: "Work with us | Tilted Needle",
    path: "/apply",
    description: "We create viral social media content for your personal brand or business. Tell us about yours.",
  }),
  alternates: { canonical: applyUrl() },
};

export default function Apply() {
  return (
    <div className="bg-[color:var(--stage)]">
      <section className="flex min-h-[100svh] flex-col justify-between pb-10 pt-32 md:pb-14 md:pt-40">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-14">
          <p className="enter-rise mono mb-8">
            Work with us <span className="text-[color:var(--ink-faint)]">/</span> One question first
          </p>
          {/* The claim at the size of a page's lead, the question as the
              headline: this page is the question, and both answers have to
              be on the first screen, where a full-size headline pushed them
              under the fold of a 900px laptop. */}
          <p className="enter-rise max-w-[40ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]" style={{ animationDelay: "0.08s" }}>
            We create viral social media content for your personal brand or business.
          </p>
          <h1 className="enter-rise display mt-8 max-w-[16ch] text-[clamp(40px,5.6vw,96px)]" style={{ animationDelay: "0.16s" }}>
            {PRICE_LINE.replace(" Is this within your budget?", "")}{" "}
            <span className="em-serif">Is this within your budget?</span>
          </h1>
          <div className="enter-rise mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.24s" }}>
            <ApplyLink step="enquiry" className="pill pill-solid px-8 py-3.5 text-[15px]">
              {YES}
            </ApplyLink>
            <ApplyLink step="referral" className="pill pill-outline px-8 py-3.5 text-[15px]">
              {NO}
            </ApplyLink>
          </div>
        </div>
        <p className="enter-fade mx-auto mt-16 w-full max-w-[1600px] px-6 mono text-[color:var(--ink-mid)] md:px-14" style={{ animationDelay: "0.5s" }}>
          {CITIES.map((city, i) => (
            <span key={city}>
              {i > 0 && <span className="text-[color:var(--ink-faint)]">&nbsp;&nbsp;/&nbsp;&nbsp;</span>}
              {city}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
