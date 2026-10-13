import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { pageMeta } from "@/lib/page-meta";
import { REFERRAL } from "@/lib/apply-data";

export const metadata: Metadata = {
  ...pageMeta({ title: "Get a referral | Tilted Needle", path: "/apply/referral", description: REFERRAL.lead }),
  robots: { index: false, follow: true },
};

/** The referral request, for someone whose budget does not fit. */
export default function Referral() {
  return (
    <div className="bg-[color:var(--stage)]">
      <section className="pb-24 pt-32 md:pb-36 md:pt-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="enter-rise mono mb-8">
            Work with us <span className="text-[color:var(--ink-faint)]">/</span> A referral
          </p>
          <h1 className="enter-rise display max-w-[14ch] text-[clamp(44px,7.5vw,120px)]" style={{ animationDelay: "0.08s" }}>
            We are probably not the right fit at the <span className="em-serif">moment.</span>
          </h1>
          <p className="enter-rise mt-10 max-w-[52ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]" style={{ animationDelay: "0.16s" }}>
            {REFERRAL.lead}
          </p>
          <div className="enter-rise mt-14 max-w-[900px]" style={{ animationDelay: "0.24s" }}>
            <ApplyForm kind="referral" />
          </div>
        </div>
      </section>
    </div>
  );
}
