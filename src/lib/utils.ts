import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * "smooth", unless the visitor has asked for reduced motion. A scripted
 * scrollIntoView({ behavior: "smooth" }) ignores the stylesheet's
 * reduced-motion rule (which only resets scroll-behavior), so scripts ask
 * here instead of hardcoding it.
 */
export function scrollBehavior(): ScrollBehavior {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}
