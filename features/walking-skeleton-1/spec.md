# Walking skeleton — spec

## Intent

**What:** The thinnest vertical slice threading every seam — a static verb dataset containing one fully-populated verb (*être*), an index screen rendered from that data, plain placeholder screens for grid and drill, all wrapped in a PWA shell deployed to Fly.io via GitHub Actions.

**Why:** Proves data → UI, routing, install, offline caching, and verified deploy end to end before any depth is built on them.

**Success:** From an iPhone — install from Safari, enable airplane mode, relaunch from the home screen: the app opens standalone, shows *être* with its meaning, and navigates to its placeholders. The deploy that put it there passed a real post-deploy health probe.

**Out of scope:** Derivation engine, real grid, drill loop, the other nine verbs, phonetic verification, install polish beyond the minimum (icon set, splash screens), service-worker update flow (feature 7).

## Behavioral requirements

### 1. Data-driven index

As the learner, opening the app shows every verb in the dataset.

- The index lists each verb in the dataset with its infinitive, English meaning, and pseudo-phonetic respelling.
- The dataset contains exactly *être*, fully populated per the Shape's Verb data fields: English meaning, six present-tense forms, past participle, future stem, auxiliary choice, and a pseudo-phonetic respelling for every French surface.
- Rendering is data-driven: a dataset fixture with a second verb renders two index entries with no code change.

### 2. Navigation shell

As the learner, I can move between the app's areas.

- Tapping a verb opens its grid placeholder — real title (the infinitive), stub body naming what will live there.
- A drill placeholder is reachable from persistent navigation.
- One back action from a placeholder returns to the index.
- Persistent navigation is anchored at the bottom of the viewport, reachable by the right thumb in portrait.

### 3. Installable PWA

As the learner, I can add Nonante to my home screen and it launches like an app.

- Valid manifest (name, icons, standalone display); served over HTTPS.
- Launched from the home screen, it opens with no browser chrome.

### 4. Offline

As the learner, once the app has loaded once, it opens with no network.

- The service worker precaches the app shell and verb data on first visit.
- With the network unavailable, relaunching renders the index with its data — never a browser error page.

### 5. Verified deploy

As the owner, pushing to `main` releases to Fly and fails loudly if unhealthy.

- GitHub Actions runs build, tests, and `flyctl deploy` on push to `main`.
- A post-deploy probe against the live app must return healthy within a bounded retry window or the job fails.

### Edge cases / failure modes

- Malformed or missing dataset → the index shows an explicit error state naming the problem, never a blank screen.
- Unknown route → shell lands on the index.
- First-ever visit with no network: nothing is cached; browser-level failure is acceptable, no requirement.

## Design

Components and seams, from the declaration's Shape:

- **Verb data** — static file shipped with the app; the index's contents change with the data and only the data. Schema carries the primitive fields named in the declaration.
- **Index screen** — entry point; renders the dataset.
- **PWA shell** — manifest, service worker, routing. Standalone launch and offline render are its behavioral properties.
- **Placeholders** (grid, drill) — real titles, stub bodies; owned by features 3 and 4.
- **Deploy seam** — `Reuses pattern: Fly.io deploy via GitHub Actions.`
- **Frontend** — `Reuses pattern: Frontend stack (React + TypeScript + Tailwind + shadcn/ui).`

Behavioral constraints:

- Dark mode is the default surface; light adapts from the same tokens.
- No primary action lives only at the top of the screen.
- Offline operation depends on no network request after first load.

Design artifacts live in `design/` (`design-spec.md`, `shell-mockup.html`). Design artifacts define the shell and visual system only; screen-level design is explicitly out of scope for this feature.

## Handoff

Ready for `/ship`. Feature folder: `features/walking-skeleton-1/`.

## Coverage

Test roots: `tests/vitest/` (Vitest, jsdom) and `tests/playwright/` (Playwright, Chromium, production build). Fixtures in `tests/fixtures/`.

