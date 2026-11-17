---
doc_type: change
title: "Professional foundation: docs system, baseline cleanup, Supabase keep-alive"
doc_id: "CHG-0001"
date: "2026-11-17"
branch: "chore/professional-foundation"
commit: ""
author: "OpenCode agent"
status: review
scope: [docs, repo-foundation, operations]
related_files:
  - docs/README.md
  - docs/_template.md
  - docs/project-overview.md
  - docs/api.md
  - docs/changes/2026-11-17-professional-foundation.md
  - README.md
  - package.json
  - scripts/supabase-keepalive.mjs
  - .github/workflows/supabase-keepalive.yml
related_docs:
  - docs/project-overview.md
  - docs/api.md
---

# Professional foundation: docs system, baseline cleanup, Supabase keep-alive

## At a glance

| Field | Value |
|---|---|
| Date | 2026-11-17 |
| Branch | `chore/professional-foundation` |
| Commit | pending |
| Scope | docs, repo foundation, operations |
| Status | `review` |

## Progress

- [x] Analysis complete
- [x] Implementation complete
- [ ] Tests added/updated (not applicable yet; test suite starts in Phase 1)
- [x] Typecheck passes (lint repair is Phase 1)
- [x] Docs updated
- [x] Verified on a running build
- [x] Ready for review

## Summary

- Added a documentation system under `docs/` with a standard change template,
  conventions, a progress board, and an agent workflow.
- Rewrote the project overview as the single source of truth for product, routes,
  architecture, state, patterns, and invariants.
- Moved and expanded the API reference to cover internal route handlers plus all
  external APIs and Supabase.
- Removed the accidental `packageManager` field and added `npm run keepalive`.
- Added a daily Supabase keep-alive script and GitHub Actions workflow.
- Cleaned stale build artifacts and the empty `recite/` route folder so typecheck is
  no longer polluted by removed routes.

## Context / Problem

The repo had good source quality but no professional foundation:

- No tests, no CI, no error boundaries.
- `npm run lint` was broken because Next 16 removed `next lint`, and
  `eslint-config-next` was two major versions behind.
- `tsc` failed on stale `.next/types` that referenced a removed `recite` page.
- Documentation existed at the root but had drifted from the code (Next 14 vs 16,
  azkar categories/counts, missing contexts/routes).
- Supabase free projects pause after 7 days of inactivity, with no keep-alive job.

This change establishes the docs and operations baseline. It deliberately does not
change product behavior.

## Scope

### In scope

- Documentation structure, template, project overview, API reference.
- Baseline cleanup of stale build artifacts and the empty route folder.
- Package script for the keep-alive job and removal of the wrong package-manager
  metadata.
- Scheduled Supabase keep-alive.

### Out of scope

- ESLint 9 / Next 16 lint migration (Phase 1).
- Vitest/RTL/MSW/Playwright setup (Phase 1).
- UI primitives, i18n migration, storage refactor, data layer (Phase 2).
- Performance, SEO, accessibility, security hardening (Phases 2–3).
- Full regression suite (Phase 4).

## Changes

| Area | File(s) | What changed / why |
|---|---|---|
| Docs system | `docs/README.md` | Index, living-vs-change docs, statuses, progress board, agent workflow, definition of done. |
| Docs template | `docs/_template.md` | Date, branch, commit, scope, status, summary, changes, tests, risks, follow-ups, agent checklist. |
| Project overview | `docs/project-overview.md` | Rewritten from the old root overview; now covers all routes, providers, storage keys, APIs, patterns, invariants, and tech debt. |
| API reference | `docs/api.md` | Moved from `API_Doc.md`; added internal route table, Quran.com reading API, radio APIs, Supabase schema, keep-alive. |
| Root README | `README.md` | Kept as the GitHub landing page; added Documentation section, corrected versions, azkar categories, Node requirement, and API link. |
| Package metadata | `package.json` | Removed unintended `packageManager: yarn@1.22.22`; added `keepalive` script. |
| Keep-alive | `scripts/supabase-keepalive.mjs` | Read-only REST ping with timeout, retries, and safe logging. |
| CI/scheduler | `.github/workflows/supabase-keepalive.yml` | Daily cron + manual dispatch, least-privilege permissions, 5-minute timeout. |
| Housekeeping | `.next/`, `app/(pages)/recite/` | Removed stale build output and empty route folder. |

## Architecture & Patterns

