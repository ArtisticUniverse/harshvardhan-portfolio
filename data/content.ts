/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Edit text, numbers, links and projects in this one file — components read
 *  from it and never hard-code copy.
 *
 *  Search for "TODO(harsh)" to find every placeholder that still needs a value.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Identity & links ─────────────────────────────────────────────────────── */

export const site = {
  name: "Harshvardhan Pandey",
  shortName: "Harsh Pandey",
  monogram: "HP",
  // TODO(harsh): set to your real domain after the first Vercel deploy.
  url: "https://harshvardhan-pandey.vercel.app",
  title: "Harshvardhan Pandey — Computer Engineer → Business Analyst → Entrepreneur → MBA@IIMU",
  description:
    "Portfolio and interactive CV of Harshvardhan (Harsh) Pandey: MBA at IIM Udaipur, ex-VC business analyst, entrepreneur behind Putri Innovations, computer engineer and AI-native vibe coder.",
  tagline: "Computer Engineer → Business Analyst → Entrepreneur → MBA@IIMU",
  taglineSub: "Brainstorming ideas to solutions",
  /** Where Harsh is from. */
  hometown: "Mumbai",
  location: {
    city: "Udaipur",
    lat: "24.58°N",
    lon: "73.71°E",
    timeZone: "Asia/Kolkata",
  },
  currently: "MBA @ IIMU · open to internships in Finance / Strategy / VC / Product",
  credit: "Designed & vibe-coded by Harsh with Claude.",
};

export const links = {
  email: "harshvardhanp6501@gmail.com",
  eduEmail: "harshvardhan.pandey.2026@iimu.ac.in",
  phone: "+91-9167010579",
  tel: "tel:+919167010579",
  whatsapp: "https://wa.me/919167010579",
  linkedin: "https://www.linkedin.com/in/harshvardhanpandey-iimu",
  github: "https://github.com/ArtisticUniverse",
  cv: "/cv/Harshvardhan_Pandey_CV.pdf",
};

export const photo = {
  // Swap these files in /public/images to change the portrait.
  src: "/images/harsh.jpg",
  /** Background-removed portrait used for the 3D hero, plus its depth map. */
  cutout: "/images/harsh-3d.webp",
  depth: "/images/harsh-depth.png",
  alt: "Portrait of Harshvardhan Pandey in a black suit",
};

/* ── Soundtrack (plays when the visitor turns sound on) ──────────────────── */

export const soundtrack = {
  title: "Night Shift in My Veins",
  src: "/audio/night-shift.m4a",
  fallback: "/audio/night-shift.mp3",
  volume: 0.35,
};

/* ── Preloader ───────────────────────────────────────────────────────── */

export const preloader = {
  message: "Harshvardhan Pandey",
};

/* ── 01 · Hero ────────────────────────────────────────────────────────────── */

export const hero = {
  lines: ["HARSHVARDHAN", "PANDEY"],
  roles: ["Business Analyst", "Entrepreneur", "Vibe Coder", "MBA @ IIM Udaipur", "VC Mind"],
  intro:
    "A Mumbai-born computer engineer turned venture analyst turned entrepreneur — now sharpening the strategy stack at IIM Udaipur.",
  scrollHint: "SCROLL TO RECOLLECT ↓",
};

/* ── Optional · The Number (CAT bell-curve section, off by default) ─────────── */

export const theNumber = {
  /** Set to true to show the pinned 99.92 → bell-curve section after the hero. */
  enabled: false,
  value: 99.92,
  label: "[ THE NUMBER ]",
  caption: "CAT 2025 · 99.92 percentile → IIM Udaipur, Section E, Batch 2026–28",
  tailLabel: "HARSH ↗ 99.92",
};

/* ── Stats marquee ───────────────────────────────────────────────────── */

export const stats = [
  "150+ startups evaluated",
  "57 investment memos",
  "500+ founders & investors met",
  "20,000+ schools impacted",
  "700+ training kits",
  "300+ events",
  "25+ IT clients",
  "32 months full-time",
  "MBA @ IIM Udaipur",
];

/* ── 02 · Timeline — "Recollections" ──────────────────────────────────────── */

export type Memory = {
  id: string;
  period: string;
  chapter: string;
  title: string;
  org: string;
  place?: string;
  highlight: { value: string; label: string };
  bullets: string[];
};

