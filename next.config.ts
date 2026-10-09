import type { NextConfig } from "next";

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
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Each pattern is held to the shapes the site actually uses, with the
    // query string fixed. Every distinct URL, width and format the optimizer
    // is asked for counts against the plan's monthly allowance of image
    // transformations (5,000 on Hobby, after which new images fail with 402
    // for the rest of the cycle), so an open pattern let anyone spend it on
    // any photo on these hosts, or on one photo with endless query strings.
    remotePatterns: [
      // the service pages' four photos
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*", search: "?w=800&h=600&fit=crop" },
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
