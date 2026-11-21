---
doc_type: change
title: "Phase 2 consistency pass: storage, UI primitives, P0 fixes, data layer"
doc_id: "CHG-0004"
date: "2026-11-18"
branch: "chore/professional-foundation"
commit: ""
author: "OpenCode agent"
status: done
scope: [consistency, ui, storage, i18n, data-layer, performance]
related_files:
  - app/globals.css
  - app/page.tsx
  - app/(pages)/azkar/Azkar.tsx
  - app/(pages)/azkar/service/GetAzkar.ts
  - app/(pages)/favourites/page.tsx
  - app/(pages)/favourites/sections/*.tsx
  - app/(pages)/listen-quran/ListenQuran.tsx
  - app/(pages)/listen-quran/service/GetSurah.ts
  - app/(pages)/prayer-times/PrayTimes.tsx
  - app/(pages)/prayer-times/service/GetPrayerTimes.ts
  - app/(pages)/read-hadith/ReadHadith.tsx
  - app/(pages)/saved-ayahs/Table.tsx
  - app/(pages)/sadaqat/Table.tsx
  - app/api/proxy/route.ts
  - components/general/AppHydrationGate.tsx
  - components/general/DataTable.tsx
  - components/general/audio-player/*.tsx
  - components/modals/DeleteConfirmModal.tsx
  - components/ui/
  - context/**/*.tsx
  - hooks/listenQuran/useAudioPlayer.ts
  - hooks/listenQuran/useFavoriteSurahActions.ts
  - hooks/azkar/usePostSalahAzkarReset.ts
  - lib/storage.ts
  - lib/http.ts
  - lib/logger.ts
  - lib/sadaqaGarya/localDeleteTokens.ts
  - public/data/listenQuran/audioDurationsSummary.json
  - locales/{en,ar}/*.json
  - tests/
related_docs:
  - docs/project-overview.md
  - docs/testing.md
  - docs/changes/2026-11-17-tooling-and-test-foundation.md
---

# Phase 2 consistency pass

## At a glance

| Field | Value |
|---|---|
| Date | 2026-11-18 |
| Branch | `chore/professional-foundation` |
| Commit | pending — not committed until the user confirms |
| Scope | consistency, UI, storage, i18n, data layer, performance |
| Status | `done` (implementation complete; commit pending) |

## Progress

- [x] Analysis complete
- [x] Phase 2a/2b/2c implementation complete
- [x] Phase 2d architecture + formatting complete
- [x] Tests added/updated
- [x] Typecheck + lint pass
- [x] Docs updated
- [x] Verified on a running build
- [ ] Committed (waiting for confirmation)
- [ ] 109 lint warnings (explicitly deferred)

## Summary

- Fixed the highest-impact consistency bugs:
  - `DataTable` `maxHeight` now uses inline style (Tailwind cannot generate
    `max-h-[${maxHeight}]`).
  - Added `tw-animate-css`, so `animate-in` / `fade-in` / `slide-in-from-*` actually
    work.
  - Aligned the default palette to **gold** across the pre-hydration script and
    `PaletteContext`; no more teal → gold flash.
  - Removed the artificial 2-second hydration gate.
  - `useFavoriteSurahActions` now derives state from context instead of reading
    `localStorage`; duplicate favorites are prevented.
  - Azkar data is fetched once and cached instead of once per category.
  - The 1.54 MB audio-duration JSON moved to `public/` and is lazy-loaded.
  - Removed 8.8 MB of unused Quran JSON and the dead `useBookPage` hook.
  - Fixed page wrappers that used `text-primary` in light mode.
- Added a centralized storage layer and migrated all direct `localStorage` access
  (except the inline pre-hydration script) to `lib/storage.ts`.
- Added shared UI primitives in `components/ui/` and adopted them in representative
  pages, `DataTable`, and `DeleteConfirmModal`.
- Rebuilt the delete-confirmation modal on Headless UI `Dialog` for focus trap,
  Escape handling, and ARIA semantics.
- Added `lib/http.ts` + `lib/logger.ts`; migrated prayer, listen-Quran, and Azkar
  services plus `/api/proxy`; **removed axios**.
- Migrated deletion-flow copy to locale keys and added a locale-parity test.
- Added tests for storage, Sadaqa tokens, HTTP, locale parity, and UI primitives.
- Applied Prettier to every changed/new file.
- Moved all external API clients to `lib/services/` and shared types to `types/`.
- Added Zod-based env validation in `lib/env.ts`.
- Ran a repository-wide Prettier pass.
- **Phase 2b continuation:**
  - `npm audit fix` cleared the remaining dev audit finding
    (`brace-expansion` 1.1.16 → 1.1.22). `npm audit` is now **0 vulnerabilities**.
  - Default palette/hue/mode constants moved to `paletteEngine.ts` and reused by
    `PaletteContext` and the pre-hydration script.
  - Added semantic `success` / `info` / `live` tokens and replaced hardcoded status
    colors in hadith badges, radio/audio live dots, download success, and share
    success states.
  - Migrated the 404 page copy to locale keys.
  - Migrated Radios, Search Ayah, and Generate Ayah Image to `PageShell` /
    `PageHeader`.
  - Reduced lint warnings from 107 to 105.

## Context / Problem

The Phase 1 audit found a set of real bugs and duplicated patterns that would make
future features inconsistent:

- Tailwind dynamic class and animation classes were no-ops.
- Default palette/theme flashed on first load.
- Every page load was blocked for 2 seconds.
- Favorites could desync from context.
- Azkar fetched the same JSON eight times.
- A 1.54 MB JSON file was statically imported into the client bundle.
- `localStorage` access was scattered across 31 call sites.
- `axios` and `fetch` were mixed, with console noise and raw errors.
- Deletion dialogs duplicated bilingual copy and lacked a shared accessible modal.
- Page shells, cards, headers, empty states, and icon buttons were duplicated.

## Scope

### In scope (Phase 2a)

- P0 consistency fixes.
- Centralized storage.
- Shared UI primitives + modal accessibility.
- Representative page migrations.
- Delete-flow i18n.
- HTTP/logger layer and axios removal.
- Tests and docs for the above.

### Out of scope (Phase 2b)

- Consolidating palette definitions across CSS/script/engine.
- Migrating every remaining hardcoded bilingual string.
- Migrating every page to `PageShell`/`PageHeader`/`Card`/`Button`.
- Moving all services out of `app/`.
- Adopting TanStack Query / Zod.
- Fixing the remaining 107 React Compiler/exhaustive-deps warnings.
- Whole-repo Prettier pass.
- Phase 3 SEO/performance/security work.

## Changes

| Area | File(s) | What changed / why |
|---|---|---|
| Animations | `app/globals.css`, `package.json` | Added `tw-animate-css`; animation utilities now produce CSS. |
| Data table | `components/general/DataTable.tsx` | Inline `maxHeight`; `EmptyState`; `IconButton` with labels; `Button` for clear-all; translated defaults. |
| Palette/hydration | `utils/themeScript.tsx`, `context/general/PaletteContext.tsx`, `components/general/AppHydrationGate.tsx` | Gold default; `<html lang>` set; 2s timer removed. |
| Favorites | `hooks/listenQuran/useFavoriteSurahActions.ts`, `context/favourites/FavoriteSurahsContext.tsx` | Context-derived `isFavorite`; duplicate guard. |
| Azkar | `app/(pages)/azkar/service/GetAzkar.ts` | Module-level cached promise; uses `fetchJson`. |
| Audio | `hooks/listenQuran/useAudioPlayer.ts`, `public/data/listenQuran/audioDurationsSummary.json` | Lazy fetch outside the client bundle. |
| Legacy assets | `data/searchQuran/*`, `hooks/readHadith/useBookPage.ts`, `hooks/readHadith/index.ts` | Removed unused raw Quran JSON (8.8 MB) and dead hook. |
| Storage | `lib/storage.ts`, `lib/sadaqaGarya/localDeleteTokens.ts`, contexts/hooks/pages | Typed SSR-safe storage helpers; keys unchanged. |
| UI primitives | `components/ui/*` | `cn`, `Button`, `IconButton`, `Card`, `PageShell`, `PageHeader`, `EmptyState`, `ErrorState`, `Skeleton`, `Modal`. |
| Modal a11y | `components/modals/DeleteConfirmModal.tsx` | Headless UI Dialog: focus trap, Escape, ARIA, RTL close button. |
| Page consistency | Azkar, Read Hadith, Listen Quran, Favourites | `PageShell` + `PageHeader` + `ErrorState`. |
| i18n | `locales/{en,ar}/*`, favourites/saved-ayahs tables, `DataTable` | Deletion copy + favourites title moved to locale keys. |
| HTTP/logging | `lib/http.ts`, `lib/logger.ts`, prayer/listen/Azkar services, `app/api/proxy/route.ts` | Timeout/error normalization, logger, fetch instead of axios. |
| Dependencies | `package.json`, `package-lock.json` | Added `tw-animate-css`, `clsx`, `tailwind-merge`, `class-variance-authority`; removed `axios`. |
| Tests | `tests/unit/*`, `tests/components/*` | 75 tests across 14 files. |

## Architecture & Patterns

- **Storage:** all browser persistence goes through `lib/storage.ts`; keys are
  intentionally unchanged to preserve existing user data.
- **HTTP:** `fetchJson` / `fetchArrayBuffer` / `fetchBlob` normalize timeouts and
  non-OK responses. Components should not call `fetch` directly.
- **UI:** new pages should compose `PageShell`, `PageHeader`, `Card`, `Button`,
  `IconButton`, `Modal`, `EmptyState`, `ErrorState`, and `Skeleton`. Existing pages
  migrate incrementally.
- **Dialog:** `Modal` uses Headless UI to get focus management and ARIA for free.
- **i18n:** user-facing copy belongs in `locales/`; the locale-parity test prevents
  one-sided keys.
- **Performance:** large data belongs in `public/` and is fetched on demand; do not
  statically import it into client hooks.

## Data & API Changes

- No database schema change.
- No public API contract change.
- `/api/proxy` now uses `fetch` instead of axios; response shape is unchanged.
- `getPrayerTimes` now returns the shared `PrayerTimings` type.
- `localStorage` keys are unchanged; data is preserved.
- New locale keys: `common.cannotUndo`, `common.confirmDeletion`,
  `common.deleteAllItemsConfirm`, `favourites.title`,
  `favourites.*.{clearAllConfirm,removeConfirm}`,
  `savedAyahs.{clearAllConfirm,removeConfirm}`.

## UI / UX Changes

- No deliberate visual redesign; layout/headers are standardized on the shared
  primitives for the migrated pages.
- Delete confirmation is now a proper accessible dialog.
- Data-table action buttons have accessible labels.
- Page shells no longer use the light-mode `text-primary` wrapper.
- First paint uses the gold brand palette consistently.
- Loading no longer blocks the app for 2 seconds.

## Testing

### Commands run

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
```

### Results

| Check | Result |
|---|---|
| Typecheck | ✅ No errors |
| Lint | ✅ 0 errors, 109 warnings |
| Unit/integration/component | ✅ 16 files, 82 tests |
| Build | ✅ Next 16.4.6, 29 routes |
| E2E | ✅ 22/22 (20 route smoke incl. dynamic routes + 1 axe + 1 i18n) |
| Production audit | ✅ 0 vulnerabilities |
| Dev audit | ✅ 0 vulnerabilities |

## Risks & Rollback

| Risk | Impact | Mitigation |
|---|---|---|
| Storage migration | A key/shape mismatch could hide user data | Keys unchanged; helpers parse defensively and fall back; tests cover round-trips. |
| Lazy audio durations | Progress bar may briefly lack exact durations on first play | `<audio>` events still drive playback; data loads once and is cached. |
| Palette default change | Users without a saved palette now see gold instead of teal | Gold matches the brand and `PaletteContext`; saved palettes are untouched. |
| Page refactors | Layout could shift on migrated pages | E2E route smoke passes; visual review recommended. |
| Axios removal | A missed axios-specific behavior | All three usages migrated; typecheck/build/E2E pass. |
| Modal refactor | Delete flows could regress | Component test + E2E render; manual delete smoke recommended. |

Rollback: revert this Phase 2a/2b change set. No data migration or API contract change.

## Phase 2b continuation

| Area | Change |
|---|---|
| Audit | `npm audit fix` updated `brace-expansion` to 1.1.22; dev audit is now clean. |
| Palette | `DEFAULT_PALETTE`, `DEFAULT_PALETTE_HUE`, `VALID_PALETTE_MODES` exported from `paletteEngine.ts`; reused in context and pre-hydration script. |
| Tokens | Added `success`, `info`, `live` semantic colors to `globals.css`. |
| Status colors | Replaced hardcoded green/blue in hadith badges, live dots, download success, and share success. |
| i18n | 404 page now uses `common.notFound*`/`goBack` keys. |
| Pages | Radios, Search Ayah, Generate Ayah Image now use `PageShell` / `PageHeader`. |
| Lint | Warnings reduced 107 → 105. |

## Phase 2c continuation

| Area | Change |
|---|---|
| i18n | Migrated the remaining UI copy: audio player + mobile sheet + repeat panel, share/tafseer/translation modals, tasbeeh, sadaqa form/deceased/table, prayer times, radios, read Quran, hadith book/chapter, search, Azkar, navbar dropdowns, and the 404 page. |
| i18n tests | Added a source-level key-usage test and a Playwright runtime test that fails on “Translation key not found”. |
| PageShell | Adopted `PageShell`/`PageHeader` across all feature pages (including reader, prayer, tasbeeh, sadaqa, home, sadaqat, saved-ayahs). Added a `decorations` slot to `PageShell`. |
| Loading UIs | Generate-image, hadith chapter, and search loading screens now use `PageShell` + `Skeleton`. |
| Helpers | `useTranslation` now exports a pure `translate(language, key, params)` for bilingual forms. |
| Tests | 15 Vitest files / 76 tests; 17 Playwright tests. |
| Audit | `npm audit` and `npm audit --omit=dev` both report 0 vulnerabilities. |

## Phase 2d finalization

| Area | Change |
|---|---|
| Architecture | Moved all external API clients from `app/(pages)/.../service` to `lib/services/<domain>/`; moved shared domain types to `types/`. No `lib` → `app` imports remain. |
| Env | Added `lib/env.ts` with Zod validation for Supabase and Hadith configuration; removed ad-hoc env checks from the store and Hadith route. |
| Reciter page | Adopted `PageShell` with full-width overrides; the player remains a specialized layout. |
| Formatting | Ran a repository-wide Prettier pass. |
| E2E | Added dynamic routes: Quran surah/juz, Hadith book, Azkar category, and Reciter page. |
| Tests | 16 Vitest files / 82 tests; 22 Playwright tests. |
| Audit | 0 production and 0 dev vulnerabilities. |

## Follow-ups (remaining consistency)

- [ ] Consolidate palette **values** across `globals.css`, `themeScript`, and
      `paletteEngine` (defaults are already centralized).
- [ ] Decide whether social brand colors in `ShareModal` should become named brand
      tokens.
- [ ] Fix the remaining 109 React Compiler/exhaustive-deps warnings and re-enable
      them as errors (explicitly skipped for Phase 2).
- [ ] Split the audio player into smaller components.
- [ ] Manual smoke: audio/radio, modals, favourite flows, azkar counters, prayer
      times, sadaqa delete, image generator.
- [ ] Consider TanStack Query for client caching if data-fetching duplication grows;
      Zod is already used for environment validation.

## Agent Checklist

- [x] Read `docs/project-overview.md` and `docs/testing.md`.
- [x] Followed existing patterns or documented a deviation.
- [x] No new direct `localStorage` access outside `lib/storage.ts`.
- [x] No new raw colors outside tokens.
- [x] Added/updated tests for changed behavior.
- [x] `npm run check` passes (typecheck + lint + tests).
- [x] `npm run test:e2e` passes.
- [x] Updated this document and the progress board.
- [ ] Committed after user confirmation.

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-11-18 | OpenCode agent | Phase 2a consistency pass: storage, UI primitives, P0 fixes, data layer, tests. |

## Related Links

- [Project overview](../project-overview.md)
- [Testing guide](../testing.md)
- [Phase 1 record](./2026-11-17-tooling-and-test-foundation.md)
- [React 19 record](./2026-11-17-react-19-upgrade.md)
