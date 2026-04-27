import { useCallback, useState } from "react";
import {
  DEFAULT_CUSTOM_HUE,
  FIXED_AYAH_PALETTES,
  type AyahImagePaletteMode,
  type FixedAyahPaletteId,
} from "@/app/(pages)/generate-ayah-image/palettePresets";

interface PaletteDefaults {
  customHue: number;
  theme: "light" | "dark";
}

export function useAyahPalette(defaults: PaletteDefaults) {
  const [paletteMode, setPaletteMode] =
    useState<AyahImagePaletteMode>("softContemplation");
  const [paletteHue, setPaletteHue] = useState(
    defaults.customHue ?? DEFAULT_CUSTOM_HUE,
  );
  const [imageTheme, setImageTheme] = useState<"light" | "dark">(
    defaults.theme,
  );
  const [showPageNumber, setShowPageNumber] = useState(false);
  const [showWebsiteAttribution, setShowWebsiteAttribution] = useState(true);

  const selectPalettePreset = useCallback((mode: FixedAyahPaletteId) => {
    setPaletteMode(mode);
  }, []);

  const setCustomPaletteHue = useCallback((hue: number) => {
    setPaletteMode("custom");
    setPaletteHue(hue);
  }, []);

  return {
    fixedPalettes: FIXED_AYAH_PALETTES,
    paletteMode,
    paletteHue,
    imageTheme,
    showPageNumber,
    showWebsiteAttribution,
    setImageTheme,
    setShowPageNumber,
    setShowWebsiteAttribution,
    selectPalettePreset,
    setCustomPaletteHue,
  };
}
