"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSavedAyahs } from "../../context/SavedAyahsContext";
import { toArabicNumber } from "../../utils/helpers";
import { surahNames } from "../../constants/quranData";

interface AyahInteractionState {
  ayahNumber: number;
  isOpen: boolean;
}

interface AyahData {
  text: string;
  numberInSurah: number;
  surah?: {
    number: number;
  };
}

interface SavedAyahData {
  surahNameEn: string | undefined;
  surahNameAr: string | undefined;
  ayahNumberAr: number | string | null;
  text: string;
  ayahNumberEn: number | null;
  SurahNumber: number | string | null;
}

export const useAyahInteraction = () => {
  const { saveAyah } = useSavedAyahs();
  const [showPopover, setShowPopover] = useState<AyahInteractionState>({
    ayahNumber: 0,
    isOpen: false,
  });

  const [ayahNumberEn, setAyahNumberEn] = useState<number | null>(null);
  const [ayahNumberAr, setAyahNumberAr] = useState<number | string | null>(
    null,
  );
  const [surahNumber, setSurahNumber] = useState<number | string | null>(null);
  const [surahNameAr, setSurahNameAr] = useState<string | undefined>(undefined);
  const [surahNameEn, setSurahNameEn] = useState<string | undefined>(undefined);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleAyahClick = useCallback(
    (
      ayah: AyahData,
      providedSurahNameAr?: string,
      providedSurahNameEn?: string,
      providedSurahNumber?: number | string,
    ) => {
      console.log("Ayah clicked:", ayah.numberInSurah);
      setShowPopover({ ayahNumber: ayah.numberInSurah, isOpen: true });
      setAyahNumberEn(ayah.numberInSurah);
      setAyahNumberAr(toArabicNumber(ayah.numberInSurah));

      if (providedSurahNumber && providedSurahNameAr && providedSurahNameEn) {
        setSurahNumber(providedSurahNumber);
        setSurahNameAr(providedSurahNameAr);
        setSurahNameEn(providedSurahNameEn);
      } else if (ayah.surah?.number) {
        setSurahNumber(ayah.surah.number);
        const surah = surahNames.find((s) => s.number === ayah.surah!.number);
        if (surah) {
          setSurahNameAr(surah.ar);
          setSurahNameEn(surah.en);
        }
      }
    },
    [],
  );

  const handleSaveAyah = useCallback(
    (
      ayah: AyahData,
      providedSurahNameEn?: string,
      providedSurahNameAr?: string,
      providedSurahNumber?: number | string,
    ) => {
      console.log("handleSaveAyah called");
      console.log("Saving Ayah with the following details:");
      console.log("Surah Name (EN):", providedSurahNameEn || surahNameEn);
      console.log("Surah Name (AR):", providedSurahNameAr || surahNameAr);
      console.log("Ayah Number (EN):", ayah.numberInSurah);
      console.log("Surah Number:", providedSurahNumber || surahNumber);
      console.log("Ayah Text:", ayah.text);

      const savedAyahData: SavedAyahData = {
        surahNameEn: providedSurahNameEn || surahNameEn,
        surahNameAr: providedSurahNameAr || surahNameAr,
        ayahNumberAr: toArabicNumber(ayah.numberInSurah),
        text: ayah.text,
        ayahNumberEn: ayah.numberInSurah,
        SurahNumber: providedSurahNumber || surahNumber,
      };

      saveAyah(savedAyahData);
      console.log("Ayah saved:", ayah.text);
      setShowPopover({ ayahNumber: 0, isOpen: false });
    },
    [surahNameEn, surahNameAr, surahNumber, saveAyah],
  );

  const handleClosePopover = useCallback((event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setShowPopover({ ayahNumber: 0, isOpen: false });
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setShowPopover({ ayahNumber: 0, isOpen: false });
    }
  }, []);

  useEffect(() => {
    if (showPopover.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover.isOpen, handleClickOutside]);

  return {
    showPopover,
    popoverRef,
    handleAyahClick,
    handleSaveAyah,
    handleClosePopover,
    ayahNumberEn,
    ayahNumberAr,
    surahNumber,
    surahNameAr,
    surahNameEn,
  };
};
