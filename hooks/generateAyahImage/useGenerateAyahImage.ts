"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { surahNames } from "@/constants/quranData";
import { getAyahImageData } from "@/app/(pages)/generate-ayah-image/service/GetAyahImageData";
import type {
  AyahImageData,
  DropdownItem,
} from "@/app/(pages)/generate-ayah-image/types";
import {
  DEFAULT_CUSTOM_HUE,
  FIXED_AYAH_PALETTES,
  type AyahImagePaletteMode,
  type FixedAyahPaletteId,
} from "@/app/(pages)/generate-ayah-image/palettePresets";

interface GenerateAyahImageDefaults {
  customHue: number;
  theme: "light" | "dark";
}

export function useGenerateAyahImage(
  language: string,
  defaults: GenerateAyahImageDefaults,
) {
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);

  const [surahQuery, setSurahQuery] = useState("");
  const [ayahQuery, setAyahQuery] = useState("");

  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [showAyahDropdown, setShowAyahDropdown] = useState(false);
  const [paletteMode, setPaletteMode] =
    useState<AyahImagePaletteMode>("custom");
  const [paletteHue, setPaletteHue] = useState(
    defaults.customHue ?? DEFAULT_CUSTOM_HUE,
  );
  const [imageTheme, setImageTheme] = useState<"light" | "dark">(
    defaults.theme,
  );
  const [showPageNumber, setShowPageNumber] = useState(false);

  const [isLoadingAyah, setIsLoadingAyah] = useState(false);
  const [ayahData, setAyahData] = useState<AyahImageData | null>(null);
  const [error, setError] = useState("");
  const [fontReadyForExport, setFontReadyForExport] = useState(false);

  const selectedSurahMeta = useMemo(
    () => surahNames.find((s) => s.number === selectedSurah) ?? surahNames[0],
    [selectedSurah],
  );

  const filteredSurahs = useMemo(() => {
    const query = surahQuery.trim().toLowerCase();
    if (!query) return surahNames;

    return surahNames.filter((surah) => {
      return (
        surah.en.toLowerCase().includes(query) ||
        surah.ar.toLowerCase().includes(query) ||
        String(surah.number).includes(query)
      );
    });
  }, [surahQuery]);

  const surahDropdownItems = useMemo<DropdownItem[]>(() => {
    return filteredSurahs.map((surah) => ({
      value: surah.number,
      label: language === "ar" ? surah.ar : surah.en,
      meta:
        language === "ar"
          ? `سورة رقم ${surah.number} - ${surah.ayahs} آية`
          : `Surah ${surah.number} - ${surah.ayahs} ayahs`,
    }));
  }, [filteredSurahs, language]);

  const ayahNumbers = useMemo(() => {
    const count = selectedSurahMeta?.ayahs ?? 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [selectedSurahMeta]);

  const filteredAyahs = useMemo(() => {
    const query = ayahQuery.trim();
    if (!query) return ayahNumbers;

    return ayahNumbers.filter((ayah) => String(ayah).includes(query));
  }, [ayahNumbers, ayahQuery]);

  const ayahDropdownItems = useMemo<DropdownItem[]>(() => {
    return filteredAyahs.map((ayah) => ({
      value: ayah,
      label: language === "ar" ? `الآية ${ayah}` : `Ayah ${ayah}`,
      meta: language === "ar" ? `رقم ${ayah}` : `No. ${ayah}`,
    }));
  }, [filteredAyahs, language]);

  const selectedSurahLabel =
    language === "ar"
      ? `${selectedSurahMeta.ar} (${selectedSurahMeta.number})`
      : `${selectedSurahMeta.en} (${selectedSurahMeta.number})`;

  const selectedAyahLabel =
    language === "ar" ? `الآية ${selectedAyah}` : `Ayah ${selectedAyah}`;

  const selectSurah = useCallback((surahNumber: number) => {
    const nextSurah = surahNames.find((s) => s.number === surahNumber);
    if (!nextSurah) return;

    setSelectedSurah(surahNumber);
    setSelectedAyah(1);
    setAyahQuery("");
    setShowSurahDropdown(false);
  }, []);

  const selectAyah = useCallback((ayahNumber: number) => {
    setSelectedAyah(ayahNumber);
    setShowAyahDropdown(false);
  }, []);

  const selectPalettePreset = useCallback((mode: FixedAyahPaletteId) => {
    setPaletteMode(mode);
  }, []);

  const setCustomPaletteHue = useCallback((hue: number) => {
    setPaletteMode("custom");
    setPaletteHue(hue);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAyahData() {
      setIsLoadingAyah(true);
      setError("");
      setFontReadyForExport(false);

      try {
        const data = await getAyahImageData(selectedSurah, selectedAyah);
        if (!active) return;

        setAyahData(data.ayahData);
      } catch (err) {
        if (!active) return;

        setAyahData(null);
        setError(
          err instanceof Error ? err.message : "Failed to load ayah data",
        );
      } finally {
        if (active) {
          setIsLoadingAyah(false);
        }
      }
    }

    loadAyahData();

    return () => {
      active = false;
    };
  }, [selectedSurah, selectedAyah]);

  return {
    fixedPalettes: FIXED_AYAH_PALETTES,
    selectedSurah,
    selectedAyah,
    surahQuery,
    ayahQuery,
    showSurahDropdown,
    showAyahDropdown,
    paletteMode,
    paletteHue,
    imageTheme,
    showPageNumber,
    isLoadingAyah,
    ayahData,
    error,
    fontReadyForExport,
    selectedSurahLabel,
    selectedAyahLabel,
    surahDropdownItems,
    ayahDropdownItems,
    selectSurah,
    selectAyah,
    setSurahQuery,
    setAyahQuery,
    setShowSurahDropdown,
    setShowAyahDropdown,
    setImageTheme,
    setShowPageNumber,
    selectPalettePreset,
    setCustomPaletteHue,
    setFontReadyForExport,
    canExport: !!ayahData && !isLoadingAyah && fontReadyForExport,
  };
}
