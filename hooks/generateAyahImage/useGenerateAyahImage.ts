"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { surahNames } from "@/constants/quranData";
import { getAyahImageData } from "@/app/(pages)/generate-ayah-image/service/GetAyahImageData";
import type { QuranVerse } from "@/hooks/readQuran";
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

interface AyahSelectionState {
  surahNumber: number;
  ayahNumber: number;
  beforeCount: number;
  afterCount: number;
  showAyahNumber: boolean;
  specificPartEnabled: boolean;
  specificPartStartWordIndex: number | null;
  specificPartEndWordIndex: number | null;
}

const MAX_AYAH_IMAGE_LINES = 15;

function getAyahNumber(verse: QuranVerse): number {
  const [, ayahPart] = verse.verse_key.split(":");
  return Number(ayahPart);
}

function flattenSelectableWords(verses: QuranVerse[]) {
  return verses.flatMap((verse) =>
    verse.words
      .filter((word) => word.char_type_name !== "end")
      .map((word) => word),
  );
}

function countUniqueLines(verses: QuranVerse[]) {
  const lines = new Set<number>();

  verses.forEach((verse) => {
    verse.words.forEach((word) => {
      const lineNumber = Number(word.line_number);
      if (Number.isFinite(lineNumber) && lineNumber > 0) {
        lines.add(lineNumber);
      }
    });
  });

  return lines.size;
}

function sameSelection(a: AyahSelectionState, b: AyahSelectionState): boolean {
  return (
    a.surahNumber === b.surahNumber &&
    a.ayahNumber === b.ayahNumber &&
    a.beforeCount === b.beforeCount &&
    a.afterCount === b.afterCount &&
    a.showAyahNumber === b.showAyahNumber &&
    a.specificPartEnabled === b.specificPartEnabled &&
    (!a.specificPartEnabled ||
      (a.specificPartStartWordIndex === b.specificPartStartWordIndex &&
        a.specificPartEndWordIndex === b.specificPartEndWordIndex))
  );
}

function buildAyahImageData(
  selection: AyahSelectionState,
  surahVerses: QuranVerse[],
): AyahImageData | null {
  if (surahVerses.length === 0) return null;

  const surahMeta = surahNames.find((s) => s.number === selection.surahNumber);
  if (!surahMeta) return null;

  const ayahCount = surahMeta.ayahs;
  const clampedAyah = Math.min(Math.max(selection.ayahNumber, 1), ayahCount);
  const rangeStartAyah = Math.max(
    1,
    clampedAyah - Math.max(selection.beforeCount, 0),
  );
  const rangeEndAyah = Math.min(
    ayahCount,
    clampedAyah + Math.max(selection.afterCount, 0),
  );

  const targetVerse = surahVerses.find(
    (verse) => getAyahNumber(verse) === clampedAyah,
  );
  const targetVerses = surahVerses.filter((verse) => {
    const ayah = getAyahNumber(verse);
    return ayah >= rangeStartAyah && ayah <= rangeEndAyah;
  });

  if (!targetVerse || targetVerses.length === 0) {
    return null;
  }

  const firstWord = targetVerses[0]?.words[0];
  if (!firstWord) return null;

  const totalSelectableWords = flattenSelectableWords(targetVerses).length;
  const isSingleAyahSelection = rangeStartAyah === rangeEndAyah;
  const lineCount = countUniqueLines(targetVerses);

  let specificPartStartWordIndex: number | null = null;
  let specificPartEndWordIndex: number | null = null;
  let displayVerses = targetVerses;

  if (selection.specificPartEnabled && totalSelectableWords > 0) {
    const fallbackEnd = totalSelectableWords - 1;
    const rawStart = selection.specificPartStartWordIndex ?? 0;
    const rawEnd = selection.specificPartEndWordIndex ?? fallbackEnd;
    const start = Math.max(0, Math.min(rawStart, rawEnd, fallbackEnd));
    const end = Math.max(
      start,
      Math.min(Math.max(rawStart, rawEnd), fallbackEnd),
    );

    let globalIndex = 0;
    displayVerses = targetVerses
      .map((verse) => {
        const scopedWords = verse.words.filter((word) => {
          if (word.char_type_name === "end") return false;

          const isSelected = globalIndex >= start && globalIndex <= end;
          globalIndex += 1;
          return isSelected;
        });

        return {
          ...verse,
          words: scopedWords,
        };
      })
      .filter((verse) => verse.words.length > 0);

    specificPartStartWordIndex = start;
    specificPartEndWordIndex = end;
  } else if (isSingleAyahSelection && !selection.showAyahNumber) {
    displayVerses = targetVerses.map((verse) => ({
      ...verse,
      words: verse.words.filter((word) => word.char_type_name !== "end"),
    }));
  }

  if (displayVerses.length === 0) {
    displayVerses = targetVerses;
  }

  return {
    surahNumber: selection.surahNumber,
    ayahNumber: clampedAyah,
    rangeStartAyah,
    rangeEndAyah,
    pageNumber: Number(firstWord.page_number),
    lineNumber: Number(firstWord.line_number),
    lineCount,
    surahNameAr: surahMeta.arTashkeel,
    surahNameEn: surahMeta.en,
    targetVerse,
    targetVerses,
    displayVerses,
    isSingleAyahSelection,
    showAyahNumber: isSingleAyahSelection ? selection.showAyahNumber : false,
    specificPartEnabled: selection.specificPartEnabled,
    specificPartStartWordIndex,
    specificPartEndWordIndex,
    totalSelectableWords,
  };
}

