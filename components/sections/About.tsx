"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { about, photo, sectionLabel } from "@/data/content";
import SplitReveal from "@/components/ui/SplitReveal";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/cn";

const EASE = [0.76, 0, 0.24, 1] as const;

/** "About, at three speeds": the visitor chooses how much time to give the story. */
export default function About() {
  const root = useRef<HTMLElement>(null);
  const [speed, setSpeed] = useState(1);
  const current = about.speeds[speed];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-truth]", {
          opacity: 0,
          x: -24,
          stagger: 0.07,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-truths]", start: "top 85%", once: true },
        });
        gsap.from("[data-now-row]", {
          opacity: 0,
          y: 16,
          stagger: 0.06,
          duration: 0.6,
          scrollTrigger: { trigger: "[data-now]", start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative py-28 md:py-40">
      <div className="gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono-label text-muted">{sectionLabel("about")}</p>
            <SplitReveal as="h2" className="mt-6 text-[clamp(3rem,10vw,11rem)] font-semibold uppercase leading-[0.82] tracking-[-0.055em]">
              {about.kicker}
            </SplitReveal>
          </div>
          <p className="mono-label max-w-[30ch] text-muted">
            Pick how much time you have. The story is the same — the detail is not.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* The story, at three speeds */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              {about.speeds.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSpeed(i);
                    playSound("tick");
                  }}
                  aria-pressed={speed === i}
                  className={cn(
                    "relative rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-300",
                    speed === i ? "border-accent bg-accent text-on-accent" : "border-ink/20 hover:border-accent hover:text-accent-ink",
                  )}
                >
                  {s.label}
                </button>
              ))}
              <span className="mono-label ml-1 text-muted">{current.read}</span>
            </div>

            {/* Fill bar: how long this version takes to read */}
            <div className="mt-5 h-px w-full bg-ink/12">
              <m.div
                className="h-full bg-accent"
                initial={false}
                animate={{ width: `${((speed + 1) / about.speeds.length) * 100}%` }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </div>

            <AnimatePresence mode="wait">
              <m.div
                key={current.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-8 flex flex-col gap-5"
              >
                {current.body.map((para, i) => (
                  <p
                    key={i}
                    className={cn(
                      "max-w-[60ch] leading-snug text-ink/80",
                      speed === 0 ? "text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-[1.2] text-ink" : "text-lg md:text-xl",
                    )}
                  >
                    {para}
                  </p>
                ))}
              </m.div>
            </AnimatePresence>

            <div data-now className="mt-12 rounded-sm border border-ink/12 p-6 md:p-7">
              <p className="mono-label text-accent-ink">{about.nowTitle}</p>
              <dl className="mt-4 flex flex-col">
                {about.now.map((row) => (
                  <div key={row.k} data-now-row className="grid grid-cols-[92px_1fr] gap-4 border-t border-ink/10 py-3 first:border-t-0 first:pt-0 md:grid-cols-[120px_1fr]">
                    <dt className="mono-label text-muted">{row.k}</dt>
                    <dd className="leading-snug">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Things that are true */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="relative mx-auto w-full max-w-[380px] rotate-[1.5deg] overflow-hidden rounded-sm border border-ink/15 bg-surface/70 lg:ml-auto lg:mr-0">
                <img src={photo.src} alt="" className="aspect-[4/3] w-full object-cover object-[50%_28%] opacity-90 grayscale" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
                <span className="mono-label absolute bottom-3 left-4 text-accent-ink">FROM MUMBAI · NOW UDAIPUR</span>
              </div>

              <ul data-truths className="mt-10 flex flex-col">
                <li className="mono-label pb-3 text-muted">{about.truthsTitle}</li>
                {about.truths.map((t, i) => (
                  <li
                    key={t}
                    data-truth
                    className="group flex gap-4 border-t border-ink/10 py-3.5 transition-colors hover:text-accent-ink"
                  >
                    <span className="mono-label pt-1 text-muted transition-colors group-hover:text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
