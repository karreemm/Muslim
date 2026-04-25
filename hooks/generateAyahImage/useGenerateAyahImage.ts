"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  areVersesWithinPage,
  buildAyahImageData,
  MAX_AYAH_IMAGE_LINES,
} from "@/utils/ayahImageUtils";
import { useAyahSelection } from "./useAyahSelection";
import { useAyahDropdowns } from "./useAyahDropdowns";
import { useAyahPalette } from "./useAyahPalette";
import { useAyahData } from "./useAyahData";
import type { AyahImageData } from "@/app/(pages)/generate-ayah-image/types";

interface GenerateAyahImageDefaults {
  customHue: number;
  theme: "light" | "dark";
  initialSurah?: number;
  initialAyah?: number;
}

export function useGenerateAyahImage(
  language: string,
  defaults: GenerateAyahImageDefaults,
) {
  const [pendingAyahData, setPendingAyahData] = useState<AyahImageData | null>(
    null,
  );
  const [appliedAyahData, setAppliedAyahData] = useState<AyahImageData | null>(
    null,
  );
  const [isApplyingAyahSelection, setIsApplyingAyahSelection] = useState(false);

  const {
    pendingSelection,
    setPendingSelection,
    setAppliedSelection,
    selectSurah: _selectSurah,
    selectAyah: _selectAyah,
    selectPredefinedAyah: _selectPredefinedAyah,
    incrementBefore: _incrementBefore,
    decrementBefore: _decrementBefore,
    incrementAfter: _incrementAfter,
    decrementAfter: _decrementAfter,
    setShowAyahNumberForSingle,
    setSpecificPartEnabled,
    setSpecificPartStartWordIndex,
    setSpecificPartEndWordIndex,
  } = useAyahSelection(pendingAyahData?.totalSelectableWords ?? 0, {
    initialSurah: defaults.initialSurah,
    initialAyah: defaults.initialAyah,
  });

  const {
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
  } = useAyahDropdowns(
    language,
    pendingSelection.surahNumber,
    pendingSelection.ayahNumber,
  );

  const palette = useAyahPalette(defaults);

  const {
    surahVerses,
    loadedSurahNumber,
    isLoadingAyah,
    error,
    setError,
    fontReadyForExport,
    setFontReadyForExport,
    forceLoad,
  } = useAyahData(pendingSelection.surahNumber, pendingSelection.ayahNumber);

  const selectSurah = useCallback(
    (surahNumber: number) => {
      _selectSurah(surahNumber);
      clearAyahQuery();
      setShowSurahDropdown(false);
    },
    [_selectSurah, clearAyahQuery, setShowSurahDropdown],
  );

  const selectAyah = useCallback(
    (ayahNumber: number) => {
      _selectAyah(ayahNumber);
      setShowAyahDropdown(false);
    },
    [_selectAyah, setShowAyahDropdown],
  );

  const selectPredefinedAyah = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      _selectPredefinedAyah(surahNumber, ayahNumber);
      clearSurahQuery();
      clearAyahQuery();
      setShowSurahDropdown(false);
      setShowAyahDropdown(false);
    },
    [
      _selectPredefinedAyah,
      clearSurahQuery,
      clearAyahQuery,
      setShowSurahDropdown,
      setShowAyahDropdown,
    ],
  );

  useEffect(() => {
    if (
      loadedSurahNumber !== pendingSelection.surahNumber ||
      surahVerses.length === 0
    )
      return;
    const data = buildAyahImageData(pendingSelection, surahVerses);
    setPendingAyahData(data);
  }, [loadedSurahNumber, pendingSelection, surahVerses]);

  useEffect(() => {
    if (!pendingAyahData) return;
    if (pendingSelection.specificPartEnabled) return;
    setAppliedSelection(pendingSelection);
    setAppliedAyahData(pendingAyahData);
  }, [pendingAyahData, pendingSelection, setAppliedSelection]);

  const canIncreaseBefore = useMemo(() => {
    if (!pendingAyahData || surahVerses.length === 0) return false;
    if (pendingAyahData.rangeStartAyah <= 1) return false;
    const next = buildAyahImageData(
      { ...pendingSelection, beforeCount: pendingSelection.beforeCount + 1 },
      surahVerses,
    );
    if (!next) return false;
    if (!areVersesWithinPage(next.displayVerses, next.pageNumber)) return false;
    return next.lineCount <= MAX_AYAH_IMAGE_LINES;
  }, [pendingAyahData, pendingSelection, surahVerses]);

  const canIncreaseAfter = useMemo(() => {
    if (!pendingAyahData || surahVerses.length === 0) return false;
    if (pendingAyahData.rangeEndAyah >= selectedSurahMeta.ayahs) return false;
    const next = buildAyahImageData(
      { ...pendingSelection, afterCount: pendingSelection.afterCount + 1 },
      surahVerses,
    );
    if (!next) return false;
    if (!areVersesWithinPage(next.displayVerses, next.pageNumber)) return false;
    return next.lineCount <= MAX_AYAH_IMAGE_LINES;
  }, [pendingAyahData, pendingSelection, selectedSurahMeta.ayahs, surahVerses]);

  const canDecreaseBefore = pendingSelection.beforeCount > 0;
  const canDecreaseAfter = pendingSelection.afterCount > 0;

  const incrementBefore = useCallback(
    () => _incrementBefore(canIncreaseBefore),
    [_incrementBefore, canIncreaseBefore],
  );
  const decrementBefore = useCallback(
    () => _decrementBefore(canDecreaseBefore),
    [_decrementBefore, canDecreaseBefore],
  );
  const incrementAfter = useCallback(
    () => _incrementAfter(canIncreaseAfter),
    [_incrementAfter, canIncreaseAfter],
  );
  const decrementAfter = useCallback(
    () => _decrementAfter(canDecreaseAfter),
    [_decrementAfter, canDecreaseAfter],
  );

  const hasPendingAyahChanges = useMemo(() => {
    if (!pendingSelection.specificPartEnabled) return false;
    const totalWords = pendingAyahData?.totalSelectableWords ?? 0;
    if (totalWords <= 0) return false;

    const fallbackEnd = Math.max(0, totalWords - 1);
    const rawStart =
      pendingSelection.specificPartStartWordIndex ??
      pendingSelection.committedPartStartWordIndex ??
      0;
    const rawEnd =
      pendingSelection.specificPartEndWordIndex ??
      pendingSelection.committedPartEndWordIndex ??
      fallbackEnd;
    const nextStart = Math.max(0, Math.min(rawStart, rawEnd, fallbackEnd));
    const nextEnd = Math.max(
      nextStart,
      Math.min(Math.max(rawStart, rawEnd), fallbackEnd),
    );

    const { committedPartStartWordIndex: cs, committedPartEndWordIndex: ce } =
      pendingSelection;
    if (cs === null || ce === null) return true;
    return nextStart !== cs || nextEnd !== ce;
  }, [pendingAyahData?.totalSelectableWords, pendingSelection]);

  const applyAyahSelection = useCallback(async () => {
    if (!hasPendingAyahChanges || !pendingAyahData) return;
    if (!pendingSelection.specificPartEnabled) return;
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
        sourceVerses = await forceLoad(
          pendingSelection.surahNumber,
          pendingSelection.ayahNumber,
        );
      }

      const nextData = buildAyahImageData(pendingSelection, sourceVerses);
      if (!nextData) throw new Error("Failed to apply ayah selection");

      const shouldCommit =
        pendingSelection.specificPartEnabled &&
        nextData.specificPartStartWordIndex !== null &&
        nextData.specificPartEndWordIndex !== null;

      const committedSelection = shouldCommit
        ? {
            ...pendingSelection,
            committedPartStartWordIndex: nextData.specificPartStartWordIndex,
            committedPartEndWordIndex: nextData.specificPartEndWordIndex,
            specificPartEnabled: false,
            specificPartStartWordIndex: null,
            specificPartEndWordIndex: null,
          }
        : pendingSelection;

      const committedData = shouldCommit
        ? buildAyahImageData(committedSelection, sourceVerses)
        : nextData;

      if (!committedData) throw new Error("Failed to finalize ayah selection");

      setPendingSelection(committedSelection);
      setAppliedSelection(committedSelection);
      setPendingAyahData(committedData);
      setAppliedAyahData(committedData);
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
    forceLoad,
    setAppliedSelection,
    setError,
    setFontReadyForExport,
    setPendingSelection,
  ]);

  return {
    maxAyahImageLines: MAX_AYAH_IMAGE_LINES,
    fixedPalettes: palette.fixedPalettes,
    selectedSurah: pendingSelection.surahNumber,
    selectedAyah: pendingSelection.ayahNumber,
    selectedBeforeAyahs: pendingSelection.beforeCount,
    selectedAfterAyahs: pendingSelection.afterCount,
    currentLineCount: pendingAyahData?.lineCount ?? 0,
    isSingleAyahSelection: pendingAyahData?.isSingleAyahSelection ?? true,
    showAyahNumberForSingle: pendingSelection.showAyahNumber,
    specificPartEnabled: pendingSelection.specificPartEnabled,
    specificPartStartWordIndex:
      pendingSelection.specificPartStartWordIndex ?? 0,
    specificPartEndWordIndex:
      pendingSelection.specificPartEndWordIndex ??
      Math.max(0, (pendingAyahData?.totalSelectableWords ?? 1) - 1),
    canIncreaseBefore,
    canIncreaseAfter,
    canDecreaseBefore,
    canDecreaseAfter,
    surahQuery,
    ayahQuery,
    showSurahDropdown,
    showAyahDropdown,
    paletteMode: palette.paletteMode,
    paletteHue: palette.paletteHue,
    imageTheme: palette.imageTheme,
    showPageNumber: palette.showPageNumber,
    showWebsiteAttribution: palette.showWebsiteAttribution,
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
    setImageTheme: palette.setImageTheme,
    setShowPageNumber: palette.setShowPageNumber,
    setShowWebsiteAttribution: palette.setShowWebsiteAttribution,
    selectPalettePreset: palette.selectPalettePreset,
    setCustomPaletteHue: palette.setCustomPaletteHue,
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
