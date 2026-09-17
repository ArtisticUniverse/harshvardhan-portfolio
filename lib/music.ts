"use client";

import { soundtrack } from "@/data/content";
import { store } from "./store";

let audio: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let data: Uint8Array | null = null;
let fadeRaf = 0;
let started = false;

function ensure() {
  if (audio) return audio;
  audio = new Audio();
  const aac = audio.canPlayType('audio/mp4; codecs="mp4a.40.2"');
  audio.src = aac ? soundtrack.src : soundtrack.fallback;
  audio.loop = true;
  audio.preload = "none";
  audio.volume = 0;
  return audio;
}

function connectAnalyser(a: HTMLAudioElement) {
  if (analyser) return;
  try {
    ctx = new AudioContext();
    const source = ctx.createMediaElementSource(a);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser).connect(ctx.destination);
    data = new Uint8Array(analyser.frequencyBinCount);
  } catch {
    analyser = null;
  }
}

function fadeTo(target: number, ms: number, done?: () => void) {
  const a = ensure();
  cancelAnimationFrame(fadeRaf);
  const from = a.volume;
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / ms);
    a.volume = from + (target - from) * k * k * (3 - 2 * k);
    if (k < 1) fadeRaf = requestAnimationFrame(step);
    else done?.();
  };
  fadeRaf = requestAnimationFrame(step);
}

async function play() {
  const a = ensure();
  connectAnalyser(a);
  try {
    if (ctx?.state === "suspended") await ctx.resume();
    await a.play();
    started = true;
    fadeTo(soundtrack.volume, 1600);
  } catch {
    // Autoplay blocked: retry on the next user gesture.
    const retry = () => {
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
      if (store.get().sound) void play();
    };
    window.addEventListener("pointerdown", retry, { once: true });
    window.addEventListener("keydown", retry, { once: true });
  }
}

function pause() {
  if (!audio || !started) return;
  fadeTo(0, 700, () => audio?.pause());
}

/** 0..1 levels for `n` frequency bands (all zero when silent). */
export function musicLevels(n: number) {
  const out = new Array(n).fill(0);
  if (!analyser || !data || !audio || audio.paused) return out;
  analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
  const per = Math.floor(data.length / n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < per; j++) sum += data[i * per + j];
    out[i] = sum / per / 255;
  }
  return out;
}

/** Keeps the soundtrack in sync with the sound toggle and tab visibility. */
export function initMusic() {
  let last = store.get().sound;
  if (last) void play();
  const unsub = store.subscribe(() => {
    const on = store.get().sound;
    if (on === last) return;
    last = on;
    if (on) void play();
    else pause();
  });
  const onVis = () => {
    if (!audio || !store.get().sound) return;
    if (document.hidden) audio.pause();
    else void audio.play().catch(() => undefined);
  };
  document.addEventListener("visibilitychange", onVis);
  return () => {
    unsub();
    document.removeEventListener("visibilitychange", onVis);
    audio?.pause();
  };
}
