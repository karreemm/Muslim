# Documentation

Source of truth for how the project works and what is changing. The GitHub landing
page is [`../README.md`](../README.md).

## Start here

| # | Doc | Read when |
|---|---|---|
| 1 | [Project overview](./project-overview.md) | Always — routes, architecture, invariants |
| 2 | [Testing](./testing.md) | Before adding tests or touching CI |
| 3 | [UI/UX](./ui-ux-guidelines.md) | Before UI, copy, layout, or tokens |
| 4 | [Operations](./operations.md) | Before env vars, Supabase, or deployment |
| 5 | [API](./api.md) | Before an API route or integration |
| 6 | [Changes](./changes/) | Before continuing in-progress work |

## Two kinds of docs

- **Living guides** (`project-overview`, `ui-ux-guidelines`, `testing`, `operations`,
  `api`) describe the system today. Update them in place.
- **Change records** (`changes/YYYY-MM-DD-<slug>.md`) are append-only history. Use
  [`_template.md`](./_template.md). Small typo fixes do not need one; behavior,
  structure, dependency, data, or UI changes do.

## Status vocabulary

| Status | Meaning |
|---|---|
| `draft` | Written, not implemented |
| `in-progress` | Underway |
| `review` | Ready for review |
| `done` | Merged and verified |
| `superseded` | Replaced |

## Progress board

| Date | Scope | Status | Record |
|---|---|---|---|
| 2026-11-17 | docs, repo foundation, keep-alive | `done` | [Foundation](./changes/2026-11-17-professional-foundation.md) |
| 2026-11-17 | tooling, tests, CI, error boundaries | `done` | [Tooling](./changes/2026-11-17-tooling-and-test-foundation.md) |
| 2026-11-17 | React 19 + type migration | `done` | [React 19](./changes/2026-11-17-react-19-upgrade.md) |
| 2026-11-18 | consistency, UI primitives, storage, i18n | `done` | [Phase 2](./changes/2026-11-18-phase-2-consistency.md) |
| 2026-11-18 | SEO metadata, sitemap, robots, manifest | `done` | [Phase 3A](./changes/2026-11-18-phase-3a-seo-metadata.md) |
| 2026-11-19 | fonts, WebP, bundle splitting, dates | `done` | [Phase 3B](./changes/2026-11-19-phase-3b-performance.md) |
| 2026-11-19 | headers, CSP, API hardening | `done` | [Phase 3C](./changes/2026-11-19-phase-3c-security.md) |
| 2026-11-20 | accessibility, journeys, cross-browser | `review` | [Phase 4](./changes/2026-11-20-phase-4-quality.md) |
| 2026-11-21 | minimal docs, contributor files, license, visual suite removal | `review` | [Phase 5](./changes/2026-11-21-phase-5-docs.md) |
| 2026-11-21 | read-only memorial verses, saved-ayah landing, save feedback | `review` | [Reader fixes](./changes/2026-11-21-reader-fixes.md) |
| 2026-11-25 | cross-device Qibla finder, true-north compass | `review` | [Qibla finder](./changes/2026-11-25-qibla-finder.md) |
| 2026-11-26 | Qibla redesign, one compass, governorate fallback | `review` | [Qibla redesign](./changes/2026-11-26-qibla-redesign.md) |

## Workflow

1. Read the overview and the guide for your area.
2. Search the code for an existing pattern before adding one.
3. Keep the change focused; add tests with it.
4. Update the living docs it affects and add a change record if it changes
   behavior, structure, dependencies, data, or UI.
5. Run the checks in `package.json` (`npm run check`, `npm run test:e2e`).

Formatting: lowercase kebab-case filenames, ISO dates, repository-relative paths,
short and factual prose.
