/**
 * The visitor's own pause for the site's endless motion: the client-logo and
 * word crawls, the hero's drift, grain and dust, the wordmark's stitch, the
 * lamp, the running timecode, and the films that play as they pass. Motion
 * that starts by itself and runs past five seconds needs a way to stop it
 * (WCAG 2.2.2); hover paused the crawls, which no keyboard or touch screen
 * can do, and reduced motion is a setting most people never find.
 *
 * MotionToggle flips it. It is kept in localStorage and put on <html>
 * (data-motion="still") by STILL_SCRIPT, inline at the top of <body>, before
 * the first paint, so a visitor who paused the site never sees a frame of it
 * moving again. CSS holds the CSS loops (globals.css); script-driven motion
 * asks isStill() and listens with onStillChange(). One-shot entrances are
 * left to run: paused before they had played, they would hold text unseen.
 */
export const STILL_KEY = "tn-motion";
const EVENT = "tn-motion";

export const STILL_SCRIPT =
  'try{if(localStorage.getItem("' + STILL_KEY + '")==="still")document.documentElement.setAttribute("data-motion","still")}catch(e){}';

export function isStill() {
  return typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") === "still";
}

export function setStill(still: boolean) {
  const root = document.documentElement;
  if (still) root.setAttribute("data-motion", "still");
  else root.removeAttribute("data-motion");
  try {
    if (still) localStorage.setItem(STILL_KEY, "still");
    else localStorage.removeItem(STILL_KEY);
  } catch {
    // private mode: paused for this page only
  }
  window.dispatchEvent(new Event(EVENT));
}

export function onStillChange(fn: () => void) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
