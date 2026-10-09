"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CutLink } from "@/components/room/CutLink";
import { attachThrottledVideo } from "@/lib/video-slots";
import { pad2, timecode, films, type Film } from "@/lib/films";

/**
 * A film page is a suite with one clip loaded. The slate runs across the top
 * (number, client, year, categories), the film stands 9:16 in its well with
 * real transport controls, and beside it the idea and the numbers. The page
 * ends on a match cut to the next film.
 */
export function FilmPage({ film, next }: { film: Film; next: Film }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [dead, setDead] = useState(false);
  const [embedOn, setEmbedOn] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // The Play control unmounts as the player mounts; hand keyboard focus to
  // the player rather than letting it fall back to the page.
  useEffect(() => {
    if (embedOn) playerRef.current?.focus();
  }, [embedOn]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !film.videoUrl) return;
    return attachThrottledVideo(v, film.videoUrl, 6000);
  }, [film.videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !sound;
  }, [sound]);

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (bar.current) bar.current.style.width = (v.currentTime / v.duration) * 100 + "%";
    if (tc.current) tc.current.textContent = timecode(v.currentTime);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const scrub = (e: React.MouseEvent<HTMLButtonElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  };

  const live = playing && !paused;
  // A file of the studio's own to play in the well. The CloudFront originals
  // are gone (RECOVERY.md), so today no film has one; the transport waits for
  // them to come back.
  const selfHosted = !film.embedId && !!film.videoUrl;

  return (
    <article className="bg-[color:var(--stage)] pt-24 md:pt-28">
      {/* the slate */}
      <header className="mx-auto max-w-[1600px] px-6 md:px-14">
        {/* Keys in ink-mid, values a step up in ink-soft. The keys were
            ink-faint, which measured 2.6:1 at this 11px size (globals.css keeps
            faint for decoration and large type). */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-y border-[color:var(--rule-strong)] py-4 mono md:grid-cols-4">
          <p className="text-[color:var(--ink-soft)]">
            <span className="text-[color:var(--ink-mid)]">Film</span> {pad2(film.index)} / {pad2(films.length)}
          </p>
          <p className="text-[color:var(--ink-soft)]">
            <span className="text-[color:var(--ink-mid)]">Client</span> {film.client}
          </p>
          <p className="text-[color:var(--ink-soft)]">
            <span className="text-[color:var(--ink-mid)]">Year</span> {film.year}
          </p>
          <p className="text-[color:var(--ink-soft)]">
            <span className="text-[color:var(--ink-mid)]">Format</span> {film.categories.join(" / ")}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-16 gap-y-14 px-6 py-14 md:grid-cols-12 md:px-14 md:py-20">
        {/* the well */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            {/* Width is derived from the height budget so the well is always 9:16;
                on a narrow column the width cap wins and the height follows. */}
            <div className="well mx-auto" style={{ width: "min(100%, calc(min(82svh, 900px) * 9 / 16))" }}>
              {/* A published cut, when the index has one: YouTube's own player in
                  the well, from its privacy-enhanced host. The custom transport
                  below applies to self-hosted files only.

                  The player loads when asked for. Mounted on arrival it pulled
                  about 1 MB of YouTube's script into every film page and kept
                  the main thread busy for seconds on a phone, for a film most
                  visitors read about rather than play. Until then the well
                  shows the film's own still and slate, and a Play control. */}
              {film.embedId && embedOn && (
                <iframe
                  ref={playerRef}
                  src={"https://www.youtube-nocookie.com/embed/" + film.embedId + "?rel=0&modestbranding=1&playsinline=1&color=white&autoplay=1"}
                  title={film.title + ", the published cut"}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 z-10 h-full w-full"
                />
              )}
              {film.embedId && !embedOn && (
                <button
                  type="button"
                  onClick={() => setEmbedOn(true)}
                  className="group/play absolute inset-0 z-10 flex h-full w-full items-center justify-center"
                  aria-label={"Play " + film.title + ", the published cut"}
                  data-cursor="Play"
                >
                  <span
                    aria-hidden="true"
                    className="flex items-center gap-2 rounded-full border border-[color:var(--rule-strong)] bg-[rgba(11,11,12,0.6)] px-5 py-2.5 text-[13px] font-medium text-[color:var(--ink)] backdrop-blur-sm transition-colors duration-300 group-hover/play:border-[color:var(--ink)] group-hover/play:bg-[color:var(--ink)] group-hover/play:text-[color:var(--stage)] group-focus-visible/play:border-[color:var(--ink)]"
                  >
                    Play the cut &#9654;
                  </span>
                </button>
              )}
              {/* The page's largest image, so eager and first in the queue, but
                  sized to the well (at most 506px wide) rather than the full
                  9:16 original. */}
              {film.poster && (
                <Image
                  src={film.poster}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 506px, 92vw"
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover"
                />
              )}
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                onPlaying={() => setPlaying(true)}
                onTimeUpdate={onTime}
                onError={() => setDead(true)}
                className={
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 " +
                  (playing ? "opacity-100" : "opacity-0")
                }
              />
              {/* The slate over the still. A scrim at head and foot keeps its
                  type readable on a bright still; YouTube's player used to
                  cover this layer on most films, so it was rarely seen. */}
              <div
                aria-hidden="true"
                className={
                  "absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-[rgba(11,11,12,0.6)] via-transparent via-40% to-[rgba(11,11,12,0.75)] p-6 transition-opacity duration-700 " +
                  (playing ? "opacity-0" : "opacity-100")
                }
              >
                <p className="mono">Film {pad2(film.index)}</p>
                <div>
                  <p className="display text-[clamp(40px,4vw,64px)] leading-[0.9] text-[color:var(--ink)]/85">{film.title}</p>
                  {dead && <p className="mono mt-4 text-[color:var(--tally)]">Source offline</p>}
                </div>
              </div>

              {selfHosted && (
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute inset-0 block h-full w-full"
                  aria-label={live ? "Pause film" : "Play film"}
                  data-cursor={live ? "Pause" : "Play"}
                />
              )}
            </div>

            {/* Where the published cut lives. For a film with no file of its
                own and no YouTube cut (the watch dealer's is on Instagram) this
                is the only way to see it: the Play button and transport used to
                show anyway, wired to a video with no source. */}
            {film.post && !selfHosted && (
              <div className="mt-4 flex items-center justify-between mono">
                <span>Published cut</span>
                <a href={film.post.url} target="_blank" rel="noopener noreferrer" className="slate-link inline-flex min-h-6 items-center">
                  {"Open on " + (film.post.platform === "instagram" ? "Instagram" : film.post.platform === "tiktok" ? "TikTok" : "YouTube")} &#8599;
                </a>
              </div>
            )}

            {/* transport, for the studio's own files only */}
            <div className={selfHosted ? "mt-4" : "hidden"}>
              <button
                type="button"
                onClick={scrub}
                className="block h-4 w-full"
                aria-label="Scrub"
                data-cursor="Scrub"
              >
                <span className="block h-px w-full bg-[color:var(--rule-strong)]">
                  <span ref={bar} className="block h-px w-0 bg-[color:var(--tally)]" />
                </span>
              </button>
              <div className="flex items-center justify-between mono">
                <span className="flex items-center gap-2">
                  <span className={live ? "lamp" : "lamp-off"} aria-hidden="true" />
                  {live ? "Playing" : paused ? "Paused" : "Cued"}
                  <span ref={tc} className="tc ml-2">
                    00:00:00:00
                  </span>
                  {film.duration ? <span className="text-[color:var(--ink-mid)]">/ {timecode(film.duration)}</span> : null}
                </span>
                {/* At least 24px tall: the bare mono line was a 16px target. */}
                <button type="button" onClick={() => setSound((s) => !s)} className="slate-link inline-flex min-h-6 items-center" aria-pressed={sound}>
                  Sound {sound ? "on" : "off"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* the read */}
        <div className="md:col-span-7">
          <h1 className="display text-[clamp(56px,8vw,140px)]">{film.title}</h1>
          <p className="em-serif mt-6 text-[clamp(24px,2.6vw,40px)] text-[color:var(--ink-soft)]">{film.highlight}</p>

          <div className="mt-14 border-t border-[color:var(--rule)] pt-8">
            <p className="mono">The idea</p>
            <p className="mt-4 max-w-[52ch] text-[19px] leading-relaxed text-[color:var(--ink-soft)] md:text-[21px]">{film.summary}</p>
          </div>

          <div className="mt-12 border-t border-[color:var(--rule)] pt-8">
            <p className="mono">The numbers</p>
            <dl className="mt-6 grid grid-cols-2 gap-8">
              {film.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="display tabular text-[clamp(48px,6vw,104px)] leading-none">{m.value}</dd>
                  <dt className="mono mt-3">{m.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-12 border-t border-[color:var(--rule)] pt-8">
            <p className="mono">Format</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {film.categories.map((c) => (
                <li key={c} className="pill pill-outline px-4 py-1.5 text-[13px]">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* the match cut */}
      <CutLink
        href={"/film/" + next.slug}
        className="group block border-t border-[color:var(--rule)] bg-[color:var(--stage-2)]"
        data-cursor="Cut"
      >
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-8 px-6 py-16 md:px-14 md:py-24">
          <div className="flex items-end gap-8">
            {next.poster && (
              <div className="relative hidden h-24 w-16 shrink-0 overflow-hidden rounded-[2px] border border-[color:var(--rule-strong)] shadow-xl sm:block">
                {/* thumbnail-sized through the optimizer, not the full still */}
                <Image
                  src={next.poster}
                  alt=""
                  width={64}
                  height={96}
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </div>
            )}
            <div>
              <p className="mono">Next film {pad2(next.index)}</p>
              <p className="display mt-4 text-[clamp(40px,7vw,120px)] transition-colors duration-300 group-hover:text-white">
                {next.title}
              </p>
              <p className="mono mt-4">{next.client}</p>
            </div>
          </div>
          <span aria-hidden="true" className="display text-[clamp(40px,7vw,120px)] text-[color:var(--ink-faint)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[color:var(--ink)]">
            &#8599;
          </span>
        </div>
      </CutLink>
    </article>
  );
}