export const timeline: Memory[] = [
  {
    id: "origin",
    period: "2018 — 2022",
    chapter: "ORIGIN",
    title: "Learning to build",
    org: "Yashodham → Thakur College (Sci & Comm) → B.E. Computer Engineering, TCET",
    place: "MUMBAI",
    highlight: { value: "B.E.", label: "Computer Engineering" },
    bullets: [
      "Class X — Yashodham High School & Jr. College (2016)",
      "Class XII — Thakur College of Science & Commerce (2018)",
      "B.E. Computer Engineering — Thakur College of Engineering & Technology (2022)",
      "Built a CNN paddy-disease detector and a face-recognition attendance system",
    ],
  },
  {
    id: "campus",
    period: "2019 — 2022",
    chapter: "CAMPUS",
    title: "Running the room",
    org: "Zephyr · MULTICON-W · Taarangan · Class Representative",
    place: "TCET, MUMBAI",
    highlight: { value: "200+", label: "participants coordinated" },
    bullets: [
      "Zephyr Sponsorship — engaged 20+ sponsors, managed 5+ partnerships",
      "MULTICON-W Session Coordinator — 200+ participants, 15+ stakeholders",
      "Taarangan Marketing — 5+ digital campaigns through COVID-19",
      "Class Representative — primary liaison for 70+ students",
    ],
  },
  {
    id: "eagle",
    period: "AUG '22 — MAR '25",
    chapter: "CAPITAL",
    title: "Business Analyst",
    org: "Eagle Group",
    place: "MUMBAI",
    highlight: { value: "150+", label: "startups evaluated" },
    bullets: [
      "Evaluated 150+ startups on domain and market fit; ~10% shortlisted for investment",
      "Delivered 57 investment memos via Tracxn, shaping ₹4,00,000 of capital allocation",
      "Met 500+ founders and investors; screened pitch decks and initiated deals",
      "Streamlined MoM and task workflows for core leaders — 40% faster",
      "Scaled Droneworld operations 0 → 1 under the Director",
    ],
  },
  {
    id: "sapio",
    period: "MAR '25 — JUN '25",
    chapter: "SCALE",
    title: "Business Analyst Intern",
    org: "Sapio Analytica Pvt. Ltd.",
    place: "NASHIK · MAHARASHTRA",
    highlight: { value: "20,000+", label: "schools reached" },
    bullets: [
      "Led 25 teams of 120 trainers across the Nashik division",
      "Ran operations for AI-education workshops across 20,000+ Maharashtra schools",
      "Managed pan-Maharashtra logistics for 700+ training kits",
      "Researched and delivered a course curriculum with MSSDS Institute",
      "Wrote a market-intelligence report on state and central government schemes",
    ],
  },
  {
    id: "iimu",
    period: "2026 →",
    chapter: "NOW",
    title: "MBA",
    org: "Indian Institute of Management Udaipur",
    place: "UDAIPUR",
    highlight: { value: "MBA", label: "Batch 2026–28 · Section E" },
    bullets: [
      "Admitted through CAT 2025 (99.92 percentile)",
      "Finance · Marketing · Microeconomics · Statistics · Organisational Behaviour",
      "Capsim simulation with Team Ferris",
      "Pursuing FMVA (KOED Learning)",
    ],
  },
];

/* ── Projects (03 · Entrepreneur mode + 04 · OG builds + case studies) ─────────── */

export type Project = {
  id: string;
  index: string;
  name: string;
  /** venture → Entrepreneur mode · engineering → OG builds · lab → Built with Claude case study */
  category: "venture" | "engineering" | "lab";
  kind: string;
  year: string;
  role: string;
  summary: string;
  metrics: { value: string; label: string }[];
  features: { title: string; desc: string }[];
  howItWorks: { title: string; desc: string }[];
  stack: string[];
  skills: string[];
  /** Optional image path in /public. Leave empty to use the generative artwork. */
  image?: string;
  art?: "data" | "rings" | "leaf" | "face" | "signal" | "wave";
  href?: string;
};

