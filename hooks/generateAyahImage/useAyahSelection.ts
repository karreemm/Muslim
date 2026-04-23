import { startTransition, useCallback, useState } from "react";
import { surahNames } from "@/constants/quranData";

export interface AyahSelectionState {
  surahNumber: number;
  ayahNumber: number;
  beforeCount: number;
  afterCount: number;
  showAyahNumber: boolean;
  committedPartStartWordIndex: number | null;
  committedPartEndWordIndex: number | null;
  specificPartEnabled: boolean;
  specificPartStartWordIndex: number | null;
  specificPartEndWordIndex: number | null;
}

const INITIAL_SELECTION: AyahSelectionState = {
  surahNumber: 1,
  ayahNumber: 1,
  beforeCount: 0,
  afterCount: 0,
  showAyahNumber: true,
  committedPartStartWordIndex: null,
  committedPartEndWordIndex: null,
  specificPartEnabled: false,
  specificPartStartWordIndex: null,
  specificPartEndWordIndex: null,
};

const RESET_PART_FIELDS = {
  committedPartStartWordIndex: null,
  committedPartEndWordIndex: null,
  specificPartEnabled: false,
  specificPartStartWordIndex: null,
  specificPartEndWordIndex: null,
};

export function useAyahSelection(totalSelectableWords: number) {
  const [pendingSelection, setPendingSelection] =
    useState<AyahSelectionState>(INITIAL_SELECTION);
  const [appliedSelection, setAppliedSelection] =
    useState<AyahSelectionState>(INITIAL_SELECTION);

  const selectSurah = useCallback((surahNumber: number) => {
    const nextSurah = surahNames.find((s) => s.number === surahNumber);
    if (!nextSurah) return;
    setPendingSelection((prev) => ({
      ...prev,
      surahNumber,
      ayahNumber: 1,
      beforeCount: 0,
      afterCount: 0,
      ...RESET_PART_FIELDS,
    }));
  }, []);

  const selectAyah = useCallback((ayahNumber: number) => {
    setPendingSelection((prev) => ({
      ...prev,
      ayahNumber,
      ...RESET_PART_FIELDS,
    }));
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
        ...RESET_PART_FIELDS,
      }));
    },
    [],
  );

  const incrementBefore = useCallback((canIncrease: boolean) => {
    if (!canIncrease) return;
    setPendingSelection((prev) => ({
      ...prev,
      beforeCount: prev.beforeCount + 1,
      ...RESET_PART_FIELDS,
    }));
  }, []);

  const decrementBefore = useCallback((canDecrease: boolean) => {
    if (!canDecrease) return;
    setPendingSelection((prev) => ({
      ...prev,
      beforeCount: Math.max(0, prev.beforeCount - 1),
      ...RESET_PART_FIELDS,
    }));
  }, []);

  const incrementAfter = useCallback((canIncrease: boolean) => {
    if (!canIncrease) return;
    setPendingSelection((prev) => ({
      ...prev,
      afterCount: prev.afterCount + 1,
      ...RESET_PART_FIELDS,
    }));
  }, []);

  const decrementAfter = useCallback((canDecrease: boolean) => {
    if (!canDecrease) return;
    setPendingSelection((prev) => ({
      ...prev,
      afterCount: Math.max(0, prev.afterCount - 1),
      ...RESET_PART_FIELDS,
    }));
  }, []);

  const setShowAyahNumberForSingle = useCallback((value: boolean) => {
    setPendingSelection((prev) => ({ ...prev, showAyahNumber: value }));
  }, []);

  const setSpecificPartEnabled = useCallback(
    (enabled: boolean) => {
      setPendingSelection((prev) => {
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
          specificPartStartWordIndex: prev.committedPartStartWordIndex ?? 0,
          specificPartEndWordIndex:
            prev.committedPartEndWordIndex ?? Math.max(0, totalSelectableWords - 1),
        };
      });
    },
    [totalSelectableWords],
  );

  const setSpecificPartStartWordIndex = useCallback((index: number) => {
    startTransition(() => {
      setPendingSelection((prev) => {
        const end = prev.specificPartEndWordIndex ?? index;
        return { ...prev, specificPartStartWordIndex: Math.min(index, end) };
      });
    });
  }, []);

  const setSpecificPartEndWordIndex = useCallback((index: number) => {
    startTransition(() => {
      setPendingSelection((prev) => {
        const start = prev.specificPartStartWordIndex ?? 0;
        return { ...prev, specificPartEndWordIndex: Math.max(index, start) };
      });
    });
  }, []);

  return {
    pendingSelection,
    appliedSelection,
    setPendingSelection,
    setAppliedSelection,
    selectSurah,
    selectAyah,
    selectPredefinedAyah,
    incrementBefore,
    decrementBefore,
    incrementAfter,
    decrementAfter,
    setShowAyahNumberForSingle,
    setSpecificPartEnabled,
    setSpecificPartStartWordIndex,
    setSpecificPartEndWordIndex,
  };
}