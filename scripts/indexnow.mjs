// Tell the IndexNow engines (Bing, Yandex, Naver, Seznam, Yep) which pages
// changed. Without it, Bing learns of a page whenever its crawler happens to
// come by (on 2026-10-13 it knew of none); with it, within hours of a push.
// Google does not take part; it reads the sitemap through Search Console.
//
//   node scripts/indexnow.mjs            pages whose sitemap lastmod is recent
//   node scripts/indexnow.mjs --all      every page in the live sitemap
//   node scripts/indexnow.mjs /services /film/the-jet-broker   just these
//
// .github/workflows/indexnow.yml runs the first form after every production
// deployment. SITE_URL overrides the host (default www.tiltedneedle.com).
import fs from "node:fs";
import path from "node:path";

const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.tiltedneedle.com").replace(/\/$/, "");
const host = new URL(SITE_URL).host;
// "Recent": a change stamped within this many days (see scripts/stamp.mjs).
// Wide enough that a deploy a day or two after the commit still submits it.
const RECENT_DAYS = 3;

// The key is public by design: an engine fetches /<key>.txt to confirm the
// site itself is asking. The file in public/ is the only copy of it.
const pub = path.join(process.cwd(), "public");
const keyFile = fs.readdirSync(pub).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("no IndexNow key file (<32 hex>.txt) in public/");
const key = fs.readFileSync(path.join(pub, keyFile), "utf8").trim();
if (key !== keyFile.slice(0, -4)) throw new Error(`${keyFile} does not contain its own name`);

const args = process.argv.slice(2);
const all = args.includes("--all");
let urls = args.filter((a) => !a.startsWith("--")).map((p) => (p.startsWith("http") ? p : SITE_URL + p));

if (urls.length === 0) {
  const res = await fetch(SITE_URL + "/sitemap.xml", { headers: { "user-agent": "tilted-needle-indexnow" } });
  if (!res.ok) throw new Error(`sitemap: HTTP ${res.status}`);
  const xml = await res.text();
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
    lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  }));
  const since = Date.now() - RECENT_DAYS * 86400e3;
  urls = entries
    .filter((e) => e.loc && (all || !e.lastmod || Date.parse(e.lastmod) >= since))
    .map((e) => e.loc);
  if (urls.length === 0) {
    console.log(`IndexNow: nothing changed in the last ${RECENT_DAYS} days (${entries.length} pages in the sitemap); nothing sent`);
    process.exit(0);
  }
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `${SITE_URL}/${keyFile}`, urlList: urls }),
});
// 200: accepted. 202: accepted, key file to be checked later. Anything else
// is a problem with the key, the host or the URLs.
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL${urls.length === 1 ? "" : "s"} on ${host}`);
for (const u of urls) console.log("  " + u);
if (res.status !== 200 && res.status !== 202) {
  console.log(await res.text());
  process.exit(1);
}
