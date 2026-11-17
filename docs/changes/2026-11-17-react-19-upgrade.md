---
doc_type: change
title: "React 19 upgrade and ref-type migration"
doc_id: "CHG-0003"
date: "2026-11-17"
branch: "chore/professional-foundation"
commit: ""
author: "OpenCode agent"
status: done
scope: [dependencies, react, types]
related_files:
  - package.json
  - package-lock.json
  - app/(pages)/generate-ayah-image/components/SearchableDropdown.tsx
  - app/(pages)/generate-ayah-image/components/AyahImagePreview.tsx
  - components/general/PlayerIconButton.tsx
  - components/general/audio-player/AudioPlayer.tsx
  - components/general/audio-player/AudioPlayerMobileSheet.tsx
  - components/general/audio-player/AudioPlayerProgressBar.tsx
  - components/general/audio-player/AudioPlayerReciterDropdown.tsx
  - hooks/readQuran/Useayahpopoverposition.ts
  - hooks/readQuran/useContainerFontSize.ts
related_docs:
  - docs/project-overview.md
  - docs/testing.md
  - docs/changes/2026-11-17-tooling-and-test-foundation.md
---

# React 19 upgrade and ref-type migration

## At a glance

| Field | Value |
|---|---|
| Date | 2026-11-17 |
| Branch | `chore/professional-foundation` |
| Commit | pending |
| Scope | dependencies, React runtime, TypeScript ref types |
| Status | `done` |

## Progress

- [x] Analysis complete
- [x] Implementation complete
- [x] Tests updated/verified
- [x] Typecheck + lint pass
- [x] Docs updated
- [x] Verified on a running build
- [x] Committed

## Summary

- Upgraded React and React DOM from `18.3.1` to `19.3.1`.
- Upgraded `@types/react` / `@types/react-dom` to `19.3.0`.
- Upgraded `react-spinners` from `0.14.1` to `0.17.1` (the only dependency whose
  peer range excluded React 19).
- Migrated component ref prop types from `RefObject<T>` to
  `RefObject<T | null>` to match React 19’s stricter `useRef<T>(null)` return type.
- Removed an unused `use` import from `SearchableDropdown.tsx`.
- Confirmed the Next 16 “React 18 support is deprecated” warning is gone.

## Context / Problem

Next.js 16 warns:

> React 18 support is deprecated in Next.js 16 and will be removed in Next.js 17.

The project was on React 18.3.1. A peer-dependency audit showed only
`react-spinners@0.14.1` blocked React 19; the other UI libraries already supported
it:

| Package | React 19 status |
|---|---|
| `@headlessui/react@2.2.9` | ✅ `^18 \|\| ^19` |
| `lucide-react@0.469.0` | ✅ includes `^19` |
| `@testing-library/react@16.3.3` | ✅ `^18 \|\| ^19` |
| `@vercel/analytics@2.0.1` | ✅ `^18 \|\| ^19` |
| `@fortawesome/react-fontawesome@0.2.2` | ✅ `react >=16.3` |
| `react-spinners@0.14.1` | ❌ max `^18` |
| `react-spinners@0.17.1` | ✅ `^19` |

## Scope

### In scope

- React / React DOM / type packages.
- `react-spinners` upgrade.
- Type-level ref migration required by React 19.
- Verification through typecheck, lint, unit tests, build, and E2E.

### Out of scope

- Adopting React 19-only features (`use`, Actions, `useOptimistic`, etc.).
- React Compiler.
- Any Phase 2 UI, i18n, storage, or data-layer refactor.

## Changes

| Area | File(s) | What changed / why |
|---|---|---|
| Runtime | `package.json`, `package-lock.json` | `react@19.3.1`, `react-dom@19.3.1`. |
| Types | `package.json` | `@types/react@19.3.0`, `@types/react-dom@19.3.0`. |
| Spinner | `package.json` | `react-spinners@0.17.1` for React 19 peer support. |
| Ref props | `AyahImagePreview.tsx`, `PlayerIconButton.tsx`, `AudioPlayer.tsx`, `AudioPlayerMobileSheet.tsx`, `AudioPlayerProgressBar.tsx`, `AudioPlayerReciterDropdown.tsx`, `Useayahpopoverposition.ts`, `useContainerFontSize.ts` | `RefObject<T>` → `RefObject<T \| null>`, matching React 19’s `useRef<T>(null)`. |
| Cleanup | `SearchableDropdown.tsx` | Removed unused `use` import. |

## Architecture & Patterns

React 19’s `useRef<T>(null)` returns `RefObject<T | null>`. Components that accept a
ref as a prop must accept the nullable form:

```ts
// React 18-era
type Props = { previewRef: React.RefObject<HTMLDivElement> };

// React 19
type Props = { previewRef: React.RefObject<HTMLDivElement | null> };
```

This is a type-only change; runtime behavior is unchanged. Read-only access still
requires a null check (`ref.current?.…`), which the existing code already does.

## Data & API Changes

None.

## UI / UX Changes

None intended. The spinner library version changes internally; `ClipLoader` usage is
unchanged.

## Testing

### Commands run

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

### Results

| Check | Result |
|---|---|
| Typecheck | ✅ No errors after the ref-type migration |
| Lint | ✅ 0 errors, 112 warnings (unchanged from Phase 1) |
| Unit/integration/component | ✅ 7 files, 36 tests |
| Build | ✅ Next 16.4.6, 29 routes, **no React 18 deprecation warning** |
| E2E | ✅ 16/16 (15 route smoke + 1 axe) |
| Runtime smoke | ✅ Static routes render under React 19 |

### Gaps / not covered

- No automated playback test for Quran audio/radio; E2E covers page rendering only.
  Manual smoke of audio, radio, modals, and the image generator is still recommended
  before release.
- React 19-only features are not used yet.

## Risks & Rollback

| Risk | Impact | Mitigation |
|---|---|---|
| React 19 runtime behavior changes | A component could behave differently | Typecheck, build, unit tests, and 16 E2E tests pass; manual smoke recommended. |
| Third-party library incompatibility | Runtime error in a specific flow | Peer audit is clean; `react-spinners` upgraded; Headless UI/Lucide/Testing Library support 19. |
| Stricter ref types | Type errors in other branches | The migration is type-only and localized; future code should use `RefObject<T \| null>`. |
| Rollback | — | Revert this commit to return to React 18.3.1 and `react-spinners@0.14.1`; no data or API changes. |

## Follow-ups

- [ ] Manual smoke: Quran audio, radio, modals, ayah-image generator.
- [ ] Phase 2: adopt React 19 primitives only where they simplify code; do not
      introduce them as part of the consistency refactor unless justified.
- [ ] Phase 2: consider React Compiler after the hook refactor.

## Agent Checklist

- [x] Read `docs/project-overview.md` and `docs/testing.md`.
- [x] Followed the existing patterns.
- [x] No user-facing strings added.
- [x] No raw colors added.
- [x] No direct `localStorage` access added.
- [x] `npm run check` components pass.
- [x] `npm run test:e2e` passes.
- [x] Updated the progress board.
- [x] Committed as a separate change.

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-11-17 | OpenCode agent | Upgraded React to 19.3.1, migrated ref types, verified the full suite. |

## Related Links

- [Project overview](../project-overview.md)
- [Testing guide](../testing.md)
- [Tooling and test foundation](./2026-11-17-tooling-and-test-foundation.md)
