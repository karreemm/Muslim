# Muslim App Theming Guide

This file is the complete reference for color theming in the app.

Goal:

- No hard-coded colors in code.
- One token source of truth.
- Easy future palette swaps (light, dark, or new themes).

## Where To Edit

Primary source of truth:

- app/globals.css

The color system is defined in two layers:

1. Raw theme tokens in :root and .dark
2. Tailwind token mapping in @theme as --color-\* aliases

If you want to change the palette, edit only values inside:

- :root { ... }
- .dark { ... }

Do not edit color values inside components.

## Token Architecture

### 1. Raw tokens (HSL channels)

Examples:

- --background: 37 100% 94%
- --primary: 176 83% 32%

These are consumed with hsl(var(--token)).

### 2. Tailwind mapped tokens

Examples:

- --color-background: hsl(var(--background))
- --color-primary: hsl(var(--primary))

This enables semantic utility classes like:

- bg-background
- text-foreground
- bg-primary
- text-primary-foreground

## Full Token Catalog

### Core semantic UI tokens

| Token                    | Light (:root) | Dark (.dark) | Purpose             |
| ------------------------ | ------------- | ------------ | ------------------- |
| --background             | 37 100% 94%   | 222 47% 11%  | App/page background |
| --foreground             | 204 70% 26%   | 210 40% 98%  | Default text        |
| --card                   | 0 0% 100%     | 217 33% 17%  | Card surfaces       |
| --card-foreground        | 204 70% 26%   | 210 40% 98%  | Card text           |
| --popover                | 0 0% 100%     | 217 33% 17%  | Popovers/dropdowns  |
| --popover-foreground     | 204 70% 26%   | 210 40% 98%  | Popover text        |
| --primary                | 176 83% 32%   | 176 75% 49%  | Main action color   |
| --primary-foreground     | 0 0% 100%     | 222 47% 11%  | Text on primary     |
| --secondary              | 37 44% 92%    | 217 33% 22%  | Secondary surfaces  |
| --secondary-foreground   | 204 70% 26%   | 210 40% 98%  | Text on secondary   |
| --muted                  | 210 16% 93%   | 215 27% 25%  | Subtle backgrounds  |
| --muted-foreground       | 215 16% 47%   | 214 20% 74%  | Subtle text         |
| --accent                 | 43 89% 45%    | 43 96% 56%   | Accent/highlight    |
| --accent-foreground      | 0 0% 100%     | 222 47% 11%  | Text on accent      |
| --destructive            | 0 73% 45%     | 0 84% 60%    | Danger/delete       |
| --destructive-foreground | 0 0% 100%     | 210 40% 98%  | Text on destructive |
| --border                 | 206 24% 74%   | 215 27% 30%  | Borders/dividers    |
| --input                  | 210 16% 90%   | 215 27% 25%  | Input backgrounds   |
| --ring                   | 176 83% 32%   | 176 75% 49%  | Focus ring          |

### App-specific tokens

| Token                      | Light (:root)    | Dark (.dark)       | Purpose                         |
| -------------------------- | ---------------- | ------------------ | ------------------------------- |
| --player-bg                | 0 0% 100% / 0.95 | 222 47% 11% / 0.98 | Sticky global player background |
| --player-foreground        | 204 70% 26%      | 210 40% 98%        | Player text                     |
| --player-control           | 176 83% 32%      | 176 75% 49%        | Player buttons/icons            |
| --player-track             | 214 20% 91%      | 215 27% 26%        | Progress track base             |
| --player-track-active      | 176 83% 32%      | 176 75% 49%        | Progress active section         |
| --quran-surface            | 0 0% 100%        | 215 35% 18%        | Quran card/panel surface        |
| --quran-surface-foreground | 204 70% 26%      | 210 40% 98%        | Quran panel text                |
| --quran-highlight          | 176 83% 45%      | 176 75% 49%        | Active ayah highlight           |
| --quran-highlight-soft     | 176 83% 96%      | 175 84% 15%        | Soft highlight background       |
| --scrollbar-track          | 37 100% 94%      | 222 47% 11%        | Scrollbar track                 |
| --scrollbar-thumb          | 176 83% 32%      | 175 74% 41%        | Scrollbar thumb                 |
| --scrollbar-thumb-hover    | 176 79% 27%      | 174 81% 39%        | Scrollbar hover                 |
| --quran-karaoke-base       | 215 28% 17%      | 210 40% 98%        | Karaoke text base               |

