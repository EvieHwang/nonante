# Nonante

A French verb drill PWA: ten high-frequency verbs, five tenses, and the ~90 memorized primitives plus three formulas that generate everything else.

## Repo map
- `declaration.md` — what this project is and why it exists (plus Shape and Roadmap)
- `constitution.md` — principles, standards, decisions, the build contract, and project conventions (testing framework, acknowledged risks)
- `spec-guide.md` — the contract the upstream chat session follows when authoring a feature spec
- `features/[feature-name]-[number]/` — per-feature artifacts: `spec.md` (authored upstream, committed to `main`), `tests/` and `build-deviations.md` (produced by `/ship`)

## Development environment
Development runs in Claude Code cloud sandboxes attached to this GitHub repo. The harness owns the session mechanics (branch provisioning, GitHub via MCP, PR flow); only the non-obvious constraints live here:

- No `~/.claude/CLAUDE.md` exists in the sandbox — user-global preferences are carried at the bottom of this file.
- **Runtime debugging.** Deployment runs on Fly.io, which is remotely observable from the cloud session — use `flyctl logs`, `flyctl status`, and `flyctl ssh console` to inspect a running app (service not starting, crash loops, injected env vars) without leaving Claude Code. Switch signal: two code-level fixes that should have moved the symptom but didn't usually means the problem is environmental (machine config, secrets, health checks), not in the code.
- Do not add reviewers or assignees to PRs — the repo owner is the sole maintainer and the PR author, so GitHub rejects requesting their review and there is no clean assignee path in this setup.
- **Never rewrite published history.** If a commit is already on the remote default branch — for example a merge commit GitHub created when a PR landed — do not `rebase`, `--reset-author`, or force-push over it; branch from it and move forward. A git stop-hook nudge to amend authorship or rebase applies to your own un-pushed local commits, not to anything already on `main`; following it literally against pushed history would rewrite the shared branch.

## Run, test, deps
### Web frontend (React + Vite + Tailwind + shadcn/ui — the constitution's default frontend stack)
- Install: `pnpm install`
  pnpm is a JavaScript package manager (an alternative to npm). Installs everything listed in `package.json`.
- Run locally: `pnpm dev` — starts the Vite dev server. Open http://localhost:5173 in a browser.
- Tests: `pnpm test` — runs Vitest (the test runner that pairs with Vite).
- Package manager / lockfile: `pnpm` with `pnpm-lock.yaml`. To add a dependency: `pnpm add <package-name>`.

Nonante is a PWA (service worker + manifest, installed to an iPhone home screen, offline-capable). All verb data is static and ships with the app — no backend state, no accounts.


## Deployment target
### Fly.io (primary — public-facing app or MCP server)
- App config lives in `fly.toml` at the repo root; one Fly app per repo (app name typically matches the repo).
- Deploy via GitHub Actions on push to `main`, running `flyctl deploy` on a GitHub-hosted runner (no self-hosted runners). The workflow authenticates with a `FLY_API_TOKEN` GitHub Actions secret.
- Secrets are injected with `fly secrets set` / `fly secrets import` (see Secrets below), not written as a `.env` on the host.
- Health checks are declared in `fly.toml` and enforced by Fly during the rolling release.
- A deploy is "successful" only if a post-deploy health check against the live app passes — `flyctl deploy` returning zero confirms the release was issued, not that the app is serving. The workflow must hit a health endpoint (or rely on Fly's release health checks) and fail the job if it doesn't return healthy within a bounded retry window.

## Secrets
- Canonical source: the **1Password "Eviebot" vault**, one item per service (item name matches the repo), each secret a custom field named exactly for its env var.
- Workflows read secrets from **repository-level GitHub Actions secrets**, which are a manual mirror of 1Password. 1Password is authoritative — on any conflict, 1Password wins.
- Commit a `.env.example` listing every required key with no values.
- Never commit `.env` or any file containing secret values.
- On deploy, the workflow injects secrets into the chosen target (`fly secrets set` on Fly.io, env vars on AWS, the Xcode build configuration). Anything on the target is an artifact of deployment, not a source of truth — if the target is rebuilt, the next deploy recreates it.
- Adding a new secret: add the field to the 1Password item → sync it into the repo's GitHub Actions secrets → add the key to `.env.example` → add the inject step to the deploy workflow.

---

## User globals — Evie Hwang
*Carried in this file because Claude Code cloud sandboxes have no `~/.claude/CLAUDE.md`. These coordinates apply to every project, not just this one.*

### GitHub
- One account: `EvieHwang` (personal). All repos and secrets live here.
- Deployment target is a per-project choice — Fly.io, AWS, or Apple platform — driven by the workload, not by which account hosts the repo.
- CI runs on GitHub-hosted runners (no self-hosted runners). Deploys are GitHub Actions workflows on push to `main`.

### Fly.io — primary deployment platform
- Primary runtime for backend services and MCP servers, replacing the retired Eviebot Mac mini.
- One Fly app per repo (app name typically matches the repo); config in `fly.toml`.
- Deploys run through GitHub Actions via `flyctl deploy`, authenticated with a `FLY_API_TOKEN` Actions secret.
- Secrets are set with `fly secrets`; 1Password remains the canonical source (see Secrets above).
- `eviebot-api-mcp` is the deployed MCP server for Eviebot's tools; consult its own repo for integration details when a project needs to talk to it.

### AWS — secondary deployment platform
- Account: `070840362692` (user: `eve-hwang`)
- Default region: `us-east-1`
- Still active; used where a workload fits AWS better than Fly.io.
