// What a search engine reads, on every page in the sitemap: a title and a
// description (lengths reported, never judged: they are the brand's lines), a
// canonical on the sitemap's own address, no robots tag keeping a listed page
// out, one h1 that reads as words, structured data that parses with every
// cross-reference resolved, breadcrumbs on the service and film pages. Then
// the 404, robots.txt, llms.txt, the IndexNow key, the sitemap's dates, the
// old vercel.app host and the old Squarespace addresses.
//
//   npm run build && npx next start -p 3400     (another shell)
//   npm run seo                                  (checks http://localhost:3400)
//   node scripts/seo-check.mjs https://www.tiltedneedle.com --live
//
// --live is required for any host that is not localhost: the run makes about
// fifty requests, and Vercel challenges an address that sends too many in an
// hour. Run it against a local build as a rule, live once after a deploy.
import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const BASE = (args.find((a) => !a.startsWith("--")) || process.env.BASE || "http://localhost:3400").replace(/\/$/, "");
const LIVE = args.includes("--live");
const ALIAS = "portfolio-main-vert-gamma.vercel.app";
const baseHost = new URL(BASE).hostname;
if (!LIVE && !["localhost", "127.0.0.1", "[::1]"].includes(baseHost)) {
  console.log(`refusing to check ${baseHost} without --live (about fifty requests)`);
  process.exit(2);
}

let failed = 0;
let requests = 0;
const say = (ok, what, detail = "") => {
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + what.padEnd(58) + " " + String(detail).slice(0, 160));
};

// RESOLVE=host=ip pins a host to an address (curl's --resolve), for when this
// machine's DNS cache still answers with an old one.
const PIN = Object.fromEntries((process.env.RESOLVE || "").split(",").filter(Boolean).map((p) => p.split("=")));
const lookup = (host, opts, cb) =>
  PIN[host] ? (opts && opts.all ? cb(null, [{ address: PIN[host], family: 4 }]) : cb(null, PIN[host], 4)) : dns.lookup(host, opts, cb);

// node:http, not fetch: fetch drops a Host header without a word, so the
// alias test would quietly ask localhost instead.
const get = (p, headers = {}) =>
  new Promise((resolve, reject) => {
    requests++;
    const u = new URL(BASE + p);
    const req = (u.protocol === "https:" ? https : http).request(
      { hostname: u.hostname, port: u.port || undefined, path: u.pathname + u.search, headers, lookup, servername: u.hostname },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, location: res.headers.location || null, type: res.headers["content-type"] || "", body }));
      },
    );
    req.on("error", reject);
    req.end();
  });

const metas = (html, name) => [...html.matchAll(new RegExp(`<meta name="${name}" content="([^"]*)"`, "g"))].map((m) => m[1]);
const text = (s) =>
  s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

// The sitemap, and what it says about itself.
const sitemap = await get("/sitemap.xml");
const entries = [...sitemap.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));
const urls = entries.map((e) => e.loc);
const origin = new URL(urls[0]).origin;
say(urls.length >= 19, "sitemap lists the pages", urls.length + " on " + origin);
say(!origin.includes("vercel.app") && !/\/\/tiltedneedle\.com/.test(origin), "sitemap is on the primary host (www)", origin);
say(!urls.some((u) => /\/apply(\/|$)/.test(u)), "sitemap leaves the apply funnel out");
const today = new Date().toISOString().slice(0, 10);
const badDates = entries.filter((e) => e.lastmod && !(/^\d{4}-\d{2}-\d{2}$/.test(e.lastmod) && e.lastmod <= today));
const dated = entries.filter((e) => e.lastmod).length;
say(badDates.length === 0 && dated >= entries.length - 1, "sitemap dates are days, not in the future, on every page", badDates.map((e) => e.loc + " " + e.lastmod).join(", ") || dated + " of " + entries.length + " dated");

const types = (data) => {
  const out = [],
    ids = new Set(),
    refs = [];
  const walk = (x) => {
    if (Array.isArray(x)) return x.forEach(walk);
    if (!x || typeof x !== "object") return;
    if (x["@type"]) out.push(x["@type"]);
    if (x["@id"]) Object.keys(x).length > 1 ? ids.add(x["@id"]) : refs.push(x["@id"]);
    Object.values(x).forEach(walk);
  };
  walk(data);
  return { out, unresolved: refs.filter((r) => !ids.has(r)) };
};

