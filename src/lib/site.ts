/**
 * Canonical site URL helper.
 * Uses NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL if available,
 * falling back to the primary custom domain.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  vercelUrl ||
  "https://tiltedneedle.com"
).replace(/\/$/, "");
