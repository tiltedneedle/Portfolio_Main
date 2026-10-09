import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

/**
 * Organization + WebSite JSON-LD. Only facts stated on the site itself —
 * no invented founding dates, headcount or ratings.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Tilted Needle",
  url: BASE_URL,
  // The dark mark: search engines show an organisation's logo on white, where
  // the white one (the site's own, on its dark stage) would be invisible.
  logo: `${BASE_URL}/black-logo.png`,
  email: "info@tiltedneedle.com",
  description:
    "A short-form production studio in London and Dubai. Eight films, 5B+ views, $250M+ in revenue for the people in them.",
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
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "en-GB",
};
