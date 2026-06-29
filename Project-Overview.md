# Muslim — Project Overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| UI | React 18 |
| Styling | Tailwind CSS v4 |
| Icons | FontAwesome (free-solid, free-regular, free-brands) |
| Utilities | `lucide-react`, `@headlessui/react`, `axios`, `moment-hijri`, `html-to-image`, `react-spinners` |
| Analytics | `@vercel/analytics` |
| Deployment | Vercel |

---

## Project Structure

```
app/
├── layout.tsx              # Root layout — providers, fonts, ThemeScript
├── page.tsx                # Home page
├── globals.css             # CSS variables, palettes, scrollbar styles
├── styles/modules/         # CSS Modules (AudioPlayer, QuranText, Animations, Shared)
├── api/                    # API routes (proxy, hadith, search-quran, tafseer, sadaqa-garya, download-audio)
└── (pages)/                # Route group — all feature pages
    ├── home/
    ├── read-quran/
    ├── read-hadith/
    ├── listen-quran/
    ├── radios/
    ├── azkar/
    ├── prayer-times/
    ├── tasbeeh/
    ├── search-ayah/
    ├── generate-ayah-image/
    ├── sadaqa-garya/
    ├── sadaqat/
    ├── saved-ayahs/
    └── favourites/

components/
├── layout/
│   ├── pageLayout.tsx      # Wraps Navbar + children + AudioPlayer/RadioPlayer + Footer
│   ├── navbar/
│   │   ├── Navbar.tsx       # Main navigation bar
│   │   ├── NavDropdown.tsx  # Reusable dropdown menu component
│   │   ├── LanguageDropdown.tsx
│   │   ├── ThemeDropdown.tsx
│   │   ├── PaletteDropdown.tsx
│   │   └── ReadingProgressBar.tsx
│   └── footer/Footer.tsx
├── general/
│   ├── audio-player/       # Quran audio player (global)
│   ├── radio-player/       # Radio player (global, bottom bar)
│   ├── PlayerIconButton.tsx
│   ├── AppHydrationGate.tsx
│   ├── DataTable.tsx
│   └── Loading.tsx
```

---

## Routing

Next.js App Router with a `(pages)` route group. All feature pages live under `app/(pages)/`. API routes live under `app/api/`.

| Route | Feature |
|-------|---------|
| `/` | Home page |
| `/read-quran` | Read Quran (by page) |
| `/read-quran/surah/[number]` | Read Quran by Surah |
| `/read-quran/juz/[number]` | Read Quran by Juz |
| `/read-hadith` | Browse Hadith books |
| `/read-hadith/book/[slug]` | Book chapters |
| `/read-hadith/book/[slug]/chapter/[chapterNumber]` | Chapter hadiths |
| `/listen-quran` | Listen Quran reciters list |
| `/listen-quran/reciter/[id]` | Reciter's surahs |
| `/radios` | Live Quran radio stations |
| `/azkar` | Azkar categories |
| `/azkar/category/[id]` | Specific azkar category |
| `/prayer-times` | Prayer times |
| `/tasbeeh` | Digital tasbeeh counter |
| `/search-ayah` | Search Quran verses |
| `/generate-ayah-image` | Generate image from ayah |
| `/sadaqa-garya` | Sadaqa Garya form |
| `/sadaqa-garya/[slug]` | Sadaqa Garya deceased page |
| `/saved-ayahs` | Saved ayahs |
| `/favourites` | User favourites |
| `/sadaqat` | User sadaqat list |

---

## Bilingual System (Arabic / English)

### How It Works

1. **Language Context**: `context/general/LanguageContext.tsx` stores the current language (`"ar"` | `"en"`) in state and `localStorage`. It also sets the document `dir` attribute (`rtl` / `ltr`).

2. **Translation Hook**: `hooks/general/useTranslation.ts` provides `t(key)` — a dot-notation lookup function. It reads from pre-imported JSON locale files and falls back to English.

3. **Locale Files**: `locales/en/*.json` and `locales/ar/*.json`. Each namespace maps to a feature area:
   - `navbar` — navigation labels
   - `home`, `quran`, `hadith`, `azkar`, `radio`, etc. — feature-specific strings
   - `common`, `footer` — shared strings

### Adding a New Translation Key

1. Add the key to both `locales/en/<namespace>.json` and `locales/ar/<namespace>.json`.
2. Use `t("namespace.key")` in components via the `useTranslation` hook.
3. If creating a new namespace, add the imports to `hooks/general/useTranslation.ts`.

### Language-Specific Patterns

- Components use `const isArabic = language === "ar"` for conditional layout.
- RTL-aware positioning: `${isArabic ? "right-3" : "left-3"}` for absolute elements.
- `dir="ltr"` is applied explicitly where LTR is needed regardless of language (e.g., audio player slider, phone numbers).
---

## Styling System

### CSS Variables (HSL)

All colors are defined as HSL CSS custom properties in `globals.css`:

```css
:root {
  --background: 150 30% 96%;
  --foreground: 200 60% 12%;
  --primary: 174 80% 28%;
  /* ... */
}
```

Mapped to Tailwind via `@theme`:

```css
@theme {
  --color-background: hsl(var(--background));
  --color-primary: hsl(var(--primary));
  /* ... */
}
```

