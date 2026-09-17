"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

type State = {
  /** Preloader finished — intro animations may start. */
  loaded: boolean;
  menuOpen: boolean;
  recruiter: boolean;
  sound: boolean;
  theme: Theme;
  section: string;
  egg: boolean;
  /** id of the project whose case study is open */
  project: string | null;
};

let state: State = {
  loaded: false,
  menuOpen: false,
  recruiter: false,
  sound: false,
  theme: "dark",
  section: "hero",
  egg: false,
  project: null,
};

const listeners = new Set<() => void>();

export const store = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => select(state),
    () => select(state),
  );
}

/**
 * Mutable scroll telemetry written by the Lenis loop every frame.
 * Read it inside tickers / rAF — never put it in React state.
 */
export const scroll = {
  y: 0,
  progress: 0,
  velocity: 0,
  direction: 1 as 1 | -1,
  limit: 1,
};

export function safeStorage(kind: "local" | "session") {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}
