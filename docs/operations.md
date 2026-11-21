---
doc_type: guide
title: "Operations Guide"
last_updated: "2026-11-21"
status: active
---

# Operations Guide

The app is stateless. All state is in the browser except Sadaqa Jariyah memorials,
which live in Supabase. There is no session store, queue, or in-app cron.

## Environments

| Environment | URL | Database |
|---|---|---|
| Local | `http://localhost:3000` | `.env.local` |
| Preview (PR) | Vercel preview URL | **not** production Supabase |
| Production | `https://muslim-one.vercel.app` | Production Supabase |

Set `NEXT_PUBLIC_SITE_URL` per environment so canonical URLs and the sitemap match.

## Environment variables

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `SUPABASE_URL` | server | yes | Supabase REST base |
| `SUPABASE_SERVICE_ROLE_KEY` | server | yes | REST auth (bypasses RLS) |
| `SUPABASE_SADAQA_TABLE` | server | no | Defaults to `sadaqa_garya_records` |
| `HADITH_API_KEY` | server | yes | Hadith upstream |
| `HADITH_API_BASE_URL` | server | no | Defaults to `https://hadithapi.com/api` |
| `NEXT_PUBLIC_SITE_URL` | public | no | Canonical/OG base |

`lib/env.ts` validates lazily, so a missing value fails on first use rather than at
build time. After adding or rotating a variable: update `.env.example`, Vercel
(Production **and** Preview), GitHub Actions secrets if a workflow needs it, then
redeploy.

## Supabase

Table `sadaqa_garya_records`: `id`, `slug` (unique), `name_en`, `name_ar`,
`message_en`, `message_ar`, `created_at`, `delete_token_hash`.

- Access is server-side with the service-role key. Keep RLS enabled with no `anon`
  policies; the schema revokes `anon` and `authenticated`.
- Schema changes are additive: add nullable, deploy code, backfill, then constrain.
- Free projects pause after 7 days idle. The daily keep-alive workflow
  (`04:17 UTC`) pings the table; run `npm run keepalive` manually if needed.
  Required secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- If paused: Sadaqa routes return 500 while the rest of the app still works.

## Deploy

```bash
npm run check
npm run build
npm run test:e2e
```

Before deploying: no `.env*` staged, `NEXT_PUBLIC_SITE_URL` correct, new env vars in
Vercel, schema changes applied. Headers and CSP come from `next.config.mjs` — do
not duplicate them in the dashboard. Production strips `console.log`/`debug`.

**Rollback:** Vercel → Deployments → previous → Promote to Production. Then revert
the commit. Database changes are additive, so no schema rollback is needed.

## Monitoring

Vercel function logs are the only sink (no external tracker). Watch for:

- `GET/POST /api/sadaqa-garya failed` → Supabase paused, wrong key, or table name.
- Repeated `429` → a client is spamming create/delete.
- New `script-src`/`connect-src` CSP reports after a deploy → add the origin or fix
  the inline script.

Never log request bodies, tokens, or personal data.

## Runbooks

**Leaked key** — rotate in the provider, update Vercel + GitHub secrets, redeploy,
check Supabase logs for abuse. Rotate before investigating; rewrite history only if
needed.

**Sadaqa 500** — confirm env vars, project not paused, table name. Run
`npm run keepalive` with the same credentials.

**Spam** — limits are per instance; if abuse persists add a shared limiter
(Upstash/KV) or a CAPTCHA, or disable create temporarily.

**CSP enforcement** — collect reports for a week, fix or allowlist origins, replace
inline scripts with nonces, then switch the header name in `next.config.mjs`.

## Maintenance

| Cadence | Task |
|---|---|
| Weekly | Skim logs for Sadaqa 500s and new CSP violations |
| Monthly | `npm audit`, merge Dependabot, confirm keep-alive ran |
| Quarterly | Rotate the service-role key; review RLS grants and rate limits |

Secrets stay server-side; only `NEXT_PUBLIC_*` reaches the browser. Headers and
CSP live in `next.config.mjs`.
