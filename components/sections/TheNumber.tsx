"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { theNumber } from "@/data/content";
import { useStore } from "@/lib/store";
import { webglAvailable } from "@/lib/hooks";
import { curveLayout, curveToCss, pdf, Z_9992 } from "@/components/three/curve";

const NumberParticles = dynamic(() => import("@/components/three/NumberParticles"), { ssr: false });

const TICKS = [
  { z: -3, p: "0.13" },
  { z: -2, p: "2.3" },
  { z: -1, p: "15.9" },
  { z: 0, p: "50" },
  { z: 1, p: "84.1" },
  { z: 2, p: "97.7" },
  { z: 3, p: "99.87" },
];

function curvePath(w: number, h: number) {
  const L = curveLayout(w, h);
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const z = -4 + (i / 160) * 8;
    const x = w / 2 + (z / 4) * L.halfWidth;
    const y = h / 2 - (L.baseline + (pdf(z) / pdf(0)) * L.peak);
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function TheNumber() {
  const loaded = useStore((s) => s.loaded);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const [dims, setDims] = useState<{ w: number; h: number; font: string; fontPx: number } | null>(null);
  const [mode, setMode] = useState<"gl" | "static" | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduced && webglAvailable() ? "gl" : "static");
    const measure = () => {
      const el = stage.current;
      if (!el || !num.current) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const fontPx = Math.round(Math.min(w * 0.3, h * 0.58));
      setDims({ w, h, fontPx, font: getComputedStyle(num.current).fontFamily });
    };
    measure();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(measure, 200);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!loaded || !dims || mode !== "gl") return;
      const counter = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=300%",
          pin: stage.current,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        },
      });
      tl.to(counter, {
        v: theNumber.value,
        duration: 0.28,
        ease: "power2.out",
        onUpdate: () => {
          if (num.current) num.current.textContent = counter.v.toFixed(2).padStart(5, "0");
        },
      })
        .fromTo("[data-num-intro]", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06 }, 0.24)
        .to(num.current, { autoAlpha: 0, scale: 1.04, filter: "blur(6px)", duration: 0.06 }, 0.29)
        .fromTo("[data-num-axis]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.74)
        .fromTo("[data-num-curve]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.12 }, 0.76)
        .fromTo("[data-num-dot]", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.06, ease: "back.out(3)" }, 0.84)
        .fromTo("[data-num-caption]", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.88)
        .to({}, { duration: 0.06 });
    },
    { dependencies: [loaded, dims, mode], scope: section, revertOnUpdate: true },
  );

  const isStatic = mode === "static";
  const dot = dims ? curveToCss(Z_9992, dims.w, dims.h) : null;
  const numberFont = dims ? `${dims.fontPx}px` : "min(30vw, 58svh)";

  return (
    <section ref={section} id="number" className="relative">
      <div ref={stage} className="relative h-[100svh] overflow-hidden">
        <div className="gutter mono-label absolute inset-x-0 top-24 z-10 flex justify-between text-muted md:top-28">
          <span>{theNumber.label}</span>
          <span data-num-intro>SCROLL TO RECOUNT ↓</span>
        </div>

        {mode === "gl" && dims && active !== undefined && (
          <NumberParticles progress={progress} active={active} font={dims.font} fontPx={dims.fontPx} />
        )}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            ref={num}
            className="font-semibold leading-none tracking-[-0.05em] tabular-nums"
            style={{ fontSize: numberFont, opacity: isStatic ? 0.12 : 1 }}
          >
            {isStatic ? theNumber.value.toFixed(2) : "00.00"}
          </span>
        </div>

        {dims && dot && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            aria-hidden
          >
            <g data-num-axis style={{ opacity: isStatic ? 1 : 0 }}>
              <line x1={dims.w * 0.05} x2={dims.w * 0.95} y1={dot.baselineTop} y2={dot.baselineTop} stroke="rgb(var(--ink) / 0.35)" strokeWidth={1} />
              {TICKS.map((t) => {
                const c = curveToCss(t.z, dims.w, dims.h);
                return (
                  <g key={t.z}>
                    <line x1={c.left} x2={c.left} y1={c.baselineTop} y2={c.baselineTop + 8} stroke="rgb(var(--ink) / 0.5)" />
                    <text x={c.left} y={c.baselineTop + 26} textAnchor="middle" className="fill-muted font-mono text-[10px] md:text-[11px]">
                      {t.p}
                    </text>
                  </g>
                );
              })}
              <line x1={dot.left} x2={dot.left} y1={dot.top} y2={dot.baselineTop} stroke="rgb(var(--accent-ink))" strokeDasharray="4 4" />
            </g>
            <path
              data-num-curve
              d={curvePath(dims.w, dims.h)}
              fill="none"
              stroke="rgb(var(--ink) / 0.55)"
              strokeWidth={1}
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: isStatic ? 0 : 1 }}
            />
          </svg>
        )}

        {dims && dot && (
          <div
            data-num-dot
            className="pointer-events-none absolute z-10"
            style={{ left: dot.left, top: dot.top, opacity: isStatic ? 1 : 0 }}
          >
            <span className="absolute -left-2 -top-2 block h-4 w-4 rounded-full bg-accent" style={{ animation: "pulse-glow 2.2s ease-in-out infinite" }} />
            <span className="mono-label absolute bottom-5 right-0 whitespace-nowrap rounded-full bg-accent px-2.5 py-1 font-bold text-on-accent md:left-4 md:right-auto">
              {theNumber.tailLabel}
            </span>
          </div>
        )}

        <div
          data-num-caption
          className="gutter absolute inset-x-0 bottom-8 z-10 md:bottom-12"
          style={{ opacity: isStatic ? 1 : 0 }}
        >
          <p className="max-w-[26ch] text-[clamp(1.4rem,3.2vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            {theNumber.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
