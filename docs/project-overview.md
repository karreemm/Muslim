---
doc_type: living
title: "Muslim — Project Overview"
version: "1.0.0"
last_updated: "2026-11-19"
status: active
audience: ["agents", "contributors", "maintainers"]
---

# Muslim — Project Overview

> **Read this first.** This document explains what the project does, how it is
> structured, which patterns to copy, and which invariants must not break.
>
> For change history, see [`changes/`](./changes/). For documentation rules, see
> [`README.md`](./README.md).

---

## 1. Product summary

**Muslim** is an open-source, bilingual (Arabic / English) Islamic web platform.
It brings the Quran, Hadith, Azkar, prayer times, live radio, and daily tools into
one experience. It is built as a **Sadaqah Jariyah** (continuous charity) and is
free to use.

The app is a **Next.js App Router** project. Almost every feature page is a client
component because the experience is highly interactive (audio, counters, filters,
local storage). Global providers wrap the whole app, and two global players sit at
the bottom of the layout: Quran audio and live radio.

| Fact             | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| Framework        | Next.js `16.4.6` (App Router)                                 |
| UI runtime       | React `19.3.1`                                                |
| Runtime          | Node.js `>= 20.9`; CI uses Node 24                            |
| Package manager  | npm 11, pinned via `packageManager` in `package.json`         |
| Language         | TypeScript 5, `strict: true`                                  |
| Styling          | Tailwind CSS `4.1.13` + HSL CSS variables + a few CSS Modules |
| Icons            | FontAwesome (majority) + Lucide (subset)                      |
| Data             | REST APIs + local JSON + Supabase REST                        |
| Testing          | Vitest + Testing Library + MSW + Playwright + axe             |
| CI               | GitHub Actions (`.github/workflows/ci.yml`)                   |
| Deployment       | Vercel                                                        |
| Default language | Arabic (`ar`, RTL)                                            |
| Default theme    | Light; system preference respected                            |
| Source of truth  | This repository; GitHub landing page at `../README.md`        |

---

## 2. Feature map

All feature pages live under `app/[locale]/(pages)/`. The `[locale]` segment is
`ar` or `en` and appears in every URL; `(pages)` is a route group, so it does not
appear in URLs. Visiting `/` redirects to `/ar` or `/en` using the saved language
cookie, then `Accept-Language`, then Arabic.

| Route                                                       | What it does                                                  | Primary code                                                     | Main data source                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| `/{locale}`                                                 | Landing page: hero, features, tools, install flow, CTA        | `app/[locale]/(pages)/home/Home.tsx`                             | Local constants / i18n                                |
| `/{locale}/read-quran`                                      | Browse surahs and juz                                         | `app/[locale]/(pages)/read-quran/ReadQuran.tsx`                  | `constants/quranData.ts`                              |
| `/{locale}/read-quran/surah/[number]`                       | Read a surah, ayah popover, save, share, tafseer, translation | `app/[locale]/(pages)/read-quran/surah/[number]/page.tsx`        | `api.quran.com` v4                                    |
| `/{locale}/read-quran/juz/[number]`                         | Read a juz                                                    | `app/[locale]/(pages)/read-quran/juz/[number]/page.tsx`          | `api.quran.com` v4                                    |
| `/{locale}/read-hadith`                                     | Browse 8 hadith collections                                   | `app/[locale]/(pages)/read-hadith/ReadHadith.tsx`                | `hadithapi.com` via `/api/hadith`                     |
| `/{locale}/read-hadith/book/[slug]`                         | Chapters of a book                                            | `app/[locale]/(pages)/read-hadith/book/[slug]/page.tsx`          | `/api/hadith`                                         |
| `/{locale}/read-hadith/book/[slug]/chapter/[chapterNumber]` | Hadith list, search, pagination, favorites                    | `.../chapter/[chapterNumber]/page.tsx`                           | `/api/hadith`                                         |
| `/{locale}/listen-quran`                                    | Reciter list                                                  | `app/[locale]/(pages)/listen-quran/ListenQuran.tsx`              | `constants/recitersData.ts`                           |
| `/{locale}/listen-quran/reciter/[id]`                       | Reciter surahs + playback                                     | `app/[locale]/(pages)/listen-quran/reciter/[id]/page.tsx`        | `api.alquran.cloud` + `/api/proxy`                    |
| `/{locale}/radios`                                          | 125+ live stations, search, categories, favorites             | `app/[locale]/(pages)/radios/components/Radios.tsx`              | `constants/radioStationsData.ts` + `/api/radio-proxy` |
| `/{locale}/azkar`                                           | Azkar categories with daily completion                        | `app/[locale]/(pages)/azkar/Azkar.tsx`                           | Azkar GitHub JSON                                     |
| `/{locale}/azkar/category/[id]`                             | Azkar list + per-zekr counters                                | `app/[locale]/(pages)/azkar/category/[id]/page.tsx`              | Azkar GitHub JSON                                     |
| `/{locale}/prayer-times`                                    | Prayer times, next prayer countdown, Hijri date               | `app/[locale]/(pages)/prayer-times/PrayTimes.tsx`                | Aladhan API                                           |
| `/{locale}/tasbeeh`                                         | Digital tasbeeh counter with goal                             | `app/[locale]/(pages)/tasbeeh/Counter.tsx`                       | Local storage                                         |
| `/{locale}/search-ayah`                                     | Full Quran search with pagination                             | `app/[locale]/(pages)/search-ayah/SearchAyah.tsx`                | Local `data/searchQuran/quran-index.json`             |
| `/{locale}/generate-ayah-image`                             | Compose an ayah image and download/share                      | `app/[locale]/(pages)/generate-ayah-image/GenerateAyahImage.tsx` | `api.quran.com` + `html-to-image`                     |
| `/{locale}/sadaqa-garya`                                    | Create a memorial page                                        | `app/[locale]/(pages)/sadaqa-garya/SadaqaGarya.tsx`              | `/api/sadaqa-garya` + Supabase                        |
| `/{locale}/sadaqa-garya/[slug]`                             | Public memorial page                                          | `app/[locale]/(pages)/sadaqa-garya/[slug]/page.tsx`              | `/api/sadaqa-garya/[slug]`                            |
| `/{locale}/saved-ayahs`                                     | Saved ayahs table                                             | `app/[locale]/(pages)/saved-ayahs/Table.tsx`                     | `localStorage`                                        |
| `/{locale}/favourites`                                      | Favorite surahs, hadiths, azkar                               | `app/[locale]/(pages)/favourites/page.tsx`                       | `localStorage`                                        |
| `/{locale}/sadaqat`                                         | Memorial pages owned by this browser                          | `app/[locale]/(pages)/sadaqat/Table.tsx`                         | `/api/sadaqa-garya` + token cookie                    |
| `/{locale}/*` (404)                                         | Not-found page                                                | `app/[locale]/not-found.tsx`                                     | Local copy                                            |

