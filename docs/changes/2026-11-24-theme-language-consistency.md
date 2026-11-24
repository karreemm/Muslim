---
doc_type: change
title: "Arabic default locale and flash-free server-rendered theme"
doc_id: "CHG-0012"
date: "2026-11-24"
branch: "fix/theme-language-consistency"
commit: "pending"
author: "OpenCode agent"
status: review
scope: [theme, i18n]
related_files:
  - proxy.ts
  - app/[locale]/layout.tsx
  - lib/theme.ts
  - utils/themeScript.tsx
  - app/globals.css
  - app/styles/modules/Animations.module.css
  - context/general/ThemeContext.tsx
  - context/general/PaletteContext.tsx
  - tests/e2e/theme.spec.ts
  - tests/e2e/smoke.spec.ts
---

# Theme and language consistency

## Summary

- The root redirect now defaults to Arabic when no language cookie exists.
  Accept-Language no longer changes the first visit.
- Theme and palette are mirrored into cookies and rendered by the server on
  `<html data-theme data-palette>`, with matching CSS selectors. The first HTML
  response already has the saved colours, so a language switch, refresh, or
  hydration can never paint the default light theme first.
- The pre-paint script keeps the attributes and cookies in sync and re-asserts
  the stored choice if hydration patches a stale value.

## Context / Problem

- `/` resolved the locale from Accept-Language, so an English browser landed on
  `/en` even though Arabic is the product default.
- The document was server-rendered light. The JS theme script added `dark` and
  the palette before paint, but root-layout navigation/hydration repainted
  `<html>` from the server value. That produced one or more light frames before
  the providers restored the theme. A JS-only fix is always racing that paint.

## Changes

| Area | File(s) | What changed |
|---|---|---|
| Locale | `proxy.ts` | Cookie or Arabic default; Accept-Language ignored for `/` |
| SSR theme | `app/[locale]/layout.tsx` | Reads theme/palette/hue cookies and renders them on `<html>` |
| Cookie helpers | `lib/theme.ts` | Shared names and client cookie writer |
| Pre-paint script | `utils/themeScript.tsx` | Writes cookies, sets data attributes, re-asserts after hydration |
| CSS | `app/globals.css`, `Animations.module.css` | `[data-theme]` / `[data-palette]` instead of classes |
| Providers | `ThemeContext.tsx`, `PaletteContext.tsx` | Keep storage, cookies, attributes, and inline palette in sync |
| Tests | `theme.spec.ts`, `smoke.spec.ts` | No-light-frame probe and Arabic default redirects |

## Testing

| Check | Result |
|---|---|
| Typecheck | ✅ |
| Lint | ✅ 0 errors |
| Unit/Integration | ✅ 113 tests |
| E2E (Chromium) | ✅ 166 tests |
| Theme suite | ✅ 5/5, including no light frame across `/en` → `/ar` |
| Build | ✅ |

## Risks & follow-up

| Risk | Mitigation |
|---|---|
| English is no longer chosen from the browser language | The language switcher and the `language` cookie still select it explicitly |
| Reading cookies in the root layout makes localized pages dynamic | Accepted to guarantee the first paint; SEO HTML is still server-rendered |
| A first visit with no cookies yet uses the light default | The script writes the cookie immediately; subsequent navigations and refreshes are server-rendered |