### Celebration tokens

| Token           | Light (:root) | Dark (.dark) | Purpose         |
| --------------- | ------------- | ------------ | --------------- |
| --celebration-1 | 43 96% 56%    | 43 96% 56%   | Confetti tone 1 |
| --celebration-2 | 160 84% 39%   | 160 84% 39%  | Confetti tone 2 |
| --celebration-3 | 213 94% 68%   | 213 94% 68%  | Confetti tone 3 |
| --celebration-4 | 327 87% 70%   | 327 87% 70%  | Confetti tone 4 |
| --celebration-5 | 258 90% 76%   | 258 90% 76%  | Confetti tone 5 |
| --celebration-6 | 0 0% 100%     | 210 40% 98%  | Confetti tone 6 |
| --celebration-7 | 45 97% 77%    | 45 97% 77%   | Confetti tone 7 |

## Class Usage Map (What To Use In Components)

Preferred semantic classes:

- Page shell: bg-background text-foreground
- Card: bg-card text-card-foreground border-border
- Popup/menu: bg-popover text-popover-foreground border-border
- Primary button: bg-primary text-primary-foreground
- Secondary button: bg-secondary text-secondary-foreground
- Subtle text: text-muted-foreground
- Dangerous action: bg-destructive text-destructive-foreground
- Inputs: bg-input border-border
- Focus ring: ring-ring

Player and Quran specifics:

- Use bg-player-bg, text-player-foreground, bg-player-control
- Use bg-quran-surface, text-quran-surface-foreground
- Use text-quran-highlight or bg-quran-highlight-soft

## How To Change The Palette Safely

### Change current light palette

1. Open app/globals.css
2. Edit only values in :root token block
3. Keep token names unchanged
4. Test key pages in light mode

### Change current dark palette

1. Open app/globals.css
2. Edit only values in .dark token block
3. Keep token names unchanged
4. Test key pages in dark mode

### Add a new theme (future)

1. Add a new scope, for example .theme-forest { ...tokens... }
2. Provide full token set (do not partially override)
3. Toggle theme class on html or body
4. Reuse the same component classes (no component edits needed)

## Rules For Contributors

Hard rules:

1. No hex colors in source
2. No numeric rgb/rgba/hsl/hsla literals in source
3. No Tailwind palette classes (like text-gray-500, bg-teal-700)
4. No named colors (white/black/etc) in style declarations
5. Use semantic tokens only

If a new visual state is needed:

1. Add a new token in :root and .dark
2. Add a mapped --color-\* alias in @theme
3. Use the semantic class in components

## Strict Audit Command

Run from repo root:

```powershell
$files = Get-ChildItem app,components,hooks,context,utils,constants,EnhanceReading -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.mjs,*.cjs,*.css,*.scss,*.html
$files = $files | Where-Object { $_.FullName -notmatch '\\.next\\|\\node_modules\\|\\.git\\' }

$checks = @{
  Hex                  = '#[0-9A-Fa-f]{3,8}\b'
  NumericColorFunc     = 'rgb\(\s*\d|rgba\(\s*\d|hsl\(\s*\d|hsla\(\s*\d'
  TailwindPaletteClass = '\b(bg|text|border|from|to|via|ring|stroke|fill|shadow)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(-[0-9]{2,3})?(\/[0-9]{1,3})?\b'
  NamedColorValue      = '\b(color|background(-color)?|border-color|fill|stroke)\s*:\s*(white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|teal|navy|maroon|olive|silver|gold|beige|ivory|coral|crimson|indigo|violet|turquoise)\b'
}

foreach ($k in $checks.Keys) {
  $m = Select-String -Path ($files.FullName) -Pattern $checks[$k] -AllMatches -CaseSensitive:$false
  "${k}=" + (($m | Measure-Object).Count)
}
```

Expected result:

- Hex=0
- NumericColorFunc=0
- TailwindPaletteClass=0
- NamedColorValue=0

## Current Audit Snapshot

Latest strict run result:

- NumericColorFunc=0
- Hex=0
- TailwindPaletteClass=0
- NamedColorValue=0
