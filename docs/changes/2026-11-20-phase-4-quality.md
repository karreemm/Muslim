---
doc_type: change
title: "Phase 4: accessibility matrix, user journeys, and visual regression"
doc_id: "CHG-0008"
date: "2026-11-20"
branch: "chore/professional-foundation"
commit: ""
author: "OpenCode agent"
status: review
scope: [testing, accessibility, visual-regression]
related_files:
  - tests/e2e/a11y.spec.ts
  - tests/e2e/journeys.spec.ts
  - tests/e2e/visual.spec.ts
  - tests/e2e/cross-browser.spec.ts
  - tests/e2e/keyboard.spec.ts
  - tests/e2e/performance.spec.ts
  - playwright.config.ts
  - playwright.visual.config.ts
  - playwright.performance.config.ts
  - .github/workflows/ci.yml
  - .github/workflows/visual-baselines.yml
  - package.json
  - app/globals.css
  - app/[locale]/(pages)/tasbeeh/Counter.tsx
  - app/[locale]/(pages)/search-ayah/SearchAyah.tsx
  - app/[locale]/(pages)/sadaqa-garya/components/SadaqaNameFields.tsx
  - app/[locale]/(pages)/sadaqa-garya/components/SadaqaMessageFields.tsx
  - app/[locale]/not-found.tsx
  - app/global-not-found.tsx
related_docs:
  - docs/testing.md
  - docs/project-overview.md
---

# Phase 4: visual regression and accessibility

## Progress

- [x] Expanded accessibility matrix
- [x] Keyboard check for the language dropdown
- [x] User journey tests
- [x] Visual regression harness
- [x] Visual baselines policy (Linux-only in git)
- [x] Fix critical/serious accessibility findings
- [x] Cross-browser projects
- [x] Modal and mobile-menu keyboard flows
- [x] Visual regression CI gating for Linux baselines
- [x] Web Vitals budget checks
- [ ] Committed (waiting for confirmation)

## Summary

- Expanded axe coverage from the home page to 16 key routes.
- Accessibility tests now fail on **critical or serious** WCAG A/AA violations.
- Added a keyboard flow test for the language dropdown.
- Added six user journeys:
  - read Quran → open a surah
  - azkar → open a category
  - tasbeeh → increment and persist
  - Quran search → results
  - saved ayah → open the correct surah/ayah
  - Sadaqa → create and delete with mocked storage
- Added an opt-in visual regression suite:
  - English and Arabic
  - 5 page types (home, Quran index, Tasbeeh, Sadaqa form, 404)
  - Desktop Chromium, 1440×900
  - Footer masked to avoid year drift
- Added Firefox and WebKit smoke projects.
- Added modal focus-trap / focus-restore and mobile-menu Escape tests.
- Added a Sadaqa create/delete journey with mocked storage.
- Added Web Vitals budget checks (LCP, CLS, transfer size).
- CI installs Chromium, Firefox, and WebKit.
- Visual baselines are platform-specific, so only `*-linux.png` files are
  committed; Windows and macOS baselines are gitignored local artifacts.
- The visual CI job is dormant until Linux baselines are committed. A manual
  **Visual Baselines** workflow generates and uploads them.
- Fixed the accessibility issues found:
  - Gold light theme `primary-foreground` contrast
  - Tasbeeh increment/decrement/reset accessible names
  - Search input and clear-button labels
  - Sadaqa form placeholder, field labels, and language-badge contrast
  - Decorative 404 number hidden from assistive tech
  - 404 home button contrast

## Test configuration

- `playwright.config.ts`
  - Default suite excludes `visual.spec.ts`
  - `reducedMotion: "reduce"`
  - 2 workers for stability
- `playwright.visual.config.ts`
  - Chromium only
  - One worker
  - 1440×900, light theme, reduced motion
  - `maxDiffPixelRatio: 0.02`
  - Screenshot animations disabled and caret hidden
- `playwright.performance.config.ts`
  - Chromium only
  - Production server
  - LCP < 4s, CLS < 0.15, transfer < 4 MB

### Commands

```bash
npm run test:e2e
npm run test:visual
npm run test:visual:update
npm run test:perf
```

## Accessibility coverage

Routes:

- `/en`, `/ar`
- `/en/read-quran`, `/ar/read-quran`
- `/en/read-quran/surah/1`
- `/en/read-hadith`
- `/en/azkar`
- `/en/prayer-times`
- `/en/tasbeeh`
- `/en/search-ayah`
- `/en/generate-ayah-image`
- `/en/sadaqa-garya`
- `/en/saved-ayahs`
- `/en/favourites`
- `/en/sadaqat`
- `/en/this-page-does-not-exist`

Each route is scanned with axe using `wcag2a` and `wcag2aa`.

## Visual coverage

Snapshots:

- `home-en`, `home-ar`
- `read-quran-en`, `read-quran-ar`
- `tasbeeh-en`, `tasbeeh-ar`
- `sadaqa-garya-en`, `sadaqa-garya-ar`
- `not-found-en`, `not-found-ar`

Baselines are stored next to the spec:

- `tests/e2e/visual.spec.ts-snapshots/*-linux.png` — committed, used by CI
- `tests/e2e/visual.spec.ts-snapshots/*-win32.png` — local only (gitignored)
- `tests/e2e/visual.spec.ts-snapshots/*-darwin.png` — local only (gitignored)

Playwright only compares against the baseline for the current platform, so a
Windows run never uses the Linux images and vice versa.

**When to regenerate:** only after an intentional UI change. Run
`npm run test:visual:update`, review the new images, and commit them with the UI
change. Never run it as part of a routine commit — that would make the
assertions meaningless.

**CI status:** dormant. The `visual` job runs only when `*-linux.png` baselines
exist. Generate them by running the **Visual Baselines** workflow
(`workflow_dispatch`) and committing the uploaded `visual-linux-baselines`
artifact. Until then the job is skipped, and `npm run test:visual` remains a
local-only check.

**First local run:** baselines for your OS are not in git, so run
`npm run test:visual:update` once to create them.

## Results

| Check | Result |
|---|---|
| Typecheck | ✅ |
| Lint | ✅ 0 errors / 107 warnings |
| Unit/integration | ✅ 19 files, 109 tests |
| Default E2E | ✅ 105/105 (Chromium + Firefox + WebKit) |
| Visual E2E | ✅ 10/10 |
| Performance budgets | ✅ 4/4 |
| Build | ✅ |
| Audit | ✅ 0 vulnerabilities |

## Risks & follow-ups

| Risk | Mitigation |
|---|---|
| Visual baselines are platform-specific | Only Linux baselines are committed; others are gitignored |
| No Linux baselines yet | Visual CI job stays skipped until they are generated |
| Dynamic dates/content | Mask footer; freeze time where needed |
| External APIs can slow tests | Mock Sadaqa and keep routes deterministic |
| Accessibility coverage is automated only | Add manual screen-reader and keyboard passes |

## Follow-ups

- [x] Add Firefox and WebKit smoke projects.
- [x] Add modal focus-trap and mobile-menu keyboard tests.
- [x] Add Sadaqa create/delete journey with a mocked API.
- [ ] Generate and commit Linux visual baselines via the Visual Baselines workflow.
- [x] Add Web Vitals budget checks.
- [ ] Add broader SEO structured-data validation.
- [ ] Add manual screen-reader pass.

## Agent Checklist

- [x] Added accessibility, journey, and visual tests.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] Default E2E passes.
- [x] Visual E2E passes locally.
- [ ] Committed after user confirmation.
