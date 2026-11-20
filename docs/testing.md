---
doc_type: living
title: "Testing Guide"
version: "1.0.0"
last_updated: "2026-11-19"
status: active
audience: ["agents", "contributors", "maintainers"]
---

# Testing Guide

This project uses a layered test strategy:

| Layer            | Tool                     | Location                 | Purpose                                     |
| ---------------- | ------------------------ | ------------------------ | ------------------------------------------- |
| Unit             | Vitest                   | `tests/unit/`            | Pure functions and small modules            |
| Integration      | Vitest                   | `tests/integration/`     | Route handlers and services with mocked I/O |
| Component        | Vitest + Testing Library | `tests/components/`      | UI behavior in jsdom                        |
| E2E / regression | Playwright               | `tests/e2e/`             | Real browser, routes, flows, accessibility  |
| Accessibility    | axe-core + Playwright    | `tests/e2e/a11y.spec.ts` | Critical WCAG scans                         |
| Mocks            | MSW                      | `tests/mocks/`           | Deterministic external API responses        |

---

## Commands

```bash
npm test               # run unit + integration + component tests
npm run test:watch     # watch mode
npm run test:coverage  # v8 coverage report in ./coverage
npm run test:e2e       # Playwright default suite
npm run test:e2e:ui    # Playwright UI mode
npm run test:visual    # Opt-in visual regression snapshots
npm run test:visual:update # Regenerate local visual baselines
npm run test:perf      # Web Vitals budgets
npm run check          # typecheck + lint + unit/integration/component
```

Install the Playwright browser once per machine:

```bash
npx playwright install chromium
```

CI installs it automatically with `npx playwright install --with-deps chromium`.

---

## Layout

```
tests/
├── setup.ts                 # jsdom + jest-dom + MSW lifecycle + DOM mocks
├── mocks/
│   ├── handlers.ts          # shared MSW handlers (empty by default)
│   └── server.ts            # msw/node server
├── unit/                    # pure functions, security helpers, cookies
├── integration/             # app/api route handlers
├── components/              # React Testing Library
└── e2e/
    ├── smoke.spec.ts        # every static route returns < 400 and renders
    └── a11y.spec.ts         # axe scan for critical violations
```

---

## What is covered today

- `utils/helpers.ts` — Arabic/English digits, slugify, diacritics.
- `utils/paletteEngine.ts` — presets, custom hue, light/dark CSS variables.
- `lib/apiSecurity.ts` — client IP extraction and rate-limit windows.
- `lib/storage.ts` — string/number/JSON reads, fallbacks, validation, removal.
- `lib/sadaqaGarya/sadaqaDeleteCookie.ts` and `localDeleteTokens.ts` — token maps.
- `lib/http.ts` — JSON/array-buffer responses and `HttpError` normalization.
- `lib/env.ts` - Supabase/Hadith env validation, defaults, and missing-value failures.
- `lib/dateFormatting.ts` - Gregorian, Hijri, and 12-hour prayer-time formatting.
- `lib/i18n.ts` — locale resolution, path prefixing/swapping, stripping, and
  language-specific SEO translation.
- SEO — locale-aware metadata, hreflang, sitemap, robots, and manifest unit tests;
  Playwright checks titles, descriptions, canonical links, hreflang, `/robots.txt`,
  and `/sitemap.xml` in both locales.
- `GET /api/search-quran` — validation, success, no-match 404.
- `POST /api/download-audio` — missing/invalid URL and SSRF allowlist rejection.
- Locale parity — every English key exists in Arabic and vice versa.
- Translation key usage — every `t("…")`/`translate(…, "…")` key exists in both locales.
- Runtime i18n — Playwright visits all main routes in both locales and fails on
  “Translation key not found” warnings.
- UI primitives — `Button`, `IconButton`, `Modal`, `Loading`.
- Localized route smoke coverage for English and Arabic (Playwright).
- Root `/` redirect precedence: language cookie, then `Accept-Language`, then Arabic.
- Unsupported locale prefixes are re-homed under a supported locale.
- Unknown URLs return a localized HTTP 404 with `noindex`.
- Square PWA/Apple icons are served and declared in the manifest.
- Security headers, CSP report-only, CSP report collection, and API input
  validation.
- Sadaqat error/retry state, successful empty state, and local-token recovery.
- Language switching preserves the current path and query string.
- Internal links stay inside `/ar` or `/en` and resolve without HTTP errors.
- Accessibility: axe scans 16 key routes for critical/serious WCAG A/AA issues,
  plus keyboard language switch, modal focus trap/Escape, and mobile-menu Escape.
- Cross-browser smoke: Chromium, Firefox, and WebKit.
- User journeys: Quran/Azkar navigation, Tasbeeh persistence, Quran search,
  saved-ayah navigation, and Sadaqa create/delete with mocked storage.
- Visual regression: 10 opt-in snapshots covering EN/AR, home, Quran, Tasbeeh,
  Sadaqa form, and 404. Only Linux baselines are committed (see below).
