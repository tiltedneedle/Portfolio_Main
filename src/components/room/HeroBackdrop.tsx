"use client";

import { HeroMotion } from "@/components/room/HeroMotion";
import { films } from "@/lib/films";
import picksData from "@/lib/published-picks.json";
import type { Published } from "@/lib/published";

/**
 * The Hero Film Backdrop: A continuous reel of the studio's published vertical cuts
 * and 35mm film base sprockets that gently drift and react to scroll velocity.
 */
const DIVERSE_HERO_STILLS = [
  { id: "hero-1", client: "The Jet Business", thumb: "https://i.ytimg.com/vi/iMqGv-W5DhY/oardefault.jpg" },
  { id: "hero-2", client: "Noor Charchafchi", thumb: "https://i.ytimg.com/vi/S1yoGjXeXMQ/oardefault.jpg" },
  { id: "hero-3", client: "Alexis Gauthier", thumb: "https://i.ytimg.com/vi/uMDp2WaEX7Q/oardefault.jpg" },
  { id: "hero-4", client: "EuroEyes", thumb: "https://i.ytimg.com/vi/BRIDMjlZiW8/oardefault.jpg" },
  { id: "hero-5", client: "Frankie Mardell", thumb: "https://tkmvuxjnfzbdpditvdbo.supabase.co/storage/v1/object/public/post-thumbnails/44b49af3-3c91-40e5-a721-552c2913319f.jpg" },
  { id: "hero-6", client: "Rastah", thumb: "https://i.ytimg.com/vi/8XqZkt7fI4E/oardefault.jpg" },
  { id: "hero-7", client: "Ameerh Naran", thumb: "https://i.ytimg.com/vi/hRGhKr1XlgI/oardefault.jpg" },
  { id: "hero-8", client: "Youmi Khoury", thumb: "https://i.ytimg.com/vi/NY7r0fIoX74/oardefault.jpg" },
  { id: "hero-9", client: "Alex Evagora", thumb: "https://tkmvuxjnfzbdpditvdbo.supabase.co/storage/v1/object/public/post-thumbnails/d2d0f94f-2725-4ebe-adbf-b69ce235007a.jpg" },
  { id: "hero-10", client: "Entree", thumb: "https://tkmvuxjnfzbdpditvdbo.supabase.co/storage/v1/object/public/post-thumbnails/1512ba00-fd62-4f61-9173-b14880a35c76.jpg" },
  { id: "hero-11", client: "Delfino Mayfair", thumb: "https://tkmvuxjnfzbdpditvdbo.supabase.co/storage/v1/object/public/post-thumbnails/ccb085b0-ebb5-41a2-afa7-a27d7cfd89df.jpg" },
  { id: "hero-12", client: "Ohana Developments", thumb: "https://tkmvuxjnfzbdpditvdbo.supabase.co/storage/v1/object/public/post-thumbnails/d0002e69-fd72-448c-a3a0-e46b33d5b020.jpg" },
  { id: "hero-13", client: "Yusuf Nik", thumb: "https://tkmvuxjnfzbdpditvdbo.supabase.co/storage/v1/object/public/post-thumbnails/f76b4e6a-636c-4924-b97d-5d1dbe09042c.jpg" },
  { id: "hero-14", client: "Tilted Needle", thumb: "https://i.ytimg.com/vi/93f2iVn6rIc/oardefault.jpg" },
  { id: "hero-15", client: "The Jet Business", thumb: "https://i.ytimg.com/vi/UKZha99IJjc/oardefault.jpg" },
  { id: "hero-16", client: "EuroEyes", thumb: "https://i.ytimg.com/vi/F1yWKrngc7A/oardefault.jpg" },
  { id: "hero-17", client: "Ameerh Naran", thumb: "https://i.ytimg.com/vi/0ZEOkKHVZSk/oardefault.jpg" },
  { id: "hero-18", client: "The Jet Business", thumb: "https://i.ytimg.com/vi/R0YRf0nWEw4/oardefault.jpg" },
  { id: "hero-19", client: "EuroEyes", thumb: "https://i.ytimg.com/vi/5s76iKhZ9O8/oardefault.jpg" },
  { id: "hero-20", client: "Ameerh Naran", thumb: "https://i.ytimg.com/vi/aEBxEmp7GI8/oardefault.jpg" },
  { id: "hero-21", client: "Tilted Needle", thumb: "https://i.ytimg.com/vi/WPe64iptrYs/oardefault.jpg" },
];

/**
 * The Hero Film Backdrop: A single, seamless strip of diverse published cuts
 * from across our client roster that smoothly drifts behind the title.
 */
export function HeroBackdrop() {
  const row = (key: string, hidden: boolean) => (
    <div key={key} className="flex shrink-0 items-center gap-4 py-2" aria-hidden={hidden || undefined}>
      {DIVERSE_HERO_STILLS.map((s, i) => (
        <span key={s.id + '-' + i} className="film-frame">
          <span className="block h-[180px] w-[101px] md:h-[230px] md:w-[129px] overflow-hidden rounded-[2px] bg-[color:var(--stage-2)] border border-[color:var(--rule)]">
            <img
              src={s.thumb}
              alt=""
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
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
