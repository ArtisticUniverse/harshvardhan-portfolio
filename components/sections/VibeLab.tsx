"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { claudeBuilds, ogBuilds, type ClaudeBuild, sectionLabel } from "@/data/content";
import SplitReveal from "@/components/ui/SplitReveal";
import ProjectArt from "@/components/ui/ProjectArt";
import LazyVisual from "@/components/ui/LazyVisual";
import { openProject } from "@/components/global/ProjectSheet";
import Terminal from "./Terminal";

function BuildCard({ b, i }: { b: ClaudeBuild; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(b.prompt.length);
      setDone(true);
      return;
    }
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let n = 0;
        const step = () => {
          n += 1 + Math.round(Math.random() * 1.5);
          setTyped(Math.min(n, b.prompt.length));
          if (n < b.prompt.length) timer = window.setTimeout(step, 14 + Math.random() * 30);
          else timer = window.setTimeout(() => setDone(true), 200);
        };
        timer = window.setTimeout(step, 150 + (i % 3) * 180);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [b.prompt, i]);

  const Wrapper = b.href ? "a" : "div";

  return (
    <article ref={ref} data-build className="group relative">
      <Wrapper
        {...(b.href ? { href: b.href, target: "_blank", rel: "noreferrer", "data-cursor": "OPEN" } : {})}
        className="flex h-full flex-col rounded-sm border border-ink/12 bg-surface/60 p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-accent md:p-6"
      >
        <header className="flex items-start justify-between gap-3">
          <div>
            <span className="mono-label text-muted">{String(i + 1).padStart(2, "0")} · {b.stack}</span>
            <h3 className="mt-2 text-2xl font-semibold leading-none tracking-tight md:text-[1.75rem]">{b.title}</h3>
          </div>
          {b.href && <span className="mono-label text-accent-ink transition-transform group-hover:translate-x-1">↗</span>}
        </header>

        <div className="mt-5 rounded-sm bg-[#070707] p-4 font-mono text-[12.5px] leading-relaxed text-[#F2F0EA]/85">
          <span className="text-[#EBB94A]">prompt ›</span> <span className="sr-only">{b.prompt}</span>
          <span aria-hidden>
            {b.prompt.slice(0, typed)}
            {!done && <span className="caret" />}
          </span>
        </div>

        <dl className="mt-4 flex flex-1 flex-col gap-3 transition-opacity duration-700" style={{ opacity: done ? 1 : 0.08 }}>
          <div>
            <dt className="mono-label text-muted">→ Output</dt>
            <dd className="mt-1 leading-snug">{b.output}</dd>
          </div>
          <div className="mt-auto border-t border-ink/10 pt-3">
            <dt className="mono-label text-accent-ink">→ Impact</dt>
            <dd className="mt-1 font-medium leading-snug">{b.impact}</dd>
          </div>
        </dl>
        {b.projectId && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openProject(b.projectId!);
            }}
            className="mono-label mt-4 self-start rounded-full border border-ink/20 px-3 py-1.5 transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
          >
            Features & how it works →
          </button>
        )}
      </Wrapper>
    </article>
  );
}

function ShipCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const stacks = new Set(claudeBuilds.map((b) => b.stack.split(" · ")[0])).size;

  useGSAP(
    () => {
      const o = { v: 0 };
      gsap.to(o, {
        v: claudeBuilds.length,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(2, "0");
        },
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex flex-wrap items-end gap-x-10 gap-y-4">
      <div>
        <span ref={num} className="block text-[clamp(4.5rem,11vw,10rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-accent-ink tabular-nums">
          {String(claudeBuilds.length).padStart(2, "0")}
        </span>
        <span className="mono-label text-muted">builds shipped with Claude · {stacks} stacks</span>
      </div>
      <p className="max-w-[16ch] pb-2 text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[0.95] tracking-[-0.03em]">
        Ideas → shipped in <span className="text-accent-ink">hours</span>, not months.
      </p>
    </div>
  );
}

export default function VibeLab() {
  return (
    <section id="lab" className="relative py-32 md:py-44">
      <div className="gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono-label text-muted">{sectionLabel("lab")}</p>
            <SplitReveal as="h2" className="mt-6 text-[clamp(3.2rem,10.5vw,11.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]">
              Vibe coder lab
            </SplitReveal>
          </div>
          <p className="max-w-[36ch] text-lg leading-snug text-ink/75">
            An engineer who learned to talk to machines in plain English. Poke the terminal, then scroll the things it built.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Terminal />
          </div>
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <ShipCounter />
            <div className="mono-label grid grid-cols-2 gap-3 text-muted">
              <span className="rounded-sm border border-ink/10 p-3">↑↓ history</span>
              <span className="rounded-sm border border-ink/10 p-3">⇥ autocomplete</span>
              <span className="rounded-sm border border-ink/10 p-3">try: goto contact</span>
              <span className="rounded-sm border border-ink/10 p-3">psst: type H-I-R-E</span>
            </div>
          </div>
        </div>

        <div className="mt-28 flex items-end justify-between gap-6 border-b border-ink/10 pb-6">
          <h3 className="text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">
            Built with <span className="text-accent-ink">Claude</span>
          </h3>
          <span className="mono-label text-muted">prompt → output → impact</span>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {claudeBuilds.map((b, i) => (
            <BuildCard key={b.id} b={b} i={i} />
          ))}
          <div className="flex min-h-[260px] flex-col items-start justify-between rounded-sm border border-dashed border-ink/25 p-6">
            <span className="mono-label text-muted">{String(claudeBuilds.length + 1).padStart(2, "0")} · next build</span>
            <p className="text-2xl font-semibold leading-tight tracking-tight">
              Currently prompting<span className="caret" />
            </p>
            <span className="mono-label text-muted">slot reserved — add yours in data/content.ts</span>
          </div>
        </div>

        <div className="mt-28 flex items-end justify-between gap-6 border-b border-ink/10 pb-6">
          <h3 className="text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">OG builds</h3>
          <span className="mono-label text-muted">pre-LLM era · hand-written</span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ogBuilds.map((b) => (
            <article key={b.id} className="group relative flex flex-col overflow-hidden rounded-sm border border-ink/12">
              <button type="button" onClick={() => openProject(b.id)} data-cursor="VIEW" className="relative aspect-[16/8] overflow-hidden text-left">
                <span className="sr-only">Open the {b.name} case study</span>
                <LazyVisual className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
                  <ProjectArt kind={b.art ?? "data"} />
                </LazyVisual>
                <span className="mono-label absolute left-4 top-4 rounded-full bg-[#0A0A0A]/70 px-2.5 py-1 text-[#F2F0EA]">
                  {b.index} · {b.year}
                </span>
              </button>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="mono-label text-muted">{b.kind}</span>
                    <h4 className="mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">{b.name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.05em] text-accent-ink">{b.metrics[0].value}</div>
                    <div className="mono-label text-muted">{b.metrics[0].label}</div>
                  </div>
                </div>
                <p className="mt-4 leading-snug text-ink/75">{b.summary}</p>
                <ul className="mt-5 flex flex-col">
                  {b.features.map((f) => (
                    <li key={f.title} className="border-t border-ink/10 py-2.5">
                      <span className="font-medium">{f.title}</span>
                      <span className="text-ink/60"> — {f.desc}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openProject(b.id)}
                  className="mono-label mt-6 self-start rounded-full bg-accent px-5 py-3 font-bold text-on-accent"
                >
                  How it works →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
