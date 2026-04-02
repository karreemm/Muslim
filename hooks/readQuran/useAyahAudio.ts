"use client";

import { useCallback, useMemo } from "react";
import { useQuranAudio } from "@/context/features/QuranAudioContext";

export const useAyahAudio = (
  surahNumber: number,
  ayahNumber: number,
  onAfterListen?: () => void,
) => {
  const {
    playSurahAyah,
    isPlayerVisible,
    isPlaying,
    activeAyahIndex,
    surahNumber: playingSurahNumber,
  } = useQuranAudio();

  const isTargetAyahPlaying = useMemo(
    () =>
      isPlayerVisible &&
      isPlaying &&
      playingSurahNumber === surahNumber &&
      activeAyahIndex === ayahNumber - 1,
    [
      isPlayerVisible,
      isPlaying,
      playingSurahNumber,
      surahNumber,
      activeAyahIndex,
      ayahNumber,
    ],
  );

  const handleListenClick = useCallback(() => {
    playSurahAyah(surahNumber, ayahNumber - 1);
    onAfterListen?.();
  }, [playSurahAyah, surahNumber, ayahNumber, onAfterListen]);

  return {
    isPlaying: isTargetAyahPlaying,
    isLoadingAudio: false,
    handleListenClick,
  };
};
