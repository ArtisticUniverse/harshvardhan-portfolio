"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { claudeBuilds, links, ogBuilds, projects, sections, terminal, ventures } from "@/data/content";
import { openProject } from "@/components/global/ProjectSheet";
import { playSound } from "@/lib/sound";
import { scrollToTarget } from "@/lib/lenis";
import { celebrate } from "@/components/global/EasterEggs";
import { openRecruiter, toggleTheme } from "@/components/global/Header";

type Line = { id: number; text: string; kind: "in" | "out" | "accent" | "link"; href?: string };

const SUGGESTIONS = ["help", "whoami", "projects", "skills", "hire-harsh", "sudo coffee"];

let uid = 0;

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const booted = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  const push = useCallback((text: string, kind: Line["kind"] = "out", href?: string) => {
    setLines((l) => [...l.slice(-160), { id: uid++, text, kind, href }]);
  }, []);

  const print = useCallback(
    async (out: (string | Omit<Line, "id">)[], delay = 38) => {
      for (const o of out) {
        if (typeof o === "string") push(o);
        else push(o.text, o.kind, o.href);
        playSound("type");
        await new Promise((r) => setTimeout(r, delay));
      }
    },
    [push],
  );

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines]);

  // Boot once when the terminal first scrolls into view.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !booted.current) {
        booted.current = true;
        void print(terminal.boot.map((t) => ({ text: t, kind: "out" as const })), 180);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [print]);

  const run = async (raw: string) => {
    const cmd = raw.trim().replace(/\s+/g, " ");
    push(`${terminal.prompt} ${cmd}`, "in");
    if (!cmd) return;
    history.current.unshift(cmd);
    cursor.current = -1;
    const key = cmd.toLowerCase();
    setBusy(true);

    switch (key) {
      case "clear":
        setLines([]);
        break;
      case "cat99.92":
      case "cat 99.92":
        await print(terminal.commands["cat 99.92"]);
        break;
      case "projects":
      case "ls projects": {
        await print([{ text: "── built with claude ─────────────", kind: "accent" }]);
        await print(claudeBuilds.map((b, i) => `${String(i + 1).padStart(2, "0")}  ${b.title.padEnd(28, " ")} ${b.stack}`), 45);
        await print([{ text: "── og builds (pre-LLM) ───────────", kind: "accent" }]);
        await print(ogBuilds.map((b) => `${b.year}  ${b.name.padEnd(28, " ")} ${b.metrics[0].value} ${b.metrics[0].label}`));
        await print([{ text: "── ventures ──────────────────────", kind: "accent" }]);
        await print(ventures.map((b) => `${b.year}  ${b.name.padEnd(28, " ")} ${b.metrics[0].value} ${b.metrics[0].label}`));
        await print(["", `open a case study: open <${projects.map((p) => p.id).join(" | ")}>`]);
        break;
      }
      case "hire-harsh":
      case "hire harsh":
      case "hire":
        await print(terminal.commands["hire-harsh"], 260);
        void celebrate();
        break;
      case "contact":
        await print([
          { text: `email    → ${links.email}`, kind: "link", href: `mailto:${links.email}` },
          { text: `linkedin → ${links.linkedin.replace("https://", "")}`, kind: "link", href: links.linkedin },
          { text: `iimu     → ${links.eduEmail}`, kind: "link", href: `mailto:${links.eduEmail}` },
          { text: `phone    → ${links.phone}`, kind: "link", href: links.tel },
          { text: `whatsapp → wa.me/${links.tel.replace("tel:+", "")}`, kind: "link", href: links.whatsapp },
          { text: `cv       → ${links.cv}`, kind: "link", href: links.cv },
        ]);
        break;
      case "recruiter":
        await print(["collapsing the experience into one printable page…"]);
        openRecruiter();
        break;
      case "ls":
        await print(sections.map((s) => `${s.n}  ${s.id}/`));
        break;
      case "theme":
        toggleTheme();
        await print(["theme toggled."]);
        break;
      case "date":
        await print([new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"]);
        break;
      case "sudo rm -rf /":
      case "rm -rf /":
        await print(["nice try. this portfolio is load-bearing."]);
        break;
      case "chess":
        await print(["1. e4 — your move.", "(challenge Harsh to a real game: `contact`)"]);
        break;
      case "exit":
        await print(["there is no exit. only the contact section."]);
        scrollToTarget("contact");
        break;
      default:
        if (terminal.commands[key]) {
          await print(terminal.commands[key], key === "sudo coffee" ? 420 : 38);
        } else if (key.startsWith("goto ")) {
          const id = key.slice(5);
          if (sections.some((s) => s.id === id)) {
            await print([`navigating to ${id}…`]);
            scrollToTarget(id);
          } else await print([`goto: no such section: ${id}`]);
        } else if (key.startsWith("open ")) {
          const id = key.slice(5).trim();
          const proj = projects.find((p) => p.id === id || p.name.toLowerCase() === id);
          if (proj) {
            await print([`opening ${proj.name} — features & how it works…`]);
            openProject(proj.id);
          } else await print([`open: no such project: ${id}. try \`projects\``]);
        } else if (key.startsWith("echo ")) {
          await print([cmd.slice(5)]);
        } else {
          await print([`command not found: ${cmd}. try \`help\``]);
        }
    }
    setBusy(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (busy) return;
      const v = value;
      setValue("");
      void run(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor.current + 1, history.current.length - 1);
      if (next >= 0) {
        cursor.current = next;
        setValue(history.current[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor.current - 1;
      cursor.current = Math.max(-1, next);
      setValue(next >= 0 ? history.current[next] : "");
    } else if (e.key === "Tab") {
      const match = [...Object.keys(terminal.commands), "projects", "clear", "contact", "recruiter"].find((c) => c.startsWith(value.toLowerCase()));
      if (match && value) {
        e.preventDefault();
        setValue(match);
      }
    } else if (e.key.length === 1) {
      playSound("type");
    }
  };

  return (
    <div ref={root} className="overflow-hidden rounded-md border border-ink/15 bg-[#070707] text-[#F2F0EA] shadow-[0_40px_120px_-40px_rgba(235,185,74,0.25)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#EBB94A]" />
        </div>
        <span className="mono-label text-white/50">harsh@lab — zsh — 80×24</span>
        <span className="mono-label text-white/30">v26.2</span>
      </div>

      <div
        ref={body}
        data-lenis-prevent
        className="h-[340px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-[1.65] md:h-[380px] md:text-sm"
        onClick={() => input.current?.focus({ preventScroll: true })}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {lines.map((l) => (
          <div
            key={l.id}
            className={
              l.kind === "in" ? "text-white" : l.kind === "accent" ? "text-[#EBB94A]" : "whitespace-pre-wrap text-white/70"
            }
          >
            {l.kind === "in" ? (
              <>
                <span className="text-[#EBB94A]">{terminal.prompt}</span>
                {l.text.slice(terminal.prompt.length)}
              </>
            ) : l.href ? (
              <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="underline decoration-[#EBB94A]/50 underline-offset-4 hover:text-[#EBB94A]">
                {l.text}
              </a>
            ) : (
              l.text
            )}
          </div>
        ))}
        <label className="flex items-center gap-2">
          <span className="shrink-0 text-[#EBB94A]">{terminal.prompt}</span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="w-full min-w-0 bg-transparent text-white caret-[#EBB94A] outline-none"
            placeholder={lines.length < 3 ? "type help and press enter" : ""}
            data-cursor="TYPE"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={busy}
            onClick={() => void run(s)}
            className="mono-label rounded-full border border-white/15 px-3 py-1.5 text-white/70 transition-colors hover:border-[#EBB94A] hover:text-[#EBB94A] disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
