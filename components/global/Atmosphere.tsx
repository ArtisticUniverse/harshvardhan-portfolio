"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scroll } from "@/lib/store";

/** Film grain, thin column grid and the gold scroll-progress bar. */
export default function Atmosphere() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const set = gsap.quickSetter(el, "scaleX");
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      set(max > 0 ? Math.min(1, Math.max(0, (scroll.y || window.scrollY) / max)) : 0);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <>
      <div aria-hidden className="grid-lines">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
        <div className="grain" />
      </div>
      <div
        ref={bar}
        aria-hidden
        className="fixed left-0 top-0 z-[120] h-[2px] w-full origin-left scale-x-0 bg-accent"
      />
    </>
  );
}