const titles = new Map();
for (const url of urls) {
  const p = url.slice(origin.length) || "/";
  const r = await get(p);
  const title = text((r.body.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  const desc = text((r.body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
  const canon = (r.body.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const robots = metas(r.body, "robots").concat(metas(r.body, "googlebot"));
  const h1s = [...r.body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
  const blocks = [...r.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let ld = { out: [], unresolved: [] },
    parsed = true;
  try {
    ld = types(blocks.map((b) => JSON.parse(b)));
  } catch {
    parsed = false;
  }
  const problems = [];
  if (r.status !== 200) problems.push("status " + r.status);
  if (!title) problems.push("no title");
  if (!desc) problems.push("no description");
  if (canon !== url) problems.push("canonical " + canon);
  if (robots.some((c) => /noindex|none/.test(c))) problems.push("robots " + robots.join(" / "));
  if (robots.some((c) => /\bindex, follow\b/.test(c))) problems.push("redundant index, follow");
  if (h1s.length !== 1) problems.push(h1s.length + " h1s");
  if (!parsed) problems.push("JSON-LD does not parse");
  if (!ld.out.includes("Organization") || !ld.out.includes("WebSite")) problems.push("no Organization/WebSite");
  if (ld.unresolved.length) problems.push("unresolved @id " + ld.unresolved.join(", "));
  if (p.startsWith("/services/") && !(ld.out.includes("Service") && ld.out.includes("BreadcrumbList"))) problems.push("no Service/BreadcrumbList");
  if (p.startsWith("/film/") && !ld.out.includes("BreadcrumbList")) problems.push("no BreadcrumbList");
  titles.set(title, [...(titles.get(title) || []), p]);
  const long = title.length > 60 || desc.length > 160 ? "  (Google shortens: " + title.length + "/" + desc.length + ")" : "";
  say(problems.length === 0, p, (problems.join("; ") || `${title.length}/${desc.length} chars, h1 "${h1s[0]}", ${ld.out.join(" ")}`) + long);
}
const dup = [...titles].filter(([, ps]) => ps.length > 1);
say(dup.length === 0, "every title is its own", dup.map(([t, ps]) => t + ": " + ps.join(", ")).join(" | "));

const home = await get("/");
const h1 = text((home.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "");
say(h1 === "Cut for the scroll.", "home h1 reads as words without layout", h1);

const nf = await get("/no-such-page");
const nfRobots = metas(nf.body, "robots");
say(
  nf.status === 404 && nfRobots.some((c) => c.includes("noindex")) && !nfRobots.some((c) => /\bindex, follow\b/.test(c)),
  "404: status, noindex, nothing saying index",
  nf.status + " " + nfRobots.join(" / "),
);

const robots = await get("/robots.txt");
say(robots.body.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt names the sitemap", robots.body.match(/Sitemap: .*/)?.[0]);
say(!/^Host:/m.test(robots.body), "robots.txt has no Host line");
say(!/^Disallow: \/\s*$/m.test(robots.body), "robots.txt does not shut everything out");

// llms.txt: plain text, and every page of the sitemap named in it.
const llms = await get("/llms.txt");
const unnamed = urls.filter((u) => !llms.body.includes(u));
say(llms.status === 200 && llms.type.startsWith("text/plain") && unnamed.length === 0, "llms.txt is plain text naming every page", unnamed.join(", ") || `${llms.body.split("\n").length} lines`);

// The IndexNow key: the file in public/ is served at the root and holds its
// own name, which is what an engine checks before trusting a submission.
const keyFile = fs.readdirSync(path.join(process.cwd(), "public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (keyFile) {
  const k = await get("/" + keyFile);
  say(k.status === 200 && k.body.trim() === keyFile.slice(0, -4), "IndexNow key file is served and holds its name", k.status);
} else {
  say(false, "IndexNow key file exists in public/", "none");
}

const alias = await get("/services?x=1", { host: ALIAS });
say(alias.status === 308 && alias.location === origin + "/services?x=1", "vercel.app address 308s to www, path and query kept", alias.status + " " + alias.location);
for (const host of ["localhost", "www.tiltedneedle.com"]) {
  const r = await get("/services", { host });
  say(r.status === 200, "no redirect on " + host, r.status);
}

const OLD = ["/home", "/what-we-do", "/our-work", "/new-page", "/form", "/positions", "/contentcreator", "/hrmanager", "/productionassistant", "/sales", "/scriptwriter", "/videographer", "/videographer-2"];
const bad = [];
for (const p of OLD) {
  const r = await get(p);
  const to = r.location ? new URL(r.location, BASE) : null;
  const landed = to ? await get(to.pathname) : null;
  if (r.status !== 308 || !landed || landed.status !== 200) bad.push(`${p} ${r.status} -> ${r.location} ${landed?.status}`);
}
say(bad.length === 0, "old Squarespace addresses: one 308 to a live page", bad.join(" | ") || OLD.length + " checked");

console.log(`${requests} requests. ${failed ? failed + " FAILED" : "all passed"}`);
process.exit(failed ? 1 : 0);
