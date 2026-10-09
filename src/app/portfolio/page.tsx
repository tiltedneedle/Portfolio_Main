import type { Metadata } from "next";
import { PortfolioBoard } from "@/components/PortfolioBoard";
import { pageMeta } from "@/lib/page-meta";

// Its own title, like every other page. It used to inherit the home page's,
// so the tab, the search result and the browser history all read "Cut for
// the scroll" and could not be told apart from the home page.
export const metadata: Metadata = pageMeta({
  title: "The library | Tilted Needle",
  description: "The contact sheet. Everything Tilted Needle has published, laid out on one board.",
  path: "/portfolio",
});

export default function Portfolio() {
  return <PortfolioBoard />;
}