export const projects: Project[] = [
  {
    id: "putri-innovations",
    index: "V/01",
    name: "Putri Innovations",
    category: "venture",
    kind: "Pvt. Ltd. · B2B IT consulting & software",
    year: "2026",
    role: "Entrepreneur",
    summary:
      "An IT consulting and product studio for small businesses that still run on registers, spreadsheets and phone calls. Its flagship is Putri Manager — real-estate management software with real-time tracking and analytics — alongside inventory, billing and order apps for B2B2C businesses.",
    metrics: [
      { value: "25+", label: "SMB clients globally" },
      { value: "3", label: "languages · EN / HI / MR" },
      { value: "5", label: "personas served" },
    ],
    features: [
      {
        title: "Property operations in one app",
        desc: "Rent, maintenance bills, repair issues, staff attendance & payroll, visitor logs and CCTV — modules that used to live in separate registers.",
      },
      {
        title: "Real-time tracking & analytics",
        desc: "Every payment, complaint and gate entry updates live, so managers see money to collect and jobs pending at a glance.",
      },
      {
        title: "AI insights",
        desc: "Rent prediction, expenditure alerts and automatic complaint categorisation flag what needs attention before it becomes a problem.",
      },
      {
        title: "Persona-aware home screen",
        desc: "Residents, owners, managers, security and vendors each see what matters to them right now — ranked by urgency, relevance and time of day.",
      },
      {
        title: "Report a problem in plain words",
        desc: "Type “water dripping from the AC” and it's matched to the right verified technician with an ETA and price range.",
      },
      {
        title: "Business apps for B2B2C",
        desc: "Custom inventory, billing and order-management apps that automate the daily back office of product businesses.",
      },
    ],
    howItWorks: [
      { title: "Discover", desc: "Find SMBs through Google Maps and on-ground outreach; sit with the owner and map how work actually flows today." },
      { title: "Model", desc: "Turn the operation into data — units, tenants, bills, staff, stock and orders — with clear owners for each." },
      { title: "Build", desc: "Ship a cross-platform Flutter app with role-based views, multilingual UI and a backend on Firebase." },
      { title: "Rank", desc: "A context engine turns live activity into a feed, scored by urgency, persona and time, so the next action is always on top." },
      { title: "Iterate", desc: "Watch real usage with the client, remove steps, and add automation where people still do things by hand." },
    ],
    stack: ["Flutter", "Dart", "Riverpod", "Firebase", "GenAI"],
    skills: ["Full-Stack", "B2B Consulting", "Product Strategy", "GenAI", "Stakeholder Mgmt"],
    image: "",
    art: "data",
  },
  {
    id: "putri-banquet",
    index: "V/02",
    name: "Putri Banquet",
    category: "venture",
    kind: "Events & hospitality",
    year: "2026",
    role: "Operations lead",
    summary:
      "An events business run end to end — from the first enquiry to the last guest leaving. Decor, packages for every budget, venue operations and a guest experience built around accessibility.",
    metrics: [
      { value: "300+", label: "events executed" },
      { value: "E2E", label: "enquiry → teardown" },
    ],
    features: [
      { title: "End-to-end execution", desc: "One team owns the event from booking and planning to day-of coordination and teardown." },
      { title: "Decor & theming", desc: "Decor designed around each occasion instead of a fixed template." },
      { title: "Packages for every budget", desc: "Customisable tiers so the client picks what matters and skips what doesn't." },
      { title: "Venue operations", desc: "Staffing, vendors, schedules and the run-sheet managed so the host never has to." },
      { title: "Accessible guest experience", desc: "Accessibility standards built into the venue and the flow, so every guest is looked after." },
    ],
    howItWorks: [
      { title: "Brief", desc: "Capture the occasion, guest count, budget and must-haves." },
      { title: "Package", desc: "Design a custom package — decor, catering and services — that fits the budget." },
      { title: "Plan", desc: "Line up vendors and staff, then lock a minute-by-minute run-sheet." },
      { title: "Execute", desc: "Run the day on the ground: setup, guest flow, vendor timing and on-the-spot fixes." },
      { title: "Close", desc: "Teardown, settle vendors and collect feedback to sharpen the next event." },
    ],
    stack: ["Event ops", "Vendor management", "Budgeting"],
    skills: ["Event Management", "Operations", "Stakeholder Mgmt", "Team Leadership"],
    image: "",
    art: "rings",
  },
  {
    id: "paddy",
    index: "E/01",
    name: "Paddy disease detection",
    category: "engineering",
    kind: "Deep learning · computer vision",
    year: "2022",
    role: "Engineer",
    summary:
      "A CNN that diagnoses disease in paddy crops from a photo of the leaf, wrapped in an app simple enough for farmers who have never used a diagnostic tool.",
    metrics: [
      { value: "81%", label: "accuracy" },
      { value: "3", label: "disease categories" },
    ],
    features: [
      { title: "Diagnosis from a photo", desc: "Early-stage disease detection from a single leaf image — no lab visit needed." },
      { title: "Three-class classifier", desc: "Distinguishes between three disease categories learned from labelled crop images." },
      { title: "Farmer-friendly app", desc: "A simple interface built for non-technical users in the field." },
      { title: "Built to scale", desc: "Iteratively tuned into a diagnostic tool that can serve many farmers at once." },
    ],
    howItWorks: [
      { title: "Collect", desc: "Gather a labelled dataset of paddy-leaf images across the disease classes." },
      { title: "Prepare", desc: "Resize and normalise images, and augment them so the model sees more variety." },
      { title: "Learn", desc: "Convolution layers pick up lesion colour, shape and texture; a softmax layer scores each class." },
      { title: "Tune", desc: "Iterate on architecture and hyperparameters until validation accuracy reaches 81%." },
      { title: "Serve", desc: "The farmer uploads a leaf photo in the app and gets the predicted disease back." },
    ],
    stack: ["Python", "CNN", "Image processing"],
    skills: ["ML / CNN", "Python", "Computer Vision"],
    art: "leaf",
  },
  {
    id: "attendance",
    index: "E/02",
    name: "Face-recognition attendance",
    category: "engineering",
    kind: "Computer vision · automation",
    year: "2021",
    role: "Engineer",
    summary:
      "An attendance generator that recognises students' faces and logs attendance automatically — no roll call, no registers.",
    metrics: [
      { value: "−30%", label: "processing time" },
      { value: "Live", label: "verification & logs" },
    ],
    features: [
      { title: "Zero manual tracking", desc: "Attendance is marked automatically the moment a student is recognised." },
      { title: "Real-time verification", desc: "Faces are verified live against the enrolled class." },
      { title: "Automatic logs", desc: "Every recognition is written to an attendance log with a timestamp." },
      { title: "Classroom-ready", desc: "Deployed for real classroom use, cutting attendance processing time by 30%." },
    ],
    howItWorks: [
      { title: "Enrol", desc: "Collect face images for each student to build the training dataset." },
      { title: "Train", desc: "Train the recognition model to tell every enrolled student apart." },
      { title: "Detect", desc: "The camera feed is scanned for faces in each frame." },
      { title: "Match", desc: "Each detected face is compared with the enrolled students for a confident match." },
      { title: "Log", desc: "Matched students are marked present and the attendance sheet is generated." },
    ],
    stack: ["Python", "Face recognition", "Real-time video"],
    skills: ["ML / CNN", "Python", "Computer Vision", "Process Optimisation"],
    art: "face",
  },
  {
    id: "netscope",
    index: "L/01",
    name: "NetScope",
    category: "lab",
    kind: "Native Android app",
    year: "2026",
    role: "Builder (with Claude)",
    summary:
      "An Android app that shows the devices around you — on your Wi-Fi and over Bluetooth — and maps Wi-Fi coverage in AR. It stays inside an ethical boundary: only what devices publicly reveal.",
    metrics: [
      { value: "5", label: "tools in one app" },
      { value: "AR", label: "Wi-Fi heatmap" },
    ],
    features: [
      { title: "Network scanner", desc: "Sweeps the local subnet for live hosts with vendor, hostname, open well-known ports and mDNS services." },
      { title: "Bluetooth scanner", desc: "Classic and BLE devices with signal strength, type and audio capability." },
      { title: "Wi-Fi motion sensing", desc: "Flags movement in a room from jitter in the router's signal strength." },
      { title: "AR Wi-Fi heatmap", desc: "Walk around and paint signal strength onto the real world to find dead zones." },
      { title: "Honest multi-audio", desc: "Detects what the phone can really do with Bluetooth speakers instead of faking it." },
    ],
    howItWorks: [
      { title: "Sweep", desc: "ICMP + TCP probes find live hosts; OUI lookup and reverse DNS identify them." },
      { title: "Listen", desc: "mDNS/DNS-SD discovery surfaces Chromecasts, printers, TVs and more." },
      { title: "Sense", desc: "RSSI is sampled every ~250 ms; rolling variance above a calibrated baseline means motion." },
      { title: "Map", desc: "ARCore tracks the phone's 6-DoF pose and anchors an RSSI sample every ~0.35 m." },
    ],
    stack: ["Kotlin", "Jetpack Compose", "ARCore", "SceneView"],
    skills: ["Full-Stack", "Prompt Engineering", "Product Strategy"],
    art: "signal",
    href: "https://github.com/ArtisticUniverse/NetScope",
  },
  {
    id: "spectra",
    index: "L/02",
    name: "SPECTRA",
    category: "lab",
    kind: "Offline-first PWA",
    year: "2026",
    role: "Builder (with Claude)",
    summary:
      "A phone becomes a field instrument for 'haunted' places. It records the environment with real sensors, flags readings far from a calibrated baseline, and ranks the most likely natural explanation.",
    metrics: [
      { value: "3σ", label: "anomaly engine" },
      { value: "0", label: "dependencies" },
    ],
    features: [
      { title: "Real sensors only", desc: "Magnetic field, sound, infrasound band, vibration and light — never simulated values." },
      { title: "Anomaly detection", desc: "Readings beyond 3σ of the calibrated baseline are flagged in real time." },
      { title: "Likely explanations", desc: "Every anomaly is scored against natural causes like wiring, HVAC or phone movement." },
      { title: "Reports & EVP", desc: "Session recordings, audio clips and a printable report you can export." },
    ],
    howItWorks: [
      { title: "Calibrate", desc: "Sample each channel at 20 Hz for 30 s to learn its mean and noise floor." },
      { title: "Detect", desc: "Flag readings that stay beyond 3σ for 150 ms, with cooldowns to avoid noise." },
      { title: "Explain", desc: "Score common causes using context from the other sensors and time of day." },
      { title: "Report", desc: "Save the session offline and export it as a PDF or JSON." },
    ],
    stack: ["Vanilla JS", "Web Audio", "Generic Sensor API", "Service Worker"],
    skills: ["Full-Stack", "Prompt Engineering", "Market Intelligence"],
    art: "wave",
    href: "https://spectra-gray-nine.vercel.app",
  },
];

