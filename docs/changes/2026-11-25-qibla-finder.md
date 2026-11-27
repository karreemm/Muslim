---
doc_type: change
title: "Cross-device Qibla finder with true-north compass"
doc_id: "CHG-0013"
date: "2026-11-25"
branch: "main"
commit: "pending"
author: "OpenCode agent"
status: review
scope: [qibla, compass, geolocation, i18n, ui, navigation]
related_files:
  - lib/qibla.ts
  - hooks/useQibla.ts
  - components/qibla/QiblaCompass.tsx
  - app/[locale]/(pages)/qibla/page.tsx
  - app/[locale]/(pages)/qibla/layout.tsx
  - app/[locale]/(pages)/qibla/loading.tsx
  - locales/en/qibla.json
  - locales/ar/qibla.json
  - lib/i18n.ts
  - lib/seo.ts
  - app/sitemap.ts
  - components/layout/navbar/Navbar.tsx
  - tests/unit/qibla.test.ts
  - tests/components/QiblaCompass.test.tsx
  - tests/e2e/layout.spec.ts
  - tests/e2e/a11y.spec.ts
  - tests/e2e/smoke.spec.ts
  - tests/e2e/i18n.spec.ts
  - tests/e2e/links.spec.ts
  - tests/e2e/seo.spec.ts
  - tests/e2e/journeys.spec.ts
  - tests/e2e/cross-browser.spec.ts
related_docs:
  - docs/project-overview.md
  - docs/ui-ux-guidelines.md
  - docs/testing.md
---

# Cross-device Qibla finder

## Progress

- [x] Analysis complete
- [x] Implementation complete
- [x] Tests added/updated
- [x] Typecheck + lint pass
- [x] Docs updated
- [x] Verified on a running build
- [ ] Verified on physical iPhone, iPad, Android, and Samsung hardware
- [ ] Ready for review

## Summary

- Added `/{ar|en}/qibla` and a **Qibla Finder** entry in the Tools menu.
- Added pure great-circle and Haversine math in `lib/qibla.ts`, plus WMM2025
  magnetic declination so the displayed direction is relative to true north.
- Added `useQibla` for geolocation, iOS sensor permission, absolute/relative
  orientation detection, `webkitCompassHeading`, screen rotation, smoothing,
  stale-reading detection, and a manual-coordinate fallback.
- Added `QiblaCompass` with a live compass, calculated-direction fallback,
  bearing, distance, location/compass status, calibration instructions, and
  mobile-first RTL layout.
- Added bilingual copy, route metadata, sitemap/navbar wiring, and tests for the
  math, fallback UI, absolute heading, and denied iOS permission.

## Context / Problem

There was no Qibla feature. Browser orientation data is not a reliable compass by
default: `alpha` can be relative, iOS requires a user-gesture permission and
exposes `webkitCompassHeading`, screen rotation changes the viewport's up
direction, and magnetic north differs from true north. A feature that treats
`alpha` as an absolute heading would be wrong on several browsers.

## Implementation

| Area | File(s) | What changed |
|---|---|---|
| Bearing/distance | `lib/qibla.ts` | Initial great-circle bearing (true north) and Haversine distance; angle normalisation; coordinate validation |
| Declination | `lib/qibla.ts` | WMM2025 degree/order 12 evaluation at sea level; one `magneticHeadingToTrueHeading` conversion point |
| Location | `hooks/useQibla.ts` | One-shot `getCurrentPosition` on demand; permission, unavailable, timeout, insecure-context, and invalid-coordinate states; manual location invalidates pending GPS callbacks |
| Orientation | `hooks/useQibla.ts` | `deviceorientationabsolute`, absolute `deviceorientation`, and `webkitCompassHeading`; relative `alpha` is rejected |
| Screen rotation | `hooks/useQibla.ts` | `ScreenOrientation.angle` with `window.orientation` fallback; re-publishes the current reading on rotation |
| Smoothing | `hooks/useQibla.ts` | Shortest-angle exponential smoothing (120 ms time constant, larger-turn boost), 30 Hz publish cap, no wrap-around jumps |
| Reliability | `hooks/useQibla.ts` | Invalid readings ignored; no-reading/relative-only detection; 4 s stale watchdog; iOS `webkitCompassAccuracy` drives the calibration hint |
| UI | `components/qibla/QiblaCompass.tsx` | Compass rose, Qibla arrow, bearing/distance cards, status and accuracy rows, fallback instructions, manual location form |
| Route/i18n | `app/[locale]/(pages)/qibla/*`, `locales/*/qibla.json` | Static route, metadata, loading state, navbar and sitemap entries, Arabic/English parity |

### Heading pipeline

1. Read a **magnetic** heading from `webkitCompassHeading` or absolute `alpha`.
2. Smooth it with the shortest circular path.
3. Apply WMM2025 declination exactly once.
4. Add the screen orientation angle.
5. Draw the rose at `-heading` and the Qibla arrow at `bearing - heading`.

When no trustworthy heading is available, the arrow is drawn at the calculated
bearing with north at the top, and the UI explicitly says the direction is
relative to true north.

## Testing

| Check | Result |
|---|---|
| `npm run check` | ✅ 0 errors, 107 pre-existing lint warnings |
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ 0 errors (existing project warnings only) |
| `npm run check:ui` | ✅ |
| `npm run check:copy` | ✅ |
| `npm run test` | ✅ 22 files, 130 tests |
| `npm run build` | ✅ static `/ar/qibla` and `/en/qibla` |
| `npm run test:e2e` | ✅ 188/189 on the first full run; the sole failure was a pre-existing title-scale hydration race, fixed in the test and green on targeted rerun |
| Playwright visual pass | ✅ 390 px mobile light/dark and 1440 px Arabic dark |
| Simulated absolute sensor | ✅ `alpha = 90` → screen top 275°, Qibla arrow rotated correctly |
| Math fixtures | ✅ Cairo 136.14° / 1,287.2 km; London 118.99° / 4,793.8 km; New York 58.48° / 10,306.3 km; Jakarta 295.15° / 7,920.1 km; Sydney 277.50° / 13,236.3 km |
| WMM fixtures | ✅ Cairo 4.76°E, London 1.15°E, New York 12.48°W, Jakarta 0.64°E, Sydney 12.82°E, Makkah 3.51°E |

## Risks & follow-up

| Risk | Mitigation |
|---|---|
| A browser reports magnetic north with a different reference frame | Declination is applied only to sources documented as magnetic; the calculation has one conversion point |
| Sensor jitter or dropped events | 120 ms smoothing, 30 Hz publishes, stale watchdog, and explicit fallback |
| Device-specific `alpha` quirks | Relative alpha is never trusted; the UI falls back when no absolute reading appears |
| WMM2025 expires after 2030 | `declinationModelValid` and a UI note make extrapolated values visible |
| Desktop has no physical compass | The calculated true-north direction remains available and is labelled as such |
| Physical heading accuracy | Still requires real iPhone/iPad/Android/Samsung testing against a known landmark or physical compass |

## Follow-ups

- [ ] Verify iPhone Safari and iPadOS permission, heading, and screen rotation.
- [ ] Verify Android Chrome and Samsung Internet absolute heading and denied permission.
- [ ] Verify desktop Chrome fallback and no-sensor state.
- [ ] Compare live headings with a physical compass or known landmark.
- [ ] Add an E2E mocked-sensor scenario if hardware coverage remains manual.
