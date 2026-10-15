// Writes src/lib/lastmod.json: for each page in the sitemap, the day its
// content last changed, read from git. The sitemap prints it as <lastmod>.
//
// Only content files count. A change to the nav, footer or global styles
// alters every page's HTML but not what it says, and a lastmod that moves on
// every deploy is one search engines learn to ignore (every page used to
// carry the build time; the search round removed it). A page's files are
// listed below; a file not listed never moves a date.
//
// Runs before every `npm run build` (prebuild). On Vercel the clone is
// shallow and has no history, so the committed file is used as it is. Here,
// a content file edited but not yet committed counts as changed today, so a
// build before the commit already carries the right day.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const OUT = path.join(root, "src", "lib", "lastmod.json");
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

let full = false;
try {
  full = git("rev-parse", "--is-shallow-repository") === "false";
} catch {
  // no git at all
}
if (!full) {
  console.log("stamp: no full git history here, keeping the committed lastmod.json");
  process.exit(0);
}

// Sitemap path -> the files that hold that page's words and pictures. "*" is
// every page of that kind: one data file holds all the services, another all
// the films, so they share a date. The components that lay a page out are
// left out on purpose: they change in every motion or focus round without a
// word changing, and a date that moves with them would be the build-time
// lastmod again. Careers and Book a demo keep their copy in the component,
// so those two are listed.
const PAGES = {
  "/": ["src/app/(site)/page.tsx", "src/lib/case-studies-data.ts", "src/lib/published-picks.json"],
  "/services": ["src/lib/services-data.ts"],
  "/services/*": ["src/lib/services-data.ts"],
  "/film/*": ["src/lib/case-studies-data.ts", "src/lib/films.ts", "src/lib/published-picks.json"],
  "/portfolio": ["src/lib/published.json"],
  "/careers": ["src/components/CareersPage.tsx"],
  "/book-demo": ["src/components/BookDemoPage.tsx"],
  "/apply/*": ["src/lib/apply-data.ts"],
};

const today = new Date().toISOString().slice(0, 10);
const out = {};
for (const [page, files] of Object.entries(PAGES)) {
  const missing = files.filter((f) => !fs.existsSync(path.join(root, f)));
  if (missing.length) throw new Error(`stamp: ${page} lists files that do not exist: ${missing.join(", ")}`);
  const pending = git("status", "--porcelain", "--", ...files);
  const committed = git("log", "-1", "--format=%cs", "--", ...files);
  out[page] = pending ? today : committed;
}

const json = JSON.stringify(out, null, 2) + "\n";
const before = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
if (before === json) {
  console.log("stamp: lastmod.json is current");
} else {
  fs.writeFileSync(OUT, json);
  console.log("stamp: wrote lastmod.json (commit it with the change)");
}
