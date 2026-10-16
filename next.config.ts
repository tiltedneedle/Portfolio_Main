import type { NextConfig } from "next";
import { SITE_URL, VERCEL_ALIAS } from "./src/lib/site";
import { APPLY_HOST, APPLY_URL } from "./src/lib/apply-host";

// Applied to every response. No CSP here: the Calendly embed on /book-demo and
// the remote video/image hosts would need a broad policy to work, and a broad
// CSP gives a false sense of safety. Add one deliberately if the embed is ever
// replaced.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // browsing-topics, not interest-cohort: FLoC was withdrawn, and Chrome
    // logs an "unrecognized feature" error for it on every page.
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// The old Squarespace site's addresses (its sitemap, 2026-10-09), sent to
// where that content lives now, so links and search results that point at
// tiltedneedle.com keep working once the domain moves to this site. Its
// /careers and / already match. Permanent: search engines carry the old
// pages' standing over to the new ones.
const OLD_SITE: Array<[string, string]> = [
  ["/home", "/"],
  ["/what-we-do", "/services"],
  ["/our-work", "/portfolio"],
  ["/new-page", "/#contact"], // "Work with us": the contact form
  ["/form", "/careers#apply"], // "Join our team": the application form
  ["/positions", "/careers#roles"],
  // one page per open role on the old site; the roles are listed on /careers
  ["/contentcreator", "/careers#roles"],
  ["/hrmanager", "/careers#roles"],
  ["/productionassistant", "/careers#roles"],
  ["/sales", "/careers#roles"],
  ["/scriptwriter", "/careers#roles"],
  ["/videographer", "/careers#roles"],
  ["/videographer-2", "/careers#roles"],
];

// The vercel.app address served the whole site before the domain moved, so
// links to it are out there (Google had indexed none of it, 2026-10-12). Each
// of its pages already names its www twin as canonical; this makes it one
// site outright, path and query kept, and sends people with an old link to
// the real address. Only once the production address is somewhere else, or
// the alias would redirect to itself.
const ONE_HOST =
  new URL(SITE_URL).host === VERCEL_ALIAS
    ? []
    : [
        {
          source: "/:path*",
          has: [{ type: "host" as const, value: VERCEL_ALIAS }],
          destination: SITE_URL + "/:path*",
          permanent: true,
        },
      ];

// apply.tiltedneedle.com was a separate WordPress site (the budget question,
// an enquiry form, a referral form); it is now the funnel here, served ON
// that subdomain: the question at its root, the forms at /enquiry and
// /referral. The pages are /apply, /apply/enquiry and /apply/referral,
// reached by rewrites so the address bar stays on the subdomain; on www the
// same paths send people to it, so the funnel has one address (the one in
// the studio's bios, and the one Google sees). The old WordPress address of
// the enquiry form (/apply) lands on it; any other path on the subdomain,
// the question. Permanent, as with the old site's addresses.
//
// Redirects are checked before rewrites (the rewrites docs' order), so the
// subdomain's catch-all must leave the three funnel paths alone, or it
// would send /enquiry to the question before the rewrite could serve it.
// It leaves /_next and the site's files alone too: a page on the
// subdomain loads its scripts, fonts and images from the same host.
const ON_APPLY = { has: [{ type: "host" as const, value: APPLY_HOST }] };
const APPLY_REWRITES = [
  { source: "/", destination: "/apply", ...ON_APPLY },
  { source: "/enquiry", destination: "/apply/enquiry", ...ON_APPLY },
  { source: "/referral", destination: "/apply/referral", ...ON_APPLY },
];
const APPLY_REDIRECTS = [
  { source: "/apply", destination: APPLY_URL + "/enquiry", permanent: true, ...ON_APPLY },
  {
    source: "/:path((?!enquiry$|referral$|_next/|api/|[^/]+\\.[a-z0-9]+$).+)",
    destination: APPLY_URL,
    permanent: true,
    ...ON_APPLY,
  },
  { source: "/apply", destination: APPLY_URL, permanent: true },
  { source: "/apply/enquiry", destination: APPLY_URL + "/enquiry", permanent: true },
  { source: "/apply/referral", destination: APPLY_URL + "/referral", permanent: true },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return { beforeFiles: APPLY_REWRITES, afterFiles: [], fallback: [] };
  },
  async redirects() {
    // The hosts first, so an old path on an old host is one hop to www and
    // then the old-site rule there, not a relative hop on the old host first.
    return [...ONE_HOST, ...APPLY_REDIRECTS, ...OLD_SITE.map(([source, destination]) => ({ source, destination, permanent: true }))];
  },
  images: {
    // Each pattern is held to the shapes the site actually uses, with the
    // query string fixed. Every distinct URL, width and format the optimizer
    // is asked for counts against the plan's monthly allowance of image
    // transformations (5,000 on Hobby, after which new images fail with 402
    // for the rest of the cycle), so an open pattern let anyone spend it on
    // any photo on these hosts, or on one photo with endless query strings.
    remotePatterns: [
      // stills for the published work: YouTube's, and the studio's own cache
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/*/oardefault.jpg", search: "" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/*/mqdefault.jpg", search: "" },
      // what scripts/published.mjs falls back to for long-form videos
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/*/maxresdefault.jpg", search: "" },
      {
        protocol: "https",
        hostname: "tkmvuxjnfzbdpditvdbo.supabase.co",
        pathname: "/storage/v1/object/public/post-thumbnails/*",
        search: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // A month, not the default four hours. Each expiry is a fresh
    // transformation on Vercel (and a fresh fetch from the source), and these
    // stills never change in place: a new still is a new URL.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(clips|logos|covers)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
