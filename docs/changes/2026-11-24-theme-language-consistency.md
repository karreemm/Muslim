---
doc_type: change
title: "Theme survives language switches; Arabic is the default locale"
doc_id: "CHG-0012"
date: "2026-11-24"
branch: "fix/theme-language-consistency"
commit: "pending"
author: "OpenCode agent"
status: review
scope: [theme, i18n]
related_files:
  - proxy.ts
  - context/general/PaletteContext.tsx
  - tests/e2e/theme.spec.ts
  - tests/e2e/smoke.spec.ts
---

# Theme and language consistency

## Summary

- The root redirect now defaults to Arabic when no language cookie exists.
  Accept-Language no longer changes the first visit.
- Switching language keeps the selected theme's colours: the palette is
  re-applied when its observer registers, so a locale navigation can no longer
  leave light inline variables behind the dark class.

## Context / Problem

- `/` resolved the locale from Accept-Language, so an English browser landed on
  `/en` even though Arabic is the product default.
- Root-layout navigation resets the extra classes on `<html>`. `ThemeContext`
  re-adds `dark`, but `PaletteContext` is a child and its effect ran first,
  writing light CSS variables. The observer then missed the class change, so the
  page stayed light while the theme state and icon still said dark.

## Testing

| Check | Result |
|---|---|
| Typecheck | ✅ |
| Lint | ✅ 0 errors |
| Unit/Integration | ✅ 113 tests |
| E2E (Chromium) | ✅ 39 theme/smoke tests |
| Build | ✅ |

## Risks & follow-up

| Risk | Mitigation |
|---|---|
| English is no longer chosen from the browser language | The language switcher and the `language` cookie still select it explicitly |
| Palette can still be re-applied twice on mount | Both applications use the same resolved hue and theme |
| Server HTML still cannot know the theme before hydration | Next step: mirror theme/palette into cookies and render them on `<html>` |
