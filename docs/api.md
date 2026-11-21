---
doc_type: guide
title: "API Reference"
last_updated: "2026-11-21"
status: active
---

# API Reference

Internal handlers live in `app/api/` (Node runtime). Every external call is
server-side except Quran/hadith/radio reads proxied through these routes.

## Internal routes

| Route | Methods | Limits | Purpose |
|---|---|---|---|
| `/api/hadith` | GET | `HADITH_API_KEY` | Hadith proxy: `mode=books\|chapters\|hadiths` |
| `/api/search-quran` | GET | query ≥ 2 letters, ≤ 200 chars | Local Quran index search |
| `/api/tafseer` | GET | numeric bounds | Tafseer proxy, 1-day cache |
| `/api/proxy` | GET | reciter allowlist + ayah bounds | Reciter audio via the CDN |
| `/api/radio-proxy` | GET | host allowlist | Radio streams, `Range` supported |
| `/api/download-audio` | POST | host allowlist, ≤ 300 URLs | Surah download |
| `/api/sadaqa-garya` | GET, POST | create 8/min/IP | Owned memorials / create |
| `/api/sadaqa-garya/[slug]` | GET, DELETE | delete 10/min/IP + token | Public memorial / owner delete |
| `/api/csp-report` | POST | 120/min/IP, 16 KB | CSP report collector |

Rules:

- Keep the host allowlists in the proxy and download routes; they are the SSRF
  boundary.
- Errors are generic; upstream details stay in server logs. Responses that touch
  memorials use `no-store`.
- The Supabase store uses the service-role key. Never import it into client code.
- Rate limits are in-memory and per instance; see `lib/apiSecurity.ts`.

## External services

| Service | Base URL | Used for |
|---|---|---|
| Quran.com | `https://api.quran.com/api/v4` | Chapters, verses, translations |
| AlQuran Cloud | `https://api.alquran.cloud/v1` | Audio and translation editions |
| Quran Tafseer | `http://api.quran-tafseer.com` | Arabic tafseer (HTTP, server-only) |
| Islamic Network | `https://cdn.islamic.network` | Recitation audio files |
| Hadith API | `https://hadithapi.com/api` | Books, chapters, hadiths |
| Aladhan | `https://api.aladhan.com/v1` | Prayer times |
| Azkar API | `https://raw.githubusercontent.com/nawafalqari/azkar-api` | Azkar data |
| MP3Quran | `https://live.mp3quran.net` | Live radio |
| Qurango | `https://qurango.net` | Live radio |
| Supabase | project REST URL | Sadaqa Jariyah records |

Only the origins in `next.config.mjs` (`connect-src`, `media-src`) may be called
from the browser. New integrations require both a server wrapper and a CSP update.

## Sadaqa contract

`POST /api/sadaqa-garya` — body `{ nameEn, nameAr, messageEn?, messageAr?, slug? }`
→ `201 { deceased, deleteToken }` and an `HttpOnly` cookie holding the owner map.

`DELETE /api/sadaqa-garya/[slug]` — requires `x-sadaqa-delete-token` or the cookie →
`200 { success }`, `401`, or `404`.

Tokens are stored only as SHA-256 hashes in `delete_token_hash`.
