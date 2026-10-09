import type { Metadata } from "next";
import Script from "next/script";
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
  return (
    <>
      <BookDemoPage />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
