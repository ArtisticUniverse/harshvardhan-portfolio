"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/data/content";
import { scroll } from "@/lib/store";

function Row({ items, reverse, outline }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  return (
    <div data-row={reverse ? "rev" : "fwd"} className="flex w-max whitespace-nowrap will-change-transform">
      {[0, 1].map((copy) => (
        <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
          {items.map((s) => (
            <span key={s} className="flex items-center">
              <span
                className={
                  outline
                    ? "px-6 text-[clamp(2.6rem,7vw,6.5rem)] font-semibold uppercase leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgb(var(--ink)/0.55)]"
                    : "px-6 text-[clamp(2.6rem,7vw,6.5rem)] font-semibold uppercase leading-none tracking-[-0.04em]"
                }
              >
                {s}
              </span>
              <span className="text-[clamp(1.6rem,3.5vw,3rem)] text-accent-ink" aria-hidden>
                ✳
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Two infinite rows whose speed and direction follow scroll velocity. */
export default function StatsMarquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
        const tweens = rows.map((row) => {
          const rev = row.dataset.row === "rev";
          return gsap.fromTo(
            row,
            { xPercent: rev ? -50 : 0 },
            { xPercent: rev ? 0 : -50, duration: 38, ease: "none", repeat: -1 },
          );
        });
        const skew = gsap.quickTo(rows, "skewX", { duration: 0.4, ease: "power3" });
        let dir = 1;
        let boost = 0;
        const tick = () => {
          const v = scroll.velocity;
          if (Math.abs(v) > 0.3) dir = v > 0 ? 1 : -1;
          boost += (Math.min(Math.abs(v), 60) * 0.18 - boost) * 0.1;
          const ts = dir * (1 + boost);
          tweens.forEach((t) => t.timeScale(ts));
          skew(gsap.utils.clamp(-8, 8, -v * 0.25));
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Key numbers" className="relative overflow-hidden border-y border-ink/10 py-10 md:py-14">
      <ul className="sr-only">
        {stats.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div aria-hidden className="flex flex-col gap-4 md:gap-6">
        <Row items={stats} />
        <Row items={[...stats].reverse()} reverse outline />
      </div>
    </section>
  );
}
