# PROGRESS

Working log for the Editing Room rebuild of the marketing site. If you are
resuming after a cut-off: read this first, then `git log --oneline -5`, then
pick up at **In flight**. Do not re-ask the user what to do.

Repo (since 2026-10-09, when the user separated it from the client portal):
`C:\Users\HP\Downloads\JOB2\tilted-needle-marketing`, remote
`git@github-tn:tiltedneedle/Portfolio_Main.git`, branch `main`, its own
Vercel project; a push to `main` deploys production
(https://portfolio-main-vert-gamma.vercel.app; tiltedneedle.com still points
at the old Squarespace site). It used to be the `marketing-site` branch of
`tiltedneedle/Portfolio`, which is now the client portal only. Build with
`npm run build`; serve with `npx next start -p 3400` (kill any old listener
on 3400 first, or the start fails with EADDRINUSE and you verify a stale
build). Visual checks go through Playwright, screenshots into the session
scratchpad, never into the repo.

## Review fixes (2026-10-09)

Asked to review the separated site, then "fix and continue to find more".
Measured before/after on a phone (unthrottled, cold cache): home 18.4 MB to
1.1 MB, library 15.3 MB to 0.8 MB, careers 14.2 MB to 2.0 MB.

- Next 16.2.12 to 16.3.8 (critical/high advisories, incl. two in the image
  optimizer; production audit now clean); unused vitest removed; package
  renamed `tilted-needle-marketing`.
- Canonical links and share cards follow `SITE_URL` (they pointed at
  tiltedneedle.com, still Squarespace, so previews had no image). Every
  page has its own share title (`pageMeta()`); each film its own card.
- Background loops: `room/AmbientVideo` (in view, small renditions, never
  for reduced motion or data saver). Title card 4K 14 MB to 640px 0.6 MB and
  none on phones; careers 1080p to 960px/640px; the end slate's mixkit clip
  (403, never played) removed. Careers no longer labels stock as a shoot.
- Stills through the optimizer at drawn size everywhere (hero strip, board,
  results rows, film wells, sequence, service thumbnails, brand logos);
  `remotePatterns` pinned to the exact URL shapes, `minimumCacheTTL` a month.
- Library: no stills during the intro's wide shot; two deleted Shorts
  dropped; `scripts/published.mjs` now drops dead stills and keeps the five
  hand-set picks it used to overwrite.
- The home page no longer ships the published index (the lightbox imported
  `embedUrl` from it; now `lib/embed.ts`).
- Film wells load YouTube on Play (was ~1 MB of player script on arrival);
  the watch dealer's dead transport replaced by a link to its Instagram cut.
- Contact route: other-site Origin refused, honeypot on both forms,
  `Object.hasOwn` for the form type. Vercel overwrites X-Forwarded-For, so
  the leftmost entry is the real client (not spoofable there).
- Accessibility: nav numerals and film slate keys off `--ink-faint`, Sound
  control 24px; axe (WCAG 2.2 AA) clean on all 20 pages at 1440 and 390.
  Nav/footer hash links respect reduced motion. Dead ColdOpen video state
  removed. Apple touch icon and square manifest icons; JSON-LD logo is the
  dark mark. 404 and library titles; book-demo said 2B+ (now 5B+).
- Round two, measured on the live site (throttled phone, largest paint):
  the first screens waited for hydration, because their entrances were
  Framer Motion props (home 7.9s after round one). They are CSS now
  (`.enter-rise/.enter-fade/.enter-mask` in globals.css; no entrance at all
  under reduced motion): home, careers, studio, service pages, book-demo,
  legal. Below-the-fold reveals keep Framer. The slate is hidden from the
  first paint for returning visitors and reduced motion by an inline script
  in the home page (`data-slate` on html); its own layout effect only ran
  after hydration, seconds late on a phone. Careers plays its reel on
  laptops only (on phones the 640px file became the largest paint at 5.3s).

## The concept (approved 2026-09-03, "do whatever seems right")

"The Editing Room, cut vertical." Dark single-world system, four open faces
(Big Shoulders Display / Instrument Sans / Instrument Serif italic / JetBrains
Mono), one interface colour (tally red, state only). Home runs as a reel:
slate (once per device) > cold open > sequence of six 9:16 films on a pinned
timeline > title card > credits > results > end slate > footer. Film pages at
`/film/[slug]`. Route changes are black-frame cuts. Custom cursor on fine
pointers. Treatment artifact: claude.ai/code/artifact/ca459411-f319-45d6-98e7-d1199eafa767

Decisions made on the user's behalf: statement "Cut for the scroll.", open
faces vendored (swap to licensed = one file, `src/app/layout.tsx`), tally
accent, mint editorial system retired.

## Done

- [x] Design system: `src/app/globals.css` (tokens, faces, `.display`, `.mono`,
      `.tc`, `.lamp`, cut frame, cursor, grain on screen blend at 0.085).
- [x] Fonts vendored: `src/app/fonts/*.woff2` (4 faces, all SIL OFL).
- [x] Cut transitions: `src/lib/cut.ts`, `room/CutOverlay.tsx`, `room/CutLink.tsx`.
- [x] Cursor: `room/Cursor.tsx` (`data-cursor="Play|Open|Cut|Scrub|Pause"`).
- [x] Film model: `src/lib/films.ts` (+ `posters.json`, `scripts/posters.mjs`).
- [x] Home beats: `room/Slate`, `ColdOpen`, `Sequence`, `TitleCard`,
      `CreditsRoll`, `ResultsSlate`, `EndSlate`; `room/Readouts` (timecode, clocks).
