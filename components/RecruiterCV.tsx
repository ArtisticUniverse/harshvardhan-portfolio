"use client";

import { certifications, education, links, projects, site, skills, timeline } from "@/data/content";

const work = timeline.filter((t) => t.id === "eagle" || t.id === "sapio");
const campus = timeline.find((t) => t.id === "campus");

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-5 border-b-2 border-[#0A0A0A] pb-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#0A0A0A]">
      {children}
    </h2>
  );
}

/** Clean one-page CV built from the same content file. Prints to A4. */
export default function RecruiterCV({ onClose }: { onClose?: () => void }) {
  const cvProjects = projects.filter((p) => p.category !== "lab");
  const topSkills = skills.filter((s) => s.group !== "mind").map((s) => s.label);

  return (
    <div className="min-h-full bg-[#e8e6df] px-3 py-6 text-[#0A0A0A] md:py-10">
      <div className="no-print mx-auto mb-5 flex max-w-[820px] flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/60">Recruiter mode · one page</span>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => window.print()} className="rounded-full bg-[#0A0A0A] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#EBB94A]">
            Print / Save PDF
          </button>
          <a href={links.cv} download className="rounded-full border border-black/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em]">
            Original PDF
          </a>
          {onClose && (
            <button onClick={onClose} className="rounded-full border border-black/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.08em]">
              ← Back to experience
            </button>
          )}
        </div>
      </div>

      <article className="cv-sheet mx-auto max-w-[820px] bg-white px-7 py-8 text-[12.5px] leading-[1.4] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] md:px-12 md:py-10">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-[#EBB94A] pb-4">
          <div>
            <h1 className="text-[34px] font-semibold leading-none tracking-[-0.03em]">{site.name}</h1>
            <p className="mt-2 text-[13px] font-medium">{site.tagline}</p>
            <p className="mt-0.5 text-[12px] text-black/60">{site.currently}</p>
          </div>
          <div className="text-right font-mono text-[10.5px] leading-[1.6]">
            <div>{links.email}</div>
            <div>{links.eduEmail}</div>
            <div>{links.phone}</div>
            <div>{links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>
            <div>{links.github.replace(/^https?:\/\//, "")}</div>
            <div>
              From {site.hometown} · {site.location.city}, India
            </div>
          </div>
        </header>

        <H>Education</H>
        <table className="w-full border-collapse">
          <tbody>
            {education.map((e) => (
              <tr key={e.degree} className="align-top">
                <td className="py-0.5 pr-3 font-semibold">{e.degree}</td>
                <td className="py-0.5 pr-3">{e.school}</td>
                <td className="whitespace-nowrap py-0.5 pr-3 text-right">{e.score}</td>
                <td className="whitespace-nowrap py-0.5 text-right text-black/60">{e.year}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <H>Work experience · 32 months full-time</H>
        {work.map((w) => (
          <section key={w.id} className="mb-2 break-inside-avoid">
            <div className="flex justify-between gap-3">
              <p>
                <span className="font-semibold">{w.org}</span> — {w.title}
              </p>
              <span className="whitespace-nowrap text-black/60">{w.period}</span>
            </div>
            <ul className="ml-4 list-disc">
              {w.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}

        <H>Ventures & projects</H>
        {cvProjects.map((p) => (
          <section key={p.id} className="mb-1.5 break-inside-avoid">
            <div className="flex justify-between gap-3">
              <p>
                <span className="font-semibold">{p.name}</span> — {p.kind}
              </p>
              <span className="whitespace-nowrap text-black/60">{p.year}</span>
            </div>
            <p className="text-black/80">
              {p.metrics.map((m) => `${m.value} ${m.label}`).join(" · ")} — {p.features.slice(0, 3).map((f) => f.title).join("; ")}.
            </p>
          </section>
        ))}

        {campus && (
          <>
            <H>Positions of responsibility</H>
            <ul className="ml-4 list-disc">
              {campus.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </>
        )}

        <H>Certifications</H>
        <p>
          {certifications.map((c, i) => (
            <span key={c.title}>
              <span className="font-medium">{c.title}</span> ({c.issuer}
              {c.status ? `, ${c.status.toLowerCase()}` : ""}){i < certifications.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>

        <H>Skills</H>
        <p>{topSkills.join(" · ")}</p>

        <H>Interests</H>
        <p>Chess · Swimming · Building apps with AI · Finance & markets · Case competitions</p>
      </article>
    </div>
  );
}
