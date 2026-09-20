"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { links, photo, sections, site } from "@/data/content";
import { store, useStore } from "@/lib/store";
import { scrollToTarget } from "@/lib/lenis";
import { playSound } from "@/lib/sound";
import { curtain } from "./Curtain";
import { openRecruiter } from "./Header";
import LocalTime from "./LocalTime";

const EASE = [0.76, 0, 0.24, 1] as const;

function Preview({ id }: { id: string }) {
  switch (id) {
    case "hero":
      return <img src={photo.src} alt="" className="h-full w-full object-cover grayscale" />;
    case "number":
      return <div className="flex h-full items-center justify-center text-[5.5rem] font-semibold tracking-tighter text-accent">99.92</div>;
    case "recollections":
      return (
        <div className="relative h-full">
          {[-10, 4, -2].map((r, i) => (
            <div key={i} className="absolute left-1/2 top-1/2 h-40 w-32 -translate-x-1/2 -translate-y-1/2 bg-[#F2F0EA] p-2 pb-8 shadow-xl" style={{ transform: `translate(-50%,-50%) rotate(${r}deg) translateX(${(i - 1) * 30}px)` }}>
              <div className="h-full bg-[#141414]" />
            </div>
          ))}
        </div>
      );
    case "ventures":
      return (
        <div className="flex h-full items-center justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="absolute rounded-full border border-accent/60" style={{ width: i * 44, height: i * 44 }} />
          ))}
        </div>
      );
    case "lab":
      return (
        <div className="h-full bg-[#050505] p-5 font-mono text-xs leading-6 text-[#F2F0EA]">
          <span className="text-accent">guest@harsh:~$</span> whoami
          <br />
          Harshvardhan Pandey
          <br />
          <span className="text-accent">guest@harsh:~$</span> <span className="caret" />
        </div>
      );
    case "mindset":
      return (
        <div className="flex h-full flex-col justify-center gap-1 p-6 text-3xl font-semibold uppercase leading-none">
          <span>Think</span>
          <span className="text-muted">Build</span>
          <span className="text-muted">Execute</span>
          <span className="text-accent">Ship</span>
        </div>
      );
    case "skills":
      return (
        <div className="flex h-full flex-wrap content-end gap-2 p-5">
          {["Valuation", "Python", "GenAI", "Six Sigma", "ML", "Strategy"].map((s, i) => (
            <span key={s} className={`rounded-full border px-3 py-1 text-sm ${i % 2 ? "border-ink/30" : "border-accent bg-accent text-on-accent"}`}>
              {s}
            </span>
          ))}
        </div>
      );
    case "certs":
      return (
        <div className="relative h-full">
          {[-14, -5, 5, 14].map((r, i) => (
            <div key={i} className="absolute bottom-6 left-1/2 h-36 w-28 origin-bottom rounded-lg border border-ink/20 bg-surface" style={{ transform: `translateX(-50%) rotate(${r}deg)` }} />
          ))}
        </div>
      );
    case "beyond":
      return (
        <div className="grid h-full grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }, (_, i) => (
            <div key={i} className={(Math.floor(i / 8) + i) % 2 ? "bg-ink/80" : "bg-canvas"} />
          ))}
        </div>
      );
    default:
      return <div className="flex h-full items-center justify-center p-6 text-center text-4xl font-semibold uppercase leading-none text-accent">Let&apos;s build</div>;
  }
}

export default function Menu() {
  const open = useStore((s) => s.menuOpen);
  const [hovered, setHovered] = useState<string>(sections[0].id);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && store.set({ menuOpen: false });
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    playSound("click");
    void curtain(() => {
      store.set({ menuOpen: false });
      scrollToTarget(id, true);
    });
  };

  const onMove = (e: React.PointerEvent) => {
    const el = previewRef.current;
    if (!el) return;
    const y = (e.clientY / window.innerHeight - 0.5) * 60;
    el.style.transform = `translateY(${y}px) rotate(${y * 0.05}deg)`;
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[140] overflow-hidden bg-canvas"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 0.8, ease: EASE }}
          onPointerMove={onMove}
          data-lenis-prevent
        >
          <m.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            aria-hidden
          />
          <div className="gutter relative flex h-full flex-col pb-5 pt-20 md:pt-28">
            <div className="grid min-h-0 flex-1 grid-cols-12 gap-4 overflow-y-auto overscroll-contain">
              <ul className="col-span-12 flex flex-col justify-center md:col-span-8">
                {sections.map((s, i) => (
                  <li key={s.id} className="overflow-hidden border-b border-ink/10">
                    <m.button
                      onClick={() => go(s.id)}
                      onPointerEnter={() => {
                        setHovered(s.id);
                        playSound("tick");
                      }}
                      onFocus={() => setHovered(s.id)}
                      className="group flex w-full items-baseline gap-4 py-0.5 text-left md:py-1.5"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-110%" }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.04 }}
                      data-cursor="GO"
                    >
                      <span className="mono-label w-8 text-muted group-hover:text-accent-ink">{s.n}</span>
                      <span className="text-[clamp(1.5rem,4.8vh,4.2rem)] font-semibold uppercase leading-[1.05] tracking-[-0.03em] transition-[transform,color] duration-500 group-hover:translate-x-4 group-hover:text-accent-ink">
                        {s.label}
                      </span>
                    </m.button>
                  </li>
                ))}
              </ul>
              <div className="col-span-4 hidden items-center justify-center md:flex">
                <m.div
                  ref={previewRef}
                  className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-sm border border-ink/15 bg-surface transition-transform duration-700 ease-out"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <AnimatePresence mode="popLayout">
                    <m.div
                      key={hovered}
                      className="absolute inset-0"
                      initial={{ clipPath: "inset(100% 0 0 0)" }}
                      animate={{ clipPath: "inset(0% 0 0 0)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                    >
                      <Preview id={hovered} />
                    </m.div>
                  </AnimatePresence>
                  <span className="mono-label absolute bottom-3 left-3 rounded-full bg-canvas/80 px-2 py-0.5">
                    [ {sections.find((s) => s.id === hovered)?.n} — {sections.find((s) => s.id === hovered)?.hud} ]
                  </span>
                </m.div>
              </div>
            </div>
            <m.div
              className="mono-label mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-4 text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex flex-wrap gap-x-5">
                <a href={`mailto:${links.email}`} className="inline-flex items-center py-2 hover:text-accent-ink">Email</a>
                <a href={links.tel} className="inline-flex items-center py-2 hover:text-accent-ink">{links.phone}</a>
                <a href={links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center py-2 hover:text-accent-ink">LinkedIn</a>
                <a href={links.github} target="_blank" rel="noreferrer" className="inline-flex items-center py-2 hover:text-accent-ink">GitHub</a>
                <a href={links.cv} download className="inline-flex items-center py-2 hover:text-accent-ink">CV (PDF)</a>
                <button onClick={openRecruiter} className="inline-flex items-center py-2 hover:text-accent-ink">Recruiter mode</button>
              </div>
              <div className="flex gap-5">
                <span>{site.location.lat} {site.location.city.toUpperCase()}</span>
                <LocalTime />
              </div>
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
