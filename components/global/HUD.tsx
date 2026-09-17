"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scroll, store, useStore } from "@/lib/store";
import { sections, site, soundtrack } from "@/data/content";
import { useLocalTime } from "./LocalTime";
import { cn } from "@/lib/cn";

/** Compact F1-telemetry readout: chapter, mini-sectors, scroll %, velocity and local time. */
export default function HUD() {
  const loaded = useStore((s) => s.loaded);
  const active = useStore((s) => s.section);
  const sound = useStore((s) => s.sound);
  const time = useLocalTime(false);
  const pct = useRef<HTMLSpanElement>(null);
  const vel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!loaded) return;
    const triggers = sections.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        refreshPriority: -10,
        onToggle: (self) => self.isActive && store.set({ section: s.id }),
      });
    });
    ScrollTrigger.refresh();

    let smooth = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.round(((scroll.y || window.scrollY) / max) * 100) : 0;
      if (pct.current) pct.current.textContent = String(Math.min(100, Math.max(0, p))).padStart(3, "0");
      smooth += (scroll.velocity - smooth) * 0.15;
      const v = Math.min(999, Math.round(Math.abs(smooth) * 10));
      if (vel.current) vel.current.textContent = String(v).padStart(3, "0");
    };
    gsap.ticker.add(tick);
    return () => {
      triggers.forEach((t) => t?.kill());
      gsap.ticker.remove(tick);
    };
  }, [loaded]);

  const idx = Math.max(0, sections.findIndex((s) => s.id === active));
  const current = sections[idx];

  return (
    <aside
      aria-hidden
      className={cn(
        "pointer-events-none fixed bottom-4 left-[max(16px,4vw)] z-[110] hidden font-mono text-[10px] uppercase leading-none tracking-[0.08em] text-ink/70 transition-opacity duration-700 lg:block",
        loaded ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex items-center gap-3 rounded-full border border-ink/10 bg-canvas/70 py-2 pl-3 pr-4 backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        <span className="text-ink">
          <span className="font-semibold text-accent-ink">{current.n}</span> {current.hud}
        </span>
        <span className="flex w-[72px] gap-[2px]">
          {sections.map((s, i) => (
            <span key={s.id} className={cn("h-[3px] flex-1 transition-colors duration-500", i <= idx ? "bg-accent" : "bg-ink/15")} />
          ))}
        </span>
        <span>
          SCR <span ref={pct} className="text-ink">000</span>
        </span>
        <span>
          VEL <span ref={vel} className="text-ink">000</span>
        </span>
        <span className="text-ink" suppressHydrationWarning>
          {site.location.city.slice(0, 3)} {time}
        </span>
        {sound && <span className="max-w-[160px] truncate text-accent-ink">♪ {soundtrack.title}</span>}
      </div>
    </aside>
  );
}
