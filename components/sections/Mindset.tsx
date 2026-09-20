"use client";

import { useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { principles, sectionLabel } from "@/data/content";
import { buildMemo, type Memo } from "@/lib/memo";
import { playSound } from "@/lib/sound";
import Magnetic from "@/components/ui/Magnetic";
import ScreenPipeline from "@/components/ui/ScreenPipeline";
import LazyVisual from "@/components/ui/LazyVisual";
import { cn } from "@/lib/cn";

if (typeof window !== "undefined") gsap.registerPlugin(MorphSVGPlugin);

function gear() {
  const teeth = 8;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 4 < 2 ? 44 : 34;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(2)} ${(50 + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z M50 36 A14 14 0 1 0 50.01 36 Z`;
}

const ICONS = [
  // Investor: a rising trend line with an arrow head.
  "M8 80 L36 52 L52 66 L76 40 L66 30 L94 24 L88 52 L80 44 L52 74 L36 60 L16 88 Z",
  // Engineer: </>
  "M34 24 L43 33 L26 50 L43 67 L34 76 L8 50 Z M66 24 L92 50 L66 76 L57 67 L74 50 L57 33 Z M55 16 L64 18 L46 84 L37 82 Z",
  // Operator: gear
  gear(),
  // Vibe coder: spark
  "M58 4 L20 56 L46 56 L38 96 L82 38 L55 38 Z",
];

function Principles() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const icon = useRef<SVGPathElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const blocks = gsap.utils.toArray<HTMLElement>("[data-principle]", stage.current);
        const splits = blocks.map((b) => SplitText.create(b.querySelectorAll("[data-split]"), { type: "chars", mask: "chars" }));
        const proofs = blocks.map((b) => b.querySelector("[data-proof]"));
        const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", stage.current);

        gsap.set(blocks, { autoAlpha: 1 });
        splits.slice(1).forEach((s) => gsap.set(s.chars, { yPercent: 110 }));
        gsap.set(proofs.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set(bars, { scaleX: 0 });
        gsap.set(bars[0], { scaleX: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: `+=${principles.length * 90}%`,
            pin: stage.current,
            scrub: 0.8,
            snap: { snapTo: "labels", duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut" },
            onUpdate: (self) => {
              const i = Math.min(principles.length - 1, Math.round(self.progress * (principles.length - 1)));
              if (counter.current) counter.current.textContent = String(i + 1).padStart(2, "0");
            },
          },
        });
        tl.addLabel("p0");
        for (let i = 1; i < principles.length; i++) {
          tl.to(splits[i - 1].chars, { yPercent: -110, stagger: 0.012, duration: 0.5 })
            .to(proofs[i - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, "<")
            .to(icon.current, { morphSVG: ICONS[i], duration: 0.7, rotate: i * 90, transformOrigin: "50% 50%" }, "<")
            .fromTo(splits[i].chars, { yPercent: 110 }, { yPercent: 0, stagger: 0.012, duration: 0.5 }, "<0.25")
            .to(proofs[i], { autoAlpha: 1, y: 0, duration: 0.35 }, "<0.2")
            .to(bars[i], { scaleX: 1, duration: 0.5 }, "<")
            .addLabel(`p${i}`)
            .to({}, { duration: 0.3 });
        }
        return () => splits.forEach((s) => s.revert());
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} id="mindset" className="relative">
      <div ref={stage} className="gutter relative flex min-h-[100svh] flex-col justify-center py-24 motion-reduce:py-32">
        <div className="mono-label flex justify-between text-muted">
          <span>{sectionLabel("mindset")}</span>
          <span className="motion-reduce:hidden">
            <span ref={counter}>01</span> / {String(principles.length).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-10 grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-4 motion-reduce:hidden">
            <div className="relative mx-auto aspect-square w-[46vw] max-w-[340px] md:w-full">
              <div className="absolute inset-0 rounded-full border border-ink/15" />
              <div className="absolute inset-[8%] rounded-full border border-dashed border-accent/40" style={{ animation: "spin-slow 40s linear infinite" }} />
              <svg viewBox="0 0 100 100" className="absolute inset-[24%]" aria-hidden>
                <path ref={icon} d={ICONS[0]} fill="rgb(var(--accent))" fillRule="evenodd" />
              </svg>
            </div>
            <div className="mx-auto mt-8 flex max-w-[340px] gap-2">
              {principles.map((p) => (
                <span key={p.id} className="relative h-[3px] flex-1 overflow-hidden bg-ink/15">
                  <span data-bar className="absolute inset-0 origin-left bg-accent" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:col-span-8 motion-reduce:gap-16">
            {principles.map((p, i) => (
              <div
                key={p.id}
                data-principle
                className={`[grid-area:1/1] motion-reduce:visible motion-reduce:[grid-area:auto] ${i === 0 ? "" : "invisible"}`}
              >
                <p data-split className="whitespace-nowrap text-[clamp(2.8rem,10.5vw,11.5rem)] font-semibold uppercase leading-[0.85] tracking-[-0.06em]">
                  {p.verb}
                </p>
                <p data-split className="mt-3 text-[clamp(1.6rem,4.6vw,4.6rem)] font-medium leading-[1] tracking-[-0.04em] text-accent-ink">
                  {p.like}
                </p>
                <p data-proof className="mt-6 max-w-[38ch] text-lg leading-snug text-ink/75 md:text-xl">
                  {p.proof}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const EXAMPLES = [
  "AI copilot that automates GST filing for Indian SMBs on a subscription",
  "Quick-commerce for tier-2 pharmacies that wait days for stock; we take a commission",
  "Uber for dog walkers",
  "an app",
];

function Criteria({ memo }: { memo: Memo }) {
  return (
    <ul className="mt-5 flex flex-col gap-1.5">
      {memo.criteria.map((c, i) => (
        <m.li
          key={c.key}
          className="flex items-start gap-3 text-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.07 }}
        >
          <span
            className={cn(
              "mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] text-[10px] font-bold",
              c.met ? "bg-[#0A0A0A] text-[#EBB94A]" : "border border-black/25 text-black/35",
            )}
          >
            {c.met ? "✓" : "✕"}
          </span>
          <span className={c.met ? "" : "opacity-55"}>
            {c.label}
            {!c.met && <span className="opacity-70"> — {c.hint}</span>}
          </span>
        </m.li>
      ))}
    </ul>
  );
}

function MemoCard({ memo }: { memo: Memo }) {
  const rejected = memo.status === "rejected";
  const verdictColor = rejected
    ? "border border-[#c2453a] text-[#c2453a]"
    : memo.verdict === "TAKE THE MEETING"
      ? "bg-accent text-on-accent"
      : memo.verdict === "WATCHLIST"
        ? "border border-ink/40"
        : "border border-[#c2453a] text-[#c2453a]";

  return (
    <m.article
      key={memo.company + memo.overall + memo.status}
      initial={{ y: 60, opacity: 0, rotate: -2 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="relative overflow-hidden rounded-sm bg-[rgb(var(--paper))] p-6 text-[rgb(var(--paper-ink))] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.7)] md:p-8"
    >
      <div className="mono-label flex justify-between opacity-60">
        <span>{rejected ? "Screening note" : `Investment memo ${memo.number}`}</span>
        <span>{rejected ? "Not scored" : "Confidential · mock"}</span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-3xl font-semibold leading-none tracking-tight md:text-4xl">{memo.company}</h4>
          <p className="mono-label mt-2 opacity-60">
            {memo.sector}
            {!rejected && ` · market: ${memo.market}`}
          </p>
        </div>
        {!rejected && (
          <div className="text-right">
            <m.div
              className="text-5xl font-semibold leading-none tracking-tighter md:text-6xl"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 16 }}
            >
              {memo.overall.toFixed(1)}
            </m.div>
            <div className="mono-label opacity-60">/ 10</div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-black/10 pt-4">
        <p className="mono-label opacity-60">
          Screen · {memo.criteria.filter((c) => c.met).length} of 5 criteria met
        </p>
        <Criteria memo={memo} />
      </div>

      {rejected ? (
        <p className="mt-5 border-t border-black/10 pt-4 text-[15px] leading-snug">{memo.rejection}</p>
      ) : (
        <>
          <ul className="mt-5 flex flex-col gap-2.5 border-t border-black/10 pt-4">
            {memo.scores.map((sc, i) => (
              <li key={sc.label} className="grid grid-cols-[120px_1fr_32px] items-center gap-3 text-sm">
                <span className="opacity-70">{sc.label}</span>
                <span className="relative h-1.5 overflow-hidden rounded-full bg-black/10">
                  <m.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: sc.label === "Execution risk" ? "#c2453a" : "#0A0A0A" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${sc.value * 10}%` }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  />
                </span>
                <span className="text-right font-mono text-xs">{sc.value.toFixed(1)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-5 border-t border-black/10 pt-5 sm:grid-cols-2">
            <div>
              <p className="mono-label opacity-60">Why it could work</p>
              <ul className="mt-2 flex flex-col gap-1 text-sm leading-snug">
                {memo.strengths.map((t) => (
                  <li key={t}>+ {t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono-label opacity-60">Key risks</p>
              <ul className="mt-2 flex flex-col gap-1 text-sm leading-snug">
                {memo.risks.map((t) => (
                  <li key={t}>− {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      <m.div
        className={`mono-label mt-6 inline-flex rounded-sm px-3 py-2 text-sm font-bold ${verdictColor}`}
        initial={{ scale: 2.2, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: -3 }}
        transition={{ delay: rejected ? 0.4 : 0.75, type: "spring", stiffness: 420, damping: 18 }}
      >
        {rejected ? "Rejected at screen" : `Verdict: ${memo.verdict}`}
      </m.div>
    </m.article>
  );
}

function PitchMe() {
  const [pitch, setPitch] = useState("");
  const [memo, setMemo] = useState<Memo | null>(null);
  const [count, setCount] = useState(58);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMemo(buildMemo(t, count));
    setCount((c) => c + 1);
    playSound("success");
  };

  return (
    <section aria-labelledby="pitch-title" className="gutter relative overflow-hidden py-24 md:py-36">
      <LazyVisual className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 hidden h-[240px] -translate-y-1/2 text-ink opacity-[0.13] lg:block">
        <ScreenPipeline />
      </LazyVisual>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="mono-label text-muted">[ INTERACTIVE — THE VC LENS ]</p>
          <h3 id="pitch-title" className="mt-6 text-[clamp(2.6rem,6vw,6rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
            Pitch me a <span className="text-accent-ink">startup.</span>
          </h3>
          <p className="mt-6 max-w-[40ch] text-lg leading-snug text-ink/75">
            Same screen Harsh ran 150+ times: a pitch has to clear five criteria before it earns a memo. Most don&apos;t — the rest get scored on market, moat, timing, model and execution risk.
          </p>
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              submit(pitch);
            }}
          >
            <label htmlFor="pitch" className="mono-label text-muted">
              Your one-liner
            </label>
            <textarea
              id="pitch"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(pitch);
                }
              }}
              rows={3}
              maxLength={220}
              placeholder="e.g. AI copilot that automates GST filing for Indian SMBs"
              className="mt-2 w-full resize-none rounded-sm border border-ink/20 bg-transparent p-4 text-lg leading-snug outline-none transition-colors placeholder:text-ink/35 focus:border-accent"
              data-cursor="TYPE"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button type="submit" className="mono-label rounded-full bg-accent px-6 py-3 font-bold text-on-accent disabled:opacity-40" disabled={!pitch.trim()}>
                  Generate memo →
                </button>
              </Magnetic>
              <span className="mono-label text-muted">or try:</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    setPitch(ex);
                    submit(ex);
                  }}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-left text-sm text-ink/75 transition-colors hover:border-accent hover:text-accent-ink"
                >
                  {ex}
                </button>
              ))}
            </div>
          </form>
          <p className="mono-label mt-8 text-muted">Rule-based screen, no AI — same checklist every time. For fun, not investment advice.</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
          <AnimatePresence mode="wait">
            {memo ? (
              <MemoCard memo={memo} />
            ) : (
              <m.div
                key="empty"
                exit={{ opacity: 0, y: -20 }}
                className="flex min-h-[420px] flex-col items-center justify-center rounded-sm border border-dashed border-ink/20 p-10 text-center"
              >
                <span className="mono-label text-muted">Screen open · awaiting pitch</span>
                <p className="mt-4 max-w-[24ch] text-2xl font-medium leading-tight tracking-tight text-ink/60">
                  Five criteria. Clear three, and it gets a memo.
                </p>
                <p className="mono-label mt-5 max-w-[34ch] text-muted">
                  who it&apos;s for · what breaks today · how it works · how it makes money · which market
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default function Mindset() {
  return (
    <>
      <Principles />
      <PitchMe />
    </>
  );
}
