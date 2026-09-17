"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contact, links, sectionLabel, site } from "@/data/content";
import { scroll } from "@/lib/store";
import { scrollToTarget } from "@/lib/lenis";
import Magnetic from "@/components/ui/Magnetic";
import { useLocalTime } from "@/components/global/LocalTime";
import { openRecruiter } from "@/components/global/Header";

const BUTTONS = [
  { label: "Email", sub: "personal", href: `mailto:${links.email}`, cursor: "WRITE" },
  { label: "IIMU mail", sub: "education", href: `mailto:${links.eduEmail}`, cursor: "WRITE" },
  { label: "Call", sub: links.phone, href: links.tel, cursor: "CALL" },
  { label: "WhatsApp", sub: "message", href: links.whatsapp, cursor: "CHAT", external: true },
  { label: "LinkedIn", sub: "connect", href: links.linkedin, cursor: "OPEN", external: true },
  { label: "Download CV", sub: "PDF", href: links.cv, cursor: "SAVE", download: true },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const time = useLocalTime();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-stretch]", heading.current);
        gsap.from(lines, {
          yPercent: 100,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: heading.current, start: "top 85%", once: true },
        });
        const sy = gsap.quickTo(lines, "scaleY", { duration: 0.5, ease: "power3" });
        const sk = gsap.quickTo(lines, "skewX", { duration: 0.5, ease: "power3" });
        const tick = () => {
          const v = scroll.velocity;
          sy(1 + Math.min(Math.abs(v) * 0.018, 0.45));
          sk(gsap.utils.clamp(-12, 12, -v * 0.3));
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="relative overflow-hidden pb-8 pt-28 md:pt-40">
      <div className="gutter">
        <p className="mono-label text-muted">{sectionLabel("contact")}</p>
        <h2 ref={heading} className="mt-8 uppercase leading-[0.8] tracking-[-0.06em]" aria-label={contact.heading.join(" ")}>
          {contact.heading.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]" aria-hidden>
              <span
                data-stretch
                className={`block origin-bottom font-semibold ${i === 1 ? "text-accent-ink" : ""}`}
                style={{ fontSize: i === 0 ? "clamp(3.2rem,13.4vw,16rem)" : "clamp(3.2rem,15.2vw,18rem)" }}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <p className="max-w-[40ch] text-xl leading-snug text-ink/80 md:col-span-5">{contact.blurb}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-7">
            {BUTTONS.map((b) => (
              <Magnetic key={b.label} strength={0.45} className="block">
                <a
                  href={b.href}
                  {...(b.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  {...(b.download ? { download: "" } : {})}
                  data-cursor={b.cursor}
                  className="group flex aspect-square flex-col justify-between rounded-full border border-ink/20 p-6 transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-on-accent md:p-5"
                >
                  <span className="mono-label self-end opacity-60">↗</span>
                  <span className="text-center">
                    <span className="block text-lg font-semibold leading-none md:text-xl">{b.label}</span>
                    <span className="mono-label mt-1 block opacity-60">{b.sub}</span>
                  </span>
                  <span />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-6 border-t border-ink/10 pt-8 md:grid-cols-3">
          <div>
            <p className="mono-label text-muted">Local time · {site.location.city}</p>
            <p className="mt-2 font-mono text-3xl tabular-nums tracking-tight" suppressHydrationWarning>
              {time} <span className="text-base text-muted">IST</span>
            </p>
          </div>
          <div>
            <p className="mono-label text-muted">Currently</p>
            <p className="mt-2 text-lg leading-snug">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent align-middle" />
              {site.currently}
            </p>
          </div>
          <div>
            <p className="mono-label text-muted">Reach & based</p>
            <p className="mt-2 text-lg leading-snug">
              <a href={`mailto:${links.email}`} className="block break-all hover:text-accent-ink">{links.email}</a>
              <a href={`mailto:${links.eduEmail}`} className="block break-all hover:text-accent-ink">{links.eduEmail}</a>
              <a href={links.tel} className="block hover:text-accent-ink">{links.phone}</a>
              <span className="mt-2 block text-ink/70">From {site.hometown} · now in {site.location.city} ({site.location.lat}, {site.location.lon})</span>
            </p>
          </div>
        </div>
      </div>

      <footer className="gutter mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent">{site.monogram}</span>
          <span className="mono-label text-muted">
            © {new Date().getFullYear()} {site.name}
          </span>
        </div>
        <p className="mono-label text-muted">{site.credit}</p>
        <div className="mono-label flex gap-4">
          <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-accent-ink">
            GitHub
          </a>
          <button onClick={openRecruiter} className="hover:text-accent-ink">
            Recruiter mode
          </button>
          <button onClick={() => scrollToTarget(0)} className="hover:text-accent-ink">
            Back to top ↑
          </button>
        </div>
      </footer>
    </section>
  );
}
