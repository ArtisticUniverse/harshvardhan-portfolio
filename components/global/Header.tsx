"use client";

import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import Magnetic from "@/components/ui/Magnetic";
import { safeStorage, store, useStore, type Theme } from "@/lib/store";
import { playSound } from "@/lib/sound";
import { initMusic, musicLevels } from "@/lib/music";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { curtain } from "./Curtain";
import { site, soundtrack } from "@/data/content";
import { cn } from "@/lib/cn";

type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = store.get().theme === "dark" ? "light" : "dark";
  const apply = () => {
    document.documentElement.dataset.theme = next;
    flushSync(() => store.set({ theme: next }));
    safeStorage("local")?.setItem("hp-theme", next);
  };
  const doc = document as VTDocument;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduced) return apply();

  const x = origin?.x ?? window.innerWidth - 60;
  const y = origin?.y ?? 40;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const t = doc.startViewTransition(apply);
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

export function openRecruiter() {
  void curtain(() => {
    store.set({ recruiter: true, menuOpen: false });
  });
}

export default function Header() {
  const menuOpen = useStore((s) => s.menuOpen);
  const sound = useStore((s) => s.sound);
  const theme = useStore((s) => s.theme);
  const loaded = useStore((s) => s.loaded);
  const inHero = useStore((s) => s.section === "hero");

  const bars = useRef<HTMLSpanElement[]>([]);

  useEffect(() => initMusic(), []);

  // Equalizer bars follow the soundtrack's frequency bands.
  useEffect(() => {
    if (!sound) return;
    const tick = () => {
      const lv = musicLevels(4);
      bars.current.forEach((b, i) => {
        if (b) b.style.transform = `scaleY(${Math.max(0.2, Math.min(1, lv[i] * 1.4)).toFixed(3)})`;
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [sound]);

  useEffect(() => {
    const t = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const snd = safeStorage("local")?.getItem("hp-sound") === "on";
    store.set({ theme: t, sound: snd });
  }, []);

  const toggleSound = () => {
    const next = !store.get().sound;
    store.set({ sound: next });
    safeStorage("local")?.setItem("hp-sound", next ? "on" : "off");
    playSound("success");
  };

  const btn =
    "mono-label flex h-10 items-center gap-2 rounded-full border border-ink/15 bg-canvas/60 px-4 backdrop-blur-md transition-colors hover:border-accent hover:text-accent-ink";

  return (
    <header
      className={cn(
        "gutter fixed inset-x-0 top-0 z-[150] flex items-center justify-between py-4 transition-opacity duration-700 md:py-5",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-[160%] before:bg-gradient-to-b before:from-canvas before:via-canvas/75 before:to-transparent before:transition-opacity before:duration-500",
        inHero ? "before:opacity-0" : "before:opacity-100",
        loaded ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Magnetic strength={0.4}>
        <button
          onClick={() => scrollToTarget(0)}
          aria-label="Back to top"
          className="group flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[15px] font-semibold tracking-tight text-on-accent transition-transform duration-500 group-hover:rotate-[360deg]">
            {site.monogram}
          </span>
          <span className={cn("mono-label hidden text-left text-muted transition-opacity duration-500 xl:block", inHero ? "opacity-100" : "opacity-0")}>
            {site.tagline}
            <br />
            <span className="text-ink">{site.taglineSub}</span>
          </span>
        </button>
      </Magnetic>

      <nav aria-label="Site controls" className="flex items-center gap-2">
        <button onClick={openRecruiter} className={cn(btn, "hidden sm:flex")} data-cursor="CV">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Recruiter mode
        </button>
        <Magnetic strength={0.25}>
          <button
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? `Turn music off (${soundtrack.title})` : `Turn music on — plays ${soundtrack.title}`}
            title={sound ? `Now playing: ${soundtrack.title}` : `Play ${soundtrack.title}`}
            data-cursor={sound ? "MUTE" : "PLAY"}
            className={cn(
              "relative flex h-11 items-center gap-3 rounded-full pl-1.5 pr-4 text-[13px] font-semibold tracking-tight transition-colors duration-300 md:h-12 md:pr-5 md:text-[15px]",
              sound
                ? "border border-accent/60 bg-canvas/70 text-ink backdrop-blur-md hover:border-accent"
                : "bg-accent text-on-accent shadow-[0_10px_40px_-10px_rgb(var(--accent)/0.8)] hover:brightness-110",
            )}
          >
            {!sound && (
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent [animation:halo_2.2s_ease-out_infinite]" />
            )}
            <span
              aria-hidden
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full md:h-9 md:w-9",
                sound ? "bg-accent text-on-accent" : "bg-on-accent text-accent",
              )}
            >
              {sound ? (
                <span className="flex h-3.5 items-end gap-[2px]">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      ref={(el) => {
                        if (el) bars.current[i] = el;
                      }}
                      className="h-full w-[3px] origin-bottom rounded-full bg-current transition-transform duration-75"
                      style={{ transform: "scaleY(0.3)" }}
                    />
                  ))}
                </span>
              ) : (
                <svg viewBox="0 0 12 12" className="ml-0.5 h-3 w-3" fill="currentColor">
                  <path d="M2 1.2v9.6a.6.6 0 0 0 .9.52l8-4.8a.6.6 0 0 0 0-1.04l-8-4.8A.6.6 0 0 0 2 1.2Z" />
                </svg>
              )}
            </span>
            <span className="whitespace-nowrap">
              {sound ? (
                <>
                  Music on<span className="hidden text-muted md:inline"> · {soundtrack.title}</span>
                </>
              ) : (
                <>
                  Turn on music<span className={cn("hidden lg:inline", inHero ? "" : "lg:hidden")}> before you scroll</span>
                </>
              )}
            </span>
          </button>
        </Magnetic>
        <button
          onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
          className={cn(btn, "w-10 justify-center px-0")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <span
            aria-hidden
            className="block h-4 w-4 rounded-full border border-current transition-transform duration-500"
            style={{
              background: "linear-gradient(90deg, currentColor 50%, transparent 50%)",
              transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </button>
        <Magnetic strength={0.3}>
          <button
            onClick={() => {
              store.set({ menuOpen: !menuOpen });
              playSound(menuOpen ? "close" : "open");
            }}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="mono-label flex h-10 items-center gap-3 rounded-full bg-ink px-5 text-canvas"
          >
            {menuOpen ? "Close" : "Menu"}
            <span className="relative block h-2 w-4" aria-hidden>
              <span
                className="absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500"
                style={{ transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500"
                style={{ transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </Magnetic>
      </nav>
    </header>
  );
}
