---
doc_type: guide
title: "UI/UX Guidelines"
last_updated: "2026-11-21"
status: active
---

# UI/UX Guidelines

Calm surfaces, one accent, Arabic-first layout, tokens instead of colors, and no
screen without its loading, empty, and error states.

## Tokens

Colors are HSL variables in `app/globals.css`, exposed to Tailwind through
`@theme`. Use semantic classes only — `bg-card`, `text-muted-foreground`,
`border-border`, `bg-primary/10`.

**Never** use raw palette classes (`bg-green-500`, `text-white`) or literal
`hsl()`/hex values in components. Add a token instead.

### Adding a token

1. `app/globals.css` — `--color-*` mapping in `@theme`.
2. `app/globals.css` — values in `:root`, `.dark`, and palette classes.
3. `utils/paletteEngine.ts` — light **and** dark branches of `generateCSSVars`.
4. `utils/themeScript.tsx` — the inline custom-hue block (must match step 3).
5. `tests/unit/paletteEngine.test.ts`.
6. Re-check the four theme combinations: light/dark × warm/cool palette.

Status colors (`success`, `info`, `live`) do not shift with the palette.

## Typography

| Role | Font | Notes |
|---|---|---|
| UI | Kufam (`--font-kufam`) | `next/font`, swap, preloaded |
| Quran | Amiri Quran (`--font-amiri-quran`) | `next/font`, swap, not preloaded |
| Quran pages | `public/quran-fonts/p{N}.woff2` | lazy per page via `useQuranPageFont` |

Quran text never truncates, ellipsizes, or uses `line-clamp`. No uppercase,
tracking, or italics on Arabic. Arabic line-height ≥ 1.6.

## Type and spacing scale

Use the semantic roles instead of ad-hoc size classes.

| Role | Classes | Use |
|---|---|---|
| `type-display` | `text-2xl md:text-4xl lg:text-5xl` | Home hero only |
| `type-page` | `text-3xl md:text-4xl` | Route title via `PageHeader` |
| `type-compact` | `text-2xl md:text-3xl` | Reader, prayer, error pages |
| `type-section` | `text-2xl` | Section headings |
| `type-card` | `text-lg` | Card titles |
| `type-body` | `text-base leading-relaxed` | Prose |
| `type-meta` | `text-sm text-muted-foreground` | Counts and captions |

| Spacing role | Value | Use |
|---|---|---|
| `page-stack` | `space-y-10` | Page sections |
| `section-stack` | `space-y-6` | Section content |
| `grid-gap` | `gap-4 lg:gap-6` | Card grids |
| `card-pad` | `p-5 lg:p-6` | Card interiors |
| `surface-card` | 2xl radius, border, translucent card | Standard cards |
| `surface-panel` | 2xl radius, border, solid card | Dialogs and solid panels |

`PageShell` widths:

| Width | Max width | Routes |
|---|---|---|
| `wide` (default) | 7xl | Most pages |
| `medium` | 5xl | Prayer times |
| `content` | 4xl | Sadaqa form |
| `narrow` | 3xl | Prose pages |
| `full` | none | Quran reader and reciter |

`PageHeader` is `mb-10` by default; do not override the margin. Use `size="hero"`
only for the home page and `size="compact"` for reader and utility pages.

**Exceptions:** the Quran reader and players keep full-bleed layouts, and the
Ayah image export keeps its fixed canvas typography.

## Layout

- `PageShell` for the page frame (`width`, `flush`, `pb-20`).
- `PageHeader` for the single `<h1>`, subtitle, and icon.
- `mb-10` after the header; use `page-stack` between sections.
- `rounded-xl` controls, `rounded-2xl` surfaces, `rounded-full` badges.
- Tap targets ≥ 44px; usable at 320px and 200% zoom.

## Page contract

Every route must:

- use `PageShell` with an explicit `width` (default `wide`);
- render exactly one `<h1>`, via `PageHeader` or a `type-*` role;
- use `page-stack` between sections and `section-stack` inside them;
- use `grid-gap` for card grids and `card-pad` inside cards;
- use `surface-card` / `surface-panel` for standard surfaces;
- use `Button` / `IconButton` for standard actions. Custom player, dropdown, and
  segmented controls are allowed, but need `focus-visible`, an accessible name,
  and a 44 px target;
- document any deliberate exception in `scripts/ui-allowlist.json`.

`npm run check:ui` enforces the structural rules, and
`tests/e2e/layout.spec.ts` checks one `<h1>` and no horizontal overflow on every
route at 1440 px, plus 320/768 px on the layout-critical routes.

### Adding a page

1. Create `app/[locale]/(pages)/<name>/page.tsx`.
2. Wrap the content in `PageShell` with the right `width`.
3. Add `PageHeader` (or a `type-*` title for custom heroes).
4. Stack sections with `page-stack`; use `section-stack` inside a section.
5. Build cards from `surface-card` / `surface-panel` and pad with `card-pad`.
6. Add loading, empty, and error states.
7. Run `npm run check:ui` and `npm run test:e2e`.

