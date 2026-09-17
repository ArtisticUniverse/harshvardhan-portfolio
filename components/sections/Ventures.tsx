"use client";

import { useEffect, useId, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { entrepreneurLine, ventures, type Project, sectionLabel } from "@/data/content";
import ProjectArt from "@/components/ui/ProjectArt";
import { openProject } from "@/components/global/ProjectSheet";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";

function VentureCard({ v, i }: { v: Project; i: number }) {
  const card = useRef<HTMLDivElement>(null);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const filterId = `distort-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const el = card.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const media = el.querySelector<HTMLElement>("[data-media]");
    const state = { scale: 0, freq: 0.012 };
    let raf = 0;
    const apply = () => {
      disp.current?.setAttribute("scale", state.scale.toFixed(2));
      turb.current?.setAttribute("baseFrequency", `${state.freq.toFixed(4)} ${(state.freq * 1.6).toFixed(4)}`);
    };
    const enter = () => {
      gsap.to(state, { scale: 70, freq: 0.02, duration: 0.5, ease: "power3.out", onUpdate: apply });
      gsap.to(state, { scale: 0, freq: 0.012, duration: 1.4, delay: 0.5, ease: "expo.out", onUpdate: apply });
      gsap.to(media, { scale: 1.06, duration: 1.2, ease: "expo.out" });
    };
    const leave = () => {
      gsap.to(state, { scale: 0, duration: 0.6, onUpdate: apply });
      gsap.to(media, { scale: 1, duration: 1.2, ease: "expo.out" });
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const view = () => openProject(v.id);

  return (
    <div data-venture className="sticky top-0 flex min-h-[100svh] items-center py-20 md:py-24">
      <div ref={card} className="gutter w-full">
        <svg className="absolute h-0 w-0" aria-hidden>
          <filter id={filterId}>
            <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012 0.019" numOctaves={2} seed={i + 3} />
            <feDisplacementMap ref={disp} in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <div data-venture-inner className="relative grid min-h-[78svh] grid-cols-12 overflow-hidden rounded-sm border border-ink/10 bg-surface">
          <button
            type="button"
            onClick={view}
            data-cursor="VIEW"
            className="relative col-span-12 min-h-[42svh] overflow-hidden text-left md:col-span-7 md:min-h-0"
          >
            <span className="sr-only">Open the {v.name} case study</span>
            <div data-media className="absolute inset-0" style={{ filter: `url(#${filterId})` }}>
              {v.image ? <img src={v.image} alt="" className="h-full w-full object-cover" loading="lazy" /> : <ProjectArt kind={v.art ?? "data"} />}
            </div>
            <span className="mono-label absolute left-4 top-4 rounded-full bg-[#0A0A0A]/70 px-2.5 py-1 text-[#F2F0EA] backdrop-blur">
              {v.index} · {v.year} · {v.role}
            </span>
          </button>

          <div className="col-span-12 flex flex-col justify-between gap-8 p-6 md:col-span-5 md:p-10">
            <div>
              <p className="mono-label text-muted">{v.kind}</p>
              <h3 className="mt-4 text-[clamp(2.6rem,5.4vw,5.6rem)] font-semibold leading-[0.86] tracking-[-0.045em]">{v.name}</h3>
              <p className="mt-5 max-w-[42ch] text-base leading-snug text-ink/75 md:text-lg">{v.summary}</p>
            </div>

            <ul className="flex flex-col">
              {v.features.slice(0, 4).map((f, k) => (
                <li key={f.title} className="flex items-baseline gap-3 border-t border-ink/10 py-2.5">
                  <span className="mono-label w-10 shrink-0 text-accent-ink">F/{String(k + 1).padStart(2, "0")}</span>
                  <span className="leading-snug">{f.title}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex gap-8">
                {v.metrics.slice(0, 2).map((mt) => (
                  <div key={mt.label}>
                    <div className="text-[clamp(2.4rem,4.4vw,4.4rem)] font-semibold leading-none tracking-[-0.05em] text-accent-ink">{mt.value}</div>
                    <div className="mono-label mt-1 text-muted">{mt.label}</div>
                  </div>
                ))}
              </div>
              <Magnetic>
                <button
                  type="button"
                  onClick={view}
                  className="mono-label rounded-full bg-accent px-5 py-3 font-bold text-on-accent"
                >
                  Features & how it works →
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Words light up one by one as the line scrolls through the viewport. */
function EntrepreneurLine() {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const split = SplitText.create(el, { type: "words" });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } },
        );
      });
      return () => {
        mm.revert();
        split.revert();
      };
    },
    { scope: ref },
  );
  return (
    <p
      ref={ref}
      className="text-balance text-[clamp(2.4rem,7.4vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
    >
      {entrepreneurLine.split(". ").map((part, i, arr) => (
        <span key={i} className={i === arr.length - 1 ? "text-accent-ink" : undefined}>
          {part}
          {i < arr.length - 1 ? ". " : ""}
        </span>
      ))}
    </p>
  );
}

export default function Ventures() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-venture]", section.current);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.querySelector("[data-venture-inner]"), {
            scale: 0.9,
            opacity: 0.35,
            rotate: -1.5,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} id="ventures" className="relative">
      <div className="gutter pt-32 md:pt-44">
        <p className="mono-label text-muted">{sectionLabel("ventures")}</p>
        <SplitReveal as="h2" className="mt-6 text-[clamp(3rem,10.2vw,12rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]">
          Entrepreneur
          <br />
          mode
        </SplitReveal>
        <p className="mt-8 max-w-[44ch] text-lg leading-snug text-ink/75">
          Two businesses, one operating system: find the messy workflow, rebuild it, and run it at scale. Open a card to see every feature and how it works.
        </p>
      </div>

      <div className="relative">
        {ventures.map((v, i) => (
          <VentureCard key={v.id} v={v} i={i} />
        ))}
      </div>

      <div className="gutter py-32 md:py-48">
        <p className="mono-label mb-8 text-muted">[ THESIS ]</p>
        <EntrepreneurLine />
      </div>
    </section>
  );
}
