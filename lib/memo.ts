/**
 * A deterministic, rule-based first-pass screen for the Pitch-me toy.
 *
 * It mirrors how Harsh screened 150+ startups: most pitches never reach a
 * memo. A pitch is first checked against five screening criteria — who it is
 * for, what breaks today, how it works, how it makes money, and which market.
 * Only pitches that clear the bar get scored; the rest come back rejected with
 * the reason, exactly like a real inbox. It is a toy, not advice.
 */

export type Criterion = { key: string; label: string; hint: string; met: boolean };

export type Memo = {
  status: "scored" | "rejected";
  number: string;
  company: string;
  sector: string;
  market: string;
  criteria: Criterion[];
  /** Only when status === "scored". */
  scores: { label: string; value: number }[];
  overall: number;
  risks: string[];
  strengths: string[];
  verdict: "TAKE THE MEETING" | "WATCHLIST" | "PASS — FOR NOW" | "NOT SCORED";
  /** Why it was rejected before scoring. */
  rejection?: string;
};

type Sector = {
  name: string;
  keys: string[];
  market: string;
  base: number;
  risk: string;
};

const SECTORS: Sector[] = [
  { name: "AI / Applied AI", keys: ["ai", "gpt", "llm", "agent", "copilot", "ml", "machine learning", "automation"], market: "Large · fast-moving", base: 7.0, risk: "Thin moat if the model layer commoditises the feature" },
  { name: "Fintech", keys: ["fintech", "payment", "upi", "lend", "loan", "credit", "invoice", "insurance", "bank", "wealth", "gst", "tax"], market: "Large · regulated", base: 6.6, risk: "RBI / SEBI compliance can stretch timelines" },
  { name: "B2B SaaS", keys: ["saas", "b2b", "crm", "erp", "dashboard", "workflow", "sme", "smb", "enterprise", "software for"], market: "Mid-large · sticky", base: 6.8, risk: "Long sales cycles for Indian SMBs; pricing power unproven" },
  { name: "Marketplace", keys: ["marketplace", "platform connecting", "connects", "uber for", "airbnb for", "booking"], market: "Depends on liquidity", base: 6.0, risk: "Cold-start: both sides need to show up at once" },
  { name: "D2C / Consumer", keys: ["d2c", "brand", "fashion", "food", "snack", "beauty", "apparel", "coffee"], market: "Crowded · brand-led", base: 5.5, risk: "CAC inflation on Meta/Google eats contribution margin" },
  { name: "Edtech", keys: ["edtech", "student", "learn", "course", "school", "exam", "tutor", "cat", "upsc"], market: "Large · post-boom caution", base: 5.8, risk: "Retention cliff after the exam / course ends" },
  { name: "Healthtech", keys: ["health", "clinic", "doctor", "patient", "fitness", "mental", "pharma", "diagnos"], market: "Large · trust-gated", base: 6.4, risk: "Clinical validation and trust take time to earn" },
  { name: "Climate / Energy", keys: ["climate", "solar", "ev", "carbon", "energy", "battery", "waste", "recycl"], market: "Large · policy tailwinds", base: 6.6, risk: "Capex-heavy; unit economics depend on subsidies" },
  { name: "Proptech", keys: ["property", "real estate", "rent", "housing", "society", "tenant", "broker"], market: "Large · fragmented", base: 6.5, risk: "Offline incumbents and slow digital adoption" },
  { name: "Mobility / Logistics", keys: ["logistic", "delivery", "fleet", "drone", "transport", "mobility", "supply chain", "quick commerce"], market: "Large · ops-heavy", base: 6.2, risk: "Operational burn scales faster than revenue" },
];

/* ── Screening signals ─────────────────────────────────────────────────────── */

const WHO = ["for ", "smb", "sme", "business", "student", "farmer", "doctor", "clinic", "shop", "retailer", "landlord", "tenant", "seller", "driver", "parent", "founder", "team", "restaurant", "pharmac", "school", "hospital", "enterprise", "consumer", "customer", "user"];
const PROBLEM = ["automat", "replace", "reduce", "cut ", "save", "solve", "fix", "help", "track", "manage", "simplif", "eliminat", "speed", "slow", "manual", "spreadsheet", "paper", "expensive", "waste", "delay", "struggl", "hard to", "instead of", "without"];
const MECHANISM = ["using", "with ", "via", "app", "platform", "software", "model", "algorithm", "ai", "ml", "api", "dashboard", "whatsapp", "sms", "marketplace", "network", "sensor", "hardware"];
const MODEL = ["subscription", "saas", "per month", "monthly", "commission", "take rate", "fee", "per seat", "licen", "pay per", "freemium", "ads", "advertis", "transaction", "margin", "pricing", "charge", "revenue", "₹", "rs.", "rupee", "$"];
const VAGUE = ["everyone", "anyone", "all people", "everybody", "any business", "the world", "masses"];
const MARKET = ["india", "bharat", "tier 2", "tier-2", "tier 3", "global", "us ", "b2b", "b2c", "enterprise", "market", "million", "crore", "lakh", "segment", "vertical"];

