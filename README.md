<div align="center">

<img src="./public/bismillah.png" alt="بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" width="460" />

<img src="./public/logo.png" alt="Muslim Logo" height="52" />

**An open-source Islamic platform for Quran, Hadith, Azkar, prayer times, and more - built as a Sadaqah Jariyah.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-CF9D40?style=for-the-badge&logo=google-chrome&logoColor=white)](https://muslim-one.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-CF9D40?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-CF9D40?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-CF9D40?style=for-the-badge)](./LICENSE)

<img width="78%" src="./public/screenshot.png" alt="Muslim App - Quran, Hadith, Azkar & Prayer Times" />

</div>

## About

**Muslim** is a bilingual (Arabic/English, RTL-first) web app that brings the daily
essentials of worship into one calm interface. It is free, open source under the
MIT license, and has no accounts, ads, or tracking.

## Features

- **Quran** — all 114 surahs and 30 juz in Uthmani script, with tafseer, saved
  ayahs, favourites, copy/share, and 14 reciters with full playback, repeat
  (hifz) mode, and audio download.
- **Ayah to image** — pick verses, choose a palette, download or share.
- **Hadith** — 8 major collections and 20,000+ hadiths, browsable by book and
  chapter, searchable in both languages.
- **Azkar & duas** — 127+ supplications across 8 categories with per-zikr
  counters, daily progress, and favourites.
- **Prayer times** — location-based times, live countdown, Hijri and Gregorian
  dates.
- **Live radio** — 125+ stations across four categories, with favourites.
- **Sadaqah Jariyah** — create a memorial page with a name and message, share its
  link, and delete it later with the owner token.
- **Personalisation** — four palettes plus a custom hue, light/dark themes, and a
  language switcher that keeps your place.

## At a Glance

| Reciters | Hadiths | Collections | Azkar | Radio stations |
|---|---|---|---|---|
| 14 | 20,000+ | 8 | 127+ | 125+ |

## Tech Stack

| Layer | Stack |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript 5 (strict) |
| Data | Supabase (Sadaqa Jariyah), Quran/hadith/prayer APIs |
| Hosting | Vercel |

## Quick Start

Requires **Node.js 24** (or `>= 20.9`), **npm 10+**, a Supabase project, and a
[hadithapi.com](https://hadithapi.com/) key.

```bash
git clone https://github.com/karreemm/Muslim.git
cd Muslim
npm install
cp .env.example .env.local    # fill in the values
npm run dev                   # http://localhost:3000
```

Create the Sadaqa table by running
[`data/sadaqaGarya/sadaqa_supabase_schema.sql`](data/sadaqaGarya/sadaqa_supabase_schema.sql)
in the Supabase SQL editor.

| Command | Purpose |
|---|---|
| `npm run check` | Typecheck + lint + unit/integration tests |
| `npm run test:e2e` | Playwright across Chromium, Firefox, WebKit |
| `npm run test:perf` | Web Vitals budgets |
| `npm run keepalive` | Supabase read-only ping |

## Documentation

| Guide | Covers |
|---|---|
| [Overview](docs/project-overview.md) | Product, routes, architecture, invariants |
| [UI/UX](docs/ui-ux-guidelines.md) | Tokens, layout, RTL, states, accessibility |
| [Testing](docs/testing.md) | Layers, commands, CI |
| [API](docs/api.md) | Internal routes and integrations |
| [Operations](docs/operations.md) | Environments, Supabase, deployment |

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). In short: fork, branch from `main`,
keep the change focused, add tests, update the affected docs, and open a PR.

## License

[MIT](./LICENSE) — use, modify, and distribute freely, including commercially,
provided the copyright notice is kept. Quran text, translations, hadith,
recitations, and radio streams belong to their respective sources.
