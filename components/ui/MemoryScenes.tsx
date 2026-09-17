import type { CSSProperties, ReactNode } from "react";

/**
 * Illustrated, animated "photos" for the Recollections polaroids.
 * Each scene is layered: layers shift with the pointer (via --px / --py set on
 * the photo) and loop small ambient animations so the archive feels alive.
 */

const GOLD = "#EBB94A";
const WARM = "#ffcf8a";
const PAPER = "#F2F0EA";

/** Deterministic pseudo-random in [0, 1) so server and client render the same. */
const rand = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const n = (v: number) => Number(v.toFixed(2));

function Layer({ depth, children }: { depth: number; children: ReactNode }) {
  const style: CSSProperties = {
    transform: `translate(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${n(depth * 0.6)}px))`,
    transition: "transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1)",
  };
  return <g style={style}>{children}</g>;
}

const anim = (name: string, dur: number, delay = 0, extra = ""): CSSProperties => ({
  animation: `${name} ${n(dur)}s ${extra || "ease-in-out"} ${n(delay)}s infinite`,
  transformBox: "fill-box",
  transformOrigin: "center",
});

function Frame({ id, children, sky }: { id: string; children: ReactNode; sky: [string, string, string?] }) {
  return (
    <svg viewBox="0 0 400 430" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset={sky[2] ? "0.55" : "1"} stopColor={sky[1]} />
          {sky[2] && <stop offset="1" stopColor={sky[2]} />}
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={GOLD} stopOpacity="0.55" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={WARM} stopOpacity="0.55" />
          <stop offset="1" stopColor={WARM} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="430" fill={`url(#${id}-sky)`} />
      {children}
    </svg>
  );
}

/* ── 01 · Origin — Mumbai at night, the Sea Link, code in the air ─────────── */

function Origin() {
  const buildings = Array.from({ length: 22 }, (_, i) => ({
    x: i * 19 - 6,
    w: 14 + rand(i, 2) * 10,
    h: 60 + rand(i, 3) * 120 + (i > 7 && i < 13 ? 50 : 0),
  }));
  return (
    <Frame id="origin" sky={["#070914", "#1a1432", "#3a2233"]}>
      <Layer depth={-4}>
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={n(rand(i, 7) * 400)} cy={n(rand(i, 8) * 170)} r={n(0.6 + rand(i, 9))} fill={PAPER} style={anim("twinkle", 2 + rand(i, 4) * 3, rand(i, 5) * 3)} />
        ))}
        <circle cx="318" cy="78" r="46" fill="url(#origin-glow)" />
        <circle cx="318" cy="78" r="18" fill={WARM} opacity="0.95" />
      </Layer>

      <Layer depth={5}>
        {buildings.map((b, i) => (
          <g key={i}>
            <rect x={n(b.x)} y={n(300 - b.h)} width={n(b.w)} height={n(b.h + 10)} fill="#15132a" />
            {Array.from({ length: Math.floor(b.h / 16) }, (_, k) =>
              rand(i * 31 + k, 11) > 0.55 ? (
                <rect
                  key={k}
                  x={n(b.x + 3 + (k % 2) * 6)}
                  y={n(300 - b.h + 8 + k * 14)}
                  width="3"
                  height="4"
                  fill={GOLD}
                  style={anim("twinkle", 3 + rand(k, i) * 4, rand(i, k) * 4)}
                />
              ) : null,
            )}
          </g>
        ))}
      </Layer>

      <Layer depth={10}>
        {/* Bandra–Worli Sea Link */}
        <path d="M-10 318 Q 200 300 410 318" stroke="#2a2440" strokeWidth="6" fill="none" />
        {[120, 260].map((x) => (
          <g key={x}>
            <path d={`M${x} 312 L${x - 6} 205 L${x + 6} 205 Z`} fill="#241f3a" />
            {Array.from({ length: 9 }, (_, k) => (
              <g key={k}>
                <line x1={x} y1={210 + k * 3} x2={x - 18 - k * 11} y2={314} stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.7" />
                <line x1={x} y1={210 + k * 3} x2={x + 18 + k * 11} y2={314} stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.7" />
              </g>
            ))}
          </g>
        ))}
        {/* Car lights crossing the bridge */}
        <circle cx="0" cy="312" r="1.8" fill={WARM} style={anim("drive", 7, 0, "linear")} />
        <circle cx="0" cy="315" r="1.8" fill="#ff7a59" style={anim("drive-back", 9, 2, "linear")} />
      </Layer>

      <Layer depth={14}>
        <rect y="318" width="400" height="112" fill="#070a14" />
        <rect x="300" y="322" width="36" height="90" fill={WARM} opacity="0.12" style={anim("shimmer", 3)} />
        {Array.from({ length: 7 }, (_, k) => (
          <path
            key={k}
            d={`M0 ${332 + k * 12} q 25 -3 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0`}
            stroke={PAPER}
            strokeOpacity={n(0.1 - k * 0.008)}
            fill="none"
            style={anim("wave-x", 6 + k, 0, "linear")}
          />
        ))}
      </Layer>

      <Layer depth={20}>
        {["</>", "{ }", "01", "if", "=>", "AI"].map((t, k) => (
          <text
            key={t}
            x={n(40 + k * 62)}
            y={n(250 + rand(k, 3) * 40)}
            fill={GOLD}
            fontFamily="monospace"
            fontSize="13"
            style={anim("float-up", 6 + rand(k, 6) * 3, k * 1.1, "ease-out")}
          >
            {t}
          </text>
        ))}
      </Layer>
    </Frame>
  );
}

