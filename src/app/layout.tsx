import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { FilmGrain } from "@/components/FilmGrain";
import { TopMark } from "@/components/room/TopMark";
import { Cursor } from "@/components/room/Cursor";
import { CutOverlay } from "@/components/room/CutOverlay";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Four faces, all vendored as woff2 so the build needs no network, all SIL OFL.
//
// Each declares a `--font-*-face` variable; globals.css maps those into the
// Tailwind theme (`--font-display` etc). The two names are deliberately
// different so the theme variable never references itself.
//
// The reference sites use commercial faces (PP Neue Montreal, PP Migra). These
// four are chosen for the same roles: condensed display, quiet body, serif
// italic accent, mono readouts. Swapping a licensed face in later is a
// one-file change here.
const sans = localFont({
  src: "./fonts/instrument-sans-var.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-sans-face",
  display: "swap",
  adjustFontFallback: "Arial",
});

const display = localFont({
  src: "./fonts/big-shoulders-display-var.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-display-face",
  display: "swap",
  adjustFontFallback: "Arial",
});

const serif = localFont({
  src: "./fonts/instrument-serif-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-serif-face",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const mono = localFont({
  src: "./fonts/jetbrains-mono-var.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-mono-face",
  display: "swap",
  adjustFontFallback: "Arial",
});

const DESCRIPTION =
  "A short-form production studio in London and Dubai. Eight films, 5B+ views, $250M+ in revenue for the people in them.";

export const metadata: Metadata = {
  // The same address robots.txt, the sitemap and the structured data use.
  // Hardcoding tiltedneedle.com sent every canonical link and share card to
  // the old Squarespace site while the domain still points there, so link
  // previews had no image. On Vercel this follows the project's production
  // domain by itself: once tiltedneedle.com is added to the project, it moves.
  metadataBase: new URL(SITE_URL),
  title: "Tilted Needle | Cut for the scroll",
  description: DESCRIPTION,
  authors: [{ name: "Tilted Needle" }],
  keywords: [
    "viral content",
    "short-form video",
    "video editing studio",
    "social media marketing",
    "TikTok agency",
    "content creation",
    "brand growth",
    "video production",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Tilted Needle | Cut for the scroll",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Tilted Needle",
    locale: "en_GB",
    type: "website",
    // images come from src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Tilted Needle | Cut for the scroll",
    description: DESCRIPTION,
  },
  // This list replaces the icon file conventions rather than adding to them,
  // so app/apple-icon.png has to be named here or it is never linked.
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0b0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable} ${mono.variable}`}>
      <body className="antialiased">
        <FilmGrain />
        {children}
        <TopMark />
        <Cursor />
        <CutOverlay />
        <script
          type="application/ld+json"
          // Static, developer-authored JSON: no user input reaches this.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </body>
    </html>
  );
}
