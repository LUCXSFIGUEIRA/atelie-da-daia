# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page landing site for Ateliê da Daia, a seamstress studio in Guareí-SP. All user-facing copy, code comments and commit messages are in **Brazilian Portuguese**; keep that convention.

Stack: React 19 + TypeScript + Vite + Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config`) + GSAP (ScrollTrigger, SplitText, `@gsap/react`) + Lenis smooth scroll.

## Commands

- `npm run dev`: dev server
- `npm run build`: type-check (`tsc -b`) + production build to `dist/`
- `npm run build:pages`: same build with `--base=/atelie-da-daia/` (used by CI)
- `npm run preview`: serve the built `dist/`
- `python scripts/otimizar-fotos.py`: convert originals in `img/` (gitignored) to WebP in `public/img/` (needs `pip install pillow`); prints each photo's new dimensions

There is no linter or test suite; `npm run build` is the correctness check.

Deploy: pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `build:pages` and publishes to GitHub Pages.

## Architecture

- `src/App.tsx` composes the page as an ordered list of section components from `src/components/`, and sets up Lenis smooth scroll driven by the GSAP ticker (disabled under `prefers-reduced-motion`).
- `src/data/site.ts` holds all contact data (WhatsApp number/message, Instagram, address, Maps URL, `CTA_LABEL`). Change contact info here, never inline in components.
- `src/data/photos.ts` is the photo catalog. Files are `.webp` by default; pass `'jpg'` as the last argument of `photo()` for JPEGs. Each entry hardcodes `w`/`h` (used to prevent layout shift) and a descriptive Portuguese `alt`. When a photo is replaced or re-optimized, update its dimensions here. Paths are built from `import.meta.env.BASE_URL` so they work under the GitHub Pages sub-path; any new asset reference must do the same.
- `src/lib/gsap.ts` registers GSAP plugins once and exports `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP` plus the `MQ` media queries. Always import GSAP from here, not from `gsap` directly. Animations are gated with `gsap.matchMedia()` using `MQ.motion` / `MQ.desktop` (heavy effects like pin, parallax, horizontal scroll only on desktop) / `MQ.finePointer` (hover micro-interactions).
- Section background colors: each `<section data-bg="blush|sun|lilac|mint">` declares its color, and `BackgroundShift` crossfades fixed layers behind the page as sections cross mid-viewport. `BackgroundShift` must stay rendered **last** in `App` so pinned sections have already created their spacers.
- The `design-taste-frontend` skill (from github.com/Leonxlnx/taste-skill) is installed in `.claude/skills/`. Use it for visual/design work. `.claude` is gitignored, so it is local only.
- Brand tokens live in the `@theme` block of `src/index.css` (`ink`, `blush`, `sun`, `lilac`, `mint`, `cta`, `cta-dark`, plus display/sans fonts). `cta` is reserved for action buttons only.