- Performance: LCP, CLS, and transfer-size budgets on four routes.

Current totals: **19 test files, 109 unit/integration/component tests**, plus
**105 default Playwright tests**, **10 visual snapshots**, and **4 Web Vitals budgets**.

**Not covered yet:** Linux visual baselines (visual CI is dormant), manual
screen-reader passes, broader SEO structured-data validation, and Lighthouse CI
thresholds.

---

## How to add a test

### Pure function

```ts
import { describe, expect, it } from "vitest";
import { myHelper } from "@/utils/myHelper";

describe("myHelper", () => {
  it("does the thing", () => {
    expect(myHelper("input")).toBe("output");
  });
});
```

### API route handler

```ts
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/my-route/route";

const response = await GET(new Request("http://localhost/api/my-route?q=x"));
expect(response.status).toBe(200);
```

Mock upstream HTTP with MSW in `tests/mocks/handlers.ts`:

```ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://example.com/api", () => HttpResponse.json({ ok: true })),
];
```

### Component

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MyComponent from "@/components/MyComponent";

it("renders", () => {
  render(<MyComponent />);
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});
```

Prefer accessible queries (`getByRole`, `getByLabelText`) over CSS selectors.

### E2E

```ts
import { expect, test } from "@playwright/test";

test("critical flow", async ({ page }) => {
  await page.goto("/en/read-quran");
  await expect(page.getByRole("heading")).toBeVisible();
});
```

Playwright starts `npm run dev` locally and `npm run start` in CI. The default
suite uses 2 workers for stability. Use `page.route()` for third-party APIs and
avoid writing to the real database.

Visual regression uses a separate config:

```bash
npm run test:visual        # compare against baselines
npm run test:visual:update # rewrite baselines (only after an intended UI change)
```

### Visual baselines

Playwright stores one image per test and appends the platform to the filename,
so a Windows run and a Linux run never share images.

| File | Committed | Purpose |
|---|---|---|
| `*-linux.png` | yes | CI baseline (Ubuntu runner) |
| `*-win32.png` | no | local baseline, gitignored |
| `*-darwin.png` | no | local baseline, gitignored |

- Baselines are **not regenerated per commit**. Every run compares against the
  stored image. Run `npm run test:visual:update` only when a UI change is
  intentional, then commit the changed PNGs with that change.
- On a fresh clone, run `npm run test:visual:update` once to create baselines
  for your OS.
- `visual CI` is dormant until Linux baselines are committed. Generate them by
  running the **Visual Baselines** workflow and committing the uploaded
  `visual-linux-baselines` artifact.
- Locally the suite runs against `npm run dev`; CI runs the production build.
  That is why Linux baselines must come from CI rather than a local machine.

---

## Coverage

Coverage is generated with v8:

- `utils/`, `lib/`, `hooks/`, `components/`, `app/api/` are included.
- Constants, data JSON, and type declarations are excluded.
- Initial targets: **80%** for `utils/`, `lib/`, and `app/api/`; **50–70%**
  overall. Do not chase 100% line coverage for media-heavy UI; prioritize route
  and critical-flow coverage.

---

## CI

`.github/workflows/ci.yml` runs:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm test`
5. `npm run build`
6. Playwright smoke + a11y + journeys + cross-browser (`npm run test:e2e`)
7. Visual regression when Linux baselines are present (`npm run test:visual`)

Playwright reports are uploaded on failure. The current suite is 19 Vitest files
(109 tests) plus 105 default Playwright tests, 10 visual snapshots, and 4 Web
Vitals budgets.

---

## Known limitations

- The app uses React 19.3.1 and `react-spinners` 0.17.1. React 19’s stricter ref
  types are reflected in component props (`RefObject<T | null>`).
- `npm audit` reports **0 vulnerabilities** for both production and dev
  dependencies after the Phase 2b `npm audit fix`.
- The 2-second hydration gate was removed in Phase 2; E2E is faster as a result.
- The legacy code has 107 lint warnings (React Compiler hook rules + exhaustive
  deps). They are visible but do not block CI; the hook refactor is the next
  consistency task.
- Prettier now runs across the repository; new files must be formatted before
  merging.
- Visual regression compares platform-specific images. Only Linux baselines are
  committed, and the visual CI job stays skipped until they exist.

---

## Troubleshooting

| Symptom                                    | Fix                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `Executable doesn't exist` from Playwright | `npx playwright install chromium`                                           |
| Port 3000 already in use                   | Stop the dev server or set `E2E_BASE_URL` to an existing server             |
| MSW handler not used                       | Check the URL/method matches exactly; use `server.use(...)` inside the test |
| `matchMedia is not a function`             | Ensure `tests/setup.ts` is loaded via `vitest.config.mts`                   |
| Type errors in tests                       | Run `npm run typecheck`; tests are part of the TypeScript program           |
