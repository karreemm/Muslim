import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { reciters } from "../../constants/recitersData";
import { surahNames } from "../../constants/quranData";

export function useReciterSurahSelection() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [reciterId, setReciterId] = useState<string | null>("Abdul-Basit");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedSurahNameEn, setSelectedSurahNameEn] = useState<string | null>(
    null
  );
  const [selectedSurahNameAr, setSelectedSurahNameAr] = useState<string | null>(
    null
  );
  const [reciterNameEn, setReciterNameEn] = useState<string>("");
  const [reciterNameAr, setReciterNameAr] = useState<string>("");

  useEffect(() => {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1];
    const surahNumber = searchParams.get("surah");

    if (id) setReciterId(id);
    if (surahNumber) {
      setSelectedSurah(parseInt(surahNumber, 10));
    } else {
      setSelectedSurah(1);
    }
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
        surahNames[selectedSurah - 1].en
      );
      console.log(
        "Selected Surah Name (AR):",
        surahNames[selectedSurah - 1].ar
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
