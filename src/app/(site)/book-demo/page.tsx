import type { Metadata } from "next";
import Script from "next/script";
import { preconnect } from "react-dom";
import { BookDemoPage } from "@/components/BookDemoPage";
import { pageMeta } from "@/lib/page-meta";

// 5B+, as everywhere else since e902a01; this description still said 2B+.
export const metadata: Metadata = pageMeta({
  title: "Book a Demo | Tilted Needle",
  path: "/book-demo",
  description:
    "Schedule a free strategy session with our team. Discover how we can help your brand grow, 5B+ organic views and $250M+ revenue generated for clients.",
});

export default function BookDemo() {
  // The scheduler's two hosts, connected while the page loads: its script
  // comes from one once the page has loaded, its booking frame from the
  // other, and on a phone each new connection is a few hundred milliseconds
  // more of the wait for the calendar.
  preconnect("https://assets.calendly.com");
  preconnect("https://calendly.com");
  return (
    <>
      <BookDemoPage />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