### Titles, quotes, and numbers

- H1: 2–5 words, at most 60 characters, centered. Move long sentences to the
  subtitle. Use `PageHeader` (always `type-page`); do not override the title
  size, and do not add outer padding to `PageShell` that shifts the header.
- Index pages pass a subtitle. Detail pages (surah/juz reader, reciter, azkar
  category, 404) keep the same `type-page` title but may omit the subtitle.
- Subtitles: one short line. Dynamic values (location, book, name) belong in the
  subtitle, not the title.
- Page quotes come from `constants/routeQuotes.ts`, generated from
  `data/searchQuran/quran-index.json` (plus the Quran.com v4 `code_v2` text).
  Never type Quran text by hand.
- Quotes render with the same per-page mushaf font as the reader
  (`/quran-fonts/p{page}.woff2` + `code_v2`), preloaded with the HTML. The quote
  stays hidden until that font is ready, so the Amiri fallback never flashes;
  if the font cannot load, the Uthmani text is shown instead. A hidden Uthmani
  copy is exposed to screen readers.
- The ornate brackets stay attached to the first and last word, so wrapping
  never leaves a bracket alone on a line.
- A page quote is wrapped in Quranic ornate brackets (`﴿ … ﴾`) and carries no
  surah/ayah caption. The home hero has no quote.
- Any ayah rendered outside `QuranPageRenderer` uses `.quran-text`; list previews
  add `.quran-clamp` (three lines).
- Pass numbers to `t()` as numbers so Arabic renders Arabic-Indic digits. Pass
  status codes and SEO values as strings when Latin digits are required.
- Do not create `_plural` keys; use count labels such as “Results: {{count}}”.
- `npm run check:copy` enforces whitespace, placeholders, and digit rules.

## Components

Use `components/ui/`: `PageShell`, `PageHeader`, `Card` (`interactive` when fully
clickable), `Button` (primary/secondary/ghost/outline/destructive), `IconButton`
(requires `label`), `Modal` (Headless UI: focus trap, Escape, ARIA),
`EmptyState`, `ErrorState` (`role="alert"`), `Skeleton`.

Do not re-implement these per feature; add a variant centrally. Compose classes
with `cn()`. Destructive actions use a modal with an explicit confirm.

## Themes

Light/dark via the `dark` class; palettes gold (default), teal, emerald, midnight,
custom hue. Persisted with `theme`, `palette`, `paletteHue` and applied before
hydration. Every new surface must work in light+gold, dark+gold, and a cool and a
warm palette.

## RTL

- Direction comes from the locale; set once on `<html>`, never per component.
- Prefer `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`.
- Mirror directional icons only. Forced-LTR content (timers, sliders) gets
  `dir="ltr"`. Arabic digits use `toArabicNumber()`.
- Strings live in `locales/{en,ar}`; add both in the same commit. Never concatenate
  sentences — use full keys with placeholders.

## States

| State | Component | Rule |
|---|---|---|
| Loading | `Skeleton` / scoped spinner | Reserve final height; no jump |
| Empty | `EmptyState` | Explain and offer the next action |
| Error | `ErrorState` | Generic message + retry; details in logs |
| Success | Content | — |

Never surface raw errors or upstream status codes. Retry must visibly re-enter
loading.

## Motion and media

150ms hover, 200ms controls, 300ms surfaces, 500ms entrances; never over 600ms.
Animate `transform`/`opacity` only. Respect `prefers-reduced-motion` (E2E runs with
it). App images are WebP; use `next/image` with `sizes`; decorative images use
`alt=""`.

## Accessibility

- 4.5:1 body contrast, 3:1 large text and meaningful borders.
- Visible focus ring; keyboard order follows visual order.
- Escape closes overlays; focus returns to the trigger.
- Accessible name on every icon-only control and field.
- One `<h1>`; headings never skip levels.
- No color-only status; no `aria-hidden` on focusable content.
- Axe scans 16 routes in E2E and fails on critical/serious issues.

## Copy

Warm, brief, respectful. Bilingual parity is mandatory. Buttons use verbs
("Create", "Retry") — not "OK"/"Submit". Never ship "Coming Soon" or placeholder
text. Quran, hadith, and azkar text is never paraphrased.

## Do / Don't

| Do | Don't |
|---|---|
| `bg-card text-card-foreground` | `bg-[#faf7f0]` |
| `ms-3` / `me-3` | `ml-3` / `mr-3` for RTL spacing |
| `PageShell` + `PageHeader` | A bespoke wrapper |
| `ErrorState` with retry | Throw into a blank screen |
| `t("namespace.key")` | Hardcoded UI strings |
