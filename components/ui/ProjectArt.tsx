import type { Project } from "@/data/content";

const GOLD = "#EBB94A";

/** Generative stand-in artwork, used until a real image is set in content.ts. */
export default function ProjectArt({ kind }: { kind: NonNullable<Project["art"]> }) {
  switch (kind) {
    case "data":
      return (
        <div className="absolute inset-0 bg-[#0d0c09]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(242,240,234,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(242,240,234,0.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute inset-x-[8%] bottom-[14%] flex h-[52%] items-end gap-[1.2%]">
            {Array.from({ length: 28 }, (_, i) => (
              <span
                key={i}
                className="flex-1 origin-bottom rounded-t-sm"
                style={{
                  height: `${(18 + ((Math.sin(i * 1.7) + 1) / 2) * 62 + (i / 28) * 20).toFixed(2)}%`,
                  background: i > 21 ? GOLD : "rgba(242,240,234,0.18)",
                  animation: `rise 2.6s cubic-bezier(.7,0,.2,1) ${i * 0.04}s infinite alternate`,
                }}
              />
            ))}
          </div>
          <svg className="absolute inset-x-[8%] top-[18%] h-[30%] w-[84%]" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
            <path d="M0,26 C10,24 16,18 26,19 C36,20 40,12 52,11 C64,10 70,14 80,6 C88,1 94,3 100,1" fill="none" stroke={GOLD} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="mono-label absolute left-[8%] top-[8%] flex gap-6 text-[#F2F0EA]/60">
            <span>● RENT</span>
            <span>● ISSUES</span>
            <span style={{ color: GOLD }}>● LIVE</span>
          </div>
        </div>
      );
    case "rings":
      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0d0b08]">
          <div className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: 7 }, (_, r) => (
              <div
                key={r}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F2F0EA]/10"
                style={{ width: `${(r + 1) * 13}%`, height: `${(r + 1) * 13}%` }}
              >
                {Array.from({ length: 6 + r * 3 }, (_, k) => {
                  const a = (k / (6 + r * 3)) * Math.PI * 2 + r;
                  return (
                    <span
                      key={k}
                      className="absolute h-1.5 w-1.5 rounded-full"
                      style={{
                        left: `${(50 + Math.cos(a) * 50).toFixed(2)}%`,
                        top: `${(50 + Math.sin(a) * 50).toFixed(2)}%`,
                        background: (k + r) % 5 === 0 ? GOLD : "#ffe2b0",
                        boxShadow: "0 0 12px 2px rgba(235,185,74,0.45)",
                        animation: `twinkle ${1.6 + ((k * 7) % 10) / 6}s ease-in-out ${(k % 5) * 0.3}s infinite`,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#0d0b08_75%)]" />
        </div>
      );
    case "leaf":
      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0b0c08]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <path d="M20,130 C60,40 140,10 185,20 C170,70 110,135 20,130 Z" fill="rgba(242,240,234,0.06)" stroke="rgba(242,240,234,0.35)" strokeWidth="0.6" />
            <path d="M20,130 C80,90 130,50 185,20" fill="none" stroke="rgba(242,240,234,0.35)" strokeWidth="0.5" />
            {[
              [70, 88, 7],
              [110, 62, 5],
              [138, 48, 4],
              [92, 100, 3.5],
            ].map(([x, y, r], i) => (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={r * 1.4} ry={r} fill="rgba(235,185,74,0.35)" />
                <rect x={x - r * 2.6} y={y - r * 2.2} width={r * 5.2} height={r * 4.4} fill="none" stroke={GOLD} strokeWidth="0.5" strokeDasharray="2 1.5" />
              </g>
            ))}
          </svg>
          <span className="mono-label absolute bottom-4 left-4" style={{ color: GOLD }}>
            LESION DETECTED
          </span>
        </div>
      );
    case "face":
      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0b0b0b]">
          <div className="absolute inset-0 grid grid-cols-3 gap-3 p-6 opacity-90">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="relative flex items-center justify-center rounded-sm border border-[#F2F0EA]/10">
                <svg viewBox="0 0 40 48" className="h-3/5 opacity-40" aria-hidden>
                  <circle cx="20" cy="16" r="10" fill="#F2F0EA" />
                  <path d="M2,48 C4,32 36,32 38,48 Z" fill="#F2F0EA" />
                </svg>
                <span
                  className="absolute inset-[18%] border"
                  style={{ borderColor: i === 1 || i === 4 ? GOLD : "rgba(242,240,234,0.25)" }}
                />
                <span className="mono-label absolute bottom-1 left-1.5 text-[9px]" style={{ color: i === 1 || i === 4 ? GOLD : "rgba(242,240,234,0.4)" }}>
                  {i === 1 || i === 4 ? "✔ PRESENT" : "SCANNING"}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case "signal":
      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0a0b0b]">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: `${(i + 1) * 22}%`,
                aspectRatio: "1",
                borderColor: i < 2 ? GOLD : `rgba(242,240,234,${0.3 - i * 0.04})`,
                animation: `twinkle ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
          {[
            [22, 30],
            [70, 22],
            [82, 55],
            [30, 58],
          ].map(([x, y], i) => (
            <span key={i} className="mono-label absolute text-[#F2F0EA]/70" style={{ left: `${x}%`, top: `${y}%` }}>
              ● {["TV", "PRINTER", "SPEAKER", "LAPTOP"][i]}
            </span>
          ))}
        </div>
      );
    case "wave":
    default:
      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
          <div className="absolute inset-y-0 left-0 flex w-[200%] items-center" style={{ animation: "wave 9s linear infinite" }}>
            {[0, 1].map((k) => (
              <svg key={k} viewBox="0 0 400 100" className="h-1/2 w-1/2" preserveAspectRatio="none" aria-hidden>
                <path
                  d="M0,50 C20,48 30,52 50,50 S80,20 100,50 S130,55 150,50 S170,10 190,50 S220,52 250,50 S280,70 300,50 S330,48 350,50 S380,40 400,50"
                  fill="none"
                  stroke="rgba(242,240,234,0.5)"
                  strokeWidth="1"
                />
              </svg>
            ))}
          </div>
          <span className="absolute left-[46%] top-[20%] h-[60%] w-px" style={{ background: GOLD }} />
          <span className="mono-label absolute left-[48%] top-[20%]" style={{ color: GOLD }}>
            &gt; 3σ → LIKELY CAUSE
          </span>
        </div>
      );
  }
}
