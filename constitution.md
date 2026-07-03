# Constitution

## Standards
Interface:        Apple Human Interface Guidelines
                  developer.apple.com/design/human-interface-guidelines
Accessibility:    WCAG 2.1 AA
                  w3.org/WAI/WCAG21/quickref
Security:         OWASP Top 10
                  owasp.org/www-project-top-ten
API contracts:    OpenAPI Specification
                  spec.openapis.org

Extended (apply when relevant):
API design:       Microsoft REST API Guidelines
AI integration:   OWASP Top 10 for LLMs
Security depth:   OWASP ASVS

Agents follow these without deviation unless the declaration 
explicitly requires otherwise. Deviation must be surfaced as 
a decision, not made silently.

## Architectural principles
- The spec is the contract. Its requirements are never modified during implementation; if a requirement is wrong, `/ship` stops and raises it to the owner rather than patching it mid-build (see `## Build contract`).
- A project's **first feature is a walking skeleton**: the thinnest vertical slice that exercises the Shape's seams end to end, not the most valuable feature. Depth comes from feature 2 onward.
- No Docker for local development unless the project has multi-service dependencies that genuinely require it.
- All deployments run through GitHub Actions, triggered by push to `main`.
- Prefer first-class deploy tooling (`flyctl deploy` from GitHub Actions) over SSH-based deploy steps.
- A deploy is done when the release is **verified healthy** — a real probe of the running service — not when CI turns green.

[Add app-specific principles below as they are decided.]

## Build contract
*How `/ship` treats the spec and tests during implementation. Framework-owned; applies to every feature.*

- **Tests are the source of truth.** A failing test means the implementation is wrong. If, after genuine investigation, a test itself contains a clear error, correct it and record the change in the feature's `build-deviations.md`: which test, the original assertion, why it was wrong, what was corrected.
- **`@frozen` vs. `@scaffolding`.** A test tagged `@frozen` (or untagged) is a hard contract — satisfied as written. `@scaffolding` marks an interface surface named ahead of the implementation only to make behavior testable; the surface may be refined as long as the asserted behavior holds, logged in `build-deviations.md`. This is latitude over provisional interface detail, never license to weaken a behavioral assertion.
- **Requirements are immutable during a build.** If a requirement looks actually *wrong* — not hard, wrong — stop and raise it to the owner; the spec is edited only at their direction, and a security-relevant edit gets a clean-context re-check. Never patch a requirement silently mid-build.
- **Design is a recommendation.** When implementation reality contradicts the spec's design, satisfy the behavioral requirement another way and log the deviation. `build-deviations.md` is the feedback channel to future spec authoring — write each entry to be legible to the next spec author, naming the authoring mistake it exposes, not just the local fix.
- **A weak test is worse than no test; a premature test is the opposite failure.** Weak tests create false confidence; premature tests pin implementation detail and foreclose valid implementations. Both are defects, and the fix for one is never to commit the other.

## Patterns in use
- **Frontend stack:** React + TypeScript + Tailwind + shadcn/ui. Vanilla JS is acceptable only for stateless single-page tools.
- **UI aesthetic:** information-dense, 14px base, tight line heights, dark mode as a first-class surface.
- **UX checklist:** apply Nielsen's 10 heuristics as a general sanity-check on any interface; Apple HIG (see Standards) is the authoritative reference for platform decisions.
- **Python service layout:** `pyproject.toml` with a console-script entry point (not `requirements.txt`); Fly deployment config (`fly.toml`, and a `Dockerfile` if the build needs one) lives at the repo root.

[Add app-specific patterns below as they are established.]

## Spec-authoring lessons
*Recurring spec/test-authoring mistakes learned from real builds, routed here by `/ship` from `build-deviations.md` so they don't recur. Both the upstream spec author (per `spec-guide.md`) and `/ship` read this section before working. Keep each entry concrete: the mistake, and the rule that prevents it, tagged with the feature it came from.*

- Nonante is offline-first: a design artifact that references any external URL (font CDN, script, image host) is specifying a defect. Name the typefaces; the build self-hosts them. (walking-skeleton-1)
- Don't pin surfaces the spec never names (a dataset's module path, a route string) in `@frozen` tests — tag the file `@scaffolding` with the behavior noted as frozen, or reach the screen the way a user does. (walking-skeleton-1)
- A "fails loudly" requirement needs a test that the failure path *can* fire (no `continue-on-error`, no swallowed exit codes) — a green happy path can't distinguish a working alarm from a disconnected one. (walking-skeleton-1)

## Quality gates
- All tests pass — and CI runs the same build the deploy runs. If the test runner doesn't type-check/compile (Vitest, esbuild, isolatedModules), CI also runs the production build (`tsc` / `pnpm build` / `mypy` / `go build`).
- `README.md` and `CLAUDE.md` exist and are current.
- `.env.example` lists every key the deploy workflow injects — no drift between the committed example and the actual required secrets.

[Add app-specific gates below as they are established.]

## Testing
*One block per test runner. A polyglot repo (e.g. a Python API plus a JS/TS frontend) has more than one — list each, because the green bar `/ship` must hit is **every** runner passing. `Test root` records how this runner discovers the per-feature suites under `features/*/tests/` — the one-time wiring `/ship` establishes so feature tests are executable without per-feature path hacks. A single-runner project has just one block. Populated by `/ship` on first use.*

- **Runner:** Vitest (jsdom + Testing Library) — data, components, routing behavior
  **Run:** `pnpm test`
  **Test root:** `vite.config.ts` `test.include` globs `features/*/tests/vitest/**/*.test.{ts,tsx}` (plus `src/**/*.test.{ts,tsx}` for unit tests beside code). The `@` alias resolves to `src/`, so feature tests import app surfaces as `@/...` with no relative-path hacks.

- **Runner:** Playwright (Chromium, iPhone-sized viewport) — PWA seams: manifest, service worker, offline render
  **Run:** `pnpm test:e2e`
  **Test root:** `playwright.config.ts` sets `testDir: 'features'` with `testMatch: '**/tests/playwright/**/*.spec.ts'`. Runs against the production build via `vite preview` (the service worker doesn't exist in the dev server), started automatically by the config's `webServer`.

## Out of scope
[List what this codebase explicitly does not do. Populated per app.]

## Decision log
| Date | Decision | Rationale |
|------|----------|-----------|
[populated as significant decisions are made]

## Acknowledged risks
*Cross-feature accumulation surface. Each adversarial-gate finding the owner acknowledges — by an explicit answer during `/ship`, or by merging a PR whose body carries it under "Risks for review" — gets one row here so the project never silently forgets that it knowingly took on risk. Severity is the unmitigated severity — an acknowledged HIGH stays HIGH. Populated by `/ship`.*

| Feature | Finding | Severity | Risk | Rationale | Mitigation |
|---------|---------|----------|------|-----------|------------|
[populated by the adversarial gate in /ship]