---

## 3. Architecture at a glance

```
app/[locale]/layout.tsx
└── LanguageProvider                ← locale comes from the URL
    └── ThemeProvider
        └── PaletteProvider
            └── QuranAudioProvider
                └── RadioProvider
                    └── SavedAyahsProvider
                        └── FavoriteSurahsProvider
                            └── FavoriteHadithsProvider
                                └── FavoriteAzkarProvider
                                    └── ZekrCounterProvider
                                        ├── PrayerAzkarReset
                                        └── SadaqaGaryaProvider
                                            └── TasbeehProvider
                                                └── PageLayout
                                                    ├── Navbar
                                                    ├── <main>{children}</main>
                                                    ├── AudioPlayer | RadioPlayer (lazy)
                                                    └── Footer
```

Key points:

- **Locale segment:** `app/[locale]/` is the root layout; `proxy.ts` redirects
  unprefixed paths and keeps the language cookie aligned with the URL.
- **Route group:** `app/[locale]/(pages)/` is not part of the URL.
- **Feature folders:** each feature owns `components/`, `hooks/`, `service/`, `types/`.
- **Global providers** live in `context/general/` (language, theme, palette) and
  `context/features/` + `context/favourites/` (audio, radio, saved/favorites, sadaqa,
  tasbeeh, zekr counter).
- **Global players:** `PageLayout` renders exactly one of `AudioPlayer` or
  `RadioPlayer`. Starting Quran audio stops radio via the `quran:started` window event.
- **API routes** live in `app/api/` and act as thin proxies or storage boundaries.
- **Most pages are client components.** Server rendering is currently limited to
  layouts, metadata, loading/404 chrome, and API routes.

---

## 4. Directory map and import rules

```
app/
├── [locale]/
│   ├── layout.tsx             # Locale root layout, providers, metadata, JSON-LD
│   ├── page.tsx               # Localized home route wrapper
│   ├── loading.tsx            # Route loading UI
│   ├── error.tsx              # Route error boundary
│   ├── not-found.tsx          # Localized route-level 404
│   └── (pages)/               # All feature pages (route group)
├── global-not-found.tsx       # Localized 404 for unmatched URLs
├── globals.css                # Tailwind v4 theme, tokens, palettes, utilities
├── sitemap.ts                 # Bilingual sitemap with hreflang
├── robots.ts                  # Crawler rules
├── manifest.ts                # PWA manifest
├── global-error.tsx           # Last-resort error boundary
└── api/                       # Route handlers (proxy/storage)
proxy.ts                        # Locale redirect + language cookie
components/
├── layout/                    # Navbar, footer, page shell
├── general/                   # DataTable, Loading, Pagination, players
├── modals/                    # Share, Tafseer, Translation, DeleteConfirm
├── ui/                        # Shared primitives: Button, Card, Modal, PageShell...
└── azkar/                     # Prayer-triggered azkar reset
constants/                     # Static data: Quran, hadith, azkar, radios, reciters
context/
├── general/                   # Language, theme, palette
├── features/                  # Audio, radio, saved ayahs, sadaqa, tasbeeh, zekr
└── favourites/                # Favorite surahs, hadiths, azkar
data/
├── searchQuran/               # 3.89 MB search index (raw duplicates removed)
└── sadaqaGarya/               # Supabase schema
public/data/listenQuran/durations/ # Per-reciter duration files (~42 KB each)
public/icons/                  # Square app icons (192/512/maskable/Apple)
public/surah-header-4.webp     # Recolored Quran header source
public/bismillah.png           # README header calligraphy
public/logo.png                # Wide wordmark used by the README
hooks/                         # Feature hooks, grouped by domain
lib/                           # Cross-cutting: i18n, SEO, fonts, date formatting, storage, http, logger, env, security
lib/services/                  # External API services (azkar, hadith, Quran, prayer, search...)
locales/{en,ar}/               # 18 namespaces per language (includes `seo`)
types/                         # Shared domain types (ayah image, hadith, radio, sadaqa, search)
utils/                         # Helpers, palette engine, search, theme script
docs/                          # This documentation system
```

