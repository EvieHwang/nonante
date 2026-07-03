# Nonante

A French verb drill PWA: ten high-frequency verbs, five tenses, and the ~90 memorized primitives plus three formulas that generate everything else.

Named for *nonante*, the Belgian/Swiss French word for 90 — the number of things the app actually asks you to memorize, and a quiet joke about standard French insisting on *quatre-vingt-dix*.

Three surfaces: an index of the ten verbs, a per-verb grid (6 persons × 5 tenses) that visually separates memorized primitives from formula-derived forms, and a two-tap flip-card drill built for one-handed use on a walk. Serif typography, warm palette, dark mode. No accounts, no persistence, no gamification — a tool for a person who has already decided to practice.

- `declaration.md` — what this is, why, for whom, shape, and roadmap
- `constitution.md` — standards, principles, and the build contract
- Deployed on Fly.io as an offline-capable PWA installed to an iPhone home screen

## Develop

React + TypeScript + Vite + Tailwind. Verb data is static and ships with the app — no backend.

```sh
pnpm install        # deps
pnpm dev            # dev server at http://localhost:5173
pnpm test           # Vitest — data, screens, routing, deploy-workflow contract
pnpm test:e2e       # Playwright — PWA seams (manifest, offline) against the production build
pnpm build          # type-check + production bundle
```

Feature acceptance suites live in `features/*/tests/`; both runners discover them (see `constitution.md` § Testing).

## Deploy

Push to `main` → GitHub Actions runs both suites and the build, then `flyctl deploy` (app `nonante`, config in `fly.toml`, nginx serving `dist/`). The job fails unless a post-deploy probe of `https://nonante.fly.dev/healthz` returns healthy within a bounded retry window.
