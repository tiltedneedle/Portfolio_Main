# PROGRESS

Working log for the Editing Room rebuild of the marketing site. If you are
resuming after a cut-off: read this first, then `git log --oneline -5`, then
pick up at **In flight**. Do not re-ask the user what to do.

Repo (since 2026-10-09, when the user separated it from the client portal):
`C:\Users\HP\Downloads\JOB2\tilted-needle-marketing`, remote
`git@github-tn:tiltedneedle/Portfolio_Main.git`, branch `main`, its own
Vercel project; a push to `main` deploys production at
https://www.tiltedneedle.com (the domain moved to Vercel on 2026-10-12: the
bare domain 308s to www, and the old
https://portfolio-main-vert-gamma.vercel.app 308s there too, next.config.ts).
DNS is at Squarespace Domains (Google Domains nameservers); a local resolver
may still hand out Squarespace's old address for a while, so check with
`nslookup www.tiltedneedle.com 8.8.8.8`. It used to be the `marketing-site` branch of
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
- Round three ("continue to find more and fix them"):
  - The old Squarespace addresses (its sitemap: /home, /what-we-do,
    /our-work, /new-page, /form, /positions and seven role pages) redirect
    308 to their new homes (next.config.ts, OLD_SITE), ready for the day
    tiltedneedle.com moves here.
  - 320px phones: a film figure (£1.893M at 48px) and book-demo's "Revenue
    generated" ran past the edge, where the body's sideways clip cut them;
    Calendly's 320px min-width pushed the scheduler 24px off screen. Fixed;
    no text or control passes the edge at 320, 360 or 375 on any page.
    (Measure text by Range rects, not element boxes: the box fits while the
    unbreakable word overflows it.)
  - Keyboard: back-to-top was invisible but focusable (now `invisible` when
    hidden); the phone menu let Tab walk into the page behind it (now
    main/footer/back-to-top are inert while it is open) and Escape left
    focus on the page (now back on Menu); the Menu button has a 40px target.
    Film numbers list their label (dt) before the figure (dd).
  - Framer Motion runs as `m.*` under LazyMotion + domAnimation
    (components/MotionProvider; write new animated elements as `m.div`).
    The logo strip and footer word strip are CSS marquees (compositor, pause
    on hover, stop under reduced motion); the logo strip is a server
    component now. Studio clocks no longer use Intl (its first call loads
    ICU data, ~400ms at 4x CPU, on the hydration path); proven equal to Intl
    at every quarter hour 2024-2030. The running timecode only runs on screen.
  - Library lightbox stills through the optimizer; sitemap lastmod only on
    the legal pages (their stated dates, not the build time); html lang
    en-GB; Permissions-Policy browsing-topics instead of the dead
    interest-cohort.
  - Not changed, for the user: the privacy policy says the site uses
    analytics cookies (it installs none) and names none of the services
    visitors' data reaches (Calendly, YouTube on Play, Pexels for the video
    loops, Vercel); the Calendly embed passes hide_gdpr_banner=1, hiding
    Calendly's own consent banner. Legal calls, not code.
  - Measuring: this machine's connection was slow (24-83 KB/s) that
    evening, so live timings were meaningless; local builds were used. A
    first layout of 300-500ms at 4x CPU is the browser's own start-up cost
    here (no CSS suspect moved it).
