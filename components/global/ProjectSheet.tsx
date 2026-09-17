"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { projects } from "@/data/content";
import { store, useStore } from "@/lib/store";
import { playSound } from "@/lib/sound";
import ProjectArt from "@/components/ui/ProjectArt";
import Magnetic from "@/components/ui/Magnetic";

const EASE = [0.76, 0, 0.24, 1] as const;

export function openProject(id: string) {
  playSound("open");
  store.set({ project: id });
}

const reveal = {
  hidden: { y: 40, opacity: 0 },
  show: (i: number) => ({ y: 0, opacity: 1, transition: { duration: 0.8, ease: EASE, delay: 0.35 + i * 0.05 } }),
};

/** Full-screen case study: features, how it works, stack and skills. */
export default function ProjectSheet() {
  const id = useStore((s) => s.project);
  const scroller = useRef<HTMLDivElement>(null);
  const idx = projects.findIndex((p) => p.id === id);
  const p = idx >= 0 ? projects[idx] : null;

  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") store.set({ project: null });
    };
    window.addEventListener("keydown", onKey);
    scroller.current?.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", onKey);
  }, [id]);

  const close = () => {
    playSound("close");
    store.set({ project: null });
  };
  const next = projects[(idx + 1) % projects.length];

  return (
    <AnimatePresence>
      {p && (
        <m.div
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          className="fixed inset-0 z-[160]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <m.div
            aria-hidden
            className="absolute inset-0 origin-bottom bg-accent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transition: { duration: 0.6, ease: EASE, delay: 0.35 } }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <m.div
            ref={scroller}
            data-lenis-prevent
            className="absolute inset-0 overflow-y-auto overscroll-contain bg-canvas"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.2 }}
          >
            <div className="gutter sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/10 bg-canvas/85 py-4 backdrop-blur-md">
              <span className="mono-label text-muted">
                [ CASE STUDY · {p.index} ] <span className="hidden sm:inline">— {p.kind}</span>
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => store.set({ project: next.id })} className="mono-label hidden rounded-full border border-ink/15 px-4 py-2 hover:border-accent sm:block">
                  Next: {next.name} →
                </button>
                <Magnetic>
                  <button onClick={close} className="mono-label rounded-full bg-ink px-4 py-2 text-canvas" aria-label="Close case study">
                    Close ✕
                  </button>
                </Magnetic>
              </div>
            </div>

            <article key={p.id} className="gutter pb-24">
              <header className="grid gap-8 pt-10 md:grid-cols-12 md:pt-16">
                <div className="md:col-span-7">
                  <m.p variants={reveal} initial="hidden" animate="show" custom={0} className="mono-label text-accent-ink">
                    {p.year} · {p.role}
                  </m.p>
                  <div className="overflow-hidden">
                    <m.h2
                      id="project-title"
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1, ease: EASE, delay: 0.4 }}
                      className="mt-4 text-[clamp(3rem,8.5vw,9rem)] font-semibold leading-[0.84] tracking-[-0.05em]"
                    >
                      {p.name}
                    </m.h2>
                  </div>
                  <m.p variants={reveal} initial="hidden" animate="show" custom={2} className="mt-6 max-w-[52ch] text-lg leading-snug text-ink/80 md:text-xl">
                    {p.summary}
                  </m.p>
                  <m.div variants={reveal} initial="hidden" animate="show" custom={3} className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                    {p.metrics.map((mt) => (
                      <div key={mt.label}>
                        <div className="text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.05em] text-accent-ink">{mt.value}</div>
                        <div className="mono-label mt-1 text-muted">{mt.label}</div>
                      </div>
                    ))}
                  </m.div>
                </div>
                <m.div
                  className="relative aspect-[4/3] overflow-hidden rounded-sm border border-ink/10 md:col-span-5 md:aspect-auto md:min-h-[380px]"
                  initial={{ clipPath: "inset(0 0 100% 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)" }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
                >
                  {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : <ProjectArt kind={p.art ?? "data"} />}
                </m.div>
              </header>

              <section className="mt-24" aria-labelledby="features-title">
                <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-5">
                  <h3 id="features-title" className="text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.04em]">
                    Features
                  </h3>
                  <span className="mono-label text-muted">{String(p.features.length).padStart(2, "0")} capabilities</span>
                </div>
                <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
                  {p.features.map((f, i) => (
                    <m.div
                      key={f.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, root: scroller, margin: "0px 0px -10% 0px" }}
                      transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
                      className="group flex flex-col gap-3 bg-canvas p-6 transition-colors hover:bg-surface"
                    >
                      <span className="mono-label text-accent-ink">F/{String(i + 1).padStart(2, "0")}</span>
                      <h4 className="text-xl font-semibold leading-tight tracking-tight md:text-2xl">{f.title}</h4>
                      <p className="leading-snug text-ink/70">{f.desc}</p>
                    </m.div>
                  ))}
                </div>
              </section>

              <section className="mt-24" aria-labelledby="how-title">
                <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-5">
                  <h3 id="how-title" className="text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.04em]">
                    How it works
                  </h3>
                  <span className="mono-label text-muted">{p.howItWorks.length} steps</span>
                </div>
                <ol className="relative mt-8 grid gap-6 md:grid-cols-5 md:gap-4">
                  <span aria-hidden className="absolute left-[11px] top-3 h-[calc(100%-24px)] w-px bg-ink/15 md:left-0 md:top-[11px] md:h-px md:w-full" />
                  {p.howItWorks.map((s, i) => (
                    <m.li
                      key={s.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, root: scroller, margin: "0px 0px -10% 0px" }}
                      transition={{ duration: 0.7, ease: EASE, delay: i * 0.09 }}
                      className="relative pl-10 md:pl-0 md:pt-10"
                    >
                      <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold text-on-accent">
                        {i + 1}
                      </span>
                      <h4 className="text-xl font-semibold tracking-tight">{s.title}</h4>
                      <p className="mt-2 leading-snug text-ink/70">{s.desc}</p>
                    </m.li>
                  ))}
                </ol>
              </section>

              <section className="mt-24 grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="mono-label text-muted">Stack & tools</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-full border border-ink/20 px-4 py-2 text-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mono-label text-muted">Skills it proves</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.skills.map((s) => (
                      <li key={s} className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <footer className="mt-24 flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 pt-8">
                {p.href ? (
                  <Magnetic>
                    <a href={p.href} target="_blank" rel="noreferrer" className="mono-label inline-flex rounded-full bg-accent px-6 py-3 text-on-accent" data-cursor="OPEN">
                      Open project ↗
                    </a>
                  </Magnetic>
                ) : (
                  <span className="mono-label text-muted">Live demo on request</span>
                )}
                <button onClick={() => store.set({ project: next.id })} className="group text-left" data-cursor="NEXT">
                  <span className="mono-label text-muted">Next case study</span>
                  <span className="mt-1 block text-[clamp(2rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] transition-colors group-hover:text-accent-ink">
                    {next.name} →
                  </span>
                </button>
              </footer>
            </article>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
