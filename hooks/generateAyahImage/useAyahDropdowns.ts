import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/general/useTranslation";
import { surahNames } from "@/constants/quranData";
import type { DropdownItem } from "@/types/ayahImage";

export function useAyahDropdowns(
  language: string,
  surahNumber: number,
  ayahNumber: number,
) {
  const { t } = useTranslation();
  const [surahQuery, setSurahQuery] = useState("");
  const [ayahQuery, setAyahQuery] = useState("");
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [showAyahDropdown, setShowAyahDropdown] = useState(false);

  const selectedSurahMeta = useMemo(
    () => surahNames.find((s) => s.number === surahNumber) ?? surahNames[0],
    [surahNumber],
  );

  const filteredSurahs = useMemo(() => {
    const query = surahQuery.trim().toLowerCase();
    if (!query) return surahNames;
    return surahNames.filter(
      (s) =>
        s.en.toLowerCase().includes(query) ||
        s.ar.toLowerCase().includes(query) ||
        String(s.number).includes(query),
    );
  }, [surahQuery]);

  const surahDropdownItems = useMemo<DropdownItem[]>(
    () =>
      filteredSurahs.map((surah) => ({
        value: surah.number,
        label: language === "ar" ? surah.ar : surah.en,
        meta: t("generateAyahImage.surahOption", {
          number: surah.number,
          count: surah.ayahs,
        }),
      })),
    [filteredSurahs, language],
  );

  const ayahNumbers = useMemo<number[]>(() => {
    const count = selectedSurahMeta?.ayahs ?? 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [selectedSurahMeta]);

  const filteredAyahs = useMemo(() => {
    const query = ayahQuery.trim();
    if (!query) return ayahNumbers;
    return ayahNumbers.filter((a) => String(a).includes(query));
  }, [ayahNumbers, ayahQuery]);

  const ayahDropdownItems = useMemo<DropdownItem[]>(
    () =>
      filteredAyahs.map((ayah) => ({
        value: ayah,
        label: t("generateAyahImage.ayahOption", { number: ayah }),
        meta: t("generateAyahImage.ayahNumberShort", { number: ayah }),
      })),
    [filteredAyahs, language],
  );

  const selectedSurahLabel =
    language === "ar"
      ? `${selectedSurahMeta.ar} (${selectedSurahMeta.number})`
      : `${selectedSurahMeta.en} (${selectedSurahMeta.number})`;

  const selectedAyahLabel = t("generateAyahImage.ayahOption", { number: ayahNumber });

  const clearSurahQuery = useCallback(() => setSurahQuery(""), []);
  const clearAyahQuery = useCallback(() => setAyahQuery(""), []);

  return {
    surahQuery,
    ayahQuery,
    showSurahDropdown,
    showAyahDropdown,
    selectedSurahMeta,
    surahDropdownItems,
    ayahDropdownItems,
    selectedSurahLabel,
    selectedAyahLabel,
    setSurahQuery,
    setAyahQuery,
    setShowSurahDropdown,
    setShowAyahDropdown,
    clearSurahQuery,
    clearAyahQuery,
  };
}