- Round four (2026-10-10, "continue to find more and fix them"):
  - Without JavaScript (off, blocked, failed) the slate covered the home
    page for good and Framer's reveals stayed at opacity 0: half the text
    on nine pages. `@media (scripting: none)` in globals.css hides the
    slate, shows the reveals at rest and opens the accordions.
  - app/error.tsx (the 404's slate, "Try again" = `retry`, which in Next
    16.3 re-fetches; `reset` only clears) and app/global-error.tsx (own
    document, inline styles) replace Next's bare "Application error".
    Tested with a throwaway page that throws, removed before commit.
  - Careers roles and service FAQs: collapsed panels are `inert` (their
    "Apply for this role" buttons took focus while invisible, and screen
    readers read closed answers) and are labelled `section`s, not
    role="region" divs.
  - HTML validity (html-validate): the library tile put divs inside a
    button (now block spans); nine buttons lacked type="button". Its
    "<link> without href" on film/service pages is Next's responsive image
    preload (imagesrcset), which the spec allows.
  - Library lightbox: the posting date was ink-faint text (now ink-mid).
  - Checked clean: WebKit on all pages at laptop and iPhone (only
    Calendly's own cross-origin frame error on book-demo); axe
    best-practice rules on every page; axe in opened states (phone menu,
    lightbox both kinds, careers role, service FAQ, reel pop-up, film after
    Play, contact form error).
  - Considered and left: a Content-Security-Policy (next.config.ts keeps the
    author's reasoning; script-src would still need 'unsafe-inline' for
    Next's inline scripts on static pages, so it would add little).
- Round five (2026-10-11, same request):
  - Phone menu on short screens: a fixed full-height panel that could not
    scroll, so below 515px of height (any phone held sideways, a small one
    with the browser's bars showing) its lower links were unreachable, Book
    a demo and Careers among them. It scrolls now, and the bar takes the
    menu's ground while open so links pass under it.
  - Print had no styles. Ctrl+P on a freshly opened privacy policy printed a
    third of it (every reveal still waiting for a scroll sat at opacity 0;
    terms, services and careers likewise), the fixed bar printed over the
    top of every page, and greys and highlighted terms came out pale.
    `@media print` in globals.css: paper tokens, reveals at rest, the bar,
    grain, cursor, slate and marquees left off, the white mark inverted.
    Checked by rendering PDFs and reading their fills (text runs printed
    unscrolled = scrolled on every page). Left: Chrome paints any element
    with a background solid white when printing without backgrounds, so the
    film well's scrim prints as a white frame over the still (with the
    title on it), and the home and careers heroes print one tall page each.
  - Keyboard focus you could not see: the global ring sits 3px outside a
    control, so on controls that fill a clipping box it was cut off whole:
    the home film cards, the film well's Play (all seven films) and the
    library board. `.focus-inset` draws those rings inside, over a dark edge.
    The board's own focus utilities never applied: the unlayered
    `:focus-visible` rule beats every Tailwind utility. Its 2px corner is in
    `@layer base` now, so round controls keep their shape (the library's
    zoom buttons turned square on focus).
  - Library board under the keyboard: Tab walks the tiles mounted up to
    250px past the view, and a third of the stops were wholly off screen;
    <main> was overflow-hidden, so the browser also scrolled it to a focused
    tile and drew the board away from its pan state. <main> clips now, the
    board pans to a tile that takes keyboard focus (not a pressed one), and
    the zoom controls come before the tiles in the order.
  - Checked clean: WCAG 1.4.12 text spacing on every page (laptop, phone);
    phones held sideways and 1920/2560 screens (no overlap or overflow;
    the home hero's 640px floor puts "scroll." below the fold sideways,
    which is a scroll, not a clip); keyboard focus visible at every stop on
    every page; text contrast in hover states (290 controls, nothing drops
    below AA); source maps not served; no unload handlers or no-store, so
    nothing blocks the back/forward cache; fonts four subset files, 119 KB.
    The home page's eight logo preloads are React 19's own hints for
    non-lazy images; Chrome queues them Low, so they were left.
  - Not changed, copy: US and UK spellings mix (optimize, analyze,
    industry-recognized beside organise, recognised, unauthorised,
    licences) on an en-GB site.
- Motion (2026-10-11, "improve animations and motion"):
  - The hero strip drifts on the compositor (.hero-drift, a CSS animation;
    HeroMotion changes its playback rate with the scroll, capped at 25x,
    and holds it off screen). Advanced by script every frame, it froze
    through every long task: with the main thread blocked 1.5s it moved
    0px; now 25px over 33 frames, its own pace. The sink-and-soften on
    scroll is a scroll-driven CSS animation where supported (Framer
    elsewhere), the blur split out so the sink itself composites.
  - The home strip's shuttle and the ruler's playhead are scroll-driven CSS
    where supported (view timeline on the section), identical in position
    to the script they replace at every point checked. The classes go on
    only once the travel is measured: started on a one-screen section the
    range was empty, Chrome refused the compositor ("unsupported timing
    parameters") and never retried. The playhead no longer moves by `left`
    (a layout every scroll frame).
  - The lamp breathes by fading and shrinking a glow layer instead of
    animating box-shadow; the scheduler's loading bar slides a light layer
    instead of animating background-position (both repainted every frame).
  - Films' progress bars scale and glide between the video's reports (four
    a second; they moved in jumps). Not seen playing here: Playwright's
    Chromium has no H.264.
  - The library's 4.1s fly-in ignored every wheel, drag, pinch and key;
    the first now ends it where the board is on screen, stopped on the
    element in the same handler (a render later it overshot and eased back).
  - A cut held past 400ms shows the lamp and CUEING; the safety lift waits
    4s instead of 2.5s (it lifted onto the page being left).
  - Reduced motion: the hero's skew and parallax and the films' autoplay
    were still on; now off (the hint drops "hover to play").
  - The timecodes write when the text changes (25/s, not every frame); the
    dead rise-in keyframes and a duplicate marquee are gone.
  - Tried and reverted: the wordmark stitch as one pass every 7s from a
    timer instead of forty endless loops. Starting and stopping transforms
    on the letters laid them out again each time, and it measured worse
    than the loops. The loops are still the largest cost of a page at rest
    (all forty off: ~131 to ~40 ms/s at 4x CPU); a slower or simultaneous
    stitch would be the user's design call.
  - Measuring notes: this Chromium composites CSS transform animations
    (proved by a screencast during a main-thread block), but input scroll
    waits for the main thread, and idle main-thread A/B swings +-50ms/s on
    identical pages, so only interleaved runs and stall tests count.
- Round seven (2026-10-12, "continue to find more and fix them"):
  - A "Pause motion" switch (footer, client-logo crawl) shipped in e017d15
    for WCAG 2.2.2 and was REMOVED the same day at the user's request ("i
    dont want the switch, remove the switch idea"). Do not propose it again.
    Motion still stops under reduced motion, and the crawls pause on hover
    and focus, as before.
  - The hero reel stopped for good after a scroll down and back up (the
    user's report): scrolling up runs the drift backwards, and the CSS
    animation, its clock begun at 0, ran back past its start, finished and
    was removed. A negative animation-delay does NOT help (the clock still
    starts at 0). HeroMotion banks ten loops on the clock once the page is
    live (currentTime += 1,600,000ms, invisible) and holds it off screen
    with pause()/play(). Five fast round trips spent about 30 of the 1,600
    seconds; still composited (24px in a 1.5s main-thread stall).
  - High contrast (forced colours): the marks drawn as fills vanished (the
    lamp, the ruler's playhead, the films' progress bars), and on a light
    theme the wordmark's white figure vanished into the white. The marks
    keep system colours (.tally-mark); the figure is inverted on light.
  - Tap to next paint on a slow phone (4x CPU, interleaved medians): the
    phone menu 264 -> 216ms and the reel pop-up 328 -> 296ms; their heavy
    steps (page inert and scroll lock; YouTube's frame) now wait a painted
    frame. The scroll reveals and menu items animate a whole `transform`
    (design-tokens: lifted, SETTLED), which Framer hands to the browser:
    before, every reveal's rise was stepped from script on the main thread
    (seen as Web Animations: opacity only before, opacity + transform now).
  - The book-demo page preconnects to Calendly's two hosts.
  - The dormant self-hosted transport's progress bar glides like the
    strip's (no film has a file today).
  - Checked clean: no failed requests or console errors on any page, live;
    no memory growth over six rounds of in-site navigation (nodes and
    listeners flat, the heap's growth tailing off as the router's cache
    fills).

## Search (2026-10-12)

Asked, once the domain was live, to "optimize the google index appearance
and seo" and to say what the user has to do. Audited the live domain, every
page's head, the old Squarespace site, and Google itself:

- What Google had: four pages, the old homepage ("Tilted Needle | Enhance
  Your Brand Now") and /our-work, plus apply.tiltedneedle.com, a separate
  WordPress site on Cloudflare whose title reads "Tilted Needle – My
  WordPress Blog" (its default tagline; only the user can change it). The
  brand search ranks the site first, Companies House second, then an AI
  Overview built from LinkedIn, Glassdoor and Instagram; the result showed
  "tiltedneedle.com" where the site name should be.
- Already sound: all 14 old Squarespace URLs (its sitemap) 308 to a real
  page in one hop; unknown paths are real 404s; every page has a unique
  title and description, a self-canonical on www, share cards and one h1;
  favicon has 16/32/48/256; the four social profiles in sameAs all exist.
- **The user's rule: search work does not change the brand's lines.** Titles,
  descriptions, taglines and page names stay word for word ("do not change
  the main brand lines etc."). Rewrites of the home, services, portfolio and
  careers titles/descriptions were drafted, then dropped before pushing.
  Suggest copy changes; never ship them unasked.
- Changed (all invisible): Service and BreadcrumbList data on the four
  service pages, built from their own titles and descriptions; Organization
  gains its slogan (the h1, verbatim) and the service names it offers.
  `robots` no longer says "index, follow" (it contradicted Next's noindex on
  the 404) and allows large image previews. robots.txt lost its Yandex-only
  `Host` line. The vercel.app address 308s to www. The home h1 read "Cut for
  thescroll." to anything that reads text without layout (a space between
  its two lines; layout identical, measured). `components/JsonLd.tsx`
  escapes `<`, as the Next docs advise.
- Left as written, so Google shortens them: five descriptions run past the
  ~155 characters a result shows (content creation 215, app & web 193,
  careers 178, influencer 176, paid 165).
- Not done, on purpose: VideoObject on the film pages. Google's video docs:
  "Don't rely on user actions ... to load the video", and the films load
  YouTube on Play (round one took ~1 MB of player off every film page).
  Worth revisiting only with self-hosted films (`<video>` in the HTML).
  JobPosting needs a page per role (Google's rule for list pages).
- With the user: Search Console (the domain already has a
  google-site-verification TXT record), sitemap submission, Bing import,
  a Google Business Profile, the apply subdomain, the company's legal
  details (name, number, registered office: UK trading-disclosure rules,
  and Organization.legalName would tie the site to Companies House).

## Loops and the slate (2026-10-13)

The user: on some screen sizes the reels (hero, "cut post", logos) run out
and show empty space at one side; and the first-visit loading screen should
move like a real clapper and go away without Skip. Measured first, with
`loops.mjs` (every loop stepped through its cycle at 16 widths, 320 to
3840px) and `slate-timing.mjs` (from first paint, desktop, throttled phone,
phone whose scripts never load), both in the scratchpad suite now.

- Hero reel: broken at every width. Two rows, centred, so only half a row
  lay right of centre: for the last part of every loop the strip's end
  crossed the screen and left its right side empty (half the screen: 195px
  of a phone for 8% of the loop, 720px of a laptop for 24%, 960px at 1920
  for 32%); the join between the rows had no gap. Now three rows from the
  left edge (16px past it, for the scroll skew), each ending on the
  strip's 16px gap, sliding one row (calc(-100% / 3)) per 160s: covered at
  every phase up to ~6,000px, same speed, still on the compositor.
- Logos: ran out from 1,536px (two 1,524px copies): 396px of black for a
  quarter of the loop at 1920, two thirds at 2560, always at 3440+. Four
  copies now.
- Word strip ("hook. shoot. cut. post. repeat."): the trailing space of
  each copy is dropped at the end of a no-wrap line, so the join read
  "repeat.hook." at every width; it also ran out from 1,830px. Each run
  now ends on a no-break space; four copies.
- `loops-wrap.mjs`: the frame a loop starts again on matches its first,
  item for item, to 0px, at every width (the old hero did not: its empty
  side filled with film at each restart).
- The slate: was a static stripe and a timer started after hydration, so
  a throttled phone held it 4.5s, and one whose scripts failed to load
  held it for good (Skip is a script too). Now the whole run is CSS from
  the first paint, 2.3s: the top stick of a real two-stick clapper (stripes
  opposed, so shut they meet in chevrons, hinge pin at the left) is held
  open (14 degrees on a phone, 8 on a desktop, where the 760px stick would
  leave the screen), snaps shut accelerating at 0.95s, bounces 1.5 degrees,
  the board takes a 3px knock, is pulled down out of frame at 1.85s, black
  beat, cut at 2.3s. The timecode rolls in CSS from the first paint
  (columns of numbers stepped a line at a time, finite). Measured: 2.3s on
  desktop, under 3.1s on the throttled phone (measuring on its busy main
  thread), 2.35s with no scripts at all; Skip jumps the run to the pull-out
  (0.46s). Clap, board and the cut's opacity run on the compositor (trace);
  the visibility half lets clicks through and cues the component to
  unmount. No tilt while the board is still (0.2 degrees roughened the type
  and the rules). Copy unchanged, word for word.

## Round nine (2026-10-13, "continue to find more and fix them")

Started by putting the last round's work through WebKit (Safari's engine:
loops, slate run, timing, Skip: all as in Chromium) and a phone's touch
screen, then followed what turned up. Each with a new check in the suite.

- Android froze the logo strip: a tap leaves the element in :hover until
  the next tap elsewhere, and the strip pauses on hover (iOS does not
  apply :hover there). Every custom hover style (pills, underline-draw,
  slate-link, plate, the wordmark, the marquee pause) now sits in
  `@media (hover: hover)`, as Tailwind's own hover: utilities do.
  `touch-hover.mjs`.
- The slate's production line ("Prod. Tilted Needle") broke onto two lines
  on every phone 320-412px: two equal columns, the right one needing a
  quarter of its half. `grid-cols-[1fr_auto]`, `gap-x-4 md:gap-x-6`.
  `slate-wrap.mjs`.
- On a phone held sideways the slate stood taller than the screen
  (title 16vw = 135px a line at 844x390): the clapper above the top, Skip
  below the bottom; on laptops (1366x768, 1536x730 = 1920 at 125%) the
  open stick's tip rose off the top. `.slate-title` also gives way to the
  height; screens up to 860px tall open the clapper 5 degrees, short wide
  ones (max-height 780, landscape) 3 degrees with 32px above the board.
  Portrait phones and tall desktops unchanged. `slate-landscape.mjs`, 20
  real viewport sizes incl. browser chrome.
- The slate played mid-visit: a first-time visitor who landed on an inner
  page and went home (the nav's Work and Contact are plain links that load
  the page afresh; the logo is a cut) got the whole slate over the section
  they asked for. Now only as the site's opening: the home page's inline
  script skips it when the referrer is this site (or storage is blocked),
  and marks a real opening (window.__tnSlate) for Slate, which client-side
  arrivals never get. `slate-midsession.mjs`.
- /#contact on a desktop landed 2,879px short: the film section was one
  screen tall until its script measured the strip and grew it by the whole
  travel (2,000-3,900px), after the browser had already scrolled. Its
  height is now CSS from the first paint (`.sequence`, from --films:
  8 x 40.5svh + 9 x 24px - 22vw + 100svh), equal to the measurement to
  the pixel at 768-3440px; it grows 0px after load. `nav-hash.mjs`,
  `seq-range.mjs`.
- Back to the home page in Chrome/Edge/Android put the visitor at the top
  and then scrolled them down to where they had been, ~1.5s through the
  whole page: the browser's own scroll restoration honours globals.css's
  `scroll-behavior: smooth`, and since Next 16 the router no longer
  switches it off. CutOverlay sets it to auto for 1.2s after a popstate
  that changes page (not after an in-page #link, which fires popstate
  too and stays smooth); `data-scroll-behavior="smooth"` on <html> for
  the router's own scrolls (Next 16 upgrade notes). Safari was never
  affected. `back-restore.mjs` (read 400ms after Back), `inpage-smooth.mjs`.
- Checked clean: form fields 17px (no iOS zoom) with autocomplete; first
  visit on a throttled phone no slower after the slate change (9
  interleaved runs: LCP 3.14s vs 3.32s, TBT 1.19s vs 1.33s; the extra
  copies cost 0.7 KB gzipped).

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
