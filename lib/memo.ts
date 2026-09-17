/**
 * A deterministic, rule-based "investment memo" for the Pitch-me toy.
 * It mirrors the checklist Harsh used screening startups: market, moat,
 * timing, business model and execution risk. It is a toy, not advice.
 */

export type Memo = {
  number: string;
  company: string;
  sector: string;
  market: string;
  scores: { label: string; value: number }[];
  overall: number;
  risks: string[];
  strengths: string[];
  verdict: "TAKE THE MEETING" | "WATCHLIST" | "PASS — FOR NOW";
};

type Sector = {
  name: string;
  keys: string[];
  market: string;
  base: number;
  risk: string;
};

const SECTORS: Sector[] = [
  { name: "AI / Applied AI", keys: ["ai", "gpt", "llm", "agent", "copilot", "ml", "automation"], market: "Large · fast-moving", base: 7.2, risk: "Thin moat if the model layer commoditises the feature" },
  { name: "Fintech", keys: ["fintech", "payment", "upi", "lend", "loan", "credit", "invest", "insurance", "bank", "wealth"], market: "Large · regulated", base: 6.8, risk: "RBI / SEBI compliance can stretch timelines" },
  { name: "B2B SaaS", keys: ["saas", "b2b", "crm", "erp", "dashboard", "workflow", "sme", "smb", "enterprise"], market: "Mid-large · sticky", base: 7.0, risk: "Long sales cycles for Indian SMBs; pricing power unproven" },
  { name: "Marketplace", keys: ["marketplace", "platform", "connect", "uber for", "airbnb for", "booking"], market: "Depends on liquidity", base: 6.2, risk: "Cold-start: both sides need to show up at once" },
  { name: "D2C / Consumer", keys: ["d2c", "brand", "fashion", "food", "snack", "beauty", "apparel", "coffee"], market: "Crowded · brand-led", base: 5.8, risk: "CAC inflation on Meta/Google eats contribution margin" },
  { name: "Edtech", keys: ["edtech", "student", "learn", "course", "school", "exam", "tutor", "cat", "upsc"], market: "Large · post-boom caution", base: 6.0, risk: "Retention cliff after the exam / course ends" },
  { name: "Healthtech", keys: ["health", "clinic", "doctor", "patient", "fitness", "mental", "pharma", "diagnos"], market: "Large · trust-gated", base: 6.6, risk: "Clinical validation and trust take time to earn" },
  { name: "Climate / Energy", keys: ["climate", "solar", "ev", "carbon", "energy", "battery", "waste", "recycl"], market: "Large · policy-tailwinds", base: 6.9, risk: "Capex-heavy; unit economics depend on subsidies" },
  { name: "Proptech", keys: ["property", "real estate", "rent", "housing", "society", "tenant", "broker"], market: "Large · fragmented", base: 6.7, risk: "Offline incumbents and slow digital adoption" },
  { name: "Mobility / Logistics", keys: ["logistic", "delivery", "fleet", "drone", "transport", "mobility", "supply chain", "quick commerce"], market: "Large · ops-heavy", base: 6.4, risk: "Operational burn scales faster than revenue" },
];

const BOOSTS: [string[], number, string][] = [
  [["subscription", "recurring", "saas"], 0.5, "Recurring revenue model"],
  [["india", "bharat", "tier 2", "tier-2", "tier 3", "vernacular"], 0.4, "Clear India-first wedge"],
  [["b2b", "enterprise", "sme", "smb"], 0.3, "Businesses pay for pain relief"],
  [["data", "analytics", "insight"], 0.3, "Data compounding over time"],
  [["community", "network"], 0.2, "Potential network effects"],
];

const PENALTIES: [string[], number, string][] = [
  [["crypto", "nft", "web3", "token"], -1.2, "Regulatory uncertainty in India"],
  [["uber for", "airbnb for", "tinder for"], -0.6, "“X for Y” framing: differentiation unclear"],
  [["social network", "social media app"], -0.8, "Winner-take-all attention market"],
  [["free", "ad-supported"], -0.4, "Monetisation path unclear"],
];

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
}

const clamp = (v: number, a = 1, b = 10) => Math.max(a, Math.min(b, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

export function buildMemo(pitch: string, memoNumber = 58): Memo {
  const text = ` ${pitch.toLowerCase()} `;
  const rand = seeded(hash(text.trim()));

  const sector =
    SECTORS.map((s) => ({ s, hits: s.keys.filter((k) => text.includes(k)).length }))
      .sort((a, b) => b.hits - a.hits)
      .find((x) => x.hits > 0)?.s ?? {
      name: "Generalist",
      keys: [],
      market: "Unclear · needs sizing",
      base: 5.6,
      risk: "Market size and buyer not yet defined",
    };

  const strengths: string[] = [];
  const risks: string[] = [sector.risk];
  let adj = 0;
  for (const [keys, delta, note] of BOOSTS) {
    if (keys.some((k) => text.includes(k))) {
      adj += delta;
      strengths.push(note);
    }
  }
  for (const [keys, delta, note] of PENALTIES) {
    if (keys.some((k) => text.includes(k))) {
      adj += delta;
      risks.push(note);
    }
  }

  const words = pitch.trim().split(/\s+/).length;
  if (words < 6) {
    adj -= 0.6;
    risks.push("Pitch too short to judge the wedge");
  } else if (words > 12) {
    adj += 0.2;
    strengths.push("Specific problem statement");
  }
  if (!strengths.length) strengths.push("Founder conviction (it's a start)");

  const jitter = () => (rand() - 0.5) * 1.6;
  const market = clamp(sector.base + 0.6 + jitter() + adj * 0.4);
  const moat = clamp(sector.base - 0.4 + jitter() + adj * 0.6);
  const timing = clamp(sector.base + jitter() + adj * 0.3);
  const model = clamp(sector.base - 0.2 + jitter() + adj * 0.8);
  const execution = clamp(10 - (sector.base - 1.5) + jitter() - adj * 0.2);

  const scores = [
    { label: "Market", value: round1(market) },
    { label: "Moat", value: round1(moat) },
    { label: "Timing", value: round1(timing) },
    { label: "Business model", value: round1(model) },
    { label: "Execution risk", value: round1(execution) },
  ];

  const overall = round1(clamp((market * 1.3 + moat + timing + model * 1.2 + (11 - execution) * 0.8) / 5.3));
  const verdict = overall >= 7 ? "TAKE THE MEETING" : overall >= 5.5 ? "WATCHLIST" : "PASS — FOR NOW";

  const company =
    pitch
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["startup", "platform", "that", "which", "with", "helps", "using", "for"].includes(w.toLowerCase()))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join("") || "Stealth Co.";

  return {
    number: `#${String(memoNumber).padStart(3, "0")}`,
    company,
    sector: sector.name,
    market: sector.market,
    scores,
    overall,
    risks: risks.slice(0, 3),
    strengths: strengths.slice(0, 3),
    verdict,
  };
}
