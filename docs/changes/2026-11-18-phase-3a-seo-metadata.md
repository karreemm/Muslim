---
doc_type: change
title: "Phase 3A: locale-aware SEO, metadata, sitemap, and robots"
doc_id: "CHG-0005"
date: "2026-11-18"
branch: "chore/professional-foundation"
commit: ""
author: "OpenCode agent"
status: review
scope: [seo, metadata, i18n, routing, discoverability]
related_files:
  - proxy.ts
  - app/[locale]/layout.tsx
  - app/[locale]/page.tsx
  - app/global-not-found.tsx
  - next.config.mjs
  - app/[locale]/(pages)/*/layout.tsx
  - app/[locale]/(pages)/**/[param]/layout.tsx
  - app/sitemap.ts
  - app/robots.ts
  - app/manifest.ts
  - public/icons/icon-192.png
  - public/icons/icon-512.png
  - public/icons/icon-maskable-512.png
  - public/icons/apple-touch-icon.png
  - components/seo/JsonLd.tsx
  - components/i18n/LocalizedLink.tsx
  - context/general/LanguageContext.tsx
  - lib/i18n.ts
  - lib/seo.ts
  - locales/en/seo.json
  - locales/ar/seo.json
  - tests/unit/i18n.test.ts
  - tests/unit/seo.test.ts
  - tests/e2e/seo.spec.ts
  - tests/e2e/i18n.spec.ts
  - tests/e2e/smoke.spec.ts
  - tests/e2e/links.spec.ts
related_docs:
  - docs/project-overview.md
  - docs/testing.md
---

# Phase 3A: locale-aware SEO and metadata

## Progress

- [x] Analysis complete
- [x] Locale routing implemented
- [x] Locale-aware metadata implemented
- [x] Internal links localized
- [x] Tests added and updated
- [x] Typecheck, lint, unit tests, build, and E2E pass
- [x] Docs updated
- [ ] Committed (waiting for confirmation)

## Summary

- Every page now lives under `/ar/...` or `/en/...`.
- `/` redirects by saved `language` cookie, then `Accept-Language`, then Arabic.
- Metadata is generated on the server from the URL locale:
  - AR pages render Arabic titles, descriptions, Open Graph, and JSON-LD.
  - EN pages render English equivalents.
- Dynamic titles use real content:
  - Surah names from `constants/quranData.ts`
  - Hadith book names from `constants/hadithData.ts`
  - Reciter names from `constants/recitersData.ts`
  - Azkar category names from `constants/azkarData.ts`
  - Sadaqa memorial names fetched server-side from Supabase, with a safe fallback
- Every internal link, router navigation, and share URL carries the active locale.
- Unknown URLs render a localized 404 with a real 404 status and `noindex`.
- Sitemap contains both locales with `hreflang` alternates.
- Tests cover locale resolution, metadata, redirects, links, and both languages.

## Context

Before this phase the app had one URL per page and language was client-side only.
Server metadata could not know whether the visitor was using Arabic or English, so
both languages shared a canonical URL and `<html lang>` was hard-coded to Arabic.

The chosen fix is locale-prefixed routing. It makes the URL the single source of
truth for language, which is required for correct server metadata, shareable links,
canonical URLs, and `hreflang`.

## Routing model

| Path                                                               | Behaviour                                                                        |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `/`                                                                | `proxy.ts` redirects to `/ar` or `/en` using cookie → `Accept-Language` → Arabic |
| `/ar`, `/en`                                                       | Localized home                                                                   |
| `/ar/...`, `/en/...`                                               | Localized feature routes                                                         |
| `/{locale}/unknown`                                                | Localized global-not-found page with a real HTTP 404 and noindex                                      |
| `/fr/...`                                                          | Unsupported locale segment is dropped and re-homed under a supported locale      |
| `/api/...`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Not locale-prefixed                                                              |

`app/[locale]/layout.tsx` is the root layout. It validates the locale, sets
`<html lang>` and `dir`, and passes the locale into `LanguageContext`.

## Metadata model

- `lib/seo.ts` exposes `localizedUrl()`, `createMetadata()`, localized site
  name/title/description, keywords, and the shared Open Graph image.
- Page metadata comes from the `seo` namespace in `locales/en/seo.json` and
  `locales/ar/seo.json`.
- Child pages use `title.absolute` so static and dynamic segments render the same
  full title (`Surah Al-Fatiha | Muslim`, `سورة الفاتحة | مسلم`).
- `alternates.canonical` and `alternates.languages` are absolute and locale-aware.
- `openGraph.locale` is `en_US` or `ar_AR`; the other locale is declared as
  `alternateLocale`.
- `WebsiteJsonLd` is localized and declares both site languages.

### Dynamic metadata sources

| Route                                              | Title source                                               |
| -------------------------------------------------- | ---------------------------------------------------------- |
| `/read-quran/surah/[number]`                       | `surahNames[].en` / `.ar`                                  |
| `/read-quran/juz/[number]`                         | Juz number                                                 |
| `/read-hadith/book/[slug]`                         | `hadithBooks[].name_en` / `.name_ar`                       |
| `/read-hadith/book/[slug]/chapter/[chapterNumber]` | Book name + chapter number                                 |
| `/listen-quran/reciter/[id]`                       | `reciters[].NameEn` / `.NameAr`                            |
| `/azkar/category/[id]`                             | `AzkarCategories[].en` / `.ar`                             |
| `/sadaqa-garya/[slug]`                             | Supabase record `name_en` / `name_ar`, or generic fallback |

Sadaqa metadata calls the existing server-only store in a `try/catch`. A missing
record, missing environment variable, or Supabase outage never blocks the page.

