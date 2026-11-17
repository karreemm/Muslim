---
doc_type: living
title: "Testing Guide"
version: "1.0.0"
last_updated: "2026-11-17"
status: active
audience: ["agents", "contributors", "maintainers"]
---

# Testing Guide

This project uses a layered test strategy:

| Layer | Tool | Location | Purpose |
|---|---|---|---|
| Unit | Vitest | `tests/unit/` | Pure functions and small modules |
| Integration | Vitest | `tests/integration/` | Route handlers and services with mocked I/O |
| Component | Vitest + Testing Library | `tests/components/` | UI behavior in jsdom |
| E2E / regression | Playwright | `tests/e2e/` | Real browser, routes, flows, accessibility |
| Accessibility | axe-core + Playwright | `tests/e2e/a11y.spec.ts` | Critical WCAG scans |
| Mocks | MSW | `tests/mocks/` | Deterministic external API responses |

---

## Commands

```bash
npm test               # run unit + integration + component tests
npm run test:watch     # watch mode
npm run test:coverage  # v8 coverage report in ./coverage
npm run test:e2e       # Playwright (browser must be installed)
npm run test:e2e:ui    # Playwright UI mode
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
- `lib/sadaqaGarya/sadaqaDeleteCookie.ts` — token map round-trip and malformed input.
- `GET /api/search-quran` — validation, success, no-match 404.
- `POST /api/download-audio` — missing/invalid URL and SSRF allowlist rejection.
- `Loading` — accessible status region.
- All 14 static routes + home title (Playwright).
- Home page critical a11y violations (axe).

**Not covered yet:** hooks/contexts, most components, dynamic routes with mocked
data, full user journeys, visual regression. These are Phase 2–4.

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
  await page.goto("/read-quran");
  await expect(page.getByRole("heading")).toBeVisible();
});
```

Playwright starts `npm run dev` locally and `npm run start` in CI. Use
`page.route()` for third-party APIs and avoid writing to the real database.

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
6. Playwright smoke + a11y (`npm run test:e2e`)

Playwright reports are uploaded on failure.

---

## Known limitations

- The app currently uses React 18; Next 16 warns that React 18 support is
  deprecated. The test stack works, but the React 19 upgrade is planned.
- `npm audit` reports high findings in **dev-only** tooling (`picomatch`,
  `brace-expansion`). Production dependencies audit clean. Revisit when Vitest/Vite
  publish a patched tree.
- The 2-second hydration gate makes E2E slightly slower. Removing it is a Phase 2
  task.
- The legacy code has 112 lint warnings (React Compiler hook rules). They are
  visible but do not block CI; Phase 2 fixes the hook patterns.
- A repo-wide Prettier pass is deferred to Phase 2 so the formatting diff stays
  reviewable.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Executable doesn't exist` from Playwright | `npx playwright install chromium` |
| Port 3000 already in use | Stop the dev server or set `E2E_BASE_URL` to an existing server |
| MSW handler not used | Check the URL/method matches exactly; use `server.use(...)` inside the test |
| `matchMedia is not a function` | Ensure `tests/setup.ts` is loaded via `vitest.config.mts` |
| Type errors in tests | Run `npm run typecheck`; tests are part of the TypeScript program |
