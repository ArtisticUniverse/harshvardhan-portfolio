const GOLD = "#EBB94A";

/**
 * Ambient diagram of the screen behind the memo tool: a pitch enters, gets
 * parsed, passes (or fails) five criteria, and only then reaches a score.
 */
export default function ScreenPipeline() {
  const gates = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 900 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <marker id="pipe-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="currentColor" opacity="0.6" />
        </marker>
      </defs>

      {/* Rail */}
      <line x1="70" y1="110" x2="830" y2="110" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="5 6" markerEnd="url(#pipe-arrow)" />

      {/* Stage 1 — the pitch */}
      <g>
        <rect x="18" y="86" width="104" height="48" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <text x="70" y="108" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="11" opacity="0.75">PITCH</text>
        <text x="70" y="124" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="9" opacity="0.45">one line</text>
      </g>

      {/* Stage 2 — parse */}
      <g>
        <rect x="170" y="86" width="104" height="48" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <text x="222" y="108" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="11" opacity="0.75">PARSE</text>
        <text x="222" y="124" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="9" opacity="0.45">sector · signals</text>
      </g>

      {/* Stage 3 — five gates, most pitches drop here */}
      <g>
        <text x="470" y="52" textAnchor="middle" fill={GOLD} fontFamily="monospace" fontSize="10">5 SCREENING CRITERIA</text>
        {gates.map((g) => {
          const x = 330 + g * 58;
          const fails = g === 1 || g === 3;
          return (
            <g key={g}>
              <rect x={x} y="88" width="44" height="44" rx="5" fill="none" stroke={fails ? "currentColor" : GOLD} strokeOpacity={fails ? 0.3 : 0.85} />
              <text x={x + 22} y={116} textAnchor="middle" fill={fails ? "currentColor" : GOLD} fontFamily="monospace" fontSize="14" opacity={fails ? 0.35 : 1}>
                {fails ? "✕" : "✓"}
              </text>
              {fails && (
                <circle cx={x + 22} cy="150" r="3" fill="currentColor" opacity="0.5" style={{ animation: `pipe-drop 3.4s ease-in ${g * 0.5}s infinite` }} />
              )}
            </g>
          );
        })}
        <text x="470" y="186" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="9" opacity="0.4">
          fewer than 3 met → rejected, never scored
        </text>
      </g>

      {/* Stage 4 — score */}
      <g>
        <rect x="628" y="86" width="104" height="48" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <text x="680" y="108" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="11" opacity="0.75">SCORE</text>
        <text x="680" y="124" textAnchor="middle" fill="currentColor" fontFamily="monospace" fontSize="9" opacity="0.45">5 dimensions</text>
      </g>

      {/* Stage 5 — verdict */}
      <g>
        <rect x="778" y="86" width="104" height="48" rx="6" fill="none" stroke={GOLD} strokeOpacity="0.8" />
        <text x="830" y="108" textAnchor="middle" fill={GOLD} fontFamily="monospace" fontSize="11">VERDICT</text>
        <text x="830" y="124" textAnchor="middle" fill={GOLD} fontFamily="monospace" fontSize="9" opacity="0.6">meet · watch · pass</text>
      </g>

      {/* The pitch travelling down the rail */}
      <circle cx="0" cy="110" r="5" fill={GOLD} style={{ animation: "pipe-run 6s cubic-bezier(.6,0,.4,1) infinite" }} />
    </svg>
  );
}
