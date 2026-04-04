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

type Palette = "teal" | "gold";

interface PaletteContextType {
  palette: Palette;
  setPalette: (palette: Palette) => void;
  isHydrated: boolean;
}

export const PaletteContext = createContext<PaletteContextType | null>(null);

const PaletteContextProvider = ({ children }: { children: ReactNode }) => {
  const [palette, setPaletteState] = useState<Palette>("teal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("palette") as Palette | null;

    if (stored === "teal" || stored === "gold") {
      setPaletteState(stored);
      root.classList.remove("teal", "gold");
      root.classList.add(stored);
    } else {
      root.classList.remove("teal", "gold");
      root.classList.add("teal");
    }

    setMounted(true);
  }, []);

  const setPalette = useCallback((newPalette: Palette) => {
    const root = document.documentElement;

    root.classList.remove("teal", "gold");
    root.classList.add(newPalette);
    localStorage.setItem("palette", newPalette);

    startTransition(() => setPaletteState(newPalette));
  }, []);

  if (!mounted) {
    return (
      <PaletteContext.Provider
        value={{ palette: "teal", setPalette: () => {}, isHydrated: false }}
      >
        {children}
      </PaletteContext.Provider>
    );
  }

  return (
    <PaletteContext.Provider value={{ palette, setPalette, isHydrated: true }}>
      {children}
    </PaletteContext.Provider>
  );
};

export default PaletteContextProvider;

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (!context)
    throw new Error("usePalette must be used within PaletteContextProvider");
  return context;
};
