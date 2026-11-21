---
doc_type: guide
title: "Testing Guide"
last_updated: "2026-11-21"
status: active
---

# Testing Guide

| Layer | Tool | Location |
|---|---|---|
| Unit | Vitest | `tests/unit/` |
| Integration (API handlers) | Vitest + MSW | `tests/integration/` |
| Component | Vitest + Testing Library | `tests/components/` |
| E2E | Playwright | `tests/e2e/` |
| Accessibility | axe + Playwright | `tests/e2e/a11y.spec.ts` |

## Commands

```bash
npm run check          # typecheck + lint + unit/integration/component
npm run test           # tests only
npm run test:coverage  # v8 coverage
npm run test:e2e       # Chromium + Firefox + WebKit
npm run test:perf      # Web Vitals budgets (local only)
```

Install browsers once: `npx playwright install chromium firefox webkit`.

## Coverage

- **Unit** — helpers, palette engine, storage, HTTP, env, SEO, dates, security,
  cookies, translation keys.
- **Integration** — every `app/api` route handler with mocked upstreams.
- **E2E** — route smoke, locale routing and metadata, internal links, security
  headers and CSP reports, i18n runtime scan, Sadaqa UX, 16-route axe matrix,
  keyboard flows (language switch, mobile menu Escape, modal focus trap), six user
  journeys, and Firefox/WebKit smoke checks.
- **Performance** — LCP < 4s, CLS < 0.15, transfer < 4 MB on four routes.

Current totals: **109 unit/integration/component tests** and **105 E2E tests**.

## CI

`.github/workflows/ci.yml`:

1. `verify` — `npm ci`, typecheck, lint, tests, build.
2. `e2e` — Playwright across three browsers, after `verify`.

Reports upload on failure. `test:perf` is not in CI: shared runners are too noisy
for timing budgets, so run it before a release.

## Rules

- Mock third-party APIs with `page.route()` or MSW; never hit real services or the
  real database.
- Add a test with the change, not after.
- Feature pages need loading, empty, error, and success coverage.
- Keep tests deterministic: no fixed sleeps where a locator assertion works.

## Known limitations

- 107 lint warnings remain (React Compiler hook rules and exhaustive deps); they do
  not block CI.
- No automated visual regression or manual screen-reader pass.
- `npm audit` is clean; re-run it after dependency changes.
