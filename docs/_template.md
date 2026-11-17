---
doc_type: change
title: "<Short descriptive title>"
doc_id: "CHG-0000"
date: "YYYY-MM-DD"
branch: "<branch-name>"
commit: "<short-sha>"
author: "<name or agent>"
status: draft
scope: []
related_files: []
related_docs: []
---

# <Short descriptive title>

> **How to use this template**
>
> - For a change/PR record, copy this file to `docs/changes/YYYY-MM-DD-<slug>.md`.
> - For a living guide (architecture, testing, operations), copy it to `docs/<name>.md`
>   and remove the `branch`/`commit` fields.
> - Keep every section. Write `N/A` when a section does not apply.
> - Never rewrite history: append to **Change Log** instead.

## At a glance

| Field | Value |
|---|---|
| Date | YYYY-MM-DD |
| Branch | `<branch>` |
| Commit | `<short-sha>` |
| Scope | `<area 1>, <area 2>` |
| Status | `draft` |

## Progress

- [ ] Analysis complete
- [ ] Implementation complete
- [ ] Tests added/updated
- [ ] Typecheck + lint pass
- [ ] Docs updated
- [ ] Verified on a running build
- [ ] Ready for review

## Summary

<!-- 2–5 bullets: what changed and why. This is the section an agent reads first. -->

- 

## Context / Problem

<!-- What was wrong, missing, risky, or inconsistent? Link evidence: files, screenshots, logs, issues. -->

## Scope

### In scope

- 

### Out of scope

- 

## Changes

| Area | File(s) | What changed / why |
|------|---------|--------------------|
| | | |

## Architecture & Patterns

<!-- New patterns introduced, patterns removed, import rules, trade-offs, alternatives considered. -->

## Data & API Changes

<!-- Routes, payloads, Supabase schema, storage keys, migrations, backward compatibility. -->

## UI / UX Changes

<!-- Screens, components, tokens, RTL, responsive, accessibility, copy changes. -->

## Testing

### Commands run

```bash
# e.g.
npm run typecheck
npm run lint
npm run test
npm run test:e2e
```

### Results

| Check | Result |
|-------|--------|
| Typecheck | |
| Lint | |
| Unit/Integration | |
| E2E | |

### Gaps / not covered

- 

## Risks & Rollback

<!-- What could break? How do we detect it? How do we roll back? Any data migration risk? -->

## Follow-ups

- [ ] 

## Agent Checklist

- [ ] Read `docs/project-overview.md` and the relevant living guide.
- [ ] Followed existing patterns or documented a deliberate deviation.
- [ ] No user-facing string added outside `locales/`.
- [ ] No raw colors added outside design tokens.
- [ ] No direct `localStorage` access added outside the storage helper.
- [ ] Added/updated tests for the changed behavior.
- [ ] Ran `npm run check` (once available).
- [ ] Updated this document and the progress board in `docs/README.md`.

## Change Log

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | | Created |

## Related Links

- 
