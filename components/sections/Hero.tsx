"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { hero, photo, site, sectionLabel } from "@/data/content";
import { useStore } from "@/lib/store";
import { webglAvailable } from "@/lib/hooks";
import type { CharacterState } from "@/components/three/Character3D";

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), { ssr: false });
const Character3D = dynamic(() => import("@/components/three/Character3D"), { ssr: false });

/** Giant name whose letters thin out and stretch as the cursor passes over them. */
function KineticName({ play }: { play: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!play || !ref.current) return;
      const chars = ref.current.querySelectorAll("[data-char]");
      const lines = ref.current.querySelectorAll("[data-line]");
      gsap.set(ref.current, { autoAlpha: 1 });
      gsap.fromTo(
        chars,
        { yPercent: 115, rotate: 8 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.035,
          delay: 0.1,
          onComplete: () => gsap.set(lines, { overflow: "visible" }),
        },
      );
    },
    { dependencies: [play], scope: ref },
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-char]"));
    const cur = chars.map(() => ({ w: 600, s: 1 }));
    const setScale = chars.map((c) => gsap.quickSetter(c, "scaleY"));
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    let inside = false;

    const frame = () => {
      const rects = chars.map((c) => c.getBoundingClientRect());
      let moving = false;
      chars.forEach((c, i) => {
        const r = rects[i];
        const dist = Math.hypot(r.left + r.width / 2 - mx, (r.top + r.height / 2 - my) * 0.6);
        const t = inside ? Math.max(0, 1 - dist / 280) : 0;
        const e = t * t * (3 - 2 * t);
        const tw = 600 - 420 * e;
        const ts = 1 + 0.22 * e;
        cur[i].w += (tw - cur[i].w) * 0.16;
        cur[i].s += (ts - cur[i].s) * 0.16;
        if (Math.abs(tw - cur[i].w) > 0.5 || Math.abs(ts - cur[i].s) > 0.001) moving = true;
        c.style.fontWeight = cur[i].w.toFixed(0);
        setScale[i](cur[i].s);
      });
      raf = moving || inside ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      inside = true;
      kick();
    };
    const leave = () => {
      inside = false;
      kick();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const renderLine = (text: string, className: string) => (
    <span data-line className={`block overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-char
          className="inline-block origin-bottom will-change-transform"
          style={{ fontWeight: 600 }}
        >
          {ch}
        </span>
      ))}
    </span>
  );

  return (
    <h1 ref={ref} aria-label={site.name} className="invisible select-none uppercase leading-[0.8] tracking-[-0.05em]" data-cursor="">
      {renderLine(hero.lines[0], "text-[10.3vw] md:text-[10.45vw]")}
    </h1>
  );
}

function SecondLine({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!play || !ref.current) return;
      gsap.set(ref.current, { autoAlpha: 1 });
      gsap.fromTo(
        ref.current.querySelectorAll("[data-char]"),
        { yPercent: 115 },
        { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.045, delay: 0.45 },
      );
    },
    { dependencies: [play], scope: ref },
  );
  return (
    <div ref={ref} aria-hidden className="invisible overflow-hidden whitespace-nowrap uppercase leading-[0.8] tracking-[-0.05em]">
      {hero.lines[1].split("").map((ch, i) => (
        <span key={i} data-char className="inline-block font-semibold">
          {ch}
        </span>
      ))}
    </div>
  );
}

function RoleTicker({ play }: { play: boolean }) {
  const list = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!play || !list.current) return;
      const n = hero.roles.length;
      const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
      for (let i = 1; i <= n; i++) {
        tl.to(list.current, { yPercent: (-100 / (n + 1)) * i, duration: 0.9, ease: "expo.inOut" }, "+=1.5");
      }
      tl.set(list.current, { yPercent: 0 });
    },
    { dependencies: [play] },
  );
  return (
    <div className="flex items-center gap-3">
      <span className="mono-label text-muted">Currently →</span>
      <div className="h-[1.15em] overflow-hidden text-[clamp(1.25rem,2.2vw,2rem)] font-medium leading-[1.15] tracking-tight text-accent-ink">
        <div ref={list} aria-live="off">
          {[...hero.roles, hero.roles[0]].map((r, i) => (
            <div key={i} className="h-[1.15em] whitespace-nowrap">
              {r}
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">{hero.roles.join(", ")}</span>
    </div>
  );
}

function CharacterStage({ play, active, heroRef }: { play: boolean; active: boolean; heroRef: React.RefObject<HTMLElement> }) {
  const stage = useRef<HTMLDivElement>(null);
  const state = useRef<CharacterState>({ x: 0, y: 0, hover: 0, px: 0.5, py: 0.5 });
  const [gl, setGl] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => setGl(webglAvailable() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  useGSAP(
    () => {
      if (!play || !stage.current) return;
      gsap.fromTo(stage.current.querySelector("[data-halo]"), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.8, ease: "expo.out", delay: 0.3 });
    },
    { dependencies: [play], scope: stage },
  );

  useEffect(() => {
    const hero = heroRef.current;
    const el = stage.current;
    if (!hero || !el) return;
    const move = (e: PointerEvent) => {
      const h = hero.getBoundingClientRect();
      state.current.x = ((e.clientX - h.left) / h.width) * 2 - 1;
      state.current.y = ((e.clientY - h.top) / h.height) * 2 - 1;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = 1 - (e.clientY - r.top) / r.height;
      state.current.px = px;
      state.current.py = py;
      state.current.hover = px > 0.25 && px < 0.75 && py > 0.05 && py < 0.95 ? 1 : 0;
    };
    const leave = () => {
      state.current.x = 0;
      state.current.y = 0;
      state.current.hover = 0;
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, [heroRef]);

  return (
    <div ref={stage} className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[64svh] md:left-auto md:right-[2vw] md:h-[92svh] md:w-[min(62vw,980px)]">
      <div
        data-halo
        aria-hidden
        className="invisible absolute bottom-[8%] left-1/2 aspect-square w-[78%] max-w-[640px] -translate-x-1/2 rounded-full md:w-[62%]"
        style={{
          background: "radial-gradient(circle at 50% 45%, rgb(var(--accent) / 0.22), transparent 62%)",
          boxShadow: "inset 0 0 0 1px rgb(var(--accent) / 0.25)",
        }}
      />
      <img
        src={photo.cutout}
        alt={photo.alt}
        width={724}
        height={780}
        fetchPriority="high"
        className="absolute bottom-0 left-1/2 h-[90%] w-auto max-w-none -translate-x-1/2 object-contain transition-opacity duration-700 md:h-[98%]"
        style={{ opacity: gl ? (ready && play ? 0 : play ? 1 : 0) : play ? 1 : 0, transitionDelay: ready ? "400ms" : "0ms" }}
      />
      {gl && <Character3D src={photo.cutout} depth={photo.depth} state={state} active={active && play} onReady={onReady} />}
    </div>
  );
}

export default function Hero() {
  const loaded = useStore((s) => s.loaded);
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [gl, setGl] = useState(false);

  useEffect(() => {
    setGl(webglAvailable() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!loaded) return;
      gsap.fromTo("[data-hero-fade]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.9 });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-hero-parallax]", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-photo]", {
          yPercent: 10,
          scale: 0.96,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      ScrollTrigger.refresh();
    },
    { dependencies: [loaded], scope: section },
  );

  return (
    <section ref={section} id="hero" className="relative h-[100svh] min-h-[620px] overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        {gl && <ParticleField active={inView && loaded} heroRef={section} />}
      </div>

      <div className="gutter relative z-[3] pt-24 md:pt-28">
        <div data-hero-fade className="mono-label invisible flex justify-between text-muted">
          <span>{sectionLabel("hero")}</span>
          <span className="hidden sm:inline">
            FROM {site.hometown.toUpperCase()} · NOW LAT {site.location.lat} {site.location.city.toUpperCase()}
          </span>
          <span>{site.monogram} ©2026</span>
        </div>
      </div>

      <div data-hero-parallax className="gutter relative z-[1] mt-6 md:mt-5">
        <KineticName play={loaded} />
        <div className="text-[17vw] sm:text-[15vw] md:text-[10.45vw]">
          <SecondLine play={loaded} />
        </div>
      </div>

      <div data-hero-photo className="absolute inset-0">
        <CharacterStage play={loaded} active={inView} heroRef={section} />
      </div>

      <div className="gutter absolute inset-x-0 bottom-0 z-[3] pb-6 pt-24 md:pb-8 lg:pb-16">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-canvas via-canvas/70 to-transparent md:hidden" />
        <div className="flex flex-col gap-5 md:max-w-[44vw]">
          <div data-hero-fade className="invisible">
            <RoleTicker play={loaded} />
          </div>
          <p data-hero-fade className="invisible max-w-[40ch] text-base leading-snug text-ink/80 md:text-xl">
            {hero.intro}
          </p>
          <div data-hero-fade className="mono-label invisible flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-3">
              <span className="inline-block h-6 w-px animate-pulse bg-accent" />
              {hero.scrollHint}
            </span>
            <span className="text-muted xl:hidden">
              {site.tagline} <span className="text-ink">{site.taglineSub}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
