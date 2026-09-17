"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { playSound } from "@/lib/sound";

/**
 * Dot + ring cursor. Any element with `data-cursor="LABEL"` grows the ring
 * and shows the label; links and buttons get a smaller hover state.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current || !label.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const d = dot.current;
    const r = ring.current;
    const l = label.current;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    let current: Element | null = null;

    const setState = (target: Element | null) => {
      if (target === current) return;
      current = target;
      const text = target?.getAttribute("data-cursor") ?? "";
      if (text === "hide") {
        gsap.to([d, r], { scale: 0, duration: 0.25 });
        return;
      }
      gsap.to([d, r], { scale: 1, duration: 0.25 });
      if (text) {
        l.textContent = text;
        r.dataset.state = "label";
        gsap.to(r, { width: 96, height: 96, duration: 0.45, ease: "expo.out" });
        gsap.to(l, { opacity: 1, scale: 1, duration: 0.3, delay: 0.05 });
        gsap.to(d, { scale: 0, duration: 0.2 });
        playSound("tick");
      } else if (target) {
        r.dataset.state = "hover";
        gsap.to(r, { width: 56, height: 56, duration: 0.4, ease: "expo.out" });
        gsap.to(l, { opacity: 0, scale: 0.6, duration: 0.2 });
        gsap.to(d, { scale: 1.4, duration: 0.2 });
        playSound("tick");
      } else {
        r.dataset.state = "idle";
        gsap.to(r, { width: 34, height: 34, duration: 0.4, ease: "expo.out" });
        gsap.to(l, { opacity: 0, scale: 0.6, duration: 0.2 });
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const target = t?.closest?.("[data-cursor], a, button, input, textarea, [role=button]") ?? null;
      setState(target);
    };
    const onDown = () => {
      gsap.to(r, { scale: 0.82, duration: 0.15 });
      playSound("click");
    };
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.35, ease: "back.out(3)" });
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([d, r], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        data-state="idle"
        className="pointer-events-none fixed left-0 top-0 z-[200] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-ink/50 transition-colors duration-300 data-[state=hover]:border-accent data-[state=label]:border-accent data-[state=hover]:bg-accent/10 data-[state=label]:bg-accent"
      >
        <span ref={label} className="mono-label scale-50 font-bold text-[#0A0A0A] opacity-0" />
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201] h-[6px] w-[6px] rounded-full bg-accent mix-blend-normal"
      />
    </>
  );
}
