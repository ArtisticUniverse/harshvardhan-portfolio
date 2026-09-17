"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { timeline, type Memory, sectionLabel } from "@/data/content";
import { playSound } from "@/lib/sound";
import SplitReveal from "@/components/ui/SplitReveal";

const TILT = [-3, 2.5, -1.5, 3, -2];
const OFFSET = ["md:-translate-y-6", "md:translate-y-10", "md:-translate-y-2", "md:translate-y-8", "md:-translate-y-8"];

function Polaroid({ m, i }: { m: Memory; i: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <article data-memory className="relative w-full shrink-0 md:w-[min(31vw,430px)]">
      <div
        className={`${OFFSET[i % OFFSET.length]} [rotate:calc(var(--tilt)*0.35)] md:[rotate:var(--tilt)]`}
        style={{ "--tilt": `${TILT[i % TILT.length]}deg` } as React.CSSProperties}
      >
      <button
        type="button"
        onClick={() => {
          setFlipped((f) => !f);
          playSound("click");
        }}
        aria-pressed={flipped}
        aria-label={`${m.period}: ${m.title}, ${m.org}. ${flipped ? "Show front" : "Show details"}`}
        data-cursor={flipped ? "BACK" : "FLIP"}
        className="group relative block w-full text-left [perspective:1600px]"
      >
        <div
          className="relative [transform-style:preserve-3d] transition-transform duration-[900ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front */}
          <div className="bg-[rgb(var(--paper))] p-3 pb-5 text-[rgb(var(--paper-ink))] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] [backface-visibility:hidden]">
            <div data-photo className="relative aspect-[4/4.3] overflow-hidden bg-[#0d0d0c] text-[#F2F0EA]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  background: `radial-gradient(120% 90% at ${20 + i * 17}% ${30 + (i % 3) * 20}%, rgba(235,185,74,0.28), transparent 55%), repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)`,
                }}
              />
              <span className="mono-label absolute left-3 top-3 text-[#F2F0EA]/60">MEMORY_0{i + 1}.JPG</span>
              <span className="mono-label absolute right-3 top-3 text-[#EBB94A]">[ {m.chapter} ]</span>
              <div className="absolute inset-x-4 bottom-4">
                <div className="text-[clamp(3.4rem,6.5vw,6rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-[#EBB94A]">
                  {m.highlight.value}
                </div>
                <div className="mono-label mt-2 text-[#F2F0EA]/75">{m.highlight.label}</div>
              </div>
              <span className="absolute bottom-4 right-4 font-mono text-[10px] text-[#ff9b3d]/80">{m.period}</span>
            </div>
            <div className="px-1 pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-2xl font-semibold leading-none tracking-tight md:text-[1.9rem]">{m.title}</h3>
                <span className="mono-label shrink-0 opacity-50 transition-opacity group-hover:opacity-100">flip ↻</span>
              </div>
              <p className="mt-2 text-sm leading-snug opacity-70">{m.org}</p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col bg-[rgb(var(--paper))] p-5 text-[rgb(var(--paper-ink))] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-6">
            <div className="mono-label flex justify-between opacity-60">
              <span>{m.period}</span>
              <span>{m.place}</span>
            </div>
            <h3 className="mt-4 text-3xl font-semibold leading-[0.95] tracking-tight">{m.title}</h3>
            <p className="mt-1 text-sm opacity-70">{m.org}</p>
            <ul className="mt-5 flex flex-1 flex-col gap-2.5 overflow-hidden">
              {m.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-[0.95rem] leading-snug">
                  <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A0A0A]" />
                  {b}
                </li>
              ))}
            </ul>
            <span className="mono-label mt-3 self-end opacity-50">↻ flip back</span>
          </div>
        </div>
      </button>
      </div>
    </article>
  );
}

export default function Timeline() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth;
        const scrollTween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(rail.current, { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-memory]", t).forEach((card) => {
          const photo = card.querySelector("[data-photo]");
          gsap.fromTo(
            card,
            { filter: "blur(10px) grayscale(1)", opacity: 0.35, yPercent: 8, scale: 0.92 },
            {
              filter: "blur(0px) grayscale(0)",
              opacity: 1,
              yPercent: 0,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: "left 95%", end: "left 50%", scrub: true },
            },
          );
          if (photo) {
            gsap.fromTo(
              photo,
              { filter: "brightness(2.6) contrast(0.6) sepia(0.6)" },
              {
                filter: "brightness(1) contrast(1) sepia(0)",
                ease: "none",
                scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: "left 85%", end: "left 35%", scrub: true },
              },
            );
          }
        });
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-memory]", track.current).forEach((card) => {
          gsap.fromTo(
            card,
            { filter: "blur(8px) grayscale(1)", opacity: 0.3, y: 60 },
            {
              filter: "blur(0px) grayscale(0)",
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 92%", end: "top 55%", scrub: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  // Make sure pins below measure after this one exists.
  useGSAP(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <section ref={section} id="recollections" className="relative overflow-hidden">
      <div
        ref={track}
        className="gutter flex flex-col gap-16 py-24 md:h-[100svh] md:w-max md:flex-row md:items-center md:gap-[5vw] md:py-0 md:pr-[12vw]"
      >
        <header className="shrink-0 md:w-[min(50vw,760px)]">
          <p className="mono-label text-muted">{sectionLabel("recollections")}</p>
          <SplitReveal
            as="h2"
            className="mt-6 whitespace-nowrap text-[11.5vw] font-semibold uppercase leading-[0.84] tracking-[-0.05em] md:text-[min(5.4vw,78px)]"
          >
            Recollections
          </SplitReveal>
          <p className="mt-6 max-w-[34ch] text-lg leading-snug text-ink/75">
            An archive of the chapters that built the operator. Each polaroid develops as it enters the frame — tap one to read the back.
          </p>
          <p className="mono-label mt-8 hidden items-center gap-3 text-accent-ink md:flex">
            <span className="h-px w-12 bg-accent" /> keep scrolling →
          </p>
        </header>

        {timeline.map((m, i) => (
          <Polaroid key={m.id} m={m} i={i} />
        ))}

        <div className="flex shrink-0 flex-col justify-center md:w-[26vw]">
          <p className="mono-label text-muted">[ END OF ARCHIVE ]</p>
          <p className="mt-4 text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[0.9] tracking-[-0.03em]">
            The next memory is being written in <span className="text-accent-ink">Udaipur.</span>
          </p>
        </div>
      </div>

      <div aria-hidden className="gutter absolute inset-x-0 bottom-8 hidden md:block">
        <div className="relative h-px bg-ink/15">
          <div ref={rail} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
        </div>
        <div className="mono-label mt-3 flex justify-between text-muted">
          {timeline.map((m) => (
            <span key={m.id}>{m.period}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
