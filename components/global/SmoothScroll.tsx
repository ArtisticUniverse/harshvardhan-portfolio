"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";
import { scroll, store } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/hooks";

/** Lenis inertia scroll, driven by GSAP's ticker so ScrollTrigger stays in lockstep. */
export default function SmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const reduced = prefersReducedMotion();
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      autoRaf: false,
    });
    lenisRef.set(lenis);

    lenis.on("scroll", (l: Lenis) => {
      scroll.y = l.animatedScroll;
      scroll.limit = l.limit || 1;
      scroll.progress = l.progress || 0;
      scroll.velocity = l.velocity;
      scroll.direction = l.direction === -1 ? -1 : 1;
      ScrollTrigger.update();
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
      // Decay velocity when idle so velocity-driven effects settle.
      scroll.velocity *= 0.92;
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Keep the page locked until the preloader hands over.
    if (!store.get().loaded) lenis.stop();
    const unsub = store.subscribe(() => {
      const s = store.get();
      if (!s.loaded || s.menuOpen || s.recruiter || s.project) lenis.stop();
      else lenis.start();
    });

    const onResize = () => ScrollTrigger.refresh();
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);
    window.addEventListener("orientationchange", onResize);

    return () => {
      unsub();
      ro.disconnect();
      window.removeEventListener("orientationchange", onResize);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.set(null);
    };
  }, []);

  return null;
}
