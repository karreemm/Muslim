---
doc_type: change
title: "Arabic default, static pages, and a themed loading cover"
doc_id: "CHG-0012"
date: "2026-11-25"
branch: "feat/static-theme-loading-overlay"
commit: "pending"
author: "OpenCode agent"
status: review
scope: [theme, i18n, performance]
related_files:
  - proxy.ts
  - app/[locale]/layout.tsx
  - components/layout/ThemeLoadingOverlay.tsx
  - utils/themeScript.tsx
  - app/globals.css
  - app/styles/modules/Animations.module.css
  - context/general/ThemeContext.tsx
  - context/general/PaletteContext.tsx
  - context/general/LanguageContext.tsx
  - tests/e2e/theme.spec.ts
  - tests/e2e/smoke.spec.ts
---

# Theme, language, and static rendering

## Summary

- The root redirect defaults to Arabic when no language cookie exists.
  Accept-Language no longer changes the first visit.
- Localized pages are static again; the root layout no longer reads cookies.
- A themed, opaque loading cover is present in the static HTML. The pre-paint
  theme script shows it before the first frame, and the client removes it after
  hydration, fonts, and the first themed paint. It is also shown before a
  language navigation.
- Theme/palette selectors use `data-theme` / `data-palette` attributes instead of
  classes, so React hydration cannot strip the theme.

## Context / Problem

- `/` resolved the locale from Accept-Language, so an English browser landed on
  `/en` even though Arabic is the product default.
- Static HTML is rendered without per-user theme data. The theme script applies
  dark/palette before paint, but hydration and root-layout navigation can expose
  a light frame. A cookie-based server render removed the flash but made every
  localized route dynamic.
- The cover closes the remaining window without giving up static pages.

## Changes

| Area | File(s) | What changed |
|---|---|---|
| Locale | `proxy.ts` | Cookie or Arabic default; Accept-Language ignored for `/` |
| Static layout | `app/[locale]/layout.tsx` | No cookie read; renders the cover with the page |
| Cover | `ThemeLoadingOverlay.tsx` | Shown on every load and before language navigation; hidden after hydration + fonts + one frame |
| Loading UI | `Loading.tsx`, `LoadingMark.tsx` | One mosque mark and animation for every route/data loading overlay |
| Pre-paint script | `utils/themeScript.tsx` | Sets `data-theme`, `data-palette`, and `color-scheme` |
| CSS | `app/globals.css`, `Animations.module.css` | Attribute-based theme selectors and the cover styles |
| Providers | `ThemeContext.tsx`, `PaletteContext.tsx` | Keep storage, attributes, and inline palette in sync |
| Language switch | `LanguageContext.tsx` | Shows the cover before `router.push` |

## Testing

| Check | Result |
|---|---|
| Typecheck | ✅ |
| Lint | ✅ 0 errors |
| Unit/Integration | ✅ 113 tests |
| E2E (Chromium) | ✅ 166 tests |
| Theme suite | ✅ 6/6, including the cover and no-light-frame probe |
| Build | ✅ static `●`/`○` routes restored |

## Risks & follow-up

| Risk | Mitigation |
|---|---|
| The cover appears on every page load | Short fade (180ms); removed after hydration and fonts, with a 4s CSS fallback |
| A JS failure could leave the cover up | CSS auto-hide animation and no-JS default (cover hidden) |
| English is no longer chosen from the browser language | The switcher and `language` cookie still select it explicitly |
| Hard vs soft navigation | The script sets the cover on every document; the language switch sets it before `router.push` |
