import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The form handler has nothing to index and shouldn't be crawled.
        disallow: ["/api/"],
      },
    ],
    // No `host` line: only Yandex ever read it, and Google ignores it. The
    // canonical links and the redirects to www (Vercel's for the bare domain,
    // next.config.ts for the vercel.app one) say which host is the real one.
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