const BOOSTS: [string[], number, string][] = [
  [["subscription", "per seat", "monthly", "licen"], 0.5, "Recurring revenue model"],
  [["india", "bharat", "tier 2", "tier-2", "tier 3", "vernacular"], 0.4, "Clear India-first wedge"],
  [["b2b", "enterprise", "sme", "smb"], 0.3, "Businesses pay for pain relief"],
  [["data", "analytics", "insight", "proprietary"], 0.3, "Data compounding over time"],
  [["network", "community", "marketplace"], 0.2, "Potential network effects"],
  [["already", "pilot", "customers", "revenue", "users", "traction"], 0.6, "Some traction claimed"],
];

const PENALTIES: [string[], number, string][] = [
  [["crypto", "nft", "web3", "token"], -1.4, "Regulatory uncertainty in India"],
  [["uber for", "airbnb for", "tinder for"], -0.8, "“X for Y” framing: differentiation unclear"],
  [["social network", "social media app"], -1.0, "Winner-take-all attention market"],
  [["free", "ad-supported", "ads"], -0.5, "Monetisation path unclear"],
  [["revolution", "disrupt", "world-class", "best-in-class", "unicorn", "10x better"], -0.4, "Claims outrun the evidence"],
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
/** Short keys (ai, ml, ev, us) must match whole words, or "revolutionary" reads as EV. */
const hit = (text: string, key: string) => {
  const k = key.trim();
  if (k.length <= 3 && /^[a-z]+$/.test(k)) return new RegExp(`(^|[^a-z])${k}([^a-z]|$)`).test(text);
  return text.includes(key);
};
const has = (text: string, keys: string[]) => keys.some((k) => hit(text, k));

/** Rough "is this even English" check, so keyboard mashing never reaches a score. */
function looksLikeGibberish(pitch: string) {
  const words = pitch.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const odd = words.filter((w) => {
    const letters = w.replace(/[^a-z]/g, "");
    if (letters.length < 3) return false;
    const vowels = (letters.match(/[aeiou]/g) || []).length;
    const longRun = /([a-z])\1{2,}/.test(letters);
    const noVowels = vowels === 0;
    const vowelStarved = letters.length > 5 && vowels / letters.length < 0.18;
    return longRun || noVowels || vowelStarved;
  });
  return odd.length / words.length > 0.4;
}

export function buildMemo(pitch: string, memoNumber = 58): Memo {
  const raw = pitch.trim();
  const text = ` ${raw.toLowerCase()} `;
  const words = raw.split(/\s+/).filter(Boolean);
  const rand = seeded(hash(text.trim()));

  const sectorHit = SECTORS.map((s) => ({ s, hits: s.keys.filter((k) => hit(text, k)).length }))
    .sort((a, b) => b.hits - a.hits)
    .find((x) => x.hits > 0)?.s;

  const sector = sectorHit ?? { name: "Unclassified", keys: [], market: "Unclear · needs sizing", base: 5.0, risk: "Market and buyer are not defined yet" };

  const vague = has(text, VAGUE);
  const criteria: Criterion[] = [
    { key: "who", label: "Who it's for", hint: "Name the customer, not “everyone”.", met: has(text, WHO) && !vague },
    { key: "problem", label: "What breaks today", hint: "What is slow, manual or expensive right now?", met: has(text, PROBLEM) },
    { key: "how", label: "How it works", hint: "The mechanism — app, model, marketplace, hardware.", met: has(text, MECHANISM) },
    { key: "money", label: "How it makes money", hint: "Subscription, commission, fee, per seat…", met: has(text, MODEL) },
    { key: "market", label: "Which market", hint: "Geography or segment — India, B2B, tier-2…", met: has(text, MARKET) || (!!sectorHit && !vague) },
  ];
  const met = criteria.filter((c) => c.met).length;

  const base: Omit<Memo, "status" | "verdict"> = {
    number: `#${String(memoNumber).padStart(3, "0")}`,
    company: companyFrom(raw),
    sector: sectorHit ? sector.name : "Unclassified",
    market: sector.market,
    criteria,
    scores: [],
    overall: 0,
    risks: [],
    strengths: [],
  };

  /* ── The screen: most pitches stop here ─────────────────────────────────── */

  if (looksLikeGibberish(raw)) {
    return { ...base, status: "rejected", verdict: "NOT SCORED", company: "Unreadable", sector: "—", market: "—", rejection: "That isn't a pitch I can read. Write one line a human could repeat back to you." };
  }
  if (words.length < 6) {
    return { ...base, status: "rejected", verdict: "NOT SCORED", rejection: `Too short to evaluate (${words.length} word${words.length === 1 ? "" : "s"}). A first-pass screen needs at least a customer and a problem.` };
  }
  // A named customer is non-negotiable, and the pitch must say either what
  // breaks today or how it makes money — otherwise there is nothing to size.
  const missing = criteria.filter((c) => !c.met).map((c) => c.label.toLowerCase());
  const who = criteria.find((c) => c.key === "who")!;
  const problem = criteria.find((c) => c.key === "problem")!;
  const money = criteria.find((c) => c.key === "money")!;

  if (!who.met) {
    return {
      ...base,
      status: "rejected",
      verdict: "NOT SCORED",
      rejection: vague
        ? "“Everyone” is not a customer. Name who has this problem, then try again."
        : "The pitch never says who it is for. Without a named customer there is nothing to size or price.",
    };
  }
  if (!problem.met && !money.met) {
    return {
      ...base,
      status: "rejected",
      verdict: "NOT SCORED",
      rejection: "It says who, but not what breaks today or how it makes money. One of those has to be in the first line.",
    };
  }
  if (met < 3) {
    return {
      ...base,
      status: "rejected",
      verdict: "NOT SCORED",
      rejection: `Only ${met} of 5 screening criteria met. Still missing: ${missing.join(", ")}. In a real inbox this is where most decks stop.`,
    };
  }

  /* ── Scored: signals drive each dimension, not a random number ──────────── */

  const strengths: string[] = [];
  const risks: string[] = [sector.risk];
  let adj = 0;
  for (const [keys, delta, note] of BOOSTS) {
    if (has(text, keys)) {
      adj += delta;
      strengths.push(note);
    }
  }
  for (const [keys, delta, note] of PENALTIES) {
    if (has(text, keys)) {
      adj += delta;
      risks.push(note);
    }
  }

  criteria.filter((c) => !c.met).forEach((c) => risks.push(`Pitch never says ${c.label.toLowerCase()}`));
  if (words.length > 14) strengths.push("Specific problem statement");
  if (!strengths.length) strengths.push("A clear enough wedge to take one call");

  const completeness = (met - 3) / 2; // 0 at the bar, 1 when all five are met
  const jitter = () => (rand() - 0.5) * 0.8;

  const market = clamp(sector.base - 0.5 + completeness * 1.2 + (criteria[4].met ? 0.4 : 0) + adj * 0.35 + jitter());
  const moat = clamp(sector.base - 1.6 + adj * 0.7 + (has(text, ["proprietary", "data", "network", "patent"]) ? 0.8 : 0) + jitter());
  const timing = clamp(sector.base - 0.4 + adj * 0.3 + jitter());
  const model = clamp((criteria[3].met ? sector.base - 0.2 : sector.base - 2.4) + adj * 0.7 + jitter());
  const execution = clamp(9.6 - sector.base + 1.2 - completeness * 1.4 - adj * 0.25 + jitter());

  const scores = [
    { label: "Market", value: round1(market) },
    { label: "Moat", value: round1(moat) },
    { label: "Timing", value: round1(timing) },
    { label: "Business model", value: round1(model) },
    { label: "Execution risk", value: round1(execution) },
  ];

  const overall = round1(clamp((market * 1.2 + moat * 1.1 + timing + model * 1.2 + (11 - execution) * 0.9) / 5.4));
  const verdict: Memo["verdict"] = overall >= 7.4 ? "TAKE THE MEETING" : overall >= 6 ? "WATCHLIST" : "PASS — FOR NOW";

  return { ...base, status: "scored", scores, overall, risks: risks.slice(0, 3), strengths: strengths.slice(0, 3), verdict };
}

function companyFrom(pitch: string) {
  return (
    pitch
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["startup", "platform", "that", "which", "with", "helps", "using", "for", "their"].includes(w.toLowerCase()))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join("") || "Stealth Co."
  );
}