| Requirement / seam | Test(s) | Tag |
|---|---|---|
| 1 · Data-driven index — index lists infinitive, meaning, respelling | `vitest/index-screen.test.tsx` › "shows the shipped verb…" | @scaffolding (App surface), behavior frozen |
| 1 · Dataset contains exactly *être*, fully populated | `vitest/dataset.test.ts` (all four tests) | @scaffolding (module path), content frozen |
| 1 · Rendering is data-driven (two-verb fixture → two entries) | `vitest/index-screen.test.tsx` › "renders one entry per verb…" | @scaffolding |
| 2 · Verb → grid placeholder (real title, stub body) | `vitest/navigation.test.tsx` › "tapping a verb opens its grid placeholder…" | @scaffolding |
| 2 · Drill placeholder reachable from persistent nav | `vitest/navigation.test.tsx` › "reaches the drill placeholder…" + "keeps the navigation present…" | @scaffolding |
| 2 · One back action returns to index | `vitest/navigation.test.tsx` › "one back action…" | @scaffolding |
| 2 · Nav anchored at viewport bottom, thumb-sized targets | `playwright/shell.spec.ts` (all three tests) | @frozen |
| 3 · Valid manifest (name, icons, standalone) | `playwright/pwa.spec.ts` › "serves a valid manifest…" | @frozen |
| 3 · HTTPS + no browser chrome on launch | Not machine-testable pre-deploy: HTTPS is Fly's TLS termination (verified live in the release watch); standalone launch is the manifest `display` assertion plus the spec's on-device Success check | — |
| 4 · SW precaches shell + data; offline relaunch renders index | `playwright/pwa.spec.ts` › both offline tests | @frozen |
| 5 · Actions runs build/tests/deploy on push to main; post-deploy probe fails job if unhealthy | `vitest/deploy-workflow.test.ts` (structural, config-level: trigger, ordering, probe can fail — no `continue-on-error`, no swallowed exit) + live verification of the real run during the release watch. Note: the release watch can only observe the happy path; the "fails loudly" half rests on the structural assertions. | @scaffolding |
| Edge · Malformed/missing dataset → explicit error naming the problem | `vitest/index-screen.test.tsx` › both error-state tests | @scaffolding |
| Edge · Unknown route lands on index | `vitest/navigation.test.tsx` › "lands on the index for an unknown route" | @scaffolding |
| Edge · First-ever visit with no network | No requirement per spec — untested by design | — |

Seam notes: the dataset's shape (the Verb data schema) is exercised by every Vitest suite through the same parse path the app uses; the deploy seam's *execution* is deliberately left to the post-merge release watch rather than mocked.

## Adversarial gate

Run once by a clean-context subagent against the spec and tests (no implementation existed yet). One MEDIUM, three LOW; zero HIGH, so no mid-run pause. Every fix was unambiguous and landed in the tests; nothing carries into the PR's Risks for review.

| # | Severity | Lens | Finding | Disposition |
|---|----------|------|---------|-------------|
| 1 | MEDIUM | Coverage | The deploy-probe assertions (`/health\|probe\|curl/` + `/retry\|for\|attempt/`) would pass a probe that cannot fail the job (`\|\| true`, `continue-on-error: true`), and the release watch only ever observes the happy path — so "fails loudly if unhealthy" could ship silently broken. | **Fixed in tests:** added a test asserting the probe step has no `continue-on-error`, no swallowed exit (`\|\| true` / `\|\| exit 0`), and that curl probes use `-f/--fail`; dropped the weak `for\b` regex; Coverage map now names the happy-path limit of the release watch. |
| 2 | LOW | Integrity | Two @frozen surfaces pinned non-contract internals: the dataset's module path (`@/data/verbs.json`) and the `/drill` route path (via `page.goto('/drill')`), which the spec never names. | **Fixed in tests:** `dataset.test.ts` retagged @scaffolding (module path provisional, content frozen); `shell.spec.ts` now reaches the drill placeholder through the nav instead of a hard-coded route. |
| 3 | LOW | Coverage | The two-verb test never asserted *avoir*'s phonetic, so an implementation hardcoding the phonetic line ("EH-truh") would pass the whole suite while violating the data-driven clause. | **Fixed in tests:** the two-verb test now asserts `ah-VWAHR`. |
| 4 | LOW | Coverage | Thumb reachability was asserted as bottom-anchoring plus link *height* only; 10px-wide links would pass yet fail one-thumb use. | **Fixed in tests:** nav links now asserted ≥ 44px in both dimensions. |

Clean lenses: scope drift (nothing touches the declaration's Out of scope), document integrity (tags, wiring, and French all consistent), security (HIGH-only review of the two `Reuses pattern:` seams found nothing at that bar), offline seam (the frozen offline test protects against a non-precached dataset regardless of implementation), WCAG (token palette clears 4.5:1 for the named pairs).