export const ventures = projects.filter((p) => p.category === "venture");
export const ogBuilds = projects.filter((p) => p.category === "engineering");

export const entrepreneurLine = "I don't just analyse businesses. I build them.";

/* ── 04 · The Vibe Coder Lab ──────────────────────────────────────────────── */

export type ClaudeBuild = {
  id: string;
  title: string;
  stack: string;
  prompt: string;
  output: string;
  impact: string;
  href?: string;
  /** Opens the full case study (features + how it works) from `projects`. */
  projectId?: string;
};

// TODO(harsh): add, remove or reword builds. Keep prompts short: they are typed out live.
export const claudeBuilds: ClaudeBuild[] = [
  {
    id: "portfolio",
    title: "This portfolio",
    stack: "Next.js · GSAP · Three.js",
    prompt:
      "Build a cinematic portfolio: F1-telemetry HUD, memory-archive storytelling, a 99.92 that shatters into a bell curve.",
    output: "The site you're scrolling: WebGL, physics, a working terminal and a one-page CV mode.",
    impact: "Idea → deployable site in a single session.",
  },
  {
    id: "putri-os",
    title: "Putri Manager",
    stack: "Flutter · Riverpod",
    prompt:
      "Turn a property ERP into an urban-life OS. Zero ERP words. Home screen changes with persona and time of day.",
    output: "Cross-platform app for residents, owners, managers, security and vendors in 3 languages.",
    impact: "One tap per real-world problem instead of twenty menus.",
    projectId: "putri-innovations",
  },
  {
    id: "netscope",
    title: "NetScope",
    stack: "Kotlin · Compose · ARCore",
    prompt:
      "Native Android app: scan network and Bluetooth devices, sense motion from Wi-Fi RSSI, paint an AR Wi-Fi heatmap.",
    output: "Five-tool scanner with an AR heatmap, CI build and a release APK.",
    impact: "Went from zero Kotlin to a shipped native app.",
    projectId: "netscope",
  },
  {
    id: "spectra",
    title: "SPECTRA",
    stack: "Vanilla JS · PWA",
    prompt:
      "Mobile-first sensor lab PWA. Never claim ghosts — map every unexplained reading to its likely cause.",
    output: "Installable, dependency-free PWA deployed on Vercel.",
    impact: "Sensor fusion in the browser with an honesty-first product rule.",
    projectId: "spectra",
  },
  {
    id: "news-agent",
    title: "Daily News Brief agent",
    stack: "Claude subagent",
    prompt:
      "Every morning: India + world news, weighted to markets and policy, with MBA talking points. 5-minute read max.",
    output: "A research agent with daily, weekly, deep-dive and quiz modes that tracks running stories.",
    impact: "GD- and interview-ready on current affairs every day.",
  },
  {
    id: "social-agent",
    title: "Social Media Manager agent",
    stack: "Claude · Canva · Metricool",
    prompt:
      "Turn my work updates into LinkedIn and X posts in my voice, design the visuals, schedule only after I approve.",
    output: "Drafts, visuals and a scheduling pipeline with an approval gate and a tone guide.",
    impact: "Personal brand on autopilot — never without my sign-off.",
  },
];

