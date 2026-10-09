import type { Metadata } from "next";

/** The home card (app/opengraph-image), for pages without a card of their own. */
const HOME_CARD = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Tilted Needle. Cut for the scroll.",
};

type PageMeta = {
  title: string;
  description: string;
  /** The page's own path, for its canonical link and share URL. */
  path: string;
  /** "video.other" for a film. */
  type?: "website" | "video.other";
  /**
   * Whether to attach the home card. A segment with its own opengraph-image
   * file (the film pages) passes false and gets that one instead.
   */
  homeCard?: boolean;
};

/**
 * A page's title, description and canonical address, repeated into its share
 * cards. In Next a page that sets `openGraph` replaces the root's whole card
 * rather than merging into it, and a page that sets none inherits the root's
 * card wholesale. So every inner page used to share as the home page ("Cut for
 * the scroll", the home description), and the film pages, which did set a
 * card, shared with no picture. Building both cards here keeps title, text
 * and image together for every page.
 */
export function pageMeta({ title, description, path, type = "website", homeCard = true }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Tilted Needle",
      locale: "en_GB",
      type,
      ...(homeCard ? { images: [HOME_CARD] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(homeCard ? { images: [HOME_CARD.url] } : {}),
    },
  };
}
