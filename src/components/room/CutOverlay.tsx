"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { HOLD_MS, endCut, isCutting } from "@/lib/cut";

/**
 * The black frame that every cut passes through. Rendered once in the root
 * layout; it does nothing until CutLink drops the frame, then clears it a
 * beat after the pathname changes.
 */
export function CutOverlay() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!isCutting()) return;
    // The new scene has committed. Hold the black for one beat, then reveal.
    const hash = window.location.hash.slice(1);
    const targetEl = hash ? document.getElementById(hash) : null;
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    const t = setTimeout(endCut, HOLD_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  // A back/forward navigation never goes through CutLink; make sure the frame
  // is not stuck from a cut that was interrupted.
  useEffect(() => {
    const onShow = () => endCut();
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // Back and forward between pages: the browser puts the page back where it
  // was, and with globals.css's smooth scrolling it travelled there, from
  // the top through the whole page (a second and a half down the home
  // page). For a moment after each, scrolling is instant. Only between
  // pages: a click on an in-page link (#work) fires the same event, and
  // those stay smooth.
  const shown = useRef(pathname);
  useEffect(() => {
    shown.current = pathname;
  }, [pathname]);
  useEffect(() => {
    const html = document.documentElement;
    let t: ReturnType<typeof setTimeout> | undefined;
    const onPop = () => {
      if (location.pathname === shown.current) return;
      html.style.scrollBehavior = "auto";
      clearTimeout(t);
      t = setTimeout(() => (html.style.scrollBehavior = ""), 1200);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      clearTimeout(t);
      html.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="cut-frame" aria-hidden="true">
      <p className="cut-cue mono">
        <span className="lamp" />
        Cueing
      </p>
    </div>
  );
}