/** Terminal commands. `lines` print one by one. Special commands are handled in the component. */
export const terminal = {
  boot: [
    "harsh-os v26.2 — kernel: curiosity · shell: claude",
    "type `help` to see what this terminal can do.",
  ],
  prompt: "guest@harsh:~$",
  commands: {
    help: [
      "whoami        who is this guy",
      "projects      things I've shipped",
      "skills        the toolkit",
      "hire-harsh    the pitch",
      "contact       how to reach me",
      "recruiter     one-page CV mode",
      "sudo coffee   ☕",
      "clear         wipe the screen",
    ],
    whoami: [
      "Harshvardhan Pandey (Harsh)",
      "from      : Mumbai, Maharashtra → now in Udaipur, Rajasthan",
      "role      : MBA candidate @ IIM Udaipur, Section E, 2026–28 (CAT 99.92 %ile)",
      "previous  : Business Analyst @ Eagle Group (VC) · BA Intern @ Sapio Analytica",
      "venture   : Putri Innovations · Putri Banquet",
      "trained as: Computer Engineer (TCET, Mumbai)",
      "hobbies   : chess ♟ · swimming · shipping apps at odd hours",
    ],
    "cat 99.92": [
      "CAT 2025 ........ 99.92 percentile",
      "cohort .......... 3,00,000+ test takers",
      "rank band ....... top 0.08%",
      "outcome ......... IIM Udaipur → Section E",
      "note ............ the other 0.08 is still loading.",
    ],
    skills: [
      "capital   : startup evaluation · investment memos · deal sourcing · valuation",
      "growth    : market intelligence · 0→1 scaling · B2B consulting · partnerships",
      "ops       : 20K-school operations · supply chain · 120 trainers led · 300+ events",
      "tech & ai : python · CNN / computer vision · flutter · kotlin · GenAI · agents",
      "mindset   : chess ♟ strategy · swimming discipline",
    ],
    "hire-harsh": [
      "> analysing candidate…",
      "  investor pattern-recognition ..... ✔ 150+ startups",
      "  operator execution ............... ✔ 20,000 schools · 300 events",
      "  builder ........................... ✔ engineer + entrepreneur",
      "  speed ............................. ✔ prompt → product in hours",
      "verdict: STRONG HIRE. Opening contact channel…",
    ],
    "sudo coffee": [
      "[sudo] password for guest: ********",
      "brewing ☕ ▓▓▓▓▓▓▓▓▓▓ 100%",
      "Espresso deployed. Harsh is now 12% more persuasive.",
    ],
  } as Record<string, string[]>,
};

