# Rafsan Raiyan — Portfolio

A single-page portfolio in the style of [designmonks.co](https://www.designmonks.co/): warm paper base,
inverted dark bands, oversized grotesk headlines with serif-italic accents, and scroll-driven motion
throughout. All content comes from Rafsan Raiyan's CV.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) | SSR/SSG for SEO, image optimisation, file-based metadata & OG generation |
| Language | **TypeScript** | Content is typed at the source, so a typo in `data.ts` is a build error |
| Styling | **Tailwind CSS v4** | Design tokens live in CSS `@theme`; no config file, no runtime cost |
| Animation | **Motion 13** (`motion/react`) | Scroll-linked transforms compile to native scroll timelines where supported |
| Smooth scroll | **Lenis** | Driven from Motion's rAF loop, so scroll-linked animation never lags a frame |
| Fonts | Geist, Geist Mono, Instrument Serif (`next/font`) | Self-hosted, zero layout shift |

Deploys to Vercel with no configuration.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — see "Contact form" below
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

## Editing content

**Everything is in [`src/lib/data.ts`](src/lib/data.ts).** Sections read from it directly — there is no CMS
and no content duplicated in components. Change a metric, add a project, reword the FAQ, and every place
it appears updates together.

The exported groups map one-to-one onto the page:

| Export | Section |
| --- | --- |
| `person`, `summary`, `heroStats` | Hero, nav, footer, JSON-LD |
| `metrics`, `summaryLong` | Impact band |
| `projects` | Selected work (stacking cards) |
| `services` | What I do |
| `process` | Process |
| `experience` | Experience timeline |
| `skills` | Toolkit |
| `education`, `credentials`, `additional`, `reference` | About |
| `faqs` | FAQ |

Replace the portrait at `public/rafsan.jpg` (4:5 crop works best).

### Project visuals

`src/components/ui/ProjectVisual.tsx` generates an abstract browser-framed schematic per project —
a stand-in for real screenshots, tinted by each project's `accent` colour. When you have real captures,
drop them in `public/` and swap the `<ProjectVisual />` call in
[`src/components/sections/Work.tsx`](src/components/sections/Work.tsx) for a `next/image`.

## Contact form

`POST /api/contact` validates input, drops honeypot submissions, and sends via the Resend REST API.

- **With** `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` set → mail is sent server-side.
- **Without** them → the route returns `501 { fallback: true }` and the client opens the visitor's mail
  client pre-filled. The form works either way; nothing silently fails.

To use Formspree/Getform instead, point the `fetch` in `Contact.tsx` at their endpoint and delete the route.

## Design system

Tokens are defined once in [`src/app/globals.css`](src/app/globals.css) under `@theme`:

- **Surfaces** — `paper` `#f4f2ec`, `paper-2`, `ink` `#0c0c0e`, `ink-2`
- **Accent** — `lime` `#ceff4d` (dark surfaces only), `lime-deep` (light surfaces, for contrast)
- **Type scale** — `display-xl` → `display-sm`, all fluid `clamp()`; `eyebrow` for mono labels;
  `accent-serif` for the italic highlight inside a headline

To rebrand, change the `--color-*` values. Nothing else needs touching.

## Motion

| Effect | Where |
| --- | --- |
| Counter preloader + curtain wipe | `ui/Preloader.tsx` |
| Masked word-by-word headline reveal | `ui/RevealText.tsx` |
| Scroll reveals & stagger groups | `ui/Reveal.tsx` |
| Magnetic pointer-following buttons | `ui/Magnetic.tsx` |
| Seamless CSS marquees | `ui/Marquee.tsx` |
| Count-up metrics | `ui/Counter.tsx` |
| Blend-mode custom cursor | `ui/Cursor.tsx` — opt in with `data-cursor="hover"` or `data-cursor="label"` |
| Sticky stacking project deck | `sections/Work.tsx` |
| Scroll-drawn process line | `sections/Process.tsx` |
| Direction-aware hiding nav | `sections/Nav.tsx` |

**Reduced motion is honoured everywhere.** `prefers-reduced-motion: reduce` skips the preloader, disables
the custom cursor, freezes marquees, and renders every reveal as static content — the page stays fully usable.

> Scroll-linked `useTransform` input ranges must stay within `[0,1]`. Motion compiles them to native
> scroll-timeline offsets, and out-of-range values throw at runtime. `Work.tsx` clamps for this reason.

## Visual checks

`scripts/shoot.mjs` screenshots every section at desktop and mobile, samples the stacking deck at five
scroll depths, and fails loudly on console errors or horizontal overflow.

```bash
npm run dev
node scripts/shoot.mjs      # writes to shots/ (gitignored)
```

Playwright is a devDependency purely for this. If you don't want it:
`npm uninstall -D playwright && rm scripts/shoot.mjs`.

## Deploying

Push to GitHub, import at [vercel.com/new](https://vercel.com/new), and set `NEXT_PUBLIC_SITE_URL`
(plus the Resend variables if you want server-side mail). Build command and output are detected automatically.
