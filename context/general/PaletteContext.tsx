"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  startTransition,
} from "react";
import {
  DEFAULT_PALETTE,
  DEFAULT_PALETTE_HUE,
  PaletteMode,
  applyPalette,
  resolveHue,
} from "@/utils/paletteEngine";
import {
  STORAGE_KEYS,
  readNumber,
  readString,
  writeNumber,
  writeString,
} from "@/lib/storage";

interface PaletteContextType {
  palette: PaletteMode;
  hue: number;
  setPalette: (mode: PaletteMode, customHue?: number) => void;
  isHydrated: boolean;
}

export const PaletteContext = createContext<PaletteContextType | null>(null);

export default function PaletteContextProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteMode>(DEFAULT_PALETTE);
  const [hue, setHue] = useState<number>(DEFAULT_PALETTE_HUE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedMode = readString(STORAGE_KEYS.palette, DEFAULT_PALETTE) as PaletteMode;
    const storedHue = readNumber(STORAGE_KEYS.paletteHue, DEFAULT_PALETTE_HUE);
    const isDark = document.documentElement.dataset.theme === "dark";

    const resolvedHue = resolveHue(
      storedMode,
      storedMode === "custom" ? storedHue : undefined,
    );

    setPaletteState(storedMode);
    setHue(resolvedHue);
    document.documentElement.dataset.palette = storedMode;
    applyPalette(resolvedHue, isDark);
    setMounted(true);
  }, []);

  const setPalette = useCallback((mode: PaletteMode, customHue?: number) => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const resolvedHue = resolveHue(mode, customHue);

    writeString(STORAGE_KEYS.palette, mode);
    if (mode === "custom" && customHue !== undefined) {
      writeNumber(STORAGE_KEYS.paletteHue, customHue);
    }

    document.documentElement.dataset.palette = mode;
    applyPalette(resolvedHue, isDark);

    startTransition(() => {
      setPaletteState(mode);
      setHue(resolvedHue);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    applyPalette(hue, document.documentElement.dataset.theme === "dark");

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.dataset.theme === "dark";
      applyPalette(hue, isDark);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [mounted, hue]);

  if (!mounted) {
    return (
      <PaletteContext.Provider
        value={{
          palette: DEFAULT_PALETTE,
          hue: DEFAULT_PALETTE_HUE,
          setPalette: () => {},
          isHydrated: false,
        }}
      >
        {children}
      </PaletteContext.Provider>
    );
  }

  return (
    <PaletteContext.Provider value={{ palette, hue, setPalette, isHydrated: true }}>
      {children}
    </PaletteContext.Provider>
  );
}

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (!context) throw new Error("usePalette must be used within PaletteContextProvider");
  return context;
};