/* ── 05 · How I think ─────────────────────────────────────────────────────── */

export const principles = [
  {
    id: "investor",
    verb: "Think",
    like: "like an investor",
    proof: "150+ startups and 57 memos worth of pattern recognition.",
  },
  {
    id: "engineer",
    verb: "Build",
    like: "like an engineer",
    proof: "Computer engineering foundations — CNNs, face recognition, full-stack.",
  },
  {
    id: "operator",
    verb: "Execute",
    like: "like an operator",
    proof: "20,000 schools, 700 kits and 300 events of on-ground execution.",
  },
  {
    id: "vibecoder",
    verb: "Ship",
    like: "like a vibe coder",
    proof: "From prompt to product in hours, not months.",
  },
];

/* ── 06 · Skills universe ─────────────────────────────────────────────────── */

export type SkillGroup = "capital" | "ops" | "growth" | "build" | "mind";

export const skillGroups: Record<SkillGroup, string> = {
  capital: "Capital & finance",
  ops: "Operations & leadership",
  growth: "Strategy & growth",
  build: "Tech & AI",
  mind: "Mindset",
};

/** Skills detected from Harsh's work, projects and life — each with the evidence behind it. */
export const skills: { label: string; group: SkillGroup; evidence: string }[] = [
  { label: "Startup Evaluation", group: "capital", evidence: "Screened 150+ startups at Eagle Group; ~10% shortlisted for investment." },
  { label: "Investment Memos", group: "capital", evidence: "Wrote 57 memos on Tracxn that shaped ₹4,00,000 of capital allocation." },
  { label: "Deal Sourcing", group: "capital", evidence: "Met 500+ founders and investors; evaluated pitch decks and initiated deals." },
  { label: "Financial Modeling", group: "capital", evidence: "Pursuing FMVA (KOED); MBA Finance coursework at IIM Udaipur." },
  { label: "Valuation", group: "capital", evidence: "FMVA training plus two years of pricing startups as a VC analyst." },
  { label: "Market Intelligence", group: "growth", evidence: "Mapped state & central government schemes, users and trends at Sapio Analytica." },
  { label: "0 → 1 Scaling", group: "growth", evidence: "Scaled Droneworld from zero to one, restructuring marketing and workflow." },
  { label: "B2B Consulting", group: "growth", evidence: "25+ custom IT and app projects for SMB clients via Putri Innovations." },
  { label: "Marketing", group: "growth", evidence: "5+ digital campaigns for Taarangan through COVID-19; MBA Marketing." },
  { label: "Partnerships", group: "growth", evidence: "Engaged 20+ sponsors and managed 5+ partnerships for Zephyr." },
  { label: "Product Strategy", group: "growth", evidence: "Repositioned Putri from a property ERP into an urban-life OS." },
  { label: "Operations at Scale", group: "ops", evidence: "Ran AI-education workshop operations across 20,000+ schools." },
  { label: "Supply Chain", group: "ops", evidence: "Pan-Maharashtra logistics for 700+ training kits; Lean Six Sigma Green Belt." },
  { label: "Team Leadership", group: "ops", evidence: "Led 25 teams of 120 trainers across the Nashik division." },
  { label: "Process Optimisation", group: "ops", evidence: "Cut MoM and task-workflow effort by 40%; attendance processing by 30%." },
  { label: "Event Management", group: "ops", evidence: "300+ events at Putri Banquet; MULTICON-W sessions for 200+ participants." },
  { label: "Stakeholder Mgmt", group: "ops", evidence: "15+ stakeholders at MULTICON-W; faculty liaison for 70+ students as CR." },
  { label: "Curriculum Design", group: "ops", evidence: "Researched and delivered a course curriculum with MSSDS Institute." },
  { label: "Python", group: "build", evidence: "IBM, Google and Rice certifications; ML projects since 2021." },
  { label: "ML / CNN", group: "build", evidence: "CNN paddy-disease detector at 81% accuracy across 3 classes." },
  { label: "Computer Vision", group: "build", evidence: "Face-recognition attendance system deployed in classrooms." },
  { label: "Full-Stack", group: "build", evidence: "Flutter (Putri Manager), Kotlin (NetScope), web PWAs; IBM Full-Stack assessment." },
  { label: "GenAI", group: "build", evidence: "Google Cloud GenAI Architectures & Deployment; AI insights in Putri Manager." },
  { label: "Prompt Engineering", group: "build", evidence: "Ships apps, agents and this site by prompting Claude." },
  { label: "AI Agents", group: "build", evidence: "Built news-brief and social-media agents with approval gates." },
  { label: "Strategic Thinking", group: "mind", evidence: "Chess — think five moves ahead, then adapt." },
  { label: "Discipline", group: "mind", evidence: "Swimming — consistency beats intensity." },
  { label: "Range", group: "mind", evidence: "Engineer, investor, operator, entrepreneur — a jack of all trades, on purpose." },
];

