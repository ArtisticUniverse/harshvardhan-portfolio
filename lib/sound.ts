"use client";

import { store } from "./store";

let ctx: AudioContext | null = null;
let last = 0;

type Kind = "tick" | "click" | "open" | "close" | "type" | "success";

const PRESETS: Record<Kind, { f: number; to: number; d: number; g: number; type: OscillatorType }> = {
  tick: { f: 1800, to: 1200, d: 0.03, g: 0.025, type: "sine" },
  click: { f: 900, to: 420, d: 0.07, g: 0.05, type: "triangle" },
  open: { f: 320, to: 880, d: 0.22, g: 0.04, type: "sine" },
  close: { f: 880, to: 300, d: 0.2, g: 0.04, type: "sine" },
  type: { f: 2400, to: 1600, d: 0.018, g: 0.015, type: "square" },
  success: { f: 660, to: 1320, d: 0.35, g: 0.05, type: "triangle" },
};

/** Tiny synthesized UI sounds. Silent unless the visitor turned sound on. */
export function playSound(kind: Kind) {
  if (!store.get().sound || typeof window === "undefined") return;
  const now = performance.now();
  if (kind === "tick" && now - last < 45) return;
  last = now;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const p = PRESETS[kind];
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.f, t);
    osc.frequency.exponentialRampToValueAtTime(p.to, t + p.d);
    gain.gain.setValueAtTime(p.g, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + p.d);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + p.d + 0.02);
  } catch {
    /* audio unavailable */
  }
}
