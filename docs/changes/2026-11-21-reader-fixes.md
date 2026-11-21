---
doc_type: change
title: "Reader fixes: read-only memorial verses, saved-ayah landing, save feedback"
doc_id: "CHG-0010"
date: "2026-11-21"
branch: "main"
commit: "pending"
author: "OpenCode agent"
status: review
scope: [reader, sadaqa, saved-ayahs, ui]
related_files:
  - app/[locale]/(pages)/read-quran/components/general/QuranPageRenderer.tsx
  - app/[locale]/(pages)/read-quran/components/general/AyahPopover.tsx
  - app/[locale]/(pages)/read-quran/components/surah/QuranMultiPageRenderer.tsx
  - app/[locale]/(pages)/sadaqa-garya/[slug]/components/ConcatenatedQuranPages.tsx
  - context/features/SavedAyahsContext.tsx
  - hooks/readQuran/useAyahPopover.ts
  - hooks/readQuran/useAyahInteraction.ts
---

# Reader fixes

## Progress

- [x] Analysis complete
- [x] Implementation complete
- [x] Tests added/updated
- [x] Typecheck + lint pass
- [x] Verified on a running build
- [x] Ready for review

## Summary

- Memorial pages render Quran verses read-only: no hover highlight, no pointer, no actions popover.
- Saved-ayah deep links land on the ayah: jump to the page immediately, then center the ayah once its lazy font renders.
- Interactive reader verses keep a pointer cursor while hovered.
- Saving an ayah shows a 2-second success state (success color, check icon, “Saved”) before the popover closes.
- Saved ayahs are deduplicated by surah and ayah; the newest copy wins and legacy duplicates are cleaned on load.

## Context / Problem

- `QuranPageRenderer` reused the interactive reader behavior on memorial pages, so clicking a verse opened save/tafsir/translation actions on a page meant only for reading.
- `router.push` to `?ayah=` worked, but the reader rendered pages progressively and loaded page fonts lazily; the old 2-second retry expired before the ayah existed, and a smooth scroll over tens of thousands of pixels looked like nothing happened.
- On hover, the verse class switched to `text-primary` and dropped `cursor-pointer`, so the pointer reverted to the default arrow.
- `handleSaveAyah` closed the popover right after saving, so the existing success state never appeared.
- `saveAyah` appended duplicates, so saving the same ayah twice produced two rows.

## Changes

| Area | File(s) | What changed |
|---|---|---|
| Renderer | `QuranPageRenderer.tsx` | Added `readOnly`; cursor class kept while interactive |
| Memorial | `ConcatenatedQuranPages.tsx` | Passes `readOnly` |
| Deep links | `QuranMultiPageRenderer.tsx` | Instant page jump, 8s ayah retry, instant centering |
| Popover | `AyahPopover.tsx`, `useAyahPopover.ts` | Success state, 2s delay, saved detection |
| Save | `useAyahInteraction.ts` | No longer closes the popover on save |
| Storage | `SavedAyahsContext.tsx` | Dedupe on save/load, key-based remove |

## Testing

| Check | Result |
|---|---|
| Typecheck | ✅ |
| Lint | ✅ 0 errors / 107 warnings |
| Unit/Integration | ✅ 20 files / 111 tests |
| Build | ✅ |
| E2E (saved ayah, sadaqa read-only) | ✅ |

## Risks & follow-up

| Risk | Mitigation |
|---|---|
| Memorial pages no longer allow saving from a verse | Intentional; the reader still does |
| Deep-link centering can take a few seconds on long surahs | Page jump is immediate; ayah centers when its font is ready |
| Saving while another popover action is clicked | The pending close is harmless |
