// Relative, not "@/lib/site": next.config.ts imports this file too, and the
// config is loaded before the app's path aliases exist.
import { SITE_URL } from "./site";

/**
 * The apply funnel lives on its own subdomain, apply.tiltedneedle.com: the
 * question at its root, the two forms at /enquiry and /referral. The pages
 * are the site's /apply, /apply/enquiry and /apply/referral, served there
 * by rewrites (next.config.ts, APPLY_REWRITES) so the address bar stays on
 * the subdomain; on www the same paths send people to the subdomain.
 *
 * On the subdomain, a link's path means something else: /services there
 * would be a redirect back to the question, and /#work would scroll a page
 * that has no such section (the nav thinks it is on the home page, since
 * the question is served at "/"). So the funnel's pages mark the document
 * (data-apply on <html>, components/ApplyMark), the nav and the footer send
 * every site link to www while that mark is set (useOnApplyHost, siteHref),
 * and the funnel's own links stay on the subdomain (CutLink `own`).
 */
export const APPLY_HOST = "apply.tiltedneedle.com";
export const APPLY_URL = "https://" + APPLY_HOST;

/** A funnel page's own address: "" for the question, "enquiry", "referral". */
export const applyUrl = (step: "" | "enquiry" | "referral" = "") => APPLY_URL + (step ? "/" + step : "");

/** Whether this page is being served on the apply subdomain (browser only). */
export function onApplyHost() {
  return typeof document !== "undefined" && document.documentElement.hasAttribute("data-apply");
}

/** A site link as it should be written from a page that may be on the subdomain. */
export function siteHref(path: string, onApply: boolean) {
  return onApply && path.startsWith("/") ? SITE_URL + path : path;
}
