"use client";

import { CutLink } from "@/components/room/CutLink";
import { useOnApplyHost } from "@/lib/use-on-apply-host";

/**
 * A link between the funnel's own pages. On the subdomain it is the page's
 * own address there (/enquiry, not /apply/enquiry, which would be a
 * redirect), as a cut that stays on the subdomain; anywhere else, the site
 * path, so the /apply pages still link among themselves on www and in a
 * build served from localhost. See lib/apply-host.ts.
 */
export function ApplyLink({ step, className, children }: { step: "" | "enquiry" | "referral"; className?: string; children: React.ReactNode }) {
  const onApply = useOnApplyHost();
  const here = "/" + step;
  const site = "/apply" + (step ? "/" + step : "");
  return (
    <CutLink href={onApply ? here : site} own className={className} data-cursor="Cut">
      {children}
    </CutLink>
  );
}
