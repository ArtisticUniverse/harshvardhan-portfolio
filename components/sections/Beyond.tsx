"use client";

import { useRef, useState } from "react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { gsap, useGSAP } from "@/lib/gsap";
import { deskItems, sectionLabel, type DeskItem } from "@/data/content";
import SplitReveal from "@/components/ui/SplitReveal";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/cn";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable, InertiaPlugin);

const PIECES: Record<string, string> = { "0-4": "♚", "1-3": "♟", "2-2": "♞", "3-5": "♕", "5-1": "♙", "6-6": "♖", "7-4": "♔" };

function ItemFace({ item }: { item: DeskItem }) {
  switch (item.kind) {
    case "chess":
      return (
        <div className="w-[210px] bg-[rgb(var(--paper))] p-3 pb-4 text-[rgb(var(--paper-ink))] shadow-2xl">
          <div className="grid aspect-square grid-cols-8 overflow-hidden border border-black/20">
            {Array.from({ length: 64 }, (_, i) => {
              const r = Math.floor(i / 8);
              const c = i % 8;
              return (
                <div key={i} className={cn("flex items-center justify-center text-[15px] leading-none", (r + c) % 2 ? "bg-[#3b3a36] text-[#EBB94A]" : "bg-[#e9e4d6] text-[#0a0a0a]")}>
                  {PIECES[`${r}-${c}`] ?? ""}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xl font-semibold leading-none">{item.title}</p>
          <p className="mt-1 text-sm leading-snug opacity-70">{item.body}</p>
        </div>
      );
    case "ticket":
      return (
        <div className="relative flex w-[270px] overflow-hidden rounded-md bg-accent text-on-accent shadow-2xl">
          <div className="flex-1 p-4">
            <p className="mono-label opacity-70">Admit one</p>
            <p className="mt-2 text-3xl font-semibold leading-none tracking-tight">{item.title}</p>
            <p className="mt-2 text-sm leading-snug">{item.body}</p>
          </div>
          <div className="flex w-14 flex-col items-center justify-center border-l-2 border-dashed border-black/30">
            <span
              className="h-24 w-6"
              style={{ background: "repeating-linear-gradient(0deg,#0a0a0a 0 2px,transparent 2px 4px,#0a0a0a 4px 5px,transparent 5px 8px)" }}
            />
          </div>
        </div>
      );
    case "polaroid":
      return (
        <div className="w-[200px] bg-[rgb(var(--paper))] p-3 pb-4 text-[rgb(var(--paper-ink))] shadow-2xl">
          <div className="relative aspect-square overflow-hidden bg-[#0b3a4a]">
            {[0, 1, 2].map((k) => (
              <svg key={k} viewBox="0 0 200 20" className="absolute left-0 w-[200%]" style={{ top: `${30 + k * 22}%`, animation: `wave ${6 + k * 2}s linear infinite`, opacity: 0.5 - k * 0.1 }} aria-hidden>
                <path d="M0 10 Q 12.5 0 25 10 T 50 10 T 75 10 T 100 10 T 125 10 T 150 10 T 175 10 T 200 10" fill="none" stroke="#9fe3ff" strokeWidth="2" />
              </svg>
            ))}
            <span className="mono-label absolute bottom-2 left-2 text-[#9fe3ff]">LANE 04</span>
          </div>
          <p className="mt-3 text-xl font-semibold leading-none">{item.title}</p>
          <p className="mt-1 text-sm leading-snug opacity-70">{item.body}</p>
        </div>
      );
    case "card":
      return (
        <div
          className="w-[250px] rounded-sm bg-[rgb(var(--paper))] p-5 text-[rgb(var(--paper-ink))] shadow-2xl"
          style={{ backgroundImage: "repeating-linear-gradient(transparent 0 27px, rgba(0,80,160,0.18) 27px 28px)" }}
        >
          <p className="text-xl font-semibold leading-none">{item.title}</p>
          <p className="mt-3 text-[15px] leading-[28px]">{item.body}</p>
        </div>
      );
    default:
      return (
        <div className="relative w-[210px] bg-[#f6e7a8] p-5 pt-7 text-[#1a1a1a] shadow-2xl">
          <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-white/50 backdrop-blur-sm" />
          <p className="text-xl font-semibold leading-none">{item.title}</p>
          <p className="mt-2 text-[15px] leading-snug">{item.body}</p>
        </div>
      );
  }
}

export default function Beyond() {
  const desk = useRef<HTMLDivElement>(null);
  const z = useRef(10);
  const [moved, setMoved] = useState<Record<string, boolean>>({});

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-desk-item]", desk.current);
        items.forEach((it) => gsap.set(it, { rotation: Number(it.dataset.r) }));
        gsap.from(items, {
          y: -120,
          opacity: 0,
          rotate: () => gsap.utils.random(-25, 25),
          stagger: 0.07,
          duration: 1.1,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: desk.current, start: "top 70%", once: true },
        });
        const drags = Draggable.create(items, {
          bounds: desk.current,
          inertia: true,
          edgeResistance: 0.8,
          onPress() {
            z.current += 1;
            gsap.set(this.target, { zIndex: z.current });
            gsap.to(this.target, { scale: 1.05, rotate: "+=2", duration: 0.25 });
            playSound("tick");
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, duration: 0.4, ease: "back.out(2)" });
          },
          onDragEnd() {
            const id = (this.target as HTMLElement).dataset.id!;
            setMoved((mv) => (mv[id] ? mv : { ...mv, [id]: true }));
          },
        });
        return () => drags.forEach((d) => d.kill());
      });
      return () => mm.revert();
    },
    { scope: desk },
  );

  const found = Object.keys(moved).filter((id) => deskItems.find((d) => d.id === id)?.secret).length;
  const totalSecrets = deskItems.filter((d) => d.secret).length;

  return (
    <section id="beyond" className="relative py-28 md:py-40">
      <div className="gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono-label text-muted">{sectionLabel("beyond")}</p>
            <SplitReveal as="h2" className="mt-6 text-[clamp(3rem,9.5vw,10.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]">
              Beyond the CV
            </SplitReveal>
          </div>
          <div className="max-w-[36ch]">
            <p className="text-lg leading-snug text-ink/75">
              Trying to be a jack of all trades — with a soft spot for chess, swimming and building interesting apps. Move things around; some notes hide something underneath.
            </p>
            <p className="mono-label mt-4 text-accent-ink">
              Secrets found: {found} / {totalSecrets}
            </p>
          </div>
        </div>

        <div
          ref={desk}
          className="relative mt-12 grid grid-cols-1 gap-8 rounded-sm border border-ink/10 p-6 sm:grid-cols-2 md:block md:h-[min(115svh,980px)] md:p-0"
          style={{
            background:
              "radial-gradient(120% 80% at 30% 20%, rgb(var(--accent) / 0.06), transparent 60%), repeating-linear-gradient(90deg, rgb(var(--ink) / 0.025) 0 2px, transparent 2px 9px)",
          }}
        >
          <span aria-hidden className="mono-label pointer-events-none absolute bottom-4 right-5 hidden text-muted md:block">
            ↖ drag anything
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-[46%] top-[34%] hidden h-40 w-40 rounded-full border-[10px] border-[#6b4a2b]/15 md:block"
          />
          {deskItems.map((item) => (
            <div key={item.id} className="relative md:contents">
              {item.secret && (
                <p
                  className="mono-label pointer-events-none absolute z-0 hidden max-w-[200px] text-accent-ink md:block"
                  style={{ left: `calc(${item.x}% + 24px)`, top: `calc(${item.y}% + 40px)` }}
                >
                  ✦ {item.secret}
                </p>
              )}
              <div
                data-desk-item
                data-id={item.id}
                data-r={item.r}
                data-cursor="DRAG"
                className="relative flex justify-center md:absolute md:left-[var(--x)] md:top-[var(--y)] md:block"
                style={{ "--x": `${item.x}%`, "--y": `${item.y}%` } as React.CSSProperties}
              >
                <div className="md:contents" style={{ rotate: `${item.r}deg` }}>
                  <ItemFace item={item} />
                </div>
              </div>
              {item.secret && <p className="mono-label mt-3 text-center text-accent-ink md:hidden">✦ {item.secret}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