/* ── 02 · Campus — stage lights, a crowd, a microphone ────────────────────── */

function Campus() {
  return (
    <Frame id="campus" sky={["#140b0a", "#2a1712"]}>
      <Layer depth={-3}>
        <rect x="70" y="60" width="260" height="46" rx="4" fill="#3b1e17" stroke={GOLD} strokeOpacity="0.5" />
        <text x="200" y="90" textAnchor="middle" fill={GOLD} fontFamily="monospace" fontSize="17" letterSpacing="4">
          MULTICON-W
        </text>
        {[40, 360].map((x, k) => (
          <polygon key={x} points={`${x},0 ${x - 70},330 ${x + 70},330`} fill="url(#campus-cone)" style={{ ...anim(k ? "sweep-r" : "sweep-l", 5), transformOrigin: "top center" }} />
        ))}
      </Layer>

      <Layer depth={4}>
        <polygon points="30,250 370,250 400,290 0,290" fill="#4a2a1d" />
        <rect y="290" width="400" height="10" fill="#2e1811" />
        {/* Speaker at the mic */}
        <g style={anim("sway", 4)}>
          <circle cx="200" cy="178" r="15" fill="#120a08" />
          <path d="M176 250 Q 178 200 200 196 Q 222 200 224 250 Z" fill="#120a08" />
        </g>
        <line x1="222" y1="250" x2="222" y2="196" stroke="#8a7a6a" strokeWidth="2" />
        <rect x="217" y="186" width="10" height="14" rx="4" fill={GOLD} />
        <circle cx="200" cy="170" r="70" fill="url(#campus-glow)" opacity="0.5" />
      </Layer>

      <Layer depth={12}>
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 11 - row }, (_, c) => {
            const x = 18 + c * 38 + row * 19;
            const y = 330 + row * 34;
            return (
              <g key={`${row}-${c}`} style={anim("bob", 1.4 + rand(c, row) * 1.2, rand(row, c) * 1.5)}>
                <circle cx={x} cy={y} r={11 + row} fill="#0b0605" />
                <path d={`M${x - 20} ${y + 40} Q ${x - 18} ${y + 12} ${x} ${y + 12} Q ${x + 18} ${y + 12} ${x + 20} ${y + 40} Z`} fill="#0b0605" />
                {rand(c * 5, row) > 0.8 && <rect x={x + 8} y={y - 22} width="7" height="11" rx="1.5" fill={PAPER} opacity="0.85" />}
              </g>
            );
          }),
        )}
      </Layer>

      <Layer depth={18}>
        {Array.from({ length: 18 }, (_, k) => (
          <rect
            key={k}
            x={n(rand(k, 21) * 400)}
            y="-10"
            width="4"
            height="7"
            fill={k % 3 ? GOLD : PAPER}
            style={anim("confetti", 4 + rand(k, 22) * 3, rand(k, 23) * 5, "linear")}
          />
        ))}
      </Layer>
    </Frame>
  );
}

/* ── 03 · Capital — 150 startups through the funnel, a chart, a memo ──────── */

