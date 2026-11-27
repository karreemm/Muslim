---
doc_type: guide
title: "Project Overview"
last_updated: "2026-11-26"
status: active
---

# Project Overview

**Muslim** is a bilingual (Arabic-first, RTL) Islamic web app: Quran with audio and
tafseer, hadith, azkar, prayer times, Qibla direction, radio, Tasbeeh, ayah images,
and Sadaqa Jariyah memorials. There are no accounts: everything except memorials
lives in the browser, and memorials live in Supabase.

## Routes

All pages live under `/{ar|en}/...`; `/` redirects using the saved cookie, then
`Accept-Language`, then Arabic.

| Route | Purpose |
|---|---|
| `/` | Home |
| `/read-quran`, `/read-quran/surah/[number]`, `/read-quran/juz/[number]` | Quran reading |
| `/listen-quran`, `/listen-quran/reciter/[id]` | Reciters and audio |
| `/read-hadith`, `/read-hadith/book/[slug]`, `.../chapter/[n]` | Hadith |
| `/azkar`, `/azkar/category/[id]` | Azkar |
| `/prayer-times` | Prayer times |
| `/qibla` | Qibla direction, live compass, governorate fallback |
| `/radios` | Live radio |
| `/tasbeeh` | Counter |
| `/search-ayah` | Quran search |
| `/generate-ayah-image` | Ayah image export |
| `/sadaqa-garya`, `/sadaqa-garya/[slug]` | Create / view a memorial |
| `/sadaqat` | Memorials owned by this browser |
| `/saved-ayahs`, `/favourites` | Saved content |

Unknown routes return a localized 404. `/sadaqat`, `/saved-ayahs`, and
`/favourites` are excluded from search engines.

## Architecture

```text
app/[locale]/          routes, layouts, metadata
app/api/               route handlers (Node runtime)
components/ui/         shared primitives
components/{layout,modals,general}/  chrome and shared widgets
context/               client state providers
hooks/                 feature logic
lib/                   env, http, logger, storage, seo, services, stores
utils/                 pure helpers (palette, numbers, formatting)
locales/{en,ar}/       all UI strings
data/, constants/      content data and lookup tables
```

- Server components by default; `"use client"` only at interactive leaves.
- Compass and geolocation APIs stay in `hooks/useQibla.ts`; Qibla math and WMM
  declination stay in pure `lib/qibla.ts`.
- External calls go through `lib/http.ts` (15s timeout, normalized errors).
- `lib/services/*` wraps each external API; `lib/sadaqaGarya/*` owns the Supabase
  store and delete-token cookies.
- No `lib` → `app` imports.

## State

| Provider | Holds |
|---|---|
| `LanguageContext`, `ThemeContext`, `PaletteContext` | Locale, light/dark, palette |
| `QuranAudioContext`, `RadioContext` | Global players (mutually exclusive) |
| `SavedAyahsContext`, `FavoriteSurahs/Hadiths/AzkarContext` | Favourites |
| `TasbeehContext`, `ZekrCounterContext` | Counters |
| `SadaqatContext` | Owned memorials (mounted on Sadaqa pages only) |

Browser persistence goes through `lib/storage.ts`. Keys are intentionally stable:
`theme`, `palette`, `paletteHue`, `language`, `savedAyahs`, `favoriteSurahs`,
`favoriteHadiths`, `favoriteAzkar`, `favoriteRadioStations`, `tasbeeh_count`,
`tasbeeh_goal`, `azkar_daily_counts`, `preferredReciter`, `audioPlaybackRate`,
`audioSkipMode`, `audioRepeatSettings`, `selectedGovernorate`,
`sadaqaDeleteTokens`, `postSalahResetPrayer`.

## Data

Internal API (details in [`api.md`](./api.md)):

`/api/hadith` · `/api/search-quran` · `/api/tafseer` · `/api/proxy` ·
`/api/radio-proxy` · `/api/download-audio` · `/api/sadaqa-garya` ·
`/api/sadaqa-garya/[slug]` · `/api/csp-report`

External: Quran.com, AlQuran Cloud, Quran Tafseer, Islamic Network CDN, Hadith API,
Aladhan, Azkar API, MP3Quran, Qurango, Supabase.

## i18n and theme

- Strings live only in `locales/{en,ar}/*.json`; a key-parity test prevents gaps.
- Direction comes from the locale; use logical utilities (`ms-*`, `me-*`,
  `start-*`, `end-*`).
- Palettes: gold (default), teal, emerald, midnight, custom hue. Theme and palette
  are applied before hydration by `utils/themeScript.tsx`.
- Rules: [`ui-ux-guidelines.md`](./ui-ux-guidelines.md).

## Invariants

1. No flash of wrong theme, palette, or direction on first paint.
2. Quran audio and radio never play at the same time.
3. Quran text is rendered verbatim, never truncated or paraphrased.
4. Storage keys keep their names; a rename needs an explicit migration.
5. All user-facing strings go through `locales/`.
6. No raw colors outside design tokens.
7. Secrets stay server-side; only `NEXT_PUBLIC_*` reaches the browser.
8. Public URLs, API contracts, and the Supabase schema change only with a
   migration and a change record.

## Related

[Testing](./testing.md) · [Operations](./operations.md) · [API](./api.md)
