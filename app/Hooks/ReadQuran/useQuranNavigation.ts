"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { surahNames, juzNames } from "../../Contants/QuranData";

type NavigationType = "surah" | "juz";

interface NavigationConfig {
  type: NavigationType;
  maxNumber: number;
  basePath: string;
}

export const useQuranNavigation = (type: NavigationType) => {
  const pathname = usePathname();
  const router = useRouter();
  const [number, setNumber] = useState<string | null>(null);

  const config: NavigationConfig = {
    type,
    maxNumber: type === "surah" ? surahNames.length : juzNames.length,
    basePath: type === "surah" ? "/ReadQuran/Surah" : "/ReadQuran/Juz",
  };

  const currentNumber = number ? parseInt(number) : 0;
  const hasPrev = currentNumber > 1;
  const hasNext = currentNumber < config.maxNumber;

  useEffect(() => {
    const parts = pathname.split("/");
    const pageNumber = parts.pop();

    if (
      pageNumber &&
      (parseInt(pageNumber) > config.maxNumber || parseInt(pageNumber) < 1)
    ) {
      router.push(`${config.basePath}/1`);
      return;
    }

    setNumber(pageNumber ?? null);
  }, [pathname, router, config.basePath, config.maxNumber]);

  const handleNavigation = (direction: "next" | "prev") => {
    const currentNum = number ? parseInt(number) : 1;
    const newNumber = direction === "next" ? currentNum + 1 : currentNum - 1;
    router.push(`${config.basePath}/${newNumber}`);
  };

  const getNavigationData = () => {
    if (type === "surah") {
      const currentSurah = surahNames.find((s) => s.number.toString() === number);
      const nextSurah = hasNext ? surahNames[currentNumber] : null;
      const prevSurah = hasPrev ? surahNames[currentNumber - 2] : null;

      return {
        current: currentSurah,
        next: nextSurah,
        prev: prevSurah,
      };
    } else {
      const currentJuz = juzNames.find((j) => j.number.toString() === number);
      const nextJuz = hasNext ? juzNames[currentNumber] : null;
      const prevJuz = hasPrev ? juzNames[currentNumber - 2] : null;

      return {
        current: currentJuz,
        next: nextJuz,
        prev: prevJuz,
      };
    }
  };

  return {
    number,
    currentNumber,
    hasPrev,
    hasNext,
    handleNavigation,
    navigationData: getNavigationData(),
  };
};