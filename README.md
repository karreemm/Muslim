<div align="center">

<img src="./public/bismillah.png" alt="بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" width="400" />

<br />
<br />

<img src="./public/logo.png" alt="Muslim" height="56" />

<br />
<br />

**An open-source Islamic platform for Quran, Hadith, Azkar, Qibla, prayer times, and more — built as a Sadaqah Jariyah.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-CF9D40?style=for-the-badge&logo=google-chrome&logoColor=white)](https://muslim-one.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-CF9D40?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-CF9D40?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-CF9D40?style=for-the-badge)](./LICENSE)

<br />

<img width="78%" src="./public/screenshot.png" alt="Muslim app — Quran, Hadith, Azkar and prayer times" />

</div>

## About

**Muslim** is a bilingual (Arabic/English, RTL-first) web app that brings the daily
essentials of worship into one calm interface. It is free and open source under the
MIT license, with no accounts and no ads. The only telemetry is Vercel's cookie-free
aggregate analytics.

## Features

- **Quran** — all 114 surahs and 30 juz in the Uthmani script, with tafseer, saved
  ayahs, favourites, copy/share, and 14 reciters with playback, repeat (hifz) mode,
  and audio download.
- **Ayah to image** — pick verses, choose one of 11 palettes, then download or
  share the result.
- **Hadith** — 7 collections, browsable by book and chapter and searchable in both
  languages.
- **Azkar & duas** — 127 supplications across 8 categories, with per-zikr counters,
  daily progress, and favourites.
- **Qibla** — a live, screen-relative compass with a Kaaba destination marker.
- **Prayer times** — location-based times, a live countdown to the next prayer, and
  Hijri and Gregorian dates.
- **Live radio** — 126 stations across four categories, with favourites.
- **Sadaqah Jariyah** — create a memorial with a name and message. Each page
  includes Al-Fatihah, selected verses from Al-Baqarah, Al-Ikhlas, Ya-Sin, and
  duas; share the link, and delete it later with the owner token.
- **Personalisation** — four palettes plus a custom hue, light and dark themes, and
  a language switcher that keeps your place.

## At a Glance

| Quran | Reciters | Hadith collections | Azkar | Radio stations |
|---|---|---|---|---|
| 114 surahs | 14 | 7 | 127 | 126 |

## Tech Stack

| Layer | Stack |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript 5 (strict) |
| Data | Supabase (Sadaqa Jariyah), Quran, hadith, prayer, and radio APIs |
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
| `npm run test:e2e` | Playwright across Chromium, Firefox, and WebKit |
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

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). In short: fork, branch from `main`, keep
the change focused, add tests, update the affected docs, and open a PR.

## License

[MIT](./LICENSE) — use, modify, and distribute freely, including commercially,
provided the copyright notice is kept. Quran text, translations, hadith,
recitations, and radio streams belong to their respective sources.
