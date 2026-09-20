"use client";

import dynamic from "next/dynamic";
import { LazyMotion, domAnimation } from "framer-motion";
import SmoothScroll from "@/components/global/SmoothScroll";
import Atmosphere from "@/components/global/Atmosphere";
import Cursor from "@/components/global/Cursor";
import Curtain from "@/components/global/Curtain";
import Header from "@/components/global/Header";
import HUD from "@/components/global/HUD";
import Menu from "@/components/global/Menu";
import Preloader from "@/components/global/Preloader";
import EasterEggs from "@/components/global/EasterEggs";
import ProjectSheet from "@/components/global/ProjectSheet";
import Hero from "@/components/sections/Hero";
import StatsMarquee from "@/components/sections/StatsMarquee";
import About from "@/components/sections/About";
import Timeline from "@/components/sections/Timeline";
import Ventures from "@/components/sections/Ventures";
import VibeLab from "@/components/sections/VibeLab";
import Mindset from "@/components/sections/Mindset";
import Contact from "@/components/sections/Contact";
import RecruiterOverlay from "@/components/global/RecruiterOverlay";

const Skills = dynamic(() => import("@/components/sections/Skills"));
const Certifications = dynamic(() => import("@/components/sections/Certifications"));
const Beyond = dynamic(() => import("@/components/sections/Beyond"));
import { theNumber } from "@/data/content";

const TheNumber = dynamic(() => import("@/components/sections/TheNumber"));

export default function Experience() {
  return (
    <LazyMotion features={domAnimation} strict>
      <SmoothScroll />
      <Atmosphere />
      <Preloader />
      <Header />
      <Menu />
      <HUD />
      <main className="relative z-[1]">
        <Hero />
        {theNumber.enabled && <TheNumber />}
        <StatsMarquee />
        <About />
        <Timeline />
        <Ventures />
        <VibeLab />
        <Mindset />
        <Skills />
        <Certifications />
        <Beyond />
        <Contact />
      </main>
      <ProjectSheet />
      <RecruiterOverlay />
      <Curtain />
      <EasterEggs />
      <Cursor />
    </LazyMotion>
  );
}
