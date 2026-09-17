"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { certifications, sectionLabel, site } from "@/data/content";
import SplitReveal from "@/components/ui/SplitReveal";
import { playSound } from "@/lib/sound";

/** A stacked deck of credential cards that fans out on hover (tap on touch). */
export default function Certifications() {
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = deck.current;
    if (!el) return;
    const n = cards.current.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const layout = () => {
      const w = el.clientWidth;
      const narrow = w < 640;
      cards.current.forEach((c, i) => {
        const mid = (n - 1) / 2;
        const t = i - mid;
        let vars: gsap.TweenVars;
        if (!open) {
          vars = { x: t * 3, y: -i * 4, rotate: t * 1.2, scale: 1 - (n - 1 - i) * 0.012 };
        } else if (narrow) {
          vars = { x: 0, y: i * 72 - (n - 1) * 36, rotate: t * 0.5, scale: 1 };
        } else {
          const spread = Math.min(118, (w - 280) / (n - 1));
          vars = { x: t * spread, y: Math.abs(t) * Math.abs(t) * 7, rotate: t * 6.5, scale: 1 };
        }
        if (active === i && open) vars = { ...vars, y: (vars.y as number) - 36, scale: 1.06 };
        gsap.to(c, { ...vars, duration: reduced ? 0 : 0.8, ease: "expo.out", delay: open && !reduced ? i * 0.025 : 0, zIndex: active === i ? 50 : i });
      });
    };
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [open, active]);

  return (
    <section id="certs" className="relative overflow-hidden py-28 md:py-40">
      <div className="gutter">
        <p className="mono-label text-muted">{sectionLabel("certs")}</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitReveal as="h2" className="mt-6 text-[clamp(3rem,9.5vw,10.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]">
            Certifications
          </SplitReveal>
          <p className="max-w-[34ch] text-lg leading-snug text-ink/75">
            Finance, operations, data and AI — {certifications.length} credentials. Hover the deck to fan it out.
          </p>
        </div>

        <div
          ref={deck}
          className={`relative mx-auto mt-20 flex max-w-[1200px] items-center justify-center transition-[height] duration-700 sm:h-[440px] ${open ? "h-[680px]" : "h-[300px]"}`}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") {
              setOpen(true);
              playSound("open");
            }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") {
              setOpen(false);
              setActive(null);
            }
          }}
        >
          {certifications.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => {
                if (el) cards.current[i] = el;
              }}
              className="absolute w-[min(78vw,260px)]"
              onPointerEnter={() => {
                setActive(i);
                playSound("tick");
              }}
            >
              <article
                className="relative flex aspect-[5/7] flex-col justify-between overflow-hidden rounded-xl border border-ink/15 bg-surface p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] max-sm:aspect-auto max-sm:min-h-[150px] max-sm:justify-start max-sm:gap-3 max-sm:p-4"
                tabIndex={0}
                onFocus={() => {
                  setOpen(true);
                  setActive(i);
                }}
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60"
                  style={{ background: "radial-gradient(circle, rgb(var(--accent) / 0.35), transparent 70%)" }}
                />
                <div className="relative flex items-start justify-between">
                  <span className="mono-label text-muted">
                    CERT/{String(i + 1).padStart(2, "0")}
                  </span>
                  {c.status ? (
                    <span className="mono-label rounded-full bg-accent px-2 py-0.5 font-bold text-on-accent">{c.status}</span>
                  ) : (
                    <span className="mono-label text-accent-ink">✔ {c.year}</span>
                  )}
                </div>
                <div className="relative max-sm:order-first">
                  <p className="mono-label text-accent-ink">{c.issuer}</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-[1] tracking-tight">{c.title}</h3>
                </div>
                <div className="relative flex items-end justify-between max-sm:hidden">
                  <span className="text-4xl font-semibold tracking-tighter text-ink/10">{site.monogram}</span>
                  <span
                    aria-hidden
                    className="h-6 w-20"
                    style={{ background: "repeating-linear-gradient(90deg, rgb(var(--ink) / 0.5) 0 1px, transparent 1px 3px, rgb(var(--ink) / 0.5) 3px 5px, transparent 5px 8px)" }}
                  />
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              setOpen((o) => !o);
              setActive(null);
              playSound(open ? "close" : "open");
            }}
            aria-expanded={open}
            className="mono-label rounded-full border border-ink/20 px-4 py-2 hover:border-accent"
          >
            {open ? "Stack the deck" : "Fan out the deck"}
          </button>
        </div>
      </div>
    </section>
  );
}
