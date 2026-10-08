"use client";

import { HeroMotion } from "@/components/room/HeroMotion";
import { films } from "@/lib/films";
import picksData from "@/lib/published-picks.json";
import type { Published } from "@/lib/published";

/**
 * The Hero Film Backdrop: A continuous reel of the studio's published vertical cuts
 * and 35mm film base sprockets that gently drift and react to scroll velocity.
 */
export function HeroBackdrop() {
  const picks = picksData as unknown as Record<string, Published | null>;
  const filmPosters = films
    .map((f) => ({ id: f.slug, thumb: f.poster ?? picks[f.client]?.thumb }))
    .filter((f): f is { id: string; thumb: string } => Boolean(f.thumb));

  const extraPicks = Object.values(picks)
    .filter((p): p is Published => Boolean(p && p.thumb && p.vertical))
    .map((p) => ({ id: p.id, thumb: p.thumb }));

  const allStills = [...filmPosters, ...extraPicks].slice(0, 16);
  if (!allStills.length) return null;

  const row = (key: string, hidden: boolean) => (
    <div key={key} className="flex shrink-0 items-center gap-3 py-4" aria-hidden={hidden || undefined}>
      {allStills.map((s, i) => (
        <span key={s.id + '-' + i} className="film-frame shadow-2xl">
          <span className="well block h-[180px] w-[101px] md:h-[240px] md:w-[135px] overflow-hidden rounded-[2px] bg-[color:var(--stage-2)]">
            <img
              src={s.thumb}
              alt=""
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <HeroMotion>
        {row("a", false)}
        {row("b", true)}
      </HeroMotion>
      <div className="hero-vignette absolute inset-0 pointer-events-none" />
    </div>
  );
}
