---
doc_type: change
title: "UI consistency, Quran quote typography, copy polish, and theme flash fix"
doc_id: "CHG-0011"
date: "2026-11-23"
branch: "refactor/ui-consistency"
commit: "pending"
author: "OpenCode agent"
status: review
scope: [ui, quran, hadith, i18n, copy, theme]
related_files:
  - app/globals.css
  - components/ui/PageShell.tsx
  - components/ui/PageHeader.tsx
  - components/ui/PageQuote.tsx
  - constants/routeQuotes.ts
  - hooks/readHadith/useChapterInfo.ts
  - hooks/readQuran/useQuranPageFont.ts
  - scripts/check-ui-consistency.mjs
  - scripts/check-copy.mjs
  - tests/e2e/layout.spec.ts
  - tests/e2e/theme.spec.ts
  - utils/themeScript.tsx
  - context/general/ThemeContext.tsx
---

# UI consistency, Quran quotes, copy, and theme

## Progress

- [x] Analysis complete
- [x] Implementation complete
- [x] Tests added/updated
- [x] Typecheck + lint pass
- [x] Verified on a running build
- [x] Ready for review

## Summary

- Every route now uses the shared `PageShell`, `PageHeader`, typography, spacing,
  and surface roles. Page titles share one `type-page` scale.
- Page quotes use verified Quran text in the same per-page mushaf font as the
  reader, with preloaded fonts, attached ornate brackets, and no fallback flash.
- Ayah previews outside `QuranPageRenderer` use Amiri Quran with a three-line
  clamp; Quran line-height sits outside utility layers so glyphs are not clipped.
- Copy is consistent (short titles, subtitles, count labels, localized digits),
  and the Hadith chapter subtitle includes the chapter name.
- A dark-first `color-scheme` meta was making a dark OS paint a dark canvas behind
  the light UI; `color-scheme` is now driven by the active theme before first paint.

## Changes

| Area | File(s) | What changed |
|---|---|---|
| Page contract | `PageShell`, `PageHeader`, `docs/ui-ux-guidelines.md` | Shared width, spacing, type, surface, and header rules |
| Guards | `scripts/check-ui-consistency.mjs`, `scripts/check-copy.mjs`, `package.json` | `check:ui` and `check:copy` run inside `npm run check` |
| Quran quotes | `constants/routeQuotes.ts`, `PageQuote.tsx` | Page + `code_v2` data, preloaded `/quran-fonts`, word-level wrapping, attached brackets |
| Quran typography | `app/globals.css` | `.quran-text` / `.quran-clamp` outside utility layers |
| Copy | `locales/**` | Titles, subtitles, counts, chapter labels, Arabic home title |
| Hadith | `hooks/readHadith/useChapterInfo.ts` | Chapter name resolved beside the chapter number |
| i18n | `lib/i18n.ts` | Numeric params formatted per locale |
| Theme | `utils/themeScript.tsx`, `ThemeContext.tsx`, `layout.tsx` | `color-scheme` matches the stored/system theme; dark-first meta removed |

## Testing

| Check | Result |
|---|---|
| Typecheck | ✅ |
| Lint | ✅ 0 errors / 107 warnings |
| Unit/Integration | ✅ 20 files / 113 tests |
| Build | ✅ |
| Playwright (Chromium, Firefox, WebKit) | ✅ 174/174 |
| Copy guard | ✅ 555 keys |
| UI guard | ✅ 180 files |

## Risks & follow-up

| Risk | Mitigation |
|---|---|
| Per-page fonts add one request on quote pages | Preloaded with the HTML and served from the same origin |
| Decorative quote glyphs are not selectable as Uthmani text | Hidden Uthmani copy is exposed to screen readers |
| Detail pages intentionally omit subtitles | Documented in `docs/ui-ux-guidelines.md` |
| Dynamic palette values still live in two places | `paletteEngine.ts` is the source; the inline script mirrors it |
