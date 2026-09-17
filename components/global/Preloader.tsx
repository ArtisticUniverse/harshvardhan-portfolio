"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { preloader, site } from "@/data/content";
import { safeStorage, store } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/hooks";

/** Name reveal with a 000 → 100 load counter, then a gold bar wipe into the hero. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLParagraphElement>(null);
  const tagline = useRef<HTMLParagraphElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    window.scrollTo(0, 0);

    const reduced = prefersReducedMotion();
    const session = safeStorage("session");
    const repeat = session?.getItem("hp-loaded") === "1";
    const speed = reduced ? 0.25 : repeat ? 0.45 : 1;

    const finish = () => {
      session?.setItem("hp-loaded", "1");
      store.set({ loaded: true });
      setDone(true);
    };

    let split: SplitText | null = null;
    const counter = { v: 0 };
    const tl = gsap.timeline({ paused: true, onComplete: finish });

    if (name.current) {
      split = SplitText.create(name.current, { type: "chars", mask: "chars" });
      gsap.set([name.current, tagline.current], { opacity: 1 });
      tl.from(split.chars, { yPercent: 110, duration: 0.9 * speed, stagger: 0.025 * speed, ease: "expo.out" }, 0);
      tl.from(tagline.current, { yPercent: 100, opacity: 0, duration: 0.7 * speed, ease: "power3.out" }, 0.35 * speed);
    }

    tl.to(
      counter,
      {
        v: 100,
        duration: 1.9 * speed,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(counter.v);
          if (count.current) count.current.textContent = String(v).padStart(3, "0");
          if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`;
        },
      },
      0,
    );
    tl.to({}, { duration: 0.25 * speed });

    if (reduced) {
      tl.to(el, { opacity: 0, duration: 0.3 });
    } else {
      tl.set(wipe.current, { scaleY: 0, transformOrigin: "50% 100%" })
        .to(wipe.current, { scaleY: 1, duration: 0.6, ease: "power4.inOut" })
        .set(el.querySelector("[data-pre-content]"), { autoAlpha: 0 })
        .set(el, { backgroundColor: "transparent" })
        .set(wipe.current, { transformOrigin: "50% 0%" })
        .add(() => store.set({ loaded: true }))
        .to(wipe.current, { scaleY: 0, duration: 0.75, ease: "power4.inOut" });
    }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      tl.play();
    };
    // Wait for fonts so the reveal doesn't reflow, but never hang on them.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(start);
    const fallback = window.setTimeout(start, 900);

    return () => {
      window.clearTimeout(fallback);
      tl.kill();
      split?.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[250] bg-canvas" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div data-pre-content className="gutter flex h-full flex-col justify-between py-6">
        <div className="mono-label flex justify-between text-muted">
          <span>{site.monogram} — PORTFOLIO</span>
          <span>
            LAT {site.location.lat} {site.location.city.toUpperCase()}
          </span>
        </div>

        <div>
          <p
            ref={name}
            className="text-[clamp(2.6rem,9vw,9rem)] font-semibold uppercase leading-[0.86] tracking-[-0.05em] opacity-0"
          >
            {preloader.message}
          </p>
          <div className="mt-4 overflow-hidden">
            <p ref={tagline} className="mono-label text-muted opacity-0">
              {site.tagline} · <span className="text-accent-ink">{site.taglineSub}</span>
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <span className="mono-label text-muted">Loading experience</span>
            <span ref={count} className="font-mono text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em] text-accent-ink tabular-nums">
              000
            </span>
          </div>
          <div className="mt-4 h-px w-full bg-ink/15">
            <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
      <div ref={wipe} aria-hidden className="pointer-events-none absolute inset-0 bg-accent" style={{ transform: "scaleY(0)" }} />
    </div>
  );
}