## Internal links

- `components/i18n/LocalizedLink.tsx` wraps `next/link` and prefixes root-relative
  hrefs with the active locale. External, hash, `mailto:`, and `tel:` links are
  unchanged.
- Router pushes and share URLs use `localizePath(locale, path)`.
- Navbar active states compare against `stripLocaleFromPathname(pathname)`.
- `LanguageDropdown` navigates to the same page in the other locale and preserves
  the query string and hash.

## Changes

| Area                  | File(s)                                                            | What changed                                                                                      |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Locale constants      | `lib/i18n.ts`                                                      | Locale list, direction, cookie name, locale negotiation, path helpers, all translation namespaces |
| Redirect / validation | `proxy.ts`                                                         | Root redirect, unsupported-locale handling, cookie sync                                           |
| Root layout           | `app/[locale]/layout.tsx`                                          | Locale validation, `<html lang/dir>`, providers, localized metadata and JSON-LD                   |
| Home                  | `app/[locale]/page.tsx`                                            | Localized home wrapper                                                                            |
| 404                   | `app/[locale]/not-found.tsx`, `app/global-not-found.tsx` | Localized 404 with a real 404 status and noindex |
| Config                | `next.config.mjs` | Enables experimental `globalNotFound` |
| Language state        | `context/general/LanguageContext.tsx`                              | URL-authoritative locale, cookie/localStorage sync, locale-aware navigation                       |
| Translation hook      | `hooks/general/useTranslation.ts`                                  | Uses server-safe `lib/i18n.ts`                                                                    |
| Links                 | `components/i18n/LocalizedLink.tsx` and feature pages              | Locale-preserving internal navigation                                                             |
| SEO helper            | `lib/seo.ts`                                                       | Localized metadata, canonical, hreflang, Open Graph, Twitter                                      |
| JSON-LD               | `components/seo/JsonLd.tsx`                                        | Localized WebSite/Organization data                                                               |
| Static metadata       | `app/[locale]/(pages)/*/layout.tsx`                                | `generateMetadata()` from the `seo` namespace                                                     |
| Dynamic metadata      | `app/[locale]/(pages)/**/[param]/layout.tsx`                       | Content-based AR/EN titles                                                                        |
| Copy                  | `locales/{en,ar}/seo.json`                                         | All site/page metadata copy                                                                       |
| Sitemap               | `app/sitemap.ts`                                                   | Both locales with `hreflang` and `x-default`                                                      |
| Robots                | `app/robots.ts`                                                    | Locale-aware private-route rules                                                                  |
| Manifest              | `app/manifest.ts`                                                  | Localized site name/description, square 192/512 and maskable icons                               |
| Icons                 | `public/icons/*`, `app/favicon.ico`                                | Gold mosque on a branded square background; Apple 180, maskable 512, multi-size favicon           |
| Tests                 | `tests/unit/i18n.test.ts`, `tests/unit/seo.test.ts`, `tests/e2e/*` | Locale helpers, metadata, redirects, both-locale coverage                                         |

## Data & API changes

- No API route contract changed.
- Sadaqa memorial metadata reads the existing Supabase record server-side.
- The service-role key remains server-only.

## UI / UX changes

- Language switching now changes the URL and keeps the current page.
- Shared links open in the language they were copied from.
- First paint direction is correct because `<html lang>` and `dir` are server-rendered.
- `localStorage` and the `language` cookie are kept in sync for backward compatibility.
- The pre-hydration theme script renders as executable JavaScript on the server and
  as inert `text/plain` on client re-renders, so locale switches no longer emit
  React's “Encountered a script tag” warning.
- The theme script no longer writes `lang`/`dir` from `localStorage`; the
  server-rendered locale in the URL is authoritative.

## Testing

### Commands run

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

### Results

| Check                      | Result                                                    |
| -------------------------- | --------------------------------------------------------- |
| Typecheck                  | ✅ Pass                                                   |
| Lint                       | ✅ 0 errors / 109 warnings                                |
| Unit/integration/component | ✅ 18 files, 104 tests                                    |
| Build                      | ✅ Pass; both locales statically generated where possible |
| E2E                        | ✅ 64/64                                                  |
| Audit                      | ✅ 0 production / 0 dev vulnerabilities                   |

## Risks & Rollback

| Risk                               | Impact                                | Mitigation                                                                     |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| First visit without a cookie       | Language comes from `Accept-Language` | Set the cookie on redirect and on every locale page; users can switch manually |
| Sadaqa metadata adds a server read | Slight latency on memorial pages      | `try/catch` fallback; page content still loads                                 |
| Old unprefixed links               | Redirect to the resolved locale       | `proxy.ts` preserves path and query                                            |
| Per-locale SSG output              | Larger build output                   | Only static routes are duplicated; dynamic pages remain on demand              |

Rollback: remove `proxy.ts`, move routes back from `app/[locale]` to `app/`, restore
the client-only `LanguageContext`, and revert the SEO helpers.

## Follow-ups

- [x] Add square 192×192, 512×512, maskable, and Apple touch icons.
- [ ] Add a `LanguageSwitcher` link-based fallback for no-JavaScript users.
- [ ] Phase 3B: `next/font`, WebP images, bundle analysis, audio splitting.
- [ ] Phase 3C: CSP report-only and security headers.
- [ ] Phase 4: visual regression and broader SEO audits.

## Agent Checklist

- [x] Read `docs/project-overview.md` and `docs/testing.md`.
- [x] Added tests for new behavior.
- [x] Added all user-facing copy to both locales.
- [x] Used semantic tokens; no raw colors added.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] `npm run test:e2e` passes.
- [ ] Committed after user confirmation.