function Capital() {
  return (
    <Frame id="capital" sky={["#0c0c0b", "#1a1813"]}>
      <Layer depth={-3}>
        <rect x="28" y="46" width="230" height="150" rx="6" fill="#141310" stroke={PAPER} strokeOpacity="0.15" />
        {Array.from({ length: 5 }, (_, k) => (
          <line key={k} x1="40" x2="246" y1={70 + k * 26} y2={70 + k * 26} stroke={PAPER} strokeOpacity="0.06" />
        ))}
        {Array.from({ length: 9 }, (_, k) => (
          <rect key={k} x={48 + k * 22} y={n(180 - (30 + rand(k, 31) * 60 + k * 6))} width="12" height={n(30 + rand(k, 31) * 60 + k * 6)} fill={k > 6 ? GOLD : "#3a372e"} style={{ ...anim("grow", 3.2, k * 0.12), transformOrigin: "bottom" }} />
        ))}
        <path d="M44 160 C 90 150 110 120 150 118 S 210 80 244 62" stroke={GOLD} strokeWidth="2" fill="none" pathLength={1} strokeDasharray="1" style={anim("draw", 5, 0, "ease-in-out")} />
        <text x="40" y="64" fill={PAPER} fillOpacity="0.5" fontFamily="monospace" fontSize="9">PORTFOLIO · IRR</text>
      </Layer>

      <Layer depth={8}>
        {/* Memo stack */}
        <g transform="rotate(8 330 140)">
          {[0, 1, 2].map((k) => (
            <rect key={k} x={282 - k * 3} y={80 + k * 4} width="90" height="116" fill={PAPER} opacity={1 - k * 0.25} />
          ))}
          <text x="292" y="104" fill="#0a0a0a" fontFamily="monospace" fontSize="9">MEMO #057</text>
          {Array.from({ length: 6 }, (_, k) => (
            <rect key={k} x="292" y={114 + k * 11} width={n(40 + rand(k, 41) * 30)} height="3" fill="#0a0a0a" opacity="0.35" />
          ))}
          <rect x="292" y="182" width="52" height="10" fill={GOLD} style={anim("stamp", 4, 1.5)} />
        </g>
      </Layer>

      <Layer depth={14}>
        {/* The funnel: 150 in, ~10% out */}
        <path d="M110 225 L290 225 L218 318 L218 360 L182 360 L182 318 Z" fill="none" stroke={PAPER} strokeOpacity="0.35" strokeWidth="1.5" />
        {Array.from({ length: 26 }, (_, k) => {
          const pass = k % 9 === 0;
          return (
            <circle
              key={k}
              cx={pass ? 200 : n(125 + rand(k, 51) * 150)}
              cy="200"
              r="3.2"
              fill={pass ? GOLD : PAPER}
              opacity={pass ? 1 : 0.55}
              style={anim(pass ? "funnel-pass" : "funnel-drop", 3 + rand(k, 52) * 1.5, rand(k, 53) * 4, "cubic-bezier(.5,0,.8,.6)")}
            />
          );
        })}
        <text x="200" y="215" textAnchor="middle" fill={PAPER} fillOpacity="0.6" fontFamily="monospace" fontSize="9">150+ STARTUPS</text>
      </Layer>
    </Frame>
  );
}

/* ── 04 · Scale — Maharashtra, a Nashik hub, kits moving to 20,000 schools ─ */

function Scale() {
  const hub = { x: 120, y: 150 };
  const cities = [
    { x: 70, y: 230 },
    { x: 150, y: 270 },
    { x: 250, y: 190 },
    { x: 320, y: 140 },
    { x: 230, y: 300 },
  ];
  return (
    <Frame id="scale" sky={["#07120f", "#0f1f1a"]}>
      <Layer depth={-2}>
        {Array.from({ length: 12 }, (_, k) => (
          <line key={k} x1="0" x2="400" y1={k * 36} y2={k * 36} stroke={PAPER} strokeOpacity="0.04" />
        ))}
      </Layer>
      <Layer depth={6}>
        {/* Stylised Maharashtra outline */}
        <path
          d="M40 150 L80 110 L140 104 L190 80 L250 92 L300 76 L360 100 L372 140 L340 172 L300 190 L286 240 L250 262 L240 320 L200 340 L150 318 L110 300 L70 262 L46 214 Z"
          fill="#12302a"
          stroke={GOLD}
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        {Array.from({ length: 70 }, (_, k) => {
          const x = 70 + rand(k, 61) * 270;
          const y = 110 + rand(k, 62) * 200;
          return <circle key={k} cx={n(x)} cy={n(y)} r="1.6" fill={PAPER} style={anim("twinkle", 1.5 + rand(k, 63) * 2.5, rand(k, 64) * 3)} />;
        })}
      </Layer>
      <Layer depth={12}>
        {cities.map((c, k) => (
          <g key={k}>
            <path id={`route-${k}`} d={`M${hub.x} ${hub.y} Q ${(hub.x + c.x) / 2} ${Math.min(hub.y, c.y) - 30} ${c.x} ${c.y}`} fill="none" stroke={GOLD} strokeOpacity="0.6" strokeDasharray="4 5" style={anim("dash", 2, 0, "linear")} />
            <circle cx={c.x} cy={c.y} r="4" fill={GOLD} />
            <rect x="-4" y="-4" width="8" height="8" fill={WARM}>
              <animateMotion dur={`${3 + k * 0.6}s`} repeatCount="indefinite" begin={`${k * 0.5}s`}>
                <mpath href={`#route-${k}`} />
              </animateMotion>
            </rect>
          </g>
        ))}
        <circle cx={hub.x} cy={hub.y} r="7" fill={GOLD} />
        <circle cx={hub.x} cy={hub.y} r="7" fill="none" stroke={GOLD} style={anim("ping", 2.2, 0, "ease-out")} />
        <text x={hub.x + 12} y={hub.y - 10} fill={PAPER} fontFamily="monospace" fontSize="10">NASHIK HUB</text>
        <text x="300" y="360" textAnchor="end" fill={PAPER} fillOpacity="0.5" fontFamily="monospace" fontSize="9">700+ KITS · 120 TRAINERS</text>
      </Layer>
    </Frame>
  );
}

