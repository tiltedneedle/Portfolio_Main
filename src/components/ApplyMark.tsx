"use client";

import { useLayoutEffect } from "react";
import { APPLY_HOST } from "@/lib/apply-host";

/**
 * Marks the document as the apply funnel while one of its pages is showing
 * and the host is the subdomain (lib/apply-host). A layout effect, so the
 * mark is set before the nav's first paint, and removed when the funnel is
 * left by a client-side route (which only happens if someone opens the
 * /apply pages on www, where every link is an ordinary site link).
 */
export function ApplyMark() {
  useLayoutEffect(() => {
    if (window.location.hostname !== APPLY_HOST) return;
    const html = document.documentElement;
    html.setAttribute("data-apply", "");
    return () => html.removeAttribute("data-apply");
  }, []);
  return null;
}
