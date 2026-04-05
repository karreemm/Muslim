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
  PaletteMode,
  applyPalette,
  resolveHue,
} from "@/utils/paletteEngine";

interface PaletteContextType {
  palette: PaletteMode;
  hue: number;                         
  setPalette: (mode: PaletteMode, customHue?: number) => void;
  isHydrated: boolean;
}

export const PaletteContext = createContext<PaletteContextType | null>(null);

export default function PaletteContextProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteMode>("teal");
  const [hue, setHue] = useState<number>(174);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedMode   = (localStorage.getItem("palette") as PaletteMode) ?? "teal";
    const storedHue    = parseInt(localStorage.getItem("paletteHue") ?? "174", 10);
    const isDark       = document.documentElement.classList.contains("dark");

    const resolvedHue  = resolveHue(storedMode, storedMode === "custom" ? storedHue : undefined);

    setPaletteState(storedMode);
    setHue(resolvedHue);
    applyPalette(resolvedHue, isDark);
    setMounted(true);
  }, []);

  const setPalette = useCallback((mode: PaletteMode, customHue?: number) => {
    const isDark      = document.documentElement.classList.contains("dark");
    const resolvedHue = resolveHue(mode, customHue);

    applyPalette(resolvedHue, isDark);
    localStorage.setItem("palette", mode);
    if (mode === "custom" && customHue !== undefined) {
      localStorage.setItem("paletteHue", String(customHue));
    }

    startTransition(() => {
      setPaletteState(mode);
      setHue(resolvedHue);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      applyPalette(hue, isDark);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [mounted, hue]);

  if (!mounted) {
    return (
      <PaletteContext.Provider
        value={{ palette: "teal", hue: 174, setPalette: () => {}, isHydrated: false }}
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