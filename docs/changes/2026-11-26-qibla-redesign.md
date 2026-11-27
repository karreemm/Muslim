---
doc_type: change
title: "Qibla page redesign: one compass, governorate fallback"
doc_id: "CHG-0014"
date: "2026-11-26"
branch: "main"
commit: "pending"
author: "OpenCode agent"
status: review
scope: [qibla, compass, geolocation, i18n, ui, security]
related_files:
  - components/qibla/QiblaCompass.tsx
  - hooks/useQibla.ts
  - lib/qibla.ts
  - public/qibla/kaaba.png
  - constants/egyptianGovernorates.ts
  - constants/routeQuotes.ts
  - app/[locale]/(pages)/prayer-times/components/GovernorateSelector.tsx
  - locales/en/qibla.json
  - locales/ar/qibla.json
  - locales/en/navbar.json
  - locales/ar/navbar.json
  - locales/en/seo.json
  - locales/ar/seo.json
  - next.config.mjs
  - tests/components/QiblaCompass.test.tsx
  - tests/e2e/layout.spec.ts
  - tests/e2e/a11y.spec.ts
  - tests/e2e/smoke.spec.ts
  - tests/e2e/i18n.spec.ts
  - tests/e2e/links.spec.ts
  - tests/e2e/seo.spec.ts
  - tests/e2e/journeys.spec.ts
  - tests/e2e/cross-browser.spec.ts
  - tests/e2e/security.spec.ts
related_docs:
  - docs/project-overview.md
  - docs/ui-ux-guidelines.md
  - docs/testing.md
---

# Qibla page redesign

## Summary

- Replaced the multi-card Qibla dashboard with one centered compass card.
- Added the requested heading, subtitle, and the 2:144 verse through the existing
  `PageQuote` + `ROUTE_QUOTES` pipeline. The invented header icon and surah
  reference were removed to match other routes.
- Removed the separate direction card, status card, accuracy rows, manual
  latitude/longitude form, duplicated metrics, and technical diagnostics.
- Reused the existing Egyptian governorates data and `GovernorateSelector`.
  Coordinates were added to the existing objects, not duplicated in a new list.
- Enlarged the compass, removed cardinal text labels, added 30° bearing numbers
  and refined ticks, and replaced the Kaaba mark with the supplied transparent
  `kaaba.png` asset.
- Replaced the center needle medallion with a destination marker: a short
  center pointer line toward the Qibla, a solid center dot, and the Kaaba image
  placed 90 units from the center at the Qibla angle inside a soft primary glow.
  The Kaaba is moved with translation only, so it always stays upright.
- When GPS succeeds, the governorate picker is hidden and the nearest local
  governorate name is shown in Arabic/English. The picker remains available only
  when a manual location is needed.
- Removed the calculated badge. The calculated message and compass action now sit
  above the compass; when live, they are replaced with alignment instructions.
- While location is loading, a dedicated loading row replaces the picker and
  action; the picker stays hidden on success and returns on failure. The spinner
  follows the text, so it sits on the left in Arabic and the right in English.
- The compass now shows only twelve degree labels (0°–330° in 30° steps) at one
  uniform font size. Emphasis comes from weight and opacity: 0°/180° are semibold
  at full opacity, 90°/270° are semibold at 0.82, and the remaining labels are
  medium at 0.62. Tick length, width, and opacity mirror the same hierarchy, with
  subtle 10° ticks in between, and the primary ticks end at the inner ring stroke
  so they merge with it instead of crossing it. The labels share one radial band
  with a wider gap on the ring side; the tick starts move inward by the same
  amount so the gap between each number and its tick stays unchanged. Flipped
  labels rotate about the same ink center, so every label keeps an identical gap
  on both sides. Each label is offset by half a degree-glyph so the digits, not the
  trailing `°`, sit exactly on the tick line. Emphasis uses typography and opacity
  only, so the active theme still supplies every color, and labels flip to stay
  readable as the dial rotates.
- The compass button reads **استخدم البوصلة** / **Live compass**.
- In live mode, a small fixed marker sits at 12 o'clock outside the bezel and never
  rotates with the dial. It marks the screen top, not north: alignment is computed
  from the screen-relative Qibla arrow, never from `qiblaBearing` or the rotating
  0° tick. Once the arrow stays within ±5° for 200 ms, the marker turns solid and
  the confirmation message stays visible until the arrow leaves the ±7° exit band,
  so sensor jitter does not flicker it. Re-aligning shows the confirmation again.
  No haptics are used.
- A session-level location cache keeps the chosen location across locale
  navigation, avoiding a second GPS prompt or recalculation.
- Added permission-aware automatic geolocation and a governorate fallback for
  desktops and denied/unavailable GPS.
- Fixed `Permissions-Policy` so same-origin geolocation is actually allowed.
- Sensor and geolocation diagnostics now log to the browser console in
  development only.

## Context / Problem

The first Qibla implementation was accurate but presented as a technical
dashboard: a direction card, status card, accuracy rows, a separate manual form,
and duplicated bearing/distance information. The user asked for a single,
elegant compass experience and for manual location to reuse the Prayer Times
governorate picker.

## Implementation

| Area | Change |
|---|---|
| Header/verse | `PageHeader` now uses **اتجاه القبلة** / **حدد اتجاه القبلة من مكانك**; `PageQuote` renders the 2:144 excerpt from `ROUTE_QUOTES.qibla`, matching other routes with no surah caption |
| Main card | One `Card` containing the location row, top calculated/action block, compass, bearing/distance, and concise errors |
| Location | Auto-request when the Permissions API already reports `granted`; otherwise the user presses **استخدم موقعي**. GPS hides the picker and shows the nearest governorate name locally; manual selection still uses `GovernorateSelector`. A loading row replaces the picker while locating and the picker returns if GPS fails |
| Compass | Larger SVG face, twelve 30° degree labels with a 0°/180° → 90°/270° → regular emphasis hierarchy and subtle 10° ticks, no cardinal labels or fixed label colors. The Qibla marker is a short pointer line from the center, a solid center dot, and the Kaaba at 90 units on the Qibla angle with a soft primary glow; the Kaaba is translated upright without rotating |
| State | Live only when a trustworthy heading exists. Otherwise the calculated message and action appear above the compass; when live they are replaced with an alignment instruction. A fixed 12 o'clock marker plus a persistent confirmation appear when the Qibla arrow stays within ±5° for 200 ms, until it leaves the ±7° band. The chosen location is cached for the session so locale navigation does not request it again |
| Buttons | Tinted secondary action buttons keep the gold theme while meeting AA contrast; compass action reads **استخدم البوصلة** / **Live compass** |
| Diagnostics | `console.debug("[qibla] diagnostics", …)` only when `NODE_ENV === "development"` |
| Security | `Permissions-Policy` changed from `geolocation=()` to `geolocation=(self)` |
| Dev | `devIndicators: false` so the Next.js route badge does not overlap the compass during development |

## Testing

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ 0 errors |
| `npm run test` | ✅ 22 files, 136 tests |
| `npm run build` | ✅ static `/ar/qibla` and `/en/qibla` |
| Qibla E2E (Chromium) | ✅ a11y, layout at 320/768/1440, SEO, smoke, journey, security headers |
| Qibla E2E (Firefox + WebKit) | ✅ governorate selection and calculation |
| Page quote/title E2E | ✅ qibla quote uses the mushaf font; title sizes match |
| Visual check | ✅ 390 px light and 1440 px dark, initial/filled/live states |
| Auto geolocation | ✅ granted permission hides the picker, shows Cairo, and updates the compass |

## Gaps / hardware limitations

- No IP geolocation provider was added: the project has no existing trusted IP
  service, and the task warns against sending location data to an untrusted one.
  The governorate selector remains the desktop/no-GPS fallback.
- Governorate coordinates use each governorate's capital city. For GPS, the
  nearest capital within 75 km is shown as the local name; this is a local
  approximation, not third-party reverse geocoding.
- A calculated direction does not know which way a laptop is physically facing.
  The UI labels it as calculated and explains true-north alignment.
- Physical iPhone/iPad, Android Chrome, and Samsung Internet sensor behavior still
  requires real-device verification.
- Governorate coordinates use each governorate's capital city; the Qibla angle is
  representative of that governorate, not every point within it.

## Follow-ups

- [ ] Verify live heading, permissions, and screen rotation on physical iPhone, iPad, Android, and Samsung devices.
- [ ] Compare the live heading with a physical compass or known landmark.
- [ ] Decide whether a trusted same-origin IP geolocation service should be added later.
- [ ] Replace the nearest-governorate label with real reverse geocoding only if a trusted service is chosen.
