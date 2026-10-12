/**
 * Canonical site URL helper.
 * Uses NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL if available,
 * falling back to the primary custom domain.
 *
 * The primary domain is www.tiltedneedle.com: Vercel sends the bare
 * tiltedneedle.com there with a 308, so a canonical link or sitemap entry on
 * the bare domain would point search engines at a redirect.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  vercelUrl ||
  "https://www.tiltedneedle.com"
).replace(/\/$/, "");

/**
 * The project's own vercel.app address. It served the site before the domain
 * moved, so links to it are out there; next.config.ts sends it to SITE_URL.
 */
export const VERCEL_ALIAS = "portfolio-main-vert-gamma.vercel.app";
