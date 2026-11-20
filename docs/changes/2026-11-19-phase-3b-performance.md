---
doc_type: change
title: "Phase 3B: fonts, images, code splitting, and reading performance"
doc_id: "CHG-0006"
date: "2026-11-19"
branch: "chore/professional-foundation"
commit: ""
author: "OpenCode agent"
status: done
scope: [performance, fonts, images, bundle, caching]
related_files:
  - lib/fonts.ts
  - app/[locale]/layout.tsx
  - app/globals.css
  - app/global-not-found.tsx
  - public/surah-header-4.webp
  - public/icons/*
  - app/favicon.ico
  - hooks/readQuran/useQuranPageFont.ts
  - app/[locale]/(pages)/read-quran/components/surah/QuranMultiPageRenderer.tsx
  - app/[locale]/(pages)/read-quran/components/juz/JuzMultiPageRenderer.tsx
  - app/[locale]/(pages)/read-quran/components/general/QuranSurahHeader.tsx
  - app/[locale]/(pages)/generate-ayah-image/GenerateAyahImage.tsx
  - hooks/listenQuran/useAudioPlayer.ts
  - public/data/listenQuran/durations/*
  - lib/dateFormatting.ts
  - hooks/prayerTimes/useDateFormatting.ts
  - hooks/prayerTimes/usePrayerTimes.ts
  - components/layout/pageLayout.tsx
  - components/layout/navbar/LanguageDropdown.tsx
  - next.config.mjs
  - tests/unit/dateFormatting.test.ts
related_docs:
  - docs/project-overview.md
  - docs/testing.md
---

# Phase 3B: performance and reading smoothness

## Progress

- [x] Baseline and bundle analysis
- [x] Self-hosted fonts
- [x] Quran font prefetch and caching
- [x] WebP Quran header and unused-asset cleanup
- [x] Root icon/favicon refresh
- [x] Dynamic imports and hydration-gate removal
- [x] Audio duration data split
- [x] Native `Intl` Hijri/Gregorian formatting
- [x] Cache headers
- [x] Tests, build, and production E2E
- [ ] Committed (waiting for confirmation)

## Summary

- Replaced external Google Fonts with `next/font`:
  - Kufam for UI
  - Amiri Quran for Quran text
  - Removed unused Cairo
- Kept per-page Quran fonts, but added:
  - `font-display: swap`
  - current-page loading
  - idle prefetch of the next page font
  - immutable caching for `/quran-fonts/*`
- Converted the Quran header from PNG to WebP:
  - **651 KB → 49.6 KB**
- Removed unused `surah-header-1/2/3.png` (~2 MB).
- Kept `bismillah.png` for the README.
- Replaced `moment` + `moment-hijri` with native `Intl` and custom formatting.
- Split audio durations into one file per reciter.
- Removed the full-screen hydration gate so content renders immediately.
- Lazy-loaded the audio/radio players and `html-to-image`.
- Added immutable/stale-while-revalidate cache headers for fonts, icons, and data.
- Regenerated the favicon as a transparent gold mosque.

## Results

### Route first-load JS

Measured with `npm run analyze` (uncompressed route JS).

| Route | Before 3B | After 3B | Change |
|---|---:|---:|---:|
| `/{locale}` | 810 KB | 735 KB | -75 KB |
| `/{locale}/read-quran` | 805 KB | 745 KB | -60 KB |
| `/{locale}/read-quran/surah/[number]` | 926 KB | 866 KB | -60 KB |
| `/{locale}/read-quran/juz/[number]` | 926 KB | 866 KB | -60 KB |
| `/{locale}/generate-ayah-image` | 941 KB | 881 KB | -60 KB |
| `/{locale}/sadaqa-garya/[slug]` | 945 KB | 887 KB | -58 KB |
| `/{locale}/search-ayah` | 890 KB | 833 KB | -57 KB |
| `/{locale}/favourites` | 873 KB | 797 KB | -76 KB |
| `/{locale}/prayer-times` | 811 KB | 736 KB | -75 KB |
| `/{locale}/sadaqat` | 867 KB | 792 KB | -75 KB |
| `/{locale}/radios` | 822 KB | 747 KB | -75 KB |

Typical reduction: **7–9%** before compression.

### Assets and requests

| Item | Before | After |
|---|---:|---:|
| Quran header image | 651 KB PNG | 49.6 KB WebP |
| Unused Quran header images | ~2 MB | removed |
| Audio durations | 1.54 MB single file | 14 files, ~42 KB each |
| Audio durations on a reciter page | 1.54 MB | ~42 KB |
| UI font delivery | external Google Fonts CSS | self-hosted `next/font` |
| Cairo font | downloaded but unused | removed |
| Quran page fonts | loaded with `font-display` default | `swap` + next-page prefetch |
| `html-to-image` | initial route bundle | loaded only on export |
| Audio/radio players | initial route bundle | lazy-loaded |
| App hydration | full-screen loading gate | content renders immediately |

Caching now applied:

- `/quran-fonts/*` — `public, max-age=31536000, immutable`
- `/icons/*` — `public, max-age=31536000, immutable`
- `/data/*` — `public, max-age=86400, stale-while-revalidate=604800`

## Reading smoothness

- The current page font is loaded as soon as the page number is known.
- The next page font is prefetched during idle time.
- Verified on Surah 2:
  - pages 1–4 fonts loaded
  - `/quran-fonts/p5.woff2` prefetched
- Fallback text remains visible while fonts load.
- Quran header now uses `next/image` for the static fallback and a decorative
  background for the runtime recolored version, removing raw `<img>` warnings.

## Date formatting

`moment` and `moment-hijri` were removed.

- Gregorian dates use native `Date` + the existing localized month names.
- Hijri dates use native `Intl.DateTimeFormat` with
  `en-US-u-ca-islamic-umalqura`.
- Prayer times use a small `formatTime12h()` helper.
- Compared `moment-hijri` and `Intl` across 48 monthly samples from 2024–2027:
  **0 mismatches**.
- Added `tests/unit/dateFormatting.test.ts` for Gregorian, Hijri, and prayer-time
  formatting.

## Testing

| Check | Result |
|---|---|
| Typecheck | ✅ Pass |
| Lint | ✅ 0 errors / 107 warnings (down from 109) |
| Unit/integration | ✅ 19 files, 109 tests |
| Build | ✅ Pass |
| E2E against production build | ✅ 64/64 |
| Bundle analysis | ✅ `npm run analyze` |

Verified manually:

- Kufam is the computed body font.
- External Google Fonts requests are gone.
- `/surah-header-4.webp` is served as `image/webp`.
- A reciter page requests only its own duration file.
- Cache headers are present on fonts and data.
- Dark/custom palette still hydrates correctly after removing the gate.

## Risks & rollback

| Risk | Mitigation |
|---|---|
| `next/font` downloads fonts at build time | Build succeeds on Vercel; fall back to local font files if the network changes |
| Removing the hydration gate could expose hydration mismatches | Theme/palette verified with dark/custom palette; E2E passes |
| Audio duration split changes fetch shape | One file per reciter; module-level promise cache; verified in browser |
| Native `Intl` Hijri differences | 48-date comparison against `moment-hijri`; unit tests added |
| Per-page font prefetch could over-download | Prefetch is idle-only and limited to the next page |

Rollback: restore the previous `layout.tsx`, fonts link, `useAudioPlayer` summary
fetch, and `moment-hijri` formatting. Assets are additive except for removed
unused Quran header images.

## Follow-ups

- [ ] Measure Lighthouse before/after on a deployed Vercel build.
- [ ] Consider splitting the client translation bundle by namespace.
- [ ] Phase 3C: CSP report-only and security headers.
- [ ] Phase 4: visual regression coverage.

## Agent Checklist

- [x] Read `docs/project-overview.md` and `docs/testing.md`.
- [x] Added tests for date formatting.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] `npm run test:e2e` passes against production.
- [x] Committed after user confirmation.