export function useGenerateAyahImage(
  language: string,
  defaults: GenerateAyahImageDefaults,
) {
  const [pendingSelection, setPendingSelection] = useState<AyahSelectionState>({
    surahNumber: 1,
    ayahNumber: 1,
    beforeCount: 0,
    afterCount: 0,
    showAyahNumber: true,
    specificPartEnabled: false,
    specificPartStartWordIndex: null,
    specificPartEndWordIndex: null,
  });
  const [appliedSelection, setAppliedSelection] =
    useState<AyahSelectionState>(pendingSelection);

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
  const [pendingAyahData, setPendingAyahData] = useState<AyahImageData | null>(
    null,
  );
  const [appliedAyahData, setAppliedAyahData] = useState<AyahImageData | null>(
    null,
  );
  const [surahVerses, setSurahVerses] = useState<QuranVerse[]>([]);
  const [loadedSurahNumber, setLoadedSurahNumber] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");
  const [fontReadyForExport, setFontReadyForExport] = useState(false);
  const [isApplyingAyahSelection, setIsApplyingAyahSelection] = useState(false);

  const selectedSurah = pendingSelection.surahNumber;
  const selectedAyah = pendingSelection.ayahNumber;

  const selectedSurahMeta = useMemo(
    () =>
      surahNames.find((s) => s.number === pendingSelection.surahNumber) ??
      surahNames[0],
    [pendingSelection.surahNumber],
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

  const ayahNumbers = useMemo<number[]>(() => {
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

    setPendingSelection((prev) => ({
      ...prev,
      surahNumber,
      ayahNumber: 1,
      beforeCount: 0,
      afterCount: 0,
      specificPartEnabled: false,
      specificPartStartWordIndex: null,
      specificPartEndWordIndex: null,
    }));
    setAyahQuery("");
    setShowSurahDropdown(false);
  }, []);

  const selectAyah = useCallback((ayahNumber: number) => {
    setPendingSelection((prev) => ({
      ...prev,
      ayahNumber,
      specificPartEnabled: false,
      specificPartStartWordIndex: null,
      specificPartEndWordIndex: null,
    }));
    setShowAyahDropdown(false);
  }, []);

  const selectPredefinedAyah = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      const nextSurah = surahNames.find((s) => s.number === surahNumber);
      if (!nextSurah) return;
      if (ayahNumber < 1 || ayahNumber > nextSurah.ayahs) return;

      setPendingSelection((prev) => ({
        ...prev,
        surahNumber,
        ayahNumber,
        beforeCount: 0,
        afterCount: 0,
        specificPartEnabled: false,
        specificPartStartWordIndex: null,
        specificPartEndWordIndex: null,
      }));
      setSurahQuery("");
      setAyahQuery("");
      setShowSurahDropdown(false);
      setShowAyahDropdown(false);
    },
    [],
  );

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
      if (
        loadedSurahNumber === pendingSelection.surahNumber &&
        surahVerses.length > 0
      ) {
        return;
      }

      setIsLoadingAyah(true);
      setError("");
      setFontReadyForExport(false);

      try {
        const data = await getAyahImageData(
          pendingSelection.surahNumber,
          pendingSelection.ayahNumber,
        );
        if (!active) return;

        setSurahVerses(data.surahVerses);
        setLoadedSurahNumber(pendingSelection.surahNumber);
      } catch (err) {
        if (!active) return;

        setPendingAyahData(null);
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
  }, [
    loadedSurahNumber,
    pendingSelection.ayahNumber,
    pendingSelection.surahNumber,
    surahVerses.length,
  ]);

  useEffect(() => {
    if (
      loadedSurahNumber !== pendingSelection.surahNumber ||
      surahVerses.length === 0
    ) {
      return;
    }

    const data = buildAyahImageData(pendingSelection, surahVerses);
    setPendingAyahData(data);
  }, [loadedSurahNumber, pendingSelection, surahVerses]);

  useEffect(() => {
    if (appliedAyahData || !pendingAyahData) return;

    setAppliedSelection(pendingSelection);
    setAppliedAyahData(pendingAyahData);
  }, [appliedAyahData, pendingAyahData, pendingSelection]);

  const hasPendingAyahChanges = useMemo(
    () => !sameSelection(pendingSelection, appliedSelection),
    [appliedSelection, pendingSelection],
  );

  const currentLineCount = pendingAyahData?.lineCount ?? 0;

  const canIncreaseBefore = useMemo(() => {
    if (!pendingAyahData || surahVerses.length === 0) return false;
    if (pendingAyahData.rangeStartAyah <= 1) return false;

    const next = buildAyahImageData(
      {
        ...pendingSelection,
        beforeCount: pendingSelection.beforeCount + 1,
      },
      surahVerses,
    );

    return !!next && next.lineCount <= MAX_AYAH_IMAGE_LINES;
  }, [pendingAyahData, pendingSelection, surahVerses]);

  const canIncreaseAfter = useMemo(() => {
    if (!pendingAyahData || surahVerses.length === 0) return false;
    if (pendingAyahData.rangeEndAyah >= selectedSurahMeta.ayahs) return false;

    const next = buildAyahImageData(
      {
        ...pendingSelection,
        afterCount: pendingSelection.afterCount + 1,
      },
      surahVerses,
    );

    return !!next && next.lineCount <= MAX_AYAH_IMAGE_LINES;
  }, [pendingAyahData, pendingSelection, selectedSurahMeta.ayahs, surahVerses]);

  const canDecreaseBefore = pendingSelection.beforeCount > 0;
  const canDecreaseAfter = pendingSelection.afterCount > 0;

  const incrementBefore = useCallback(() => {
    if (!canIncreaseBefore) return;
    setPendingSelection((prev) => ({
      ...prev,
      beforeCount: prev.beforeCount + 1,
      specificPartEnabled: false,
      specificPartStartWordIndex: null,
      specificPartEndWordIndex: null,
    }));
  }, [canIncreaseBefore]);

  const decrementBefore = useCallback(() => {
    if (!canDecreaseBefore) return;
    setPendingSelection((prev) => ({
      ...prev,
      beforeCount: Math.max(0, prev.beforeCount - 1),
      specificPartEnabled: false,
      specificPartStartWordIndex: null,
      specificPartEndWordIndex: null,
    }));
  }, [canDecreaseBefore]);

  const incrementAfter = useCallback(() => {
    if (!canIncreaseAfter) return;
    setPendingSelection((prev) => ({
      ...prev,
      afterCount: prev.afterCount + 1,
      specificPartEnabled: false,
      specificPartStartWordIndex: null,
      specificPartEndWordIndex: null,
    }));
  }, [canIncreaseAfter]);

  const decrementAfter = useCallback(() => {
    if (!canDecreaseAfter) return;
    setPendingSelection((prev) => ({
      ...prev,
      afterCount: Math.max(0, prev.afterCount - 1),
      specificPartEnabled: false,
      specificPartStartWordIndex: null,
      specificPartEndWordIndex: null,
    }));
  }, [canDecreaseAfter]);

  const setShowAyahNumberForSingle = useCallback((value: boolean) => {
    setPendingSelection((prev) => ({
      ...prev,
      showAyahNumber: value,
    }));
  }, []);

  const setSpecificPartEnabled = useCallback(
    (enabled: boolean) => {
      setPendingSelection((prev) => {
        const totalWords = pendingAyahData?.totalSelectableWords ?? 0;

        if (!enabled) {
          return {
            ...prev,
            specificPartEnabled: false,
            specificPartStartWordIndex: null,
            specificPartEndWordIndex: null,
          };
        }

        return {
          ...prev,
          specificPartEnabled: true,
          specificPartStartWordIndex: 0,
          specificPartEndWordIndex: Math.max(0, totalWords - 1),
        };
      });
    },
    [pendingAyahData?.totalSelectableWords],
  );

  const setSpecificPartStartWordIndex = useCallback((index: number) => {
    setPendingSelection((prev) => {
      const end = prev.specificPartEndWordIndex ?? index;
      return {
        ...prev,
        specificPartStartWordIndex: Math.min(index, end),
      };
    });
  }, []);

  const setSpecificPartEndWordIndex = useCallback((index: number) => {
    setPendingSelection((prev) => {
      const start = prev.specificPartStartWordIndex ?? 0;
      return {
        ...prev,
        specificPartEndWordIndex: Math.max(index, start),
      };
    });
  }, []);

  const applyAyahSelection = useCallback(async () => {
    if (!hasPendingAyahChanges || !pendingAyahData) return;
    if (pendingAyahData.lineCount > MAX_AYAH_IMAGE_LINES) return;

    setIsApplyingAyahSelection(true);
    setError("");
    setFontReadyForExport(false);

    try {
      let sourceVerses = surahVerses;
      if (
        loadedSurahNumber !== pendingSelection.surahNumber ||
        sourceVerses.length === 0
      ) {
        const data = await getAyahImageData(
          pendingSelection.surahNumber,
          pendingSelection.ayahNumber,
        );
        sourceVerses = data.surahVerses;
        setSurahVerses(sourceVerses);
        setLoadedSurahNumber(pendingSelection.surahNumber);
      }

      const nextData = buildAyahImageData(pendingSelection, sourceVerses);
      if (!nextData) {
        throw new Error("Failed to apply ayah selection");
      }

      setAppliedSelection(pendingSelection);
      setAppliedAyahData(nextData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "ar"
            ? "تعذر تطبيق اختيار الآيات"
            : "Failed to apply ayah selection",
      );
    } finally {
      setIsApplyingAyahSelection(false);
    }
  }, [
    hasPendingAyahChanges,
    language,
    loadedSurahNumber,
    pendingAyahData,
    pendingSelection,
    surahVerses,
  ]);

  return {
    maxAyahImageLines: MAX_AYAH_IMAGE_LINES,
    fixedPalettes: FIXED_AYAH_PALETTES,
    selectedSurah,
    selectedAyah,
    selectedBeforeAyahs: pendingSelection.beforeCount,
    selectedAfterAyahs: pendingSelection.afterCount,
    currentLineCount,
    isSingleAyahSelection: pendingAyahData?.isSingleAyahSelection ?? true,
    showAyahNumberForSingle: pendingSelection.showAyahNumber,
    specificPartEnabled: pendingSelection.specificPartEnabled,
    specificPartStartWordIndex:
      pendingSelection.specificPartStartWordIndex ?? 0,
    specificPartEndWordIndex:
      pendingSelection.specificPartEndWordIndex ??
      Math.max(0, (pendingAyahData?.totalSelectableWords ?? 1) - 1),
    specificPartMaxWordIndex: Math.max(
      0,
      (pendingAyahData?.totalSelectableWords ?? 1) - 1,
    ),
    canIncreaseBefore,
    canIncreaseAfter,
    canDecreaseBefore,
    canDecreaseAfter,
    surahQuery,
    ayahQuery,
    showSurahDropdown,
    showAyahDropdown,
    paletteMode,
    paletteHue,
    imageTheme,
    showPageNumber,
    isLoadingAyah,
    ayahData: pendingAyahData,
    appliedAyahData,
    error,
    fontReadyForExport,
    isApplyingAyahSelection,
    hasPendingAyahChanges,
    selectedSurahLabel,
    selectedAyahLabel,
    surahDropdownItems,
    ayahDropdownItems,
    selectSurah,
    selectAyah,
    selectPredefinedAyah,
    setSurahQuery,
    setAyahQuery,
    setShowSurahDropdown,
    setShowAyahDropdown,
    setImageTheme,
    setShowPageNumber,
    selectPalettePreset,
    setCustomPaletteHue,
    setFontReadyForExport,
    incrementBefore,
    decrementBefore,
    incrementAfter,
    decrementAfter,
    setShowAyahNumberForSingle,
    setSpecificPartEnabled,
    setSpecificPartStartWordIndex,
    setSpecificPartEndWordIndex,
    applyAyahSelection,
    canExport:
      !!appliedAyahData &&
      !isLoadingAyah &&
      !isApplyingAyahSelection &&
      !hasPendingAyahChanges &&
      fontReadyForExport,
  };
}
