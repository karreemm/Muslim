# Muslim — Documentation

This folder is the source of truth for how the **Muslim** project works, how it is
changing, and what an agent or contributor must know before touching the code.

The GitHub landing page stays at [`../README.md`](../README.md). Everything deeper
lives here.

---

## Start here

| Order | Document | Read it when |
|---|---|---|
| 1 | [`project-overview.md`](./project-overview.md) | Always. It explains the product, routes, architecture, patterns, state, and invariants. |
| 2 | [`testing.md`](./testing.md) | Before adding tests or changing CI. |
| 3 | `ui-ux-guidelines.md` *(planned, Phase 2)* | Before changing UI, copy, layout, tokens, or accessibility. |
| 4 | `operations.md` *(planned, Phase 5)* | Before changing env vars, Supabase, deployment, or keep-alive. |
| 5 | [`api.md`](./api.md) | Before changing an API route or external integration. |
| 6 | The active file in [`changes/`](./changes/) | Before continuing in-progress work. |

---

## The two kinds of documents

### Living docs

Stable guides that describe how the project works **today**:

- `project-overview.md`
- `ui-ux-guidelines.md`
- `testing.md`
- `operations.md`
- `api.md`

Update them in place when the truth changes. Do not create a new version for every
change.

### Change records

One file per meaningful change/PR, under `changes/`:

```
docs/changes/YYYY-MM-DD-<short-slug>.md
```

Use [`_template.md`](./_template.md). A change record captures **date, branch,
commit, scope, summary, changes, tests, risks, and follow-ups**, so any agent can
see what happened and what is still in progress.

> Small typo fixes do not need a change record. Anything that changes behavior,
> structure, dependencies, data, or user-facing UI does.

---

## Status vocabulary

| Status | Meaning |
|---|---|
| `draft` | Written, not implemented yet. |
| `in-progress` | Implementation is underway. |
| `review` | Code and docs are ready for review. |
| `done` | Merged and verified. |
| `superseded` | Replaced by a newer document. |

---

## Progress board

Update this table whenever a change record moves status.

| Date | Branch | Scope | Status | Record |
|---|---|---|---|---|
| 2026-11-17 | `chore/professional-foundation` | docs, repo foundation, Supabase keep-alive | `done` | [Professional foundation](./changes/2026-11-17-professional-foundation.md) |
| 2026-11-17 | `chore/professional-foundation` | tooling, tests, CI, error boundaries | `done` | [Tooling and test foundation](./changes/2026-11-17-tooling-and-test-foundation.md) |
| 2026-11-17 | `chore/professional-foundation` | React 19 + type migration | `done` | [React 19 upgrade](./changes/2026-11-17-react-19-upgrade.md) |
| 2026-11-18 | `chore/professional-foundation` | consistency, UI primitives, storage, i18n, services, env | `done` | [Phase 2 consistency](./changes/2026-11-18-phase-2-consistency.md) |

---

## Agent workflow

### Before changing code

1. Read `project-overview.md`.
2. Read the living guide for the area you will touch.
3. Check `changes/` for an in-progress record that overlaps your task.
4. Search the code for an existing pattern before creating a new one.
5. If the task needs a new pattern, write the decision in a change record first.

### While working

- Keep the change record updated: scope, files, decisions, test evidence.
- Do not mix unrelated refactors into a feature/fix record.
- Do not rename or move public routes, storage keys, or API contracts without a
  migration and an explicit note in the record.
- Add tests with the change, not after.

### Before finishing

1. Run the checks that exist at that point (see `package.json`).
2. Fill in **Testing → Results** in the change record.
3. Update the **Progress** checklist.
4. Update the progress board above.
5. If the change altered architecture, update `project-overview.md`.

---

## Definition of done

A change is done when:

- [ ] It follows the patterns in `project-overview.md` (or documents a deliberate deviation).
- [ ] `npm run check` passes (typecheck + lint + unit/integration/component tests).
- [ ] `npm run test:e2e` passes when a route or user flow changed.
- [ ] No new user-facing strings outside `locales/`.
- [ ] No new raw colors outside design tokens.
- [ ] No new direct `localStorage` access outside the storage helper.
- [ ] Accessibility was checked for new interactive UI.
- [ ] The change record is complete and the progress board is updated.

---

## Naming and formatting

- File names: lowercase kebab-case (`project-overview.md`, `2026-11-17-supabase-keepalive.md`).
- Language: English for docs; Arabic/English copy belongs in `locales/`.
- Dates: ISO `YYYY-MM-DD`.
- Code references: always use repository-relative paths, e.g. `app/(pages)/azkar/Azkar.tsx`.
- Keep docs concise but factual. Link to files instead of pasting large code blocks.
