import { describe, expect, it } from "vitest";
import { PALETTE_PRESETS, generateCSSVars, resolveHue } from "@/utils/paletteEngine";

describe("resolveHue", () => {
  it("resolves every named preset", () => {
    expect(resolveHue("teal")).toBe(PALETTE_PRESETS.teal.hue);
    expect(resolveHue("gold")).toBe(PALETTE_PRESETS.gold.hue);
    expect(resolveHue("emerald")).toBe(PALETTE_PRESETS.emerald.hue);
    expect(resolveHue("midnight")).toBe(PALETTE_PRESETS.midnight.hue);
  });

  it("uses the custom hue when provided", () => {
    expect(resolveHue("custom", 210)).toBe(210);
  });

  it("falls back to teal for an unknown mode", () => {
    expect(resolveHue("unknown" as never)).toBe(PALETTE_PRESETS.teal.hue);
  });
});

describe("generateCSSVars", () => {
  it("returns light-theme variables", () => {
    const vars = generateCSSVars(174, false);

    expect(vars["--primary"]).toBe("174 74% 28%");
    expect(vars["--background"]).toBe("174 35% 96%");
    expect(vars["--foreground"]).toBe("174 58% 11%");
  });

  it("returns dark-theme variables", () => {
    const vars = generateCSSVars(174, true);

    expect(vars["--primary"]).toBe("174 72% 50%");
    expect(vars["--background"]).toBe("174 38% 9%");
    expect(vars["--foreground"]).toBe("174 42% 94%");
  });

  it("derives the accent hue for warm palettes", () => {
    const vars = generateCSSVars(38, false);
    expect(vars["--accent"]).toBe("174 82% 40%");
  });

  it("includes the Quran and player tokens", () => {
    const vars = generateCSSVars(210, false);

    expect(vars["--quran-surface"]).toBeDefined();
    expect(vars["--quran-highlight"]).toBeDefined();
    expect(vars["--player-bg"]).toBeDefined();
    expect(vars["--player-control"]).toBeDefined();
  });
});