- [x] Film pages: `app/(site)/film/[slug]/page.tsx` + `room/FilmPage.tsx`
      (transport: play/pause, scrub, sound; match cut to next film). Sitemap updated.
- [x] Nav and footer rewritten as slates; `room/TopMark` replaces BackToTop.
- [x] Nine dead mint components removed. tsc clean, eslint 0 errors, build clean.
- [x] Visual pass 1 (desktop 1440, mobile 390): all beats render; slate/caption
      overlap in frames fixed; grain softened.

- [x] Visual pass 2: inner pages (studio, service, careers, book-demo, legal,
      404) and the library rewritten into the room. Commit `3627051`, pushed.
- [x] Hardening round 1: Sequence re-measures after `document.fonts.ready` and
      on orientation change; a failed source marks its frame Offline and stops
      asking for a slot; CutLink no longer cuts to the page already showing
      (the pathname never changed, so the frame stayed black until the safety
      timer); nav numbers are aria-hidden; the film well derives width from
      its height budget so it is always 9:16; the ruler readout lost its
      `aria-live` (it changed on every scroll tick).
- [x] Manifest and JSON-LD carry the new description and stage colour.

- [x] OG image is the slate, in the site's faces. Satori reads TTF/OTF/WOFF
      only; Google serves static WOFF to an ancient user agent, so
      `src/app/fonts/*.woff` are vendored copies for the renderer alone.
- [x] Separator spacing fixed (careers eyebrow, library card).

- [x] Reduced-motion audit passed: slate skipped, native cursor, sequence
      still shuttles, hero lines land at rest, nothing parked at opacity 0.
- [x] Heading order: service detail and careers section labels are now h2.
      Slate labels moved off `--ink-faint` (contrast).
- [x] Cut measured: black on click, route commit ~470ms later, lift 140ms
      after. CutLink now prefetches on pointerenter so the hold is shorter.
- [x] Contact route: 8s timeout on the Resend call (was unbounded).

- [x] Round two committed (`6d0fb2a`). Heading order verified on every page.
- [x] Mobile pass 2 on inner pages: no horizontal overflow, h1 at 56px on
      390px, film well fills the width at 9:16, library pinch-and-drag card.
- [x] Bundle: ~1.16 MB of client JS across all route chunks, largest chunk
      224 KB (React + framer). Deps: clsx, framer-motion, lucide-react,
      tailwind-merge only.

- [x] Keyboard access to the pinned strip: focusing a frame drives the scroll
      so it lands under the playhead (verified: frame 05 at x 524-888, y 84,
      scrollY 2530). Two traps found on the way: an `overflow: hidden` box
      still scrolls when a child is focused (now `overflow: clip`), and this
      headless browser only advances smooth scrolls when it paints, so scroll
      checks must force frames with screenshots or set
      `html{scroll-behavior:auto}` first.
- [x] Cursor hands back to the native pointer over iframes (Calendly).
- [x] README rewritten for the room system.
- [x] Project memory updated (`project_marketing_site_replica.md`).

- [x] Media resolved without hosting anything (2026-09-04): the studio's own
      published index (ops database, 634 posts with durable stills) now feeds
      the site. `scripts/published.mjs` exports `src/lib/published.json` (the
      library, 499 vertical clips with stills, YouTube Shorts playable in the
      lightbox, Instagram/TikTok as still + link) and
      `src/lib/published-picks.json` (per-film picks + the reel + the count, so
      the home page never carries the index). Films 01/04/05 have real stills
      and 01/04 embed the published cut; 02/03/06 (Celine, Gauthier, Rastah)
      are not in the index and keep their slates.
- [x] Animated wordmark (`room/Wordmark.tsx`, CSS stitch), nav hover grammar
      (hovered room grows, it and everything left of it go serif italic),
      logo strip back as a marquee, Toyota mark uncropped.

## In flight

- (nothing)

## Next

- [ ] Posters: run `node scripts/posters.mjs` once videos are re-hosted, then
      `git add public/posters src/lib/posters.json` and rebuild.
- [ ] When the studio has a cut showreel, point "Play reel" at it. Today it
      opens the studio's own week-in-the-life Short (`__reel` in
      `src/lib/published-picks.json`, chosen by `scripts/published.mjs`).
- [ ] Cut 2 (from the treatment): library as a true contact sheet with the
      room's data model, sound design, keyboard shuttle (J/K/L), mobile media.
- [ ] Cut 3: raw-vs-final, BTS, credits, CMS. Needs content that does not exist.

## Blockers (need the user)

- **All 144 video URLs are dead.** `d6lso8oygmnu9.cloudfront.net` has no DNS
  record at any resolver, including AWS's authoritative server; the old
  Amplify host is gone too; nothing in the Wayback Machine. The films, the
  30 portfolio items and the 109 board clips all point there. Every frame
  falls back to its slate (designed for this), but the site has no moving
  picture until the studio re-hosts the originals. Recommended: Cloudflare R2
  or Supabase Storage, then update `case-studies-data.ts`, `site-data.ts`,
  `board-videos.ts`, run `scripts/posters.mjs`, rebuild.
- (2026-10-09) The new Vercel project needs `RESEND_API_KEY` and
  `CONTACT_FROM` (optionally `CONTACT_TO`), or every enquiry takes the
  mailto route. Only the user can see or set them.
- (2026-10-09) The background loops on the title card and careers hero are
  Pexels stock, hotlinked (the mixkit one stopped answering). The studio's
  own footage, self-hosted, is the real fix; AmbientVideo takes any URL.
- (2026-10-09) The repo is public and RECOVERY.md holds internal notes (the
  lost AWS account, who is in which clip). Visibility is the user's call.
