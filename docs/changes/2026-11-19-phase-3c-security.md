---
doc_type: change
title: "Phase 3C: security headers, CSP report-only, and API hardening"
doc_id: "CHG-0007"
date: "2026-11-19"
branch: "chore/professional-foundation"
commit: ""
author: "OpenCode agent"
status: done
scope: [security, headers, csp, api]
related_files:
  - next.config.mjs
  - app/api/csp-report/route.ts
  - app/api/proxy/route.ts
  - app/api/radio-proxy/route.ts
  - app/api/download-audio/route.ts
  - app/api/search-quran/route.ts
  - app/api/tafseer/route.ts
  - app/api/hadith/route.ts
  - app/api/sadaqa-garya/route.ts
  - app/api/sadaqa-garya/[slug]/route.ts
  - lib/env.ts
  - lib/logger.ts
  - .env.example
  - tests/e2e/security.spec.ts
related_docs:
  - docs/security.md
  - docs/api.md
  - docs/project-overview.md
  - docs/testing.md
---

# Phase 3C: security hardening

## Progress

- [x] Global security headers
- [x] CSP report-only
- [x] CSP report collector
- [x] API error sanitization
- [x] API input validation
- [x] Radio proxy header filtering
- [x] Sadaqa ownership filtering
- [x] Production logging preserved
- [x] Tests and production E2E
- [ ] Committed (waiting for confirmation)

## Summary

- Added global security headers for every page and API response.
- Added `Content-Security-Policy-Report-Only` with a same-origin report collector.
- Removed raw upstream/error messages from API responses.
- Added input caps and allowlists to API routes.
- Filtered `radio-proxy` response headers.
- Fixed a privacy issue: `/api/sadaqa-garya` now returns only memorials owned by
  the requester's delete-token cookie.
- The global Sadaqa provider now mounts only on `/sadaqat` and the create page
  instead of every page, and Supabase calls have an 8-second server timeout.
- `/sadaqat` now shows a proper retryable error instead of the misleading
  “Coming Soon” card, and recovers records from local delete tokens if the
  cookie-owned list is empty.
- Removed `NEXT_PUBLIC_HADITH_API_KEY` fallbacks.
- Preserved `console.error` / `console.warn` in production so Vercel logs receive
  security and CSP events.

## Security headers

Applied to `/(.*)`:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), clipboard-write=(self)` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-Permitted-Cross-Domain-Policies` | `none` |

`preload` is intentionally omitted for now.

## CSP

Initial report-only policy:

```text
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
media-src 'self' blob: https://cdn.islamic.network;
connect-src 'self' https://api.quran.com https://api.alquran.cloud
  https://api.aladhan.com https://raw.githubusercontent.com
  https://cdn.islamic.network;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
manifest-src 'self';
worker-src 'self' blob:;
report-uri /api/csp-report;
```

- `'unsafe-eval'` is added only in development.
- `'unsafe-inline'` is temporary while the app still uses inline theme/JSON-LD
  scripts; a later pass can move to nonces/hashes.
- Reports are logged through `lib/logger` and appear in Vercel logs.

## API hardening

| Route | Change |
|---|---|
| `/api/csp-report` | New bounded report collector, 16 KB limit, high per-IP cap |
| `/api/proxy` | Reciter allowlist, surah/ayah bounds, encoded URL |
| `/api/radio-proxy` | Response-header allowlist; drops cookies/hop-by-hop headers |
| `/api/download-audio` | URL-array type check, max 300 URLs, filename cap |
| `/api/search-quran` | Query length cap, page cap 1000, limit cap 100 |
| `/api/tafseer` | Integer bounds; rejects partial/invalid parameter sets |
| `/api/hadith` | Numeric pagination validation; generic upstream errors |
| `/api/sadaqa-garya` | Owned-record filtering, generic errors, `no-store` |
| `/api/sadaqa-garya/[slug]` | Safe slug decode, generic store errors, `no-store` |
| Sadaqa provider | Page-scoped provider; 8s server / 15s client timeouts; retry + local-token recovery |

## Privacy fix

Before this change `GET /api/sadaqa-garya` returned **all** memorial records to any
caller. It now returns only records whose slugs are present in the requester's
delete-token cookie. Public memorial pages remain available at
`/api/sadaqa-garya/[slug]`.

## Logging

`next.config.mjs` now uses:

```js
removeConsole: { exclude: ["error", "warn"] }
```

in production. This keeps security and CSP logs visible in Vercel while still
removing ordinary client logging.

## Testing

| Check | Result |
|---|---|
| Typecheck | ✅ Pass |
| Lint | ✅ 0 errors / 107 warnings |
| Unit/integration | ✅ 19 files, 109 tests |
| Build | ✅ Pass |
| E2E against production | ✅ 71/71 |
| Security tests | ✅ 4/4 |
| Sadaqa UX tests | ✅ 3/3 (error, empty, local-token recovery) |
| Audit | ✅ 0 vulnerabilities |

Verified:

- Security headers on `/en`, `/ar`, and `/api/*`
- CSP report-only header contains expected directives
- Classic and Reporting API CSP payloads return `204`
- Oversized reports return `413`
- Wrong content type returns `415`
- Malformed JSON returns `400`
- Invalid reciter/surah/radio/tafseer inputs return `400`
- Existing 64 E2E tests still pass

## Risks & next steps

| Risk | Mitigation |
|---|---|
| CSP `'unsafe-inline'` is temporary | Review reports, then move to nonces/hashes |
| `globalNotFound` is experimental | Existing Phase 3A decision; keep monitoring |
| In-memory rate limits are per-instance | Documented; external APIs own their limits |
| Tafseer upstream is HTTP-only | Server-side only; documented |
| HSTS `preload` omitted | Add only after confirming every subdomain is HTTPS-only |

## Follow-ups

- [ ] Review CSP reports in Vercel logs for 1–2 weeks.
- [ ] Move inline scripts to nonce/hash-based CSP.
- [ ] Consider HSTS `preload` after domain audit.
- [ ] Replace Tafseer upstream if an HTTPS endpoint becomes available.
- [ ] Phase 4: visual regression and broader accessibility coverage.

## Agent Checklist

- [x] Added security tests.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] `npm run test:e2e` passes against production.
- [x] Committed after user confirmation.
