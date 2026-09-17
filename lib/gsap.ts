"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export const EASE = {
  out: "power4.out",
  inOut: "power3.inOut",
  expo: "expo.out",
};

export { gsap, ScrollTrigger, SplitText, useGSAP };