/* ── 07 · Certifications ──────────────────────────────────────────────────── */

export const certifications = [
  { title: "FMVA", issuer: "KOED Learning", year: "2026", status: "Pursuing" },
  { title: "Lean Six Sigma Green Belt", issuer: "ISCEA", year: "2026" },
  { title: "GenAI Architectures & Deployment", issuer: "Google Cloud", year: "2024" },
  { title: "Python for Data Science & AI", issuer: "IBM", year: "2024" },
  { title: "Full-Stack Software Assessment", issuer: "IBM", year: "2024" },
  { title: "Python Crash Course", issuer: "Google", year: "2020" },
  { title: "Python Scripting Specialization", issuer: "Rice University", year: "2020" },
  { title: "Responsive Web Design", issuer: "University of London", year: "2020" },
];

/* ── 08 · Beyond the CV — desk of memories ────────────────────────────────── */

export type DeskItem = {
  id: string;
  kind: "polaroid" | "note" | "ticket" | "chess" | "card";
  title: string;
  body: string;
  /** Position as % of the desk, and rotation in degrees. */
  x: number;
  y: number;
  r: number;
  /** A hidden message revealed when this item is dragged away. */
  secret?: string;
};

export const deskItems: DeskItem[] = [
  {
    id: "chess",
    kind: "chess",
    title: "Chess",
    body: "Favourite game. Think five moves ahead, then adapt.",
    x: 6,
    y: 8,
    r: -6,
    secret: "e4. Always e4.",
  },
  {
    id: "cat",
    kind: "ticket",
    title: "CAT 2025",
    body: "99.92 percentile · admit: IIM Udaipur",
    x: 38,
    y: 4,
    r: 4,
  },
  {
    id: "swim",
    kind: "polaroid",
    title: "Swimming",
    body: "Where the phone can't reach me.",
    x: 68,
    y: 10,
    r: 7,
    secret: "Best ideas arrive between laps.",
  },
  {
    id: "capsim",
    kind: "card",
    title: "Capsim · Team Ferris",
    body: "Pricing, capacity and R&D calls under a ticking clock.",
    x: 12,
    y: 52,
    r: 3,
  },
  {
    id: "cases",
    kind: "note",
    title: "Case competitions",
    body: "Frameworks by day, slides by 3 a.m.",
    x: 42,
    y: 46,
    r: -4,
    // TODO(harsh): add specific competitions / results.
  },
  {
    id: "markets",
    kind: "card",
    title: "Finance & markets",
    body: "Reads markets the way he read pitch decks: thesis first, noise last.",
    x: 70,
    y: 54,
    r: -5,
  },
  {
    id: "campus",
    kind: "note",
    title: "Campus @ IIMU",
    body: "Section E. Clubs, committees and late-night group projects.",
    x: 26,
    y: 74,
    r: 6,
    // TODO(harsh): name the clubs / committees you join.
  },
  {
    id: "jack",
    kind: "note",
    title: "Jack of all trades",
    body: "…and deliberately trying to master a few.",
    x: 58,
    y: 78,
    r: -3,
    secret: "“…is oftentimes better than a master of one.”",
  },
];

