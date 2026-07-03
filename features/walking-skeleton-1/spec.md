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
