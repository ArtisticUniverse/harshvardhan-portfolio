"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { links, recruiterMessage } from "@/data/content";
import { store, useStore } from "@/lib/store";
import { playSound } from "@/lib/sound";
import { openRecruiter } from "./Header";
import Magnetic from "@/components/ui/Magnetic";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export async function celebrate() {
  playSound("success");
  store.set({ egg: true });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#EBB94A", "#F2F0EA", "#0A0A0A"];
  const burst = (x: number, angle: number) =>
    confetti({ particleCount: 90, spread: 70, startVelocity: 55, angle, origin: { x, y: 0.75 }, colors, zIndex: 400, scalar: 1.1 });
  burst(0.1, 60);
  burst(0.9, 120);
  setTimeout(() => confetti({ particleCount: 140, spread: 160, origin: { y: 0.35 }, colors, zIndex: 400 }), 280);
}

/** Konami code or typing H-I-R-E anywhere (outside inputs) triggers the recruiter egg. */
export default function EasterEggs() {
  const open = useStore((s) => s.egg);

  useEffect(() => {
    let konami = 0;
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konami = key === KONAMI[konami] ? konami + 1 : key === KONAMI[0] ? 1 : 0;
      if (konami === KONAMI.length) {
        konami = 0;
        void celebrate();
      }
      if (key.length === 1) {
        typed = (typed + key).slice(-4);
        if (typed === "hire") {
          typed = "";
          void celebrate();
        }
      }
      if (e.key === "Escape" && store.get().egg) store.set({ egg: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => store.set({ egg: false })}
        >
          <m.div
            role="alertdialog"
            aria-labelledby="egg-title"
            className="relative w-full max-w-lg overflow-hidden rounded-sm bg-accent p-8 text-[#0A0A0A] md:p-10"
            initial={{ y: 60, rotate: -4, scale: 0.9 }}
            animate={{ y: 0, rotate: 0, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mono-label">[ EASTER EGG UNLOCKED ]</p>
            <h2 id="egg-title" className="mt-4 text-5xl font-semibold leading-[0.9] tracking-tight">
              {recruiterMessage.title}
            </h2>
            <p className="mt-4 text-lg leading-snug">{recruiterMessage.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <a href={`mailto:${links.email}?subject=Let's%20talk%20about%20a%20role`} className="mono-label inline-flex rounded-full bg-[#0A0A0A] px-5 py-3 text-[#EBB94A]">
                  Email Harsh →
                </a>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => {
                    store.set({ egg: false });
                    openRecruiter();
                  }}
                  className="mono-label inline-flex rounded-full border border-[#0A0A0A] px-5 py-3"
                >
                  1-page CV
                </button>
              </Magnetic>
            </div>
            <button onClick={() => store.set({ egg: false })} aria-label="Close" className="mono-label absolute right-4 top-4">
              ✕
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