### Import rules (target state)

1. `app/` may import `components/`, `features/`, `lib/`, `hooks/`, `context/`, `utils/`.
2. `features/` may import `lib/`, `components/ui/`, `utils/`; it must **not** import from `app/`.
3. `lib/` must not import from `app/`.
4. Shared UI primitives live in `components/ui/` (`Button`, `Card`, `Modal`,
   `PageShell`, `PageHeader`, `EmptyState`, `ErrorState`, `Skeleton`, `IconButton`).
5. Cross-cutting services live in `lib/` (`http`, `storage`, `logger`, `env`,
   Supabase) and external API clients live in `lib/services/<domain>/`.
6. Shared domain types live in `types/`; `lib/` must not import from `app/`.

> The previous `app/[locale]/(pages)/.../service` and `types` folders have been moved to
> `lib/services/` and `types/`. No `lib` → `app` imports remain.

---

## 5. State and persistence

### React state

Contexts are used for state shared across routes or between a page and a global
player. Page-local UI state stays in the page/feature.

| Context                  | File                                            | Purpose                              |
| ------------------------ | ----------------------------------------------- | ------------------------------------ |
| `LanguageContext`        | `context/general/LanguageContext.tsx`           | `"ar" \| "en"`, document direction   |
| `ThemeContext`           | `context/general/ThemeContext.tsx`              | light/dark                           |
| `PaletteContext`         | `context/general/PaletteContext.tsx`            | preset/custom hue                    |
| `QuranAudioContext`      | `context/features/QuranAudioContext.tsx`        | Quran playback, repeats, Hifz, speed |
| `RadioContext`           | `context/features/RadioContext.tsx`             | live radio stream, favorites         |
| `SavedAyahsContext`      | `context/features/SavedAyahsContext.tsx`        | saved ayahs                          |
| `FavoriteSurahsContext`  | `context/favourites/FavoriteSurahsContext.tsx`  | favorite surahs per reciter          |
| `FavoriteHadithsContext` | `context/favourites/FavoriteHadithsContext.tsx` | favorite hadiths                     |
| `FavoriteAzkarContext`   | `context/favourites/FavoriteAzkarContext.tsx`   | favorite azkar                       |
| `ZekrCounterContext`     | `context/features/ZekrCounterContext.tsx`       | daily azkar counters                 |
| `SadaqaGaryaProvider`    | `context/features/SadaqatContext.tsx`           | memorial records + ownership         |
| `TasbeehContext`         | `context/features/TasbeehContext.tsx`           | tasbeeh count/goal                   |

> `SadaqaGaryaProvider` living in `SadaqatContext.tsx` is a naming inconsistency to
> fix in Phase 2.

### Current `localStorage` keys

All browser storage access goes through `lib/storage.ts` (`readString`,
`readNumber`, `readJSON`, `writeString`, `writeNumber`, `writeJSON`,
`removeStorage`, `onStorageChange`). The inline pre-hydration script still reads
directly because it must run before React.

These keys are **contracts** until a migration exists. Do not rename them silently.

| Key                     | Owner                     | Purpose                                             |
| ----------------------- | ------------------------- | --------------------------------------------------- |
| `theme`                 | ThemeContext              | `light` / `dark`                                    |
| `palette`               | PaletteContext            | `teal` / `gold` / `emerald` / `midnight` / `custom` |
| `paletteHue`            | PaletteContext            | custom hue (0–360)                                  |
| `language`              | LanguageContext           | `ar` / `en`                                         |
| `favoriteSurahs`        | FavoriteSurahsContext     | favorite surahs + reciter                           |
| `favoriteHadiths`       | FavoriteHadithsContext    | favorite hadiths                                    |
| `favoriteAzkar`         | FavoriteAzkarContext      | favorite azkar                                      |
| `savedAyahs`            | SavedAyahsContext         | saved verses                                        |
| `favoriteRadioStations` | RadioContext              | favorite station URLs                               |
| `audioPlaybackRate`     | QuranAudioContext         | `1` / `0.75` / `0.5`                                |
| `audioSkipMode`         | AudioPlayer               | skip by ayah or 15 seconds                          |
| `audioRepeatSettings`   | RepeatModePanel           | repeat count + range behavior                       |
| `preferredReciter`      | AudioPlayer / search card | last reciter                                        |
| `tasbeeh_count`         | TasbeehContext            | current count                                       |
| `tasbeeh_goal`          | TasbeehContext            | goal                                                |
| `tasbeeh_input_value`   | TasbeehContext            | goal input draft                                    |
| `azkar_daily_counts`    | ZekrCounterContext        | `{ date, counts }` daily reset                      |
| `selectedGovernorate`   | Prayer times              | selected Egyptian governorate                       |
| `postSalahResetPrayer`  | PrayerAzkarReset          | last prayer period that reset post-salah azkar      |
| `sadaqaDeleteTokens`    | Sadaqa                    | browser mirror of delete tokens                     |
| `sadaqaGarya`           | SadaqatContext            | **legacy**, only removed                            |

### Sadaqa ownership

- Creating a memorial returns a random delete token.
- The server stores only `sha256(token)` in Supabase (`delete_token_hash`).
- The token is returned to the browser and stored:
  - in an **httpOnly cookie** `sadaqa_delete_tokens` (server-authored), and
  - in `localStorage` `sadaqaDeleteTokens` (mirror used by the UI).
- Delete requests send the token via `x-sadaqa-delete-token` or the cookie.
- `GET /api/sadaqa-garya` returns public records plus `ownedSlugs` for the browser.

### Theme / palette pre-hydration

`utils/themeScript.tsx` runs inline before paint to:

1. apply `.dark` from `localStorage.theme` or `prefers-color-scheme`,
2. apply the palette class or custom CSS variables,
3. set `document.documentElement.dir` from `localStorage.language`.

**Invariant:** the first paint must not flash the wrong theme, palette, or direction.
The script currently duplicates the palette definitions from `paletteEngine.ts` and
`globals.css`; Phase 2 consolidates them into one source.

---

## 6. Data sources and internal API

### External APIs

| API                                                       | Used for                                   | Called from                                                      |
| --------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| `https://api.quran.com/api/v4`                            | Quran verses (Uthmani words, pages, lines) | `app/[locale]/(pages)/read-quran/service/Get{Surah,Juz,Page}.ts` |
| `https://api.alquran.cloud/v1`                            | Audio editions, translations               | listen Quran, translation modal                                  |
| `http://api.quran-tafseer.com`                            | Arabic tafseer books and text              | `/api/tafseer`                                                   |
| `https://cdn.islamic.network/quran/audio`                 | Ayah audio files                           | `/api/proxy`                                                     |
| `https://hadithapi.com/api`                               | Books, chapters, hadiths                   | `/api/hadith`                                                    |
| `https://raw.githubusercontent.com/nawafalqari/azkar-api` | Azkar categories                           | Azkar service (direct client fetch)                              |
| `https://api.aladhan.com/v1`                              | Prayer times                               | prayer-times service (direct client call)                        |
| `https://live.mp3quran.net`, `https://qurango.net`        | Live radio streams                         | `/api/radio-proxy`                                               |
| Supabase REST                                             | Sadaqa memorial records                    | `lib/sadaqaGarya/sadaqaGaryaStore.ts`                            |

### Internal API routes

| Route                      | Methods     | Purpose                               | Notes                                                      |
| -------------------------- | ----------- | ------------------------------------- | ---------------------------------------------------------- |
| `/api/hadith`              | GET         | Proxy to Hadith API                   | Requires `HADITH_API_KEY`; `mode=books\|chapters\|hadiths` |
| `/api/search-quran`        | GET         | Local Quran search                    | Uses `data/searchQuran/quran-index.json`                   |
| `/api/tafseer`             | GET         | Proxy to tafseer API                  | Caches list/text for 1 day                                 |
| `/api/proxy`               | GET         | Proxy ayah audio                      | Builds absolute ayah number, fixed CDN host                |
| `/api/radio-proxy`         | GET         | Proxy radio streams                   | Host allowlist, forwards `Range`                           |
| `/api/download-audio`      | POST        | Stream a surah download               | Host allowlist, sanitized filename                         |
| `/api/sadaqa-garya`        | GET, POST   | List records / create memorial        | In-memory rate limit on POST                               |
| `/api/sadaqa-garya/[slug]` | GET, DELETE | Fetch public page / delete owned page | Token + rate limit on DELETE                               |

---

## 7. Internationalization (i18n)

- The URL is authoritative: `/{locale}` is either `/ar` or `/en`. `proxy.ts`
  redirects unprefixed paths and keeps the `language` cookie in sync.
- `app/[locale]/layout.tsx` sets `<html lang>` and `<html dir>` on the server.
- `lib/i18n.ts` is server-safe and owns locale constants, path helpers, locale
  negotiation, and all translation namespaces.
- `hooks/general/useTranslation.ts` wraps `lib/i18n` and exposes:

  - `t("namespace.key")` with `{{param}}` interpolation and Arabic fallback.
  - `getNamespace("namespace")`.
- `components/i18n/LocalizedLink.tsx` prefixes every internal link with the active
  locale; `localizePath()` is used for router navigations and share URLs.
- Locale files: `locales/en/*.json` and `locales/ar/*.json`, 18 namespaces each.
  **Key parity is currently 100%.**

Namespaces: `navbar`, `home`, `quran`, `listenQuran`, `readQuran`, `hadith`,
`prayerTimes`, `tasbeeh`, `sadaqa`, `favourites`, `savedAyahs`, `common`, `footer`,
`searchAyah`, `generateAyahImage`, `radio`, `azkar`, `seo`.

### Rules

1. Every user-facing string belongs in a locale file.
2. Add the key to **both** languages in the same change.
3. Use `t("namespace.key")`; do not branch on `language === "ar"` for copy.
4. Directional layout may branch on language; copy may not.
5. If a key is missing, `t()` returns the key and logs a warning. Treat that as a bug.

### Known gap

Some components still use inline `language === "ar" ? "..." : "..."` for data
labels, decorative badges, and the bilingual `global-error` fallback. User-facing
UI and metadata copy live in `locales/`.

---

## 8. Theme and palette

- All colors are HSL CSS variables in `app/globals.css`, mapped to Tailwind via
  `@theme` (`--color-primary`, `--color-card`, `--color-quran-surface`, etc.).
- Palettes: **gold** (brand default), **teal**, **emerald**, **midnight**, plus a
  custom hue. Light and dark variants exist.
- Default palette/hue constants are exported from `paletteEngine.ts`
  (`DEFAULT_PALETTE`, `DEFAULT_PALETTE_HUE`, `VALID_PALETTE_MODES`) and consumed by
  both `PaletteContext` and the pre-hydration script. The first paint no longer
  flashes teal → gold.
- The CSS root remains a teal fallback for no-JS, and palette values are still
  duplicated across `globals.css`, `themeScript`, and `paletteEngine`; full value
  consolidation is Phase 2c.
- `utils/paletteEngine.ts` can generate inline CSS variables for custom hues.
- `utils/themeScript.tsx` applies theme/palette/direction before hydration.
- `PaletteContext` applies and persists the selection.
- Tailwind v4 `dark` variant is class-based via `@custom-variant dark`.

**Current inconsistency:** the default palette is teal in `globals.css` and
`themeScript`, but gold in `PaletteContext`. This can flash teal → gold. Phase 2
makes the default single-sourced.

---

## 9. UI system and patterns

### Tokens

Use semantic tokens only:

- Surfaces: `bg-background`, `bg-card`, `bg-secondary`, `bg-muted`, `bg-accent`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`,
  `text-primary-foreground`
- Borders: `border-border`, `border-input`
- Focus: `ring-ring`
- Player: `player-bg`, `player-foreground`, `player-control`, `player-track`
- Quran: `quran-surface`, `quran-highlight`, `quran-highlight-soft`
- Prayer/celebration: `prayer-times-next-*`, `celebration-*`
- Status: `success`, `success-foreground`, `info`, `info-foreground`, `live`

**Do not add raw Tailwind colors** (`green-500`, `blue-600`, `slate-800`, `white`)
for semantic UI. Add a token instead.

### Common patterns (current)

- Page shell: `w-full min-h-screen bg-background text-foreground pb-20`, inner
  `w-[92%] max-w-7xl mx-auto pt-10`.
- Card: `rounded-2xl border border-border bg-card/70 backdrop-blur-sm` +
  hover `-translate-y-1.5`, `shadow-primary/10`.
- Primary button: `rounded-xl bg-primary px-6 py-3 text-primary-foreground
font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25`.
- Secondary button: `rounded-xl border border-border bg-background/80 px-6 py-3`.
- Icon box: `flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/50
text-primary`.
- Active nav: `border-primary/30 bg-primary/10 text-primary`.

Shared primitives now live in `components/ui/`:

| Primitive                   | Use                                                                |
| --------------------------- | ------------------------------------------------------------------ |
| `PageShell`                 | Page background, width container, bottom padding                   |
| `PageHeader`                | Page title, subtitle, optional icon                                |
| `Card`                      | Standard surface; `interactive` adds hover motion                  |
| `Button`                    | `primary`, `secondary`, `ghost`, `outline`, `destructive` variants |
| `IconButton`                | Icon-only action with a required accessible label                  |
| `Modal`                     | Headless UI dialog: focus trap, Escape, ARIA, RTL close button     |
| `EmptyState` / `ErrorState` | Consistent empty and failure states                                |
| `Skeleton`                  | Loading placeholder                                                |

Prefer these for new UI. All feature pages now use `PageShell` and `PageHeader`;
`Card`/`Button`/`IconButton`/`EmptyState`/`ErrorState`/`Skeleton` are used across the
shared components and migrated pages. The full-screen reciter player and the Quran
renderer keep specialized layouts by design.

### RTL rules

- `LanguageContext` / `themeScript` set the document direction.
- Prefer logical utilities (`ms-*`, `me-*`, `start-*`, `end-*`) where possible.
- When absolute positioning is required, branch on language:
  `${isArabic ? "right-3" : "left-3"}`.
- Forced LTR content (audio sliders, phone numbers) uses `dir="ltr"`.
- Arabic numerals use `toArabicNumber()` from `utils/helpers.ts`.

### Accessibility

- New interactive elements need a visible focus state, an accessible name, and
  keyboard support.
- Modals need `role="dialog"`, `aria-modal`, focus trap, Escape-to-close, and
  focus restoration.
- Icon-only buttons need `aria-label` or `title` + `aria-label`.
- New UI is scanned with axe across the key-route E2E matrix.

---

## 10. Coding conventions

### TypeScript

- `strict: true`; avoid `any` (currently 47 occurrences to reduce).
- Export explicit types for public function signatures.
- Prefer discriminated unions over boolean flags.
- Use `unknown` + narrowing for external API payloads.

### React / Next.js

- Server components by default; add `"use client"` only at the interactive leaf.
- Hooks are named `use*` and live in `hooks/<domain>/` or inside a feature.
- Keep context providers small; do not put page-specific state in global context.
- Avoid reading `localStorage` in render or component bodies; use the storage helper
  (Phase 2) and hydrate in an effect.
- Do not use `useEffect` for derived state; compute it.

### Data fetching

- Use `lib/http.ts` (`fetchJson`, `fetchArrayBuffer`, `fetchBlob`) for external
  requests. It adds a 15s timeout, normalizes non-OK responses into `HttpError`, and
  keeps error handling consistent.
- External API clients live in `lib/services/<domain>/`; components and hooks import
  them, never the reverse.
- No direct `fetch`/`axios` in components; use a feature service/hook. `axios` has
  been removed from the project.
- Always handle loading, empty, error, and success.
- Do not statically import large JSON into client code; fetch from `public/` or
  precompute server-side. The 1.54 MB audio-duration file now lives in
  `public/data/listenQuran/` and is fetched lazily.

### Logging

- Use `lib/logger.ts` instead of `console.*` in new code. `next.config.mjs` still
  strips console output from production builds.
- Existing `console.*` calls are being removed incrementally; the data/services
  already migrated use the logger.
- Never log secrets, tokens, cookies, or full Supabase responses.

### Naming

- Components: `PascalCase.tsx`.
- Hooks: `useCamelCase.ts`.
- Utilities: `camelCase.ts`.
- Folders: kebab-case where possible.
- Existing exceptions (`Usewordrangeselection.ts`, `Useayahpopoverposition.ts`,
  `favourites/` vs `favorite*`) are scheduled for cleanup, not immediate renames.

### Formatting

- 2 spaces, double quotes, semicolons (match the majority style).
- Prettier is the formatting authority; the repository has been formatted.

---

## 11. Global players and audio coordination

- `AudioPlayer` (`components/general/audio-player/AudioPlayer.tsx`) reads
  `QuranAudioContext`, uses `useAudioPlayer` for the actual `<audio>` engine, and
  supports ayah-level playback, repeat/Hifz, speed, skip, download, and reciter
  switching.
- `RadioPlayer` (`components/general/radio-player/RadioPlayer.tsx`) reads
  `RadioContext` and streams via `/api/radio-proxy`.
- `PageLayout` shows **either** player; starting Quran audio dispatches
  `quran:started`, and `RadioContext` stops the radio when it hears it.
- The full-screen `AppHydrationGate` was removed in Phase 3B. The inline theme
  script handles first-paint theme/palette, and the page shell renders immediately.
- `AudioPlayer` and `RadioPlayer` are dynamically imported so they do not block
  initial rendering.

**Invariant:** Quran audio and radio must never play at the same time.

---

## 12. Sadaqa Jariyah data flow

1. `SadaqaGarya.tsx` collects English/Arabic names and optional messages.
2. `useSadaqaGaryaForm` POSTs to `/api/sadaqa-garya`.
3. The route validates and calls `createSadaqaRecord` in
   `lib/sadaqaGarya/sadaqaGaryaStore.ts`.
4. The store:
   - normalizes text,
   - builds a slug from the requested slug or English name,
   - ensures uniqueness,
   - generates a 48-hex-character delete token,
   - stores `sha256(token)` in Supabase,
   - returns the record + raw token.
5. The route sets the httpOnly `sadaqa_delete_tokens` cookie (map of slug → token) and
   returns the token to the client.
6. The client mirrors the token map in `localStorage.sadaqaDeleteTokens` so
   `/sadaqat` can show ownership and delete.
7. Public page: `/sadaqa-garya/[slug]` fetches the record and renders the memorial
   (Quran surahs, duas, share link).
8. Delete: `DELETE /api/sadaqa-garya/[slug]` with the token header/cookie; server
   compares hashes before deleting.

**Invariants:**

- Never expose `delete_token_hash` to the client.
- Never log the raw delete token.
- Keep slug generation stable; existing links must not break.
- Legacy rows without a hash remain deletable (current intentional behavior).

### Supabase schema

From `data/sadaqaGarya/sadaqa_supabase_schema.sql`:

```sql
create table if not exists public.sadaqa_garya_records (
  id text primary key,
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  message_en text not null default '',
  message_ar text not null default '',
  delete_token_hash text,
  created_at timestamptz not null default now()
);
```

RLS is enabled and `anon` / `authenticated` are revoked; only the service-role key
can access the table. The service-role key must never be exposed to the browser.

---

## 13. Environment and operations

### Environment variables

| Variable                          | Scope           | Required | Purpose                                     |
| --------------------------------- | --------------- | -------- | ------------------------------------------- |
| `SUPABASE_URL`                    | server          | yes      | Supabase project URL                        |
| `SUPABASE_SERVICE_ROLE_KEY`       | server          | yes      | Supabase REST auth (never public)           |
| `SUPABASE_SADAQA_TABLE`           | server          | no       | Defaults to `sadaqa_garya_records`          |
| `HADITH_API_KEY`                  | server          | yes      | Hadith API key                              |
| `HADITH_API_BASE_URL`             | server          | no       | Defaults to `https://hadithapi.com/api`     |
| `NEXT_PUBLIC_HADITH_API_KEY`      | server fallback | no       | Legacy fallback; prefer the non-public name |
| `NEXT_PUBLIC_HADITH_API_BASE_URL` | server fallback | no       | Legacy fallback                             |

`lib/env.ts` validates Supabase and Hadith environment variables lazily with Zod,
so missing configuration produces a clear server-side error without breaking the
build.

### Local commands

```bash
npm install
npm run dev            # http://localhost:3000
npm run build
npm run start

npm run typecheck      # next typegen && tsc --noEmit
npm run lint           # ESLint 9 flat config
npm run lint:fix
npm test               # Vitest unit + integration
npm run test:watch
npm run test:coverage
npm run test:e2e       # Playwright (install browser once: npx playwright install chromium)
npm run test:e2e:ui
npm run format         # Prettier
npm run format:check
npm run check          # typecheck + lint + tests
```

### Tooling

| Tool         | Config                                | Notes                                                                                                            |
| ------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ESLint 9     | `eslint.config.mjs`                   | Flat config based on `eslint-config-next/core-web-vitals`. React Compiler hook rules are warnings until Phase 2. |
| Prettier     | `.prettierrc.json`, `.prettierignore` | Repo-wide formatting applied; run `npm run format` before merging.                                               |
| Vitest       | `vitest.config.mts`, `tests/setup.ts` | jsdom, Testing Library, MSW server, v8 coverage.                                                                 |
| Playwright   | `playwright.config.ts`                | Chromium, local dev server, CI uses `next start` after a build.                                                  |
| CI           | `.github/workflows/ci.yml`            | Typecheck, lint, unit/integration, build, then Playwright smoke + a11y.                                          |
| Env template | `.env.example`                        | Copy to `.env.local`; never commit real secrets.                                                                 |

### Supabase keep-alive

Free Supabase projects pause after 7 days without activity. The repo includes:

- `scripts/supabase-keepalive.mjs` — daily read-only REST ping.
- `.github/workflows/supabase-keepalive.yml` — scheduled GitHub Action.

Required repository secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
(optional `SUPABASE_SADAQA_TABLE`). Run manually with `npm run keepalive` or via
**Actions → Supabase Keep Alive → Run workflow**.

### SEO and metadata

- `lib/seo.ts` centralizes the site URL, localized site name/description,
  canonical URLs, hreflang alternates, Open Graph, Twitter, and `createMetadata()`.
- `app/[locale]/layout.tsx` defines the localized title template, metadataBase,
  icons, manifest, OpenGraph/Twitter defaults, and WebSite/Organization JSON-LD.
- Static feature pages have `layout.tsx` metadata; dynamic pages use
  `generateMetadata()` with content-based names from local constants.
- Surah, Juz, Hadith book/chapter, Reciter, and Azkar category titles use
  `constants/*` and the `seo` namespace. Sadaqa memorial titles fetch the record
  server-side from Supabase and fall back safely if it is unavailable.
- `app/sitemap.ts` includes both locales, hreflang alternates, static routes,
  114 surahs, 30 juz, hadith books, reciters, and azkar categories.
- `app/robots.ts` allows public content and blocks `/api/`, `/*/sadaqat`,
  `/*/saved-ayahs`, and `/*/favourites`.
- `app/manifest.ts` provides the installable-app manifest with 192/512 square
  icons and a maskable 512 icon; Apple uses a 180×180 touch icon. The wide
  `public/logo.png` is reserved for the README wordmark.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel if the production domain changes.

### Security

- `next.config.mjs` applies HSTS, `nosniff`, referrer policy, frame denial,
  permissions policy, COOP, and `Content-Security-Policy-Report-Only`.
- CSP reports go to `/api/csp-report` and are logged in Vercel.
- API routes validate inputs, return generic errors, and keep secrets server-only.
- `/api/sadaqa-garya` returns only memorials owned by the requester's cookie.
- See [`security.md`](./security.md) for the full control list and limitations.

### Deployment

- Hosted on Vercel (`https://muslim-one.vercel.app`).
- Analytics via `@vercel/analytics`.
- Production strips `console.*` via `next.config.mjs`.
- Environment variables must be set in the Vercel project settings.

---

## 14. Quality status (as of 2026-11-18)

This is a snapshot during Phase 4, not the final target state.

