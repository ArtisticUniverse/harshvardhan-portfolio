"use client";

import { createElement, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  children: React.ReactNode;
  className?: string;
  /** chars: kinetic headlines · lines: paragraphs */
  type?: "chars" | "words" | "lines";
  delay?: number;
  start?: string;
};

/** SplitText masked reveal that plays once when the element scrolls into view. */
export default function SplitReveal({ as = "div", children, className, type = "chars", delay = 0, start = "top 88%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const split = SplitText.create(el, {
        type: type === "lines" ? "lines" : type === "words" ? "words,lines" : "chars,words,lines",
        mask: type === "lines" ? "lines" : type === "words" ? "words" : "lines",
        linesClass: "split-mask",
        autoSplit: true,
        onSplit(self) {
          const targets = type === "lines" ? self.lines : type === "words" ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent: 115,
            rotate: type === "chars" ? 6 : 0,
            duration: type === "lines" ? 1.1 : 1.2,
            ease: "expo.out",
            stagger: type === "chars" ? 0.025 : type === "words" ? 0.05 : 0.09,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return createElement(as, { ref, className }, children);
}
