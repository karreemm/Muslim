"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { surahNames, juzNames } from "../../constants/quranData";

type NavigationType = "surah" | "juz" | "page";

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
    maxNumber: type === "surah" ? surahNames.length : (type === "juz" ? juzNames.length : 604),
    basePath: type === "surah" ? "/read-quran/surah" : (type === "juz" ? "/read-quran/juz" : "/read-quran/page"),
  };

  const currentNumber = number ? parseInt(number) : 0;
  const hasPrev = currentNumber > 1;
  const hasNext = currentNumber < config.maxNumber;

  useEffect(() => {
    const parts = pathname.split("/");
    const pageNumber = parts.pop();

    if (
      pageNumber &&
      !isNaN(parseInt(pageNumber)) &&
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
      const currentSurah = surahNames.find(
        (s) => s.number.toString() === number
      );
      const nextSurah = hasNext ? surahNames[currentNumber] : null;
      const prevSurah = hasPrev ? surahNames[currentNumber - 2] : null;

      return {
        current: currentSurah,
        next: nextSurah,
        prev: prevSurah,
      };
    } else if (type === "juz") {
      const currentJuz = juzNames.find((j) => j.number.toString() === number);
      const nextJuz = hasNext ? juzNames[currentNumber] : null;
      const prevJuz = hasPrev ? juzNames[currentNumber - 2] : null;

      return {
        current: currentJuz,
        next: nextJuz,
        prev: prevJuz,
      };
    } else {
      return {
        current: { number: currentNumber, label: `Page ${currentNumber}` },
        next: hasNext ? { number: currentNumber + 1 } : null,
        prev: hasPrev ? { number: currentNumber - 1 } : null,
      }
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