| Area                       | Status                                                                                                                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typecheck                  | ✅ `npm run typecheck` passes.                                                                                                                                                                                                                            |
| Lint                       | ✅ `npm run lint` passes with **0 errors / 107 warnings**. React Compiler hook warnings remain until the hook refactor.                                                                                                                                   |
| Unit/integration/component | ✅ 19 test files, 109 tests (utils, storage, HTTP, locales, i18n helpers/keys, env, SEO, date formatting, security, cookies, API routes, UI primitives).                                                                                                 |
| E2E/regression             | ✅ 105 default Playwright tests (Chromium/Firefox/WebKit) + 10 local visual snapshots + 4 Web Vitals budgets: locale, metadata, links, security, Sadaqa, 16-route axe matrix, keyboard/modal flows, and user journeys. Visual CI is dormant until Linux baselines are committed. |
| CI                         | ✅ Workflow added; first GitHub run is pending.                                                                                                                                                                                                           |
| Error boundaries           | ✅ Localized `app/[locale]/error.tsx` and `app/global-error.tsx`.                                                                                                                                                                                         |
| SEO                        | ✅ Locale-aware titles, descriptions, canonical URLs, hreflang, OpenGraph/Twitter, JSON-LD, bilingual sitemap, robots, and PWA manifest.                                                                                                                  |
| Performance                | ✅ Self-hosted `next/font`; WebP Quran header; per-page Quran font prefetch; audio durations split per reciter; lazy players/export; cache headers; hydration gate removed. Route JS reduced by 7–9%.                                                   |
| Accessibility              | ✅ Axe scans 16 routes for critical/serious WCAG A/AA issues; keyboard language switch, modal focus trap/Escape, and mobile-menu Escape covered.                                                                                                          |
| Storage                    | ✅ Centralized in `lib/storage.ts`; keys unchanged for backward compatibility.                                                                                                                                                                            |
| Data layer                 | ✅ `lib/http.ts`, `lib/logger.ts`, `lib/env.ts`, `lib/services/*`; axios removed; no `lib` → `app` imports.                                                                                                                                               |
| i18n                       | ✅ All user-facing UI copy is localized. Remaining Arabic literals are data (prayer/month names, palette labels), decorative language badges, and the `global-error` bilingual fallback. A key-usage test + Playwright runtime scan prevent missing keys. |
| Security                   | ✅ Global security headers, CSP report-only + collector, generic API errors, input validation, radio-proxy header filtering, and owned-only Sadaqa listing. In-memory rate limits remain per-instance.                                                   |
| React                      | ✅ React 19.3.1.                                                                                                                                                                                                                                          |
| Dependencies               | ✅ `npm audit` (including dev) reports **0 vulnerabilities**.                                                                                                                                                                                             |

Phase records:

- [Professional foundation](./changes/2026-11-17-professional-foundation.md)
- [Tooling and test foundation](./changes/2026-11-17-tooling-and-test-foundation.md)
- [React 19 upgrade](./changes/2026-11-17-react-19-upgrade.md)
- [Phase 2 consistency](./changes/2026-11-18-phase-2-consistency.md)
- [Phase 3A SEO](./changes/2026-11-18-phase-3a-seo-metadata.md)
- [Phase 3B performance](./changes/2026-11-19-phase-3b-performance.md)
- [Phase 3C security](./changes/2026-11-19-phase-3c-security.md)
- [Phase 4 quality](./changes/2026-11-20-phase-4-quality.md)

---

## 15. Invariants — do not break

1. **Direction/theme first paint:** no flash of wrong theme, palette, or direction.
2. **Audio exclusivity:** Quran audio and radio never play simultaneously.
3. **Storage compatibility:** existing `localStorage` keys and shapes must keep
   working, or ship a migration.
4. **Sadaqa ownership:** delete tokens stay secret; only hashes are stored.
5. **Slug stability:** existing `/{locale}/sadaqa-garya/[slug]` links must remain valid.
6. **API allowlists:** `/api/radio-proxy` and `/api/download-audio` must keep host
   allowlists (SSRF protection).
7. **Service-role key:** never import `sadaqaGaryaStore` into client code and never
   prefix the key with `NEXT_PUBLIC_`.
8. **Locale parity:** every key exists in both `locales/en` and `locales/ar`.
9. **Locale URLs:** every page URL is prefixed with `/ar` or `/en`; new internal
   links must go through `LocalizedLink` or `localizePath()`.
10. **RTL:** layouts must remain usable in both directions.
11. **Static assets:** `public/quran-fonts/*` are referenced by the Quran renderer;
    do not rename or remove them without updating the font CSS.

---

## 16. Agent checklist

Before changing anything:

- [ ] Read this document.
- [ ] Read the living guide for your area (`ui-ux-guidelines`, `testing`, `operations`).
- [ ] Check `docs/changes/` for in-progress work.
- [ ] Find the existing pattern; prefer extending it over inventing a new one.
- [ ] Identify the data source and error/empty/loading states.
- [ ] Identify RTL and accessibility implications.
- [ ] Identify storage/API contracts affected.
- [ ] Decide how you will test it.

Before finishing:

- [ ] `npm run check` passes (typecheck + lint + tests).
- [ ] Relevant E2E tests pass (`npm run test:e2e`) when a route or flow changed.
- [ ] No new hardcoded user-facing strings.
- [ ] No new raw colors.
- [ ] No new direct `localStorage` access.
- [ ] Change record updated and progress board updated.

---

## 17. Glossary

| Term               | Meaning                                                             |
| ------------------ | ------------------------------------------------------------------- |
| **Ayah**           | A verse of the Quran.                                               |
| **Surah**          | A chapter of the Quran (1–114).                                     |
| **Juz**            | One of 30 sections of the Quran.                                    |
| **Tafseer**        | Quranic exegesis/commentary.                                        |
| **Hadith**         | A recorded saying or action of Prophet Muhammad ﷺ.                  |
| **Zekr / Azkar**   | Remembrance of Allah (singular/plural).                             |
| **Tasbeeh**        | Glorification of Allah; also the digital counter tool.              |
| **Hifz**           | Quran memorization; the app's repeat mode.                          |
| **Sadaqa Jariyah** | Ongoing charity; the memorial-page feature.                         |
| **Sadaqat**        | Plural of sadaqa; the page listing memorials owned by this browser. |
| **Reciter**        | Qari; the audio voice.                                              |
| **RTL**            | Right-to-left layout used for Arabic.                               |
