"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@/context/general/ThemeContext";
import { usePalette } from "@/context/general/PaletteContext";
import { useLanguage } from "@/context/general/LanguageContext";
import Loading from "@/components/general/Loading";

interface AppHydrationGateProps {
  children: ReactNode;
}

export default function AppHydrationGate({ children }: AppHydrationGateProps) {
  const { isHydrated: isThemeHydrated } = useTheme();
  const { isHydrated: isPaletteHydrated } = usePalette();
  const { isHydrated: isLanguageHydrated } = useLanguage();

  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const isReady = isThemeHydrated && isPaletteHydrated && isLanguageHydrated && minTimePassed;

  if (!isReady) {
    return <Loading size="lg" />;
  }

  return <>{children}</>;
}