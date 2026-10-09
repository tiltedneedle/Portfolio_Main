/**
 * YouTube's privacy-enhanced player for a published cut.
 *
 * Kept apart from lib/published on purpose: that module imports the whole
 * published index (published.json), so a component that only needs this one
 * function, like the lightbox on the home page, used to carry every entry of
 * the index in its page's script.
 */
export function embedUrl(videoId: string) {
  return (
    "https://www.youtube-nocookie.com/embed/" +
    videoId +
    "?rel=0&modestbranding=1&playsinline=1&color=white&autoplay=1"
  );
}
