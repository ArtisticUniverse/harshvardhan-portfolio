# Harshvardhan Pandey — Portfolio & Interactive CV

Cinematic portfolio built with **Next.js 14 (App Router) · TypeScript · Tailwind · GSAP (ScrollTrigger, SplitText, MorphSVG, Draggable) · Lenis · React Three Fiber · Framer Motion · Matter.js**.

## Edit content

Almost everything lives in **`data/content.ts`**: name, taglines, links, timeline, projects (features + how it works), skills and their evidence, certifications, desk items, terminal commands and the soundtrack. Search for `TODO(harsh)` to find the placeholders still to fill:

| Placeholder | Where |
| --- | --- |
| Email, calendar link | `links` |
| Real domain (SEO, OG, sitemap) | `site.url` |
| Project images (optional) | `projects[].image` → put files in `public/images` |
| Case competitions, campus clubs | `deskItems` |

Assets:

- `public/images/harsh-3d.webp` / `.png`: background-removed, retouched portrait used by the 3D hero
- `public/images/harsh-depth.png`: its depth map (white = closer)
- `public/cv/Harshvardhan_Pandey_CV.pdf`: downloadable CV
- `public/audio/night-shift.m4a` (+ `.mp3` fallback): soundtrack, plays only when a visitor turns sound on

The CAT bell-curve section is kept but switched off: set `theNumber.enabled = true` to bring it back.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (or deploy it as a subfolder and set **Root Directory** to `portfolio`).
2. On vercel.com → **Add New Project** → import the repo. The framework preset is Next.js and no settings are needed.
3. Optional env var: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for Plausible. Vercel Analytics is already wired in; enable it in the project's Analytics tab.
4. After the first deploy, set `site.url` in `data/content.ts` to the live domain and redeploy so OG tags and the sitemap point to it.

With the CLI, from this folder:

```bash
npm run deploy    # production deploy, retries on "fetch failed"
```

## Features

- Preloader with a name reveal and gold bar wipe; hero with kinetic variable-weight name and a **3D depth-mapped portrait** (cursor-driven turn, gold rim light, liquid hover)
- Lenis inertia scroll, scroll-progress bar, compact F1-style telemetry HUD, custom morphing cursor, magnetic buttons
- Horizontal pinned **Recollections** timeline with developing polaroids that flip
- **Entrepreneur mode** stacking cards with SVG displacement hover → full-screen case studies (features + how it works)
- **Vibe Coder Lab**: working terminal (`help`, `whoami`, `projects`, `open netscope`, `hire-harsh`, `sudo coffee`…), Built-with-Claude gallery with typed prompts, OG builds
- **How I think**: pinned principles with MorphSVG icons; **Pitch me a startup** mock investment memo
- **Skills universe**: Matter.js physics pills with evidence per skill; certification deck that fans out; draggable **desk of memories** with hidden notes
- Contact with velocity-stretched type, live Udaipur time
- Full-screen overlay menu with previews, gold curtain transitions, dark/light circular reveal, soundtrack + UI sounds toggle, Konami / type **HIRE** easter egg
- **Recruiter mode** one-page printable CV (also at `/cv`), SEO metadata, JSON-LD, generated OG image and HP favicon, `prefers-reduced-motion` fallbacks and touch-friendly behaviour