/* ── 05 · Now — Udaipur: sunset over Lake Pichola and the City Palace ─────── */

function Now() {
  const palace = (
    <>
      <rect x="60" y="232" width="280" height="58" fill="#1a0f1c" />
      <rect x="120" y="206" width="160" height="30" fill="#1a0f1c" />
      {[78, 110, 150, 200, 250, 290, 322].map((x, k) => (
        <g key={x}>
          <rect x={x - 9} y={k % 3 === 1 ? 190 : 214} width="18" height="20" fill="#1a0f1c" />
          <path d={`M${x - 11} ${k % 3 === 1 ? 192 : 216} Q ${x} ${k % 3 === 1 ? 172 : 198} ${x + 11} ${k % 3 === 1 ? 192 : 216} Z`} fill="#1a0f1c" />
        </g>
      ))}
      {Array.from({ length: 12 }, (_, k) => (
        <path key={k} d={`M${74 + k * 22} 286 L${74 + k * 22} 262 Q ${81 + k * 22} 252 ${88 + k * 22} 262 L${88 + k * 22} 286 Z`} fill={WARM} opacity={rand(k, 71) > 0.5 ? 0.55 : 0.2} style={anim("twinkle", 3 + rand(k, 72) * 3, rand(k, 73) * 3)} />
      ))}
    </>
  );
  return (
    <Frame id="now" sky={["#2a1238", "#d9714a", "#f3b35c"]}>
      <Layer depth={-5}>
        <circle cx="210" cy="200" r="120" fill="url(#now-glow)" />
        <circle cx="210" cy="206" r="44" fill="#ffd98f" style={anim("sun", 8)} />
        {[0, 1, 2].map((k) => (
          <path key={k} d="M0 0 q 6 -6 12 0 q 6 -6 12 0" stroke="#2a1238" strokeWidth="1.8" fill="none" transform={`translate(${60 + k * 30} ${90 + k * 14})`} style={anim("fly", 14 + k * 2, k * 3, "linear")} />
        ))}
      </Layer>
      <Layer depth={3}>
        <path d="M0 250 L50 196 L110 228 L170 184 L240 226 L300 180 L360 214 L400 196 L400 290 L0 290 Z" fill="#6b3448" opacity="0.8" />
      </Layer>
      <Layer depth={8}>{palace}</Layer>
      <Layer depth={13}>
        <rect y="290" width="400" height="140" fill="#1c1030" />
        <g transform="translate(0 580) scale(1 -1)" opacity="0.28" style={anim("shimmer", 4)}>
          {palace}
        </g>
        <rect x="186" y="292" width="48" height="120" fill="#ffd98f" opacity="0.18" style={anim("shimmer", 2.5)} />
        {Array.from({ length: 8 }, (_, k) => (
          <line key={k} x1={n(rand(k, 81) * 300)} x2={n(rand(k, 81) * 300 + 60 + rand(k, 82) * 60)} y1={300 + k * 14} y2={300 + k * 14} stroke={PAPER} strokeOpacity="0.12" style={anim("wave-x", 5 + k, 0, "linear")} />
        ))}
        {/* A boat crossing the lake */}
        <g style={anim("sail", 18, 0, "linear")}>
          <path d="M0 330 L34 330 L28 338 L6 338 Z" fill="#0f0818" />
          <line x1="17" y1="330" x2="17" y2="312" stroke="#0f0818" strokeWidth="1.5" />
          <path d="M18 313 L30 328 L18 328 Z" fill={WARM} opacity="0.8" />
        </g>
      </Layer>
    </Frame>
  );
}

const SCENES: Record<string, () => JSX.Element> = {
  origin: Origin,
  campus: Campus,
  eagle: Capital,
  sapio: Scale,
  iimu: Now,
};

export default function MemoryScene({ id }: { id: string }) {
  const Scene = SCENES[id];
  return Scene ? <Scene /> : null;
}
