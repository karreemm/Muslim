# Contributing

Thanks for helping. This project is a Sadaqah Jariyah, and every fix, translation,
or accessibility improvement counts.

## Before you start

1. Read [`docs/project-overview.md`](docs/project-overview.md).
2. Read the guide for your area: [UI](docs/ui-ux-guidelines.md),
   [testing](docs/testing.md), [API](docs/api.md), [operations](docs/operations.md).
   Never commit secrets; only `NEXT_PUBLIC_*` values may reach the browser.
3. For anything larger than a bug fix, open an issue first.

## Setup

Requires Node 24 (or `>= 20.9`), npm 10+, a Supabase project, and a
[hadithapi.com](https://hadithapi.com/) key.

```bash
git clone https://github.com/karreemm/Muslim.git
cd Muslim
npm install
cp .env.example .env.local    # fill in the values
npm run dev                   # http://localhost:3000
```

Create the table with
[`data/sadaqaGarya/sadaqa_supabase_schema.sql`](data/sadaqaGarya/sadaqa_supabase_schema.sql).

## Commands

| Command | Purpose |
|---|---|
| `npm run check` | Typecheck + lint + unit/integration tests |
| `npm run test:e2e` | Playwright across three browsers |
| `npm run test:perf` | Web Vitals budgets |
| `npm run format` | Prettier |

Install browsers once: `npx playwright install chromium firefox webkit`.

## Rules

- TypeScript strict; no `any` without narrowing.
- Semantic design tokens only — no raw colors.
- All strings in `locales/`, both languages, same commit.
- Storage through `lib/storage.ts`; no direct `localStorage`.
- Reuse `components/ui/` primitives.
- Every data view has loading, empty, error, and success states.
- Accessibility is part of the change: labels, focus, contrast, keyboard.
- No secrets or real user data in code, tests, or screenshots.
- Quran and hadith content stays verbatim.

## Commits and PRs

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`,
`fix:`, `perf:`, `docs:`, `test:`, `chore:`. One logical change per commit.

Branch from `main`, keep the PR focused, include EN/AR screenshots for UI changes,
and fill in the PR template. CI must be green.

For changes to behavior, architecture, dependencies, data, or UI, add a record
under [`docs/changes/`](docs/changes/) and update the affected living docs.

## Security

Do not open a public issue for a vulnerability. Use GitHub's private security
advisories for this repository.

## License

Contributions are licensed under the [MIT License](./LICENSE).