- Docs are split into **living guides** (stable truth) and **change records** (dated
  progress). The progress board in `docs/README.md` is the quick status view.
- The root README stays at the repository root for GitHub; deeper docs live in
  `docs/`. No duplicated root-level `Project-Overview.md` or `API_Doc.md`.
- Change records are named `YYYY-MM-DD-<slug>.md` and use `_template.md`.
- The keep-alive script uses only Node built-ins (`fetch`, `AbortSignal.timeout`),
  so the workflow does not need `npm install`.
- The keep-alive job is read-only and uses the existing Supabase service-role secret.

## Data & API Changes

- No application API contract changed.
- No database schema changed.
- Added an operational dependency: repository secrets `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, and optional `SUPABASE_SADAQA_TABLE`.
- The keep-alive query is:
  `GET {SUPABASE_URL}/rest/v1/{table}?select=id&limit=1`.

## UI / UX Changes

None. This change is docs + operations only.

## Testing

### Commands run

```bash
npx tsc --noEmit
node --check scripts/supabase-keepalive.mjs
npm run build
npm run keepalive   # local verification with .env.local values
git diff --check
```

### Results

| Check | Result |
|-------|--------|
| Typecheck | ✅ `npx tsc --noEmit` — no errors after removing stale `.next` |
| Lint | ⚠️ Not run — `next lint` is broken; repair is Phase 1 |
| Unit/Integration | N/A — no suite yet |
| E2E | N/A — no suite yet |
| Build | ✅ `npm run build` — compiled successfully; 29 routes emitted |
| Keep-alive script | ✅ Local run against Supabase — HTTP 200, 1 row returned |
| `node --check` | ✅ `scripts/supabase-keepalive.mjs` syntax OK |
| `git diff --check` | ✅ No whitespace errors (only a CRLF normalization warning) |

### Gaps / not covered

- The GitHub Actions workflow cannot be executed from this machine; it will be
  verified on the first scheduled/manual run after the branch is pushed and secrets
  are configured.
- Lint remains broken until Phase 1.

## Risks & Rollback

| Risk | Impact | Mitigation |
|---|---|---|
| Service-role secret is powerful | A leaked secret gives full Supabase access | Stored only in GitHub Actions secrets; script logs no key/body; never prefix with `NEXT_PUBLIC_`. |
| Scheduled workflow can be delayed/disabled | Keep-alive may miss a day | Daily schedule gives 7 days of headroom; manual `workflow_dispatch` available. GitHub disables schedules after 60 days of repo inactivity. |
| Downstream docs links break | Confusion for contributors | Old root files were moved, not duplicated; root README links were updated. |
| Removing `.next` | None | It is a generated, gitignored artifact; the next build regenerates it. |
| Removing empty `recite/` | None | The directory contained no tracked files and had no route. |

Rollback: revert this branch. No data migration or runtime contract changed.

## Follow-ups

- [ ] Phase 1: ESLint 9 flat config + `eslint-config-next@16`; Prettier; scripts.
- [ ] Phase 1: Vitest + RTL + MSW + Playwright + axe; CI workflow.
- [ ] Phase 1: `error.tsx` / `global-error.tsx`, `.env.example`, env validation.
- [ ] Phase 2: UI primitives, i18n migration, storage helper, data layer, palette
      single source, remove 2s hydration gate.
- [ ] Phase 3: `next/font`, image optimization, metadata/sitemap/robots, security
      headers, shared rate limiting.
- [ ] Phase 4: full route/flow regression suite and accessibility scans.
- [ ] Phase 5: `docs/ui-ux-guidelines.md`, `docs/testing.md`, `docs/operations.md`.
- [ ] Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and optional
      `SUPABASE_SADAQA_TABLE` to GitHub Actions secrets.
- [ ] Push the branch and open a PR.

## Agent Checklist

- [x] Read `docs/project-overview.md` and `docs/README.md`.
- [x] Followed the docs conventions established here.
- [x] No user-facing string added outside `locales/` (no UI changes).
- [x] No raw colors added (no UI changes).
- [x] No direct `localStorage` access added.
- [x] Documented follow-ups and risks.
- [x] Updated the progress board in `docs/README.md`.

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-11-17 | OpenCode agent | Created Phase 0 docs, baseline cleanup, and keep-alive. |

## Related Links

- [Project overview](../project-overview.md)
- [API reference](../api.md)
- [Docs index](../README.md)
