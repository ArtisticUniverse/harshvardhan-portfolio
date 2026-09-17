"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import type MatterNS from "matter-js";
import { sectionLabel, skillGroups, skills, type SkillGroup } from "@/data/content";
import SplitReveal from "@/components/ui/SplitReveal";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/cn";

const PILL: Record<SkillGroup, string> = {
  capital: "bg-accent text-on-accent border-accent",
  growth: "bg-ink text-canvas border-ink",
  ops: "bg-canvas text-ink border-ink/60",
  build: "bg-surface text-accent-ink border-accent/70",
  mind: "bg-transparent text-ink border-dashed border-ink/50",
};

/** Draggable physics tag cloud. Tap or click a pill to see the evidence behind the skill. */
export default function Skills() {
  const box = useRef<HTMLDivElement>(null);
  const pills = useRef<HTMLButtonElement[]>([]);
  const engineRef = useRef<MatterNS.Engine | null>(null);
  const bodiesRef = useRef<MatterNS.Body[]>([]);
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState<SkillGroup | "all">("all");
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStaticMode(true);
      return;
    }

    let raf = 0;
    let running = false;
    let cleanup = () => {};
    let visible = false;

    const start = async () => {
      const Matter = (await import("matter-js")).default;
      const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;
      const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0012 } });
      engineRef.current = engine;
      let W = el.clientWidth;
      let H = el.clientHeight;
      const wallOpts = { isStatic: true, render: { visible: false } };
      const walls = [
        Bodies.rectangle(W / 2, H + 50, W * 3, 100, wallOpts),
        Bodies.rectangle(-50, H / 2, 100, H * 4, wallOpts),
        Bodies.rectangle(W + 50, H / 2, 100, H * 4, wallOpts),
      ];
      Composite.add(engine.world, walls);

      const bodies = pills.current.map((p, i) => {
        const w = p.offsetWidth;
        const h = p.offsetHeight;
        const b = Bodies.rectangle(
          40 + Math.random() * (W - 80),
          -60 - i * 45 - Math.random() * 120,
          w,
          h,
          { chamfer: { radius: h / 2 }, restitution: 0.35, friction: 0.08, frictionAir: 0.012, density: 0.002 },
        );
        Body.setAngle(b, (Math.random() - 0.5) * 0.6);
        return b;
      });
      bodiesRef.current = bodies;
      Composite.add(engine.world, bodies);

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let mc: MatterNS.MouseConstraint | null = null;
      if (fine) {
        const mouse = Mouse.create(el);
        // Let the page scroll normally over the box.
        const mw = (mouse as unknown as { mousewheel: EventListener }).mousewheel;
        el.removeEventListener("mousewheel", mw);
        el.removeEventListener("DOMMouseScroll", mw);
        el.removeEventListener("wheel", mw);
        mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } } });
        Composite.add(engine.world, mc);
        Events.on(mc, "startdrag", () => playSound("tick"));
      }

      const onResize = () => {
        const nw = el.clientWidth;
        const nh = el.clientHeight;
        Body.setPosition(walls[0], { x: nw / 2, y: nh + 50 });
        Body.setPosition(walls[2], { x: nw + 50, y: nh / 2 });
        W = nw;
        H = nh;
      };
      window.addEventListener("resize", onResize);

      let last = performance.now();
      const loop = (now: number) => {
        const dt = Math.min(32, now - last);
        last = now;
        Engine.update(engine, dt);
        bodies.forEach((b, i) => {
          const p = pills.current[i];
          if (!p) return;
          // Recover anything flung out of the box.
          if (b.position.y > H + 200 || b.position.x < -200 || b.position.x > W + 200) {
            Body.setPosition(b, { x: W / 2, y: -80 });
            Body.setVelocity(b, { x: 0, y: 0 });
          }
          p.style.transform = `translate(${(b.position.x - p.offsetWidth / 2).toFixed(1)}px, ${(b.position.y - p.offsetHeight / 2).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`;
        });
        raf = running ? requestAnimationFrame(loop) : 0;
      };

      const setRunning = (on: boolean) => {
        if (on === running) return;
        running = on;
        if (on) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        } else cancelAnimationFrame(raf);
      };
      setRunning(visible);
      el.dataset.ready = "1";

      cleanup = () => {
        setRunning(false);
        window.removeEventListener("resize", onResize);
        if (mc) Composite.remove(engine.world, mc);
        Engine.clear(engine);
      };
      return setRunning;
    };

    let setRunning: ((on: boolean) => void) | undefined;
    let booted = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !booted) {
          booted = true;
          void start().then((fn) => {
            setRunning = fn;
          });
        } else setRunning?.(visible);
      },
      { rootMargin: "100px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cleanup();
    };
  }, []);

  const shake = () => {
    playSound("click");
    const engine = engineRef.current;
    if (!engine) return;
    import("matter-js").then(({ default: Matter }) => {
      bodiesRef.current.forEach((b) => {
        Matter.Body.setVelocity(b, { x: (Math.random() - 0.5) * 22, y: -8 - Math.random() * 14 });
        Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.3);
      });
    });
  };

  const flip = () => {
    playSound("click");
    const engine = engineRef.current;
    if (engine) engine.gravity.y = engine.gravity.y > 0 ? -1 : 1;
  };

  const current = skills[selected];

  return (
    <section id="skills" className="relative py-28 md:py-40">
      <div className="gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono-label text-muted">{sectionLabel("skills")}</p>
            <SplitReveal as="h2" className="mt-6 text-[clamp(3rem,10vw,11rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em]">
              Skills universe
            </SplitReveal>
          </div>
          <p className="max-w-[38ch] text-lg leading-snug text-ink/75">
            Not a keyword list — every skill here was earned somewhere. Drag them around, fling them, then click one to see the proof.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {(["all", ...Object.keys(skillGroups)] as (SkillGroup | "all")[]).map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              aria-pressed={filter === g}
              className={cn(
                "mono-label rounded-full border px-3 py-1.5 transition-colors",
                filter === g ? "border-accent bg-accent text-on-accent" : "border-ink/20 hover:border-accent",
              )}
            >
              {g === "all" ? "All" : skillGroups[g]}
            </button>
          ))}
          <span className="flex-1" />
          {!staticMode && (
            <>
              <button onClick={shake} className="mono-label rounded-full border border-ink/20 px-3 py-1.5 hover:border-accent">
                Shake ⤨
              </button>
              <button onClick={flip} className="mono-label rounded-full border border-ink/20 px-3 py-1.5 hover:border-accent">
                Flip gravity ↕
              </button>
            </>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div
            ref={box}
            data-cursor={staticMode ? undefined : "DRAG"}
            className={cn(
              "relative overflow-hidden rounded-sm border border-ink/12 bg-surface/40 lg:col-span-8",
              staticMode ? "flex flex-wrap content-start gap-2 p-5" : "h-[62svh] min-h-[420px] touch-pan-y",
            )}
            style={{ backgroundImage: "radial-gradient(rgb(var(--ink) / 0.08) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          >
            {skills.map((s, i) => (
              <button
                key={s.label}
                ref={(el) => {
                  if (el) pills.current[i] = el;
                }}
                type="button"
                onClick={() => {
                  setSelected(i);
                  playSound("tick");
                }}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-[clamp(0.85rem,1.2vw,1.15rem)] font-medium transition-[opacity,box-shadow] duration-300 will-change-transform",
                  PILL[s.group],
                  staticMode ? "relative" : "absolute left-0 top-0 select-none",
                  filter !== "all" && filter !== s.group && "opacity-20",
                  selected === i && "shadow-[0_0_0_3px_rgb(var(--accent)/0.55)]",
                )}
                style={staticMode ? undefined : { transform: "translate(-999px,-999px)" }}
                aria-pressed={selected === i}
              >
                {s.label}
              </button>
            ))}
          </div>

          <aside className="flex flex-col justify-between gap-6 rounded-sm border border-ink/12 p-6 lg:col-span-4" aria-live="polite">
            <AnimatePresence mode="wait">
              <m.div
                key={current.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <p className="mono-label text-accent-ink">{skillGroups[current.group]}</p>
                <h3 className="mt-3 text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[0.95] tracking-[-0.03em]">{current.label}</h3>
                <p className="mono-label mt-6 text-muted">Evidence</p>
                <p className="mt-2 text-lg leading-snug">{current.evidence}</p>
              </m.div>
            </AnimatePresence>
            <div className="mono-label grid grid-cols-5 gap-1 text-muted">
              {(Object.keys(skillGroups) as SkillGroup[]).map((g) => (
                <div key={g} className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-ink">{skills.filter((s) => s.group === g).length}</span>
                  <span className="text-[9px] leading-tight">{skillGroups[g]}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
