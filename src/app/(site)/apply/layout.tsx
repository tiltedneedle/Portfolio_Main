import { ApplyMark } from "@/components/ApplyMark";

/**
 * The funnel's pages mark the document (data-apply on <html>) so the nav
 * and the footer, shared with the rest of the site, send their links to
 * www: on apply.tiltedneedle.com a path like /services is not a page. See
 * lib/apply-host.ts.
 */
export default function ApplyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ApplyMark />
      {children}
    </>
  );
}
