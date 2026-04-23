import { useCallback, useEffect, useState } from "react";
import { getAyahImageData } from "@/app/(pages)/generate-ayah-image/service/GetAyahImageData";
import type { QuranVerse } from "@/hooks/readQuran";

export function useAyahData(surahNumber: number, ayahNumber: number) {
  const [surahVerses, setSurahVerses] = useState<QuranVerse[]>([]);
  const [loadedSurahNumber, setLoadedSurahNumber] = useState<number | null>(null);
  const [isLoadingAyah, setIsLoadingAyah] = useState(false);
  const [error, setError] = useState("");
  const [fontReadyForExport, setFontReadyForExport] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (loadedSurahNumber === surahNumber && surahVerses.length > 0) return;

      setIsLoadingAyah(true);
      setError("");
      setFontReadyForExport(false);

      try {
        const data = await getAyahImageData(surahNumber, ayahNumber);
        if (!active) return;
        setSurahVerses(data.surahVerses);
        setLoadedSurahNumber(surahNumber);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load ayah data");
      } finally {
        if (active) setIsLoadingAyah(false);
      }
    }

    load();
    return () => { active = false; };
  }, [loadedSurahNumber, surahNumber, ayahNumber, surahVerses.length]);

  const forceLoad = useCallback(
    async (targetSurah: number, targetAyah: number) => {
      const data = await getAyahImageData(targetSurah, targetAyah);
      setSurahVerses(data.surahVerses);
      setLoadedSurahNumber(targetSurah);
      return data.surahVerses;
    },
    [],
  );

  return {
    surahVerses,
    loadedSurahNumber,
    isLoadingAyah,
    error,
    setError,
    fontReadyForExport,
    setFontReadyForExport,
    setSurahVerses,
    setLoadedSurahNumber,
    forceLoad,
  };
}