# Build deviations — walking-skeleton-1

One design deviation; no spec requirement was touched and no behavioral assertion was weakened.

## 1. Self-hosted fonts instead of the mockup's Google Fonts CDN

- **Design said:** `design/shell-mockup.html` loads Instrument Serif, Schibsted Grotesk, and Spline Sans Mono from `fonts.googleapis.com`.
- **Build did:** the same three faces, self-hosted via `@fontsource/*` packages and bundled into the build (so the service worker precaches them).
- **Why:** requirement 4 — "offline operation depends on no network request after first load" — is violated by any CDN reference. A first offline relaunch would render fallback fonts (or block on the stylesheet) with the CDN unreachable.
- **Authoring lesson:** a design artifact for an offline-first app should treat every external URL as a defect; name the faces, don't link them. (The design *spec* was clean — only the throwaway mockup HTML carried the CDN link, and mockups are allowed to be lazy. Lesson is for anyone tempted to copy mockup `<head>` markup into the app.)

## 2. Test-wiring corrections during Stage 2 (pre-gate, recorded for transparency)

Neither changed an assertion; both made the runners work at all, before any implementation existed:

- `deploy-workflow.test.ts` gained `// @vitest-environment node` — under the suite-wide jsdom environment, `import.meta.url` is not a `file://` URL, so the workflow file couldn't be read.
- `vite.config.ts` gained `test.globals: true` — Testing Library's automatic per-test cleanup registers through the global `afterEach`, and without it a second `render()` in the same file sees the first render's DOM (duplicate-element failures).
