export type PaletteMode = "teal" | "gold" | "emerald" | "midnight" | "custom";

export interface PaletteConfig {
  hue: number;        
  mode: PaletteMode;
}

export const PALETTE_PRESETS: Record<
  Exclude<PaletteMode, "custom">,
  { hue: number; accentHue: number; label: string; labelAr: string }
> = {
  teal:     { hue: 174, accentHue: 43,  label: "Teal",     labelAr: "فيروزي" },
  gold:     { hue: 38,  accentHue: 174, label: "Gold",     labelAr: "ذهبي"   },
  emerald:  { hue: 148, accentHue: 38,  label: "Emerald",  labelAr: "زمردي"  },
  midnight: { hue: 228, accentHue: 38,  label: "Midnight", labelAr: "لازوردي" },
};

function deriveAccentHue(primaryHue: number): number {
  for (const preset of Object.values(PALETTE_PRESETS)) {
    if (Math.abs(preset.hue - primaryHue) < 25) return preset.accentHue;
  }
  const isWarm = (primaryHue >= 15 && primaryHue <= 75);
  return isWarm ? 174 : 43;
}

export function generateCSSVars(hue: number, dark: boolean): Record<string, string> {
  const h = Math.round(hue);
  const ah = deriveAccentHue(h); 

  if (!dark) {
    return {
      "--background":             `${h} 35% 96%`,
      "--foreground":             `${h} 58% 11%`,
      "--card":                   `${h} 28% 99%`,
      "--card-foreground":        `${h} 58% 11%`,
      "--popover":                `${h} 28% 99%`,
      "--popover-foreground":     `${h} 58% 11%`,
      "--primary":                `${h} 74% 28%`,
      "--primary-foreground":     `0 0% 100%`,
      "--secondary":              `${h} 32% 90%`,
      "--secondary-foreground":   `${h} 55% 16%`,
      "--muted":                  `${h} 20% 90%`,
      "--muted-foreground":       `${h} 18% 36%`,
      "--accent":                 `${ah} 82% 40%`,
      "--accent-foreground":      `0 0% 100%`,
      "--destructive":            `0 73% 42%`,
      "--destructive-foreground": `0 0% 100%`,
      "--border":                 `${h} 24% 78%`,
      "--input":                  `${h} 20% 88%`,
      "--ring":                   `${h} 74% 28%`,
      "--player-bg":              `${h} 28% 99% / 0.97`,
      "--player-foreground":      `${h} 58% 11%`,
      "--player-control":         `${h} 74% 28%`,
      "--player-track":           `${h} 20% 88%`,
      "--player-track-active":    `${h} 74% 28%`,
      "--quran-surface":          `${h} 28% 99%`,
      "--quran-surface-foreground": `${h} 58% 11%`,
      "--quran-highlight":        `${h} 74% 34%`,
      "--quran-highlight-soft":   `${h} 68% 92%`,
      "--scrollbar-track":        `${h} 30% 93%`,
      "--scrollbar-thumb":        `${h} 65% 38%`,
      "--scrollbar-thumb-hover":  `${h} 74% 27%`,
      "--quran-karaoke-base":     `${h} 58% 11%`,
      "--surah-header-foreground": `0 0% 100%`,
      "--surah-header-shadow":    `0 0% 0% / 0.55`,
      "--prayer-times-next":      `${h} 74% 28%`,
      "--prayer-times-next-bg":   `${h} 58% 11%`,
      "--prayer-times-next-foreground": `0 0% 100%`,
      "--celebration-1": `43 96% 56%`,
      "--celebration-2": `160 84% 39%`,
      "--celebration-3": `213 94% 68%`,
      "--celebration-4": `327 87% 70%`,
      "--celebration-5": `258 90% 76%`,
      "--celebration-6": `0 0% 100%`,
      "--celebration-7": `45 97% 77%`,
    };
  } else {
    return {
      "--background":             `${h} 38% 9%`,
      "--foreground":             `${h} 42% 94%`,
      "--card":                   `${h} 34% 15%`,
      "--card-foreground":        `${h} 42% 94%`,
      "--popover":                `${h} 34% 15%`,
      "--popover-foreground":     `${h} 42% 94%`,
      "--primary":                `${h} 72% 50%`,
      "--primary-foreground":     `${h} 45% 8%`,
      "--secondary":              `${h} 28% 20%`,
      "--secondary-foreground":   `${h} 42% 90%`,
      "--muted":                  `${h} 24% 22%`,
      "--muted-foreground":       `${h} 22% 62%`,
      "--accent":                 `${ah} 86% 52%`,
      "--accent-foreground":      `${h} 45% 8%`,
      "--destructive":            `0 84% 60%`,
      "--destructive-foreground": `${h} 42% 94%`,
      "--border":                 `${h} 26% 25%`,
      "--input":                  `${h} 24% 22%`,
      "--ring":                   `${h} 72% 50%`,
      "--player-bg":              `${h} 38% 9% / 0.98`,
      "--player-foreground":      `${h} 42% 94%`,
      "--player-control":         `${h} 72% 50%`,
      "--player-track":           `${h} 24% 22%`,
      "--player-track-active":    `${h} 72% 50%`,
      "--quran-surface":          `${h} 32% 13%`,
      "--quran-surface-foreground": `${h} 42% 94%`,
      "--quran-highlight":        `${h} 72% 50%`,
      "--quran-highlight-soft":   `${h} 52% 17%`,
      "--scrollbar-track":        `${h} 38% 9%`,
      "--scrollbar-thumb":        `${h} 62% 38%`,
      "--scrollbar-thumb-hover":  `${h} 72% 48%`,
      "--quran-karaoke-base":     `${h} 42% 94%`,
      "--surah-header-foreground": `${h} 42% 94%`,
      "--surah-header-shadow":    `0 0% 0% / 0.65`,
      "--prayer-times-next":      `${h} 72% 50%`,
      "--prayer-times-next-bg":   `${h} 45% 8%`,
      "--prayer-times-next-foreground": `${h} 42% 94%`,
      "--celebration-1": `43 96% 56%`,
      "--celebration-2": `160 84% 39%`,
      "--celebration-3": `213 94% 68%`,
      "--celebration-4": `327 87% 70%`,
      "--celebration-5": `258 90% 76%`,
      "--celebration-6": `${h} 42% 94%`,
      "--celebration-7": `45 97% 77%`,
    };
  }
}

export function applyPalette(hue: number, dark: boolean): void {
  const vars = generateCSSVars(hue, dark);
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export function clearInlinePalette(): void {
  const root = document.documentElement;
  const sampleVars = generateCSSVars(0, false);
  for (const key of Object.keys(sampleVars)) {
    root.style.removeProperty(key);
  }
}

export function resolveHue(mode: PaletteMode, customHue?: number): number {
  if (mode === "custom" && customHue !== undefined) return customHue;
  return PALETTE_PRESETS[mode as keyof typeof PALETTE_PRESETS]?.hue ?? 174;
}