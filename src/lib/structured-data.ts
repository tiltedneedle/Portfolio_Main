import { SITE_URL } from "@/lib/site";
import type { Service } from "@/lib/services-data";

const BASE_URL = SITE_URL;
const ORGANIZATION_ID = `${BASE_URL}/#organization`;

/**
 * Organization + WebSite JSON-LD. Only facts stated on the site itself —
 * no invented founding dates, headcount or ratings.
 *
 * Google reads the site name it shows above a result from WebSite.name on the
 * home page, checked against og:site_name and the home page's <title>; all
 * three say "Tilted Needle". The sameAs profiles are the four the site links
 * to, each checked to be the studio's own (2026-10-12).
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Tilted Needle",
  url: BASE_URL,
  // The dark mark: search engines show an organisation's logo on white, where
  // the white one (the site's own, on its dark stage) would be invisible.
  logo: `${BASE_URL}/black-logo.png`,
  email: "info@tiltedneedle.com",
  description:
    "A short-form production studio in London and Dubai. Eight films, 5B+ views, $250M+ in revenue for the people in them.",
  slogan: "Cut for the scroll.",
  // The studio's own names for what it does: its short-form work and the four
  // service pages' titles, word for word.
  knowsAbout: [
    "Short-form video",
    "Content Creation",
    "Influencer Marketing",
    "Paid Advertising & Performance Marketing",
    "Application & Web Development",
  ],
  areaServed: "Worldwide",
  address: [
    { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  ],
  sameAs: [
    "https://www.instagram.com/tiltedneedle/",
    "https://www.tiktok.com/@tiltedneedle",
    "https://www.linkedin.com/company/tilted-needle",
    "https://www.youtube.com/@tiltedneedle",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Tilted Needle",
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "en-GB",
};

/** A service page: what is offered, by whom (the Organization on every page). */
export function serviceSchema(service: Service) {
  const url = `${BASE_URL}/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: "Worldwide",
  };
}

/**
 * The trail Google can show in place of a result's bare URL, top level first.
 * Each step is a real page on the site.
 */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${BASE_URL}${step.path}`,
    })),
  };
}
