"use client";

import { useState, useCallback } from "react";
import { surahNames } from "@/constants/quranData";
import { useSavedAyahs } from "@/context/features/SavedAyahsContext";
import { toArabicNumber } from "@/utils/helpers";
import type { QuranVerse } from "./useQuranPageLines";

const getSurahAndAyah = (verseKey: string | null) => {
  if (!verseKey) return { surah: 0, ayah: 0 };
  const [surah, ayah] = verseKey.split(":").map(Number);
  return { surah, ayah };
};

interface SelectedAyahInfo {
  surahNumber: number;
  ayahNumber: number;
  surahNameAr?: string;
  surahNameEn?: string;
}

export const useAyahInteraction = (verses: QuranVerse[]) => {
  const { saveAyah } = useSavedAyahs();
  const [hoveredVerseKey, setHoveredVerseKey] = useState<string | null>(null);
  const [selectedVerseKey, setSelectedVerseKey] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const [modalAyahInfo, setModalAyahInfo] = useState<SelectedAyahInfo>({
    surahNumber: 0,
    ayahNumber: 0,
    surahNameAr: undefined,
    surahNameEn: undefined,
  });

  const [showTafseerModal, setShowTafseerModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  const handleWordClick = useCallback(
    (event: React.MouseEvent, verseKey: string | undefined) => {
      if (!verseKey) return;
      event.stopPropagation();

      const { surah, ayah } = getSurahAndAyah(verseKey);
      const surahInfo = surahNames.find((s) => s.number === surah);

      setModalAyahInfo({
        surahNumber: surah,
        ayahNumber: ayah,
        surahNameAr: surahInfo?.ar,
        surahNameEn: surahInfo?.en,
      });

      setSelectedVerseKey(verseKey);
      setPopoverPosition({ x: event.clientX, y: event.clientY });
    },
    [],
  );

  const handleClosePopover = useCallback(() => {
    setSelectedVerseKey(null);
  }, []);

  const handleSaveAyah = useCallback(() => {
    if (!selectedVerseKey) return;

    const { surah: surahNumber, ayah: ayahNumber } =
      getSurahAndAyah(selectedVerseKey);

    const verse = verses.find((v) => v.verse_key === selectedVerseKey);
    if (!verse) return;

    const text = verse.words
      .map((word) => word.text_uthmani || word.code_v2)
      .join(" ");

    const surahInfo = surahNames.find((s) => s.number === surahNumber);
    if (!surahInfo) return;

    saveAyah({
      surahNameEn: surahInfo.en,
      surahNameAr: surahInfo.ar,
      ayahNumberAr: toArabicNumber(ayahNumber),
      text,
      ayahNumberEn: ayahNumber,
      SurahNumber: surahNumber,
    });

    handleClosePopover();
  }, [selectedVerseKey, verses, saveAyah, handleClosePopover]);

  const handleOpenTafseer = useCallback(() => {
    setShowTafseerModal(true);
    setSelectedVerseKey(null); 
  }, []);

  const handleOpenTranslation = useCallback(() => {
    setShowTranslationModal(true);
    setSelectedVerseKey(null);
  }, []);

  const { surah: selectedSurahNumber, ayah: selectedAyahNumber } =
    getSurahAndAyah(selectedVerseKey);
  const surahInfo = surahNames.find((s) => s.number === selectedSurahNumber);

  return {
    hoveredVerseKey,
    setHoveredVerseKey,
    selectedVerseKey,
    popoverPosition,
    handleWordClick,
    handleClosePopover,
    handleSaveAyah,
    selectedSurahNumber,
    selectedAyahNumber,
    selectedSurahNameAr: surahInfo?.ar,
    selectedSurahNameEn: surahInfo?.en,
    modalAyahInfo,
    showTafseerModal,
    setShowTafseerModal,
    showTranslationModal,
    setShowTranslationModal,
    handleOpenTafseer,
    handleOpenTranslation,
  };
};