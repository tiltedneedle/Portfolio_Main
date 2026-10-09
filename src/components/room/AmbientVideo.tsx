"use client";

import { useEffect, useRef, useState } from "react";
import { attachThrottledVideo } from "@/lib/video-slots";

type Props = {
  /** The clip for screens 768px and wider. */
  src: string;
  /** The clip below 768px. Leave it out to show no video on phones. */
  narrowSrc?: string;
  className?: string;
};

type Connection = { saveData?: boolean };

/**
 * A muted background loop that costs nothing until it is about to be seen.
 *
 * The server renders the element with no source, so the page downloads no
 * video at all. On the client it picks a source for the screen size, waits
 * until the section is near the viewport, and then loads through the shared
 * slot queue (lib/video-slots) like the film rows do. It pauses while
 * scrolled away. Visitors who ask for reduced motion or less data get no
 * video, and nothing is lost: every layer this sits under is decoration.
 *
 * A plain autoPlay attribute, which is what these sections used before, makes
 * the browser fetch the whole file whatever `preload` says. That was a 14 MB
 * 4K file behind a gradient that let a few percent of it through.
 */
export function AmbientVideo({ src, narrowSrc, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (connection?.saveData) return;
    const chosen = window.matchMedia("(min-width: 768px)").matches ? src : narrowSrc;
    if (!chosen) return;

    let release: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          video.pause();
          return;
        }
        if (!release) release = attachThrottledVideo(video, chosen, 4000);
        else video.play().catch(() => {});
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      release?.();
    };
  }, [src, narrowSrc]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setReady(true)}
      className={className}
      // Fades in once frames are actually showing, rather than popping in.
      style={{ opacity: ready ? undefined : 0, transition: "opacity 1.2s ease" }}
    />
  );
}
