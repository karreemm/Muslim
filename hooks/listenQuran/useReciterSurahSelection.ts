import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { reciters } from "../../constants/recitersData";
import { surahNames } from "../../constants/quranData";

export function useReciterSurahSelection() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getRouteReciterId = () => {
    const parts = pathname.split("/");
    return parts[parts.length - 1] || null;
  };

  const getRouteSurahNumber = () => {
    const surahNumber = searchParams.get("surah");
    const parsedSurahNumber = surahNumber ? parseInt(surahNumber, 10) : NaN;
    return Number.isFinite(parsedSurahNumber) ? parsedSurahNumber : 1;
  };

  const [reciterId, setReciterId] = useState<string | null>(
    getRouteReciterId(),
  );
  const [selectedSurah, setSelectedSurah] = useState<number | null>(
    getRouteSurahNumber(),
  );
  const [selectedSurahNameEn, setSelectedSurahNameEn] = useState<string | null>(
    null,
  );
  const [selectedSurahNameAr, setSelectedSurahNameAr] = useState<string | null>(
    null,
  );
  const [reciterNameEn, setReciterNameEn] = useState<string>("");
  const [reciterNameAr, setReciterNameAr] = useState<string>("");

  useEffect(() => {
    const id = getRouteReciterId();
    const surahNumber = getRouteSurahNumber();

    setReciterId(id);
    setSelectedSurah(surahNumber);
  }, [pathname, searchParams]);

  useEffect(() => {
    const reciter = reciters.find((r) => r.id === reciterId);
    if (reciter) {
      setReciterNameEn(reciter.NameEn);
      setReciterNameAr(reciter.NameAr);
    }
  }, [reciterId]);

  useEffect(() => {
    if (
      selectedSurah &&
      selectedSurah >= 1 &&
      selectedSurah <= surahNames.length
    ) {
      setSelectedSurahNameEn(surahNames[selectedSurah - 1].en);
      setSelectedSurahNameAr(surahNames[selectedSurah - 1].ar);
      console.log("Selected Surah:", selectedSurah);
      console.log(
        "Selected Surah Name (EN):",
        surahNames[selectedSurah - 1].en,
      );
      console.log(
        "Selected Surah Name (AR):",
        surahNames[selectedSurah - 1].ar,
      );
    }
  }, [selectedSurah]);

  const handleSurahChange = (surahNumber: number) => {
    setSelectedSurah(surahNumber);
  };

  const handleReciterChange = (newReciterId: string) => {
    setReciterId(newReciterId);
  };

  return {
    reciterId,
    selectedSurah,
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr,
    handleSurahChange,
    handleReciterChange,
  };
}
