# Security Guide

This document describes the security controls that exist **today**. Update it when
headers, CSP, API validation, or secret handling changes.

---

## Security headers

Configured in `next.config.mjs` for all routes:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), clipboard-write=(self)` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-Permitted-Cross-Domain-Policies` | `none` |

HSTS `preload` is intentionally not enabled yet.

## Content Security Policy

- Production uses `Content-Security-Policy-Report-Only`.
- Reports are sent to `/api/csp-report`.
- Initial policy allows `'unsafe-inline'` for scripts/styles because the app still
  uses inline theme and JSON-LD scripts.
- `'unsafe-eval'` is development-only.
- Reports are logged through `lib/logger` and appear in Vercel logs.

Review reports before switching to enforcement. The next step is nonce/hash-based
inline scripts.

## API rules

- Keep the host allowlists in `/api/radio-proxy` and `/api/download-audio`; they are
  the SSRF boundary.
- `/api/proxy` accepts only known reciter IDs and valid surah/ayah ranges.
- `/api/search-quran` caps query length, page, and page size.
- `/api/tafseer` requires either no parameters (list) or all valid numeric
  parameters (specific ayah).
- `/api/hadith` validates numeric pagination and returns generic upstream errors.
- API errors are generic; details stay in server logs.
- `/api/csp-report` is bounded to 16 KB and rate-limited per IP.

## Sadaqa privacy

- `GET /api/sadaqa-garya` returns only memorials owned by the requester's
  delete-token cookie.
- Public memorial pages are available through `/api/sadaqa-garya/[slug]`.
- Delete tokens are hashed in Supabase; only the original token is stored in the
  owner's `HttpOnly` cookie / local storage.
- Sensitive API responses use `Cache-Control: no-store`.
- The Sadaqa provider loads owned records only on Sadaqat/create pages and uses a
  10-second timeout for Supabase calls.

## Secrets

| Secret | Rule |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Never use `NEXT_PUBLIC_`. |
| `HADITH_API_KEY` | Server-only. `NEXT_PUBLIC_` fallbacks were removed. |
| `NEXT_PUBLIC_SITE_URL` | Public by design. |

`NEXT_PUBLIC_` variables are inlined into client code. Never put a secret behind
that prefix.

## Logging and monitoring

- Vercel is the monitoring sink.
- `next.config.mjs` preserves `console.error` and `console.warn` in production.
- CSP reports and API failures are logged with `lib/logger`.
- No external error-tracking or CSP collector is used.

## Known limitations

- `lib/apiSecurity.ts` rate limits are in-memory and per-instance; they are not
  shared across Vercel serverless instances.
- External APIs own their own rate limits; this project does not add a second layer
  of backend rate-limit hardening for those calls.
- `https://api.quran-tafseer.com` is HTTP-only and is used server-side only.

## Verification

- `tests/e2e/security.spec.ts` checks headers, CSP reports, and input validation.
- Run `npm run check`, `npm run build`, and `npm run test:e2e` before deploying.
