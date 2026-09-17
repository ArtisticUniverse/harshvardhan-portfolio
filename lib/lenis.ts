"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export const lenisRef = {
  get: () => instance,
  set: (l: Lenis | null) => {
    instance = l;
  },
};

/** Scroll to a section id (or 0) through Lenis, falling back to native scroll. */
export function scrollToTarget(target: string | number, immediate = false) {
  const el = typeof target === "string" ? document.getElementById(target) : null;
  if (instance) {
    instance.scrollTo(el ?? (typeof target === "number" ? target : 0), {
      immediate,
      force: true,
      lock: !immediate,
      duration: immediate ? 0 : 1.4,
    });
    return;
  }
  if (el) el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  else window.scrollTo({ top: typeof target === "number" ? target : 0, behavior: immediate ? "auto" : "smooth" });
}
