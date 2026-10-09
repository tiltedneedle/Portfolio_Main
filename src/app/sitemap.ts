import type { MetadataRoute } from "next";
import { servicesList } from "@/lib/services-data";
import { films } from "@/lib/films";
import { SITE_URL } from "@/lib/site";
import { privacyLastUpdated, termsLastUpdated } from "@/lib/legal-data";

const BASE_URL = SITE_URL;

// lastModified only where a real date exists: the legal pages state theirs.
// Every page used to carry the build time, so every deploy claimed every page
// had just changed, and search engines learn to ignore a lastmod like that.
// Read as a calendar date in UTC ("23 June 2026" -> "2026-06-23"), so the
// build machine's time zone cannot move it to the day before.
const stated = (text: string) => {
  const d = new Date(text + " UTC");
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
};
const LEGAL_DATES: Record<string, string | undefined> = {
  "/privacy": stated(privacyLastUpdated),
  "/terms": stated(termsLastUpdated),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/portfolio", changeFrequency: "weekly", priority: 0.8 },
    { path: "/careers", changeFrequency: "weekly", priority: 0.7 },
    { path: "/book-demo", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      ...(LEGAL_DATES[route.path] ? { lastModified: LEGAL_DATES[route.path] } : {}),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...servicesList.map((service) => ({
      url: `${BASE_URL}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...films.map((film) => ({
      url: `${BASE_URL}/film/${film.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