### Color Palettes

Four palettes, each with light + dark variants:

| Class | Light | Dark |
|-------|-------|------|
| (default) | Teal | Teal Dark |
| `.gold` | Gold | Gold Dark |
| `.emerald` | Emerald | Emerald Dark |
| `.midnight` | Blue | Blue Dark |

Applied to `<html>` via `PaletteContext` + `ThemeContext`.

### Key Design Tokens

- `--primary` / `--primary-foreground` — main brand color
- `--secondary` / `--secondary-foreground` — subtle backgrounds
- `--muted` / `--muted-foreground` — de-emphasized text
- `--destructive` / `--destructive-foreground` — error/danger
- `--border`, `--input`, `--ring` — borders and focus rings
- `--player-*` — audio/radio player specific colors
- `--quran-*` — Quran reading surface colors
- `--celebration-*` — celebration animation colors

### CSS Modules

Located in `app/styles/modules/`:
- `AudioPlayer.module.css` — slider thumb styling
- `QuranText.module.css` — Quran verse rendering
- `Animations.module.css` — shared animations
- `Shared.module.css` — shared utility styles

### Typography

- **Kufam** — primary Arabic font (`font-family: "Kufam"` on `.font` class)
- **Cairo** — secondary Arabic font
- **Amiri Quran** — Quran reading font
- Loaded via Google Fonts in `layout.tsx`.

---

## Context Provider Architecture

Providers are nested in `app/layout.tsx` (outermost to innermost):

```
LanguageContextProvider
  ThemeContextProvider
    PaletteContextProvider
      AppHydrationGate
        QuranAudioProvider
          RadioProvider
            SavedAyahsProvider
              FavoriteSurahsProvider
                FavoriteHadithsProvider
                  FavoriteAzkarProvider
                    SadaqaGaryaProvider
                      TasbeehContextProvider
                        PageLayout (Navbar + Footer + Players)
```

### Key Contexts

| Context | File | Purpose |
|---------|------|---------|
| `LanguageContext` | `context/general/LanguageContext.tsx` | Language state + localStorage |
| `ThemeContext` | `context/general/ThemeContext.tsx` | Light/dark mode |
| `PaletteContext` | `context/general/PaletteContext.tsx` | Color palette selection |
| `QuranAudioContext` | `context/features/QuranAudioContext.tsx` | Quran audio playback state |
| `RadioContext` | `context/features/RadioContext.tsx` | Radio streaming state |
| `SavedAyahsContext` | `context/features/SavedAyahsContext.tsx` | Saved verses |
| `FavoriteSurahsContext` | `context/favourites/FavoriteSurahsContext.tsx` | Favorite surahs |
| `FavoriteHadithsContext` | `context/favourites/FavoriteHadithsContext.tsx` | Favorite hadiths |
| `FavoriteAzkarContext` | `context/favourites/FavoriteAzkarContext.tsx` | Favorite azkar |
| `SadaqatContext` | `context/features/SadaqatContext.tsx` | Sadaqa Garya data |
| `TasbeehContext` | `context/features/TasbeehContext.tsx` | Tasbeeh counter state |

---

## Global Players

`PageLayout` conditionally renders one of two global players at the bottom:

- **AudioPlayer** (`components/general/audio-player/AudioPlayer.tsx`) — shown when no radio is active
- **RadioPlayer** (`components/general/radio-player/RadioPlayer.tsx`) — shown when a radio station is streaming

---

## Component Patterns

### Responsive Design

- Mobile-first with `md:`, `lg:` breakpoints
- Mobile hamburger menu with expandable sections
- Desktop: inline navigation with dropdowns
- Separate mobile/desktop layouts for players

### Tailwind Utility Classes (Common Patterns)

- **Cards**: `rounded-2xl border border-border/50 bg-card/70`
- **Buttons**: `rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200`
- **Active nav**: `border-primary/30 bg-primary/10 text-primary`
- **Hover effects**: `hover:border-primary/20 hover:bg-card hover:-translate-y-0.5 hover:shadow-md`
- **Gradient accents**: `bg-gradient-to-br from-primary to-primary/70`
---

## Constants & Data Files

| File | Content |
|------|---------|
| `constants/quranData.ts` | Surah metadata |
| `constants/radioStationsData.ts` | Radio station URLs, categories, icons |
| `constants/recitersData.ts` | Quran reciters |
| `constants/azkarData.ts` | Azkar categories and content |
| `constants/hadithData.ts` | Hadith book metadata |
| `constants/egyptianGovernorates.ts` | Egyptian governorates for prayer times |
| `constants/sadaqaData.ts` | Sadaqa Garya data |

---

## API Routes

| Route | Purpose |
|-------|---------|
| `POST /api/proxy` | Proxy audio stream requests |
| `GET /api/hadith` | Fetch hadith data from external API |
| `GET /api/search-quran` | Search Quran verses |
| `GET /api/tafseer` | Fetch tafseer (exegesis) |
| `GET /api/sadaqa-garya` | Sadaqa Garya operations |
| `GET /api/download-audio` | Download audio files |
| `POST /api/sadaqa-garya/[slug]` | Sadaqa Garya slug operations |
