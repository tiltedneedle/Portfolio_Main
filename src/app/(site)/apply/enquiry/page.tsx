import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { pageMeta } from "@/lib/page-meta";
import { ENQUIRY } from "@/lib/apply-data";
import { applyUrl } from "@/lib/apply-host";

export const metadata: Metadata = {
  ...pageMeta({ title: "Work with us | Tilted Needle", path: "/apply/enquiry", description: ENQUIRY.lead }),
  alternates: { canonical: applyUrl("enquiry") },
};

/** The enquiry, for someone whose budget fits. */
export default function Enquiry() {
  return (
    <div className="bg-[color:var(--stage)]">
      <section className="pb-24 pt-32 md:pb-36 md:pt-40">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <p className="enter-rise mono mb-8">
            Work with us <span className="text-[color:var(--ink-faint)]">/</span> Your details
          </p>
          <h1 className="enter-rise display max-w-[12ch] text-[clamp(56px,9.5vw,150px)]" style={{ animationDelay: "0.08s" }}>
            Let&apos;s work <span className="em-serif">together.</span>
          </h1>
          <p className="enter-rise mt-10 max-w-[48ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]" style={{ animationDelay: "0.16s" }}>
            {ENQUIRY.lead}
          </p>
          <div className="enter-rise mt-14 max-w-[900px]" style={{ animationDelay: "0.24s" }}>
            <ApplyForm kind="enquiry" />
          </div>
        </div>
      </section>
    </div>
  );
}