/* ── 09 · Contact ─────────────────────────────────────────────────────────── */

export const contact = {
  heading: ["LET'S BUILD", "SOMETHING"],
  blurb:
    "Hiring for Finance, Strategy, VC or Product? Building something that needs an operator who can code? Let's talk.",
};

/* ── Recruiter mode (one-page CV) ─────────────────────────────────────────── */

export const education = [
  { degree: "MBA", school: "Indian Institute of Management Udaipur", score: "CAT 99.92 %ile", year: "2026–28" },
  { degree: "B.E. Computer Engineering", school: "Thakur College of Engg. & Tech., Mumbai", score: "69.79%", year: "2022" },
  { degree: "Class XII", school: "Thakur College of Science & Commerce, Mumbai", score: "64.15%", year: "2018" },
  { degree: "Class X", school: "Yashodham High School & Jr. College, Mumbai", score: "78.20%", year: "2016" },
];

/* ── Navigation & HUD ─────────────────────────────────────────────────────── */

export const sections = [
  { id: "hero", n: "01", label: "Origin", hud: "ORIGIN" },
  { id: "recollections", n: "02", label: "Recollections", hud: "RECOLLECTIONS" },
  { id: "ventures", n: "03", label: "Entrepreneur Mode", hud: "ENTREPRENEUR" },
  { id: "lab", n: "04", label: "Vibe Coder Lab", hud: "VIBE LAB" },
  { id: "mindset", n: "05", label: "How I Think", hud: "HOW I THINK" },
  { id: "skills", n: "06", label: "Skills Universe", hud: "SKILLS" },
  { id: "certs", n: "07", label: "Certifications", hud: "CERTS" },
  { id: "beyond", n: "08", label: "Beyond the CV", hud: "BEYOND" },
  { id: "contact", n: "09", label: "Contact", hud: "CONTACT" },
] as const;

export const recruiterMessage = {
  title: "Recruiter detected.",
  body: "You found the easter egg, so you clearly read carefully. Harsh would love to hear about your role.",
};

/** "[ 03 — ENTREPRENEUR MODE ]" style micro-label for a section id. */
export function sectionLabel(id: (typeof sections)[number]["id"]) {
  const sec = sections.find((x) => x.id === id)!;
  return `[ ${sec.n} — ${sec.label.toUpperCase()} ]`;
}
