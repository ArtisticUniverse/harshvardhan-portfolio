"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { playSound } from "@/lib/sound";
import { prefersReducedMotion } from "@/lib/hooks";

let runner: ((mid: () => void | Promise<void>) => Promise<void>) | null = null;

/** Gold curtain wipe: cover the screen, run `mid` while hidden, then uncover. */
export function curtain(mid: () => void | Promise<void>) {
  if (!runner) {
    void mid();
    return Promise.resolve();
  }
  return runner(mid);
}

export default function Curtain() {
  const wrap = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement[]>([]);
  const label = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    runner = async (mid) => {
      if (busy.current || !wrap.current) return;
      if (prefersReducedMotion()) {
        await mid();
        return;
      }
      busy.current = true;
      playSound("open");
      const p = panels.current;
      gsap.set(wrap.current, { visibility: "visible" });
      await gsap
        .timeline()
        .set(p, { scaleY: 0, transformOrigin: "50% 100%" })
        .to(p, { scaleY: 1, duration: 0.55, ease: "power4.inOut", stagger: 0.06 })
        .fromTo(label.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, "-=0.2")
        .then();
      await mid();
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await gsap
        .timeline()
        .to(label.current, { opacity: 0, duration: 0.15 })
        .set(p, { transformOrigin: "50% 0%" })
        .to(p, { scaleY: 0, duration: 0.6, ease: "power4.inOut", stagger: 0.06 })
        .then();
      gsap.set(wrap.current, { visibility: "hidden" });
      busy.current = false;
    };
    return () => {
      runner = null;
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed inset-0 z-[180] flex" style={{ visibility: "hidden" }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) panels.current[i] = el;
          }}
          className="h-full flex-1 bg-accent"
          style={{ transform: "scaleY(0)" }}
        />
      ))}
      <span ref={label} className="mono-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0A0A0A] opacity-0">
        [ RECOLLECTING… ]
      </span>
    </div>
  );
}
