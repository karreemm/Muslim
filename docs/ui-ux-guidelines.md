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

## Layout

- `PageShell` for the page frame (`w-[92%] max-w-7xl pt-10 pb-20`).
- `PageHeader` for the single `<h1>` plus optional subtitle and icon.
- `mb-10` between sections; `gap-4`/`gap-6` in grids.
- `rounded-xl` controls, `rounded-2xl` surfaces, `rounded-full` badges.
- Tap targets ≥ 44px; usable at 320px and 200% zoom.

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
