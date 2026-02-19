"use client";

import { useState, useCallback, useEffect } from "react";
import { reciters } from "@/constants/recitersData";
import { useLanguage } from "@/context/LanguageContext";

export const useAyahAudio = (
  surahNumber: number,
  ayahNumber: number,
  isOpen: boolean,
) => {
  const { language } = useLanguage();
  const [selectedReciter, setSelectedReciter] = useState<string>("ar.alafasy");
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReciter = localStorage.getItem("preferredReciter");
      if (savedReciter) {
        setSelectedReciter(savedReciter);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = "";
      }
    };
  }, [audioRef]);

  useEffect(() => {
    if (!isOpen) {
      setShowReciterMenu(false);
      setIsPlaying(false);
      setIsLoadingAudio(false);
      if (audioRef) {
        audioRef.pause();
        audioRef.src = "";
      }
    }
  }, [isOpen, audioRef]);

  const handleListenClick = useCallback(async () => {
    if (isPlaying && audioRef) {
      audioRef.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedReciter}`,
      );

      if (!response.ok) {
        console.error("Failed to fetch surah data");
        setIsLoadingAudio(false);
        return;
      }

      const data = await response.json();
      const ayahData = data.data.ayahs.find(
        (a: any) => a.numberInSurah === ayahNumber,
      );

      if (!ayahData?.audio) {
        console.error("Audio URL not found for this ayah");
        setIsLoadingAudio(false);
        return;
      }

      const audio = new Audio(ayahData.audio);

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error("Error playing audio");
        setIsPlaying(false);
        setIsLoadingAudio(false);
      };
      audio.onloadeddata = () => setIsLoadingAudio(false);

      setAudioRef(audio);
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing ayah audio:", error);
      setIsLoadingAudio(false);
    }
  }, [isPlaying, audioRef, surahNumber, selectedReciter, ayahNumber]);

  const handleReciterChange = useCallback(
    (reciterId: string) => {
      setSelectedReciter(reciterId);
      setShowReciterMenu(false);

      if (typeof window !== "undefined") {
        localStorage.setItem("preferredReciter", reciterId);
      }

      if (audioRef && isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      }
    },
    [audioRef, isPlaying],
  );

  const selectedReciterData = reciters.find((r) => r.id === selectedReciter);
  const reciterName = selectedReciterData
    ? language === "ar"
      ? selectedReciterData.NameAr
      : selectedReciterData.NameEn
    : "";

  return {
    selectedReciter,
    showReciterMenu,
    setShowReciterMenu,
    isPlaying,
    isLoadingAudio,
    handleListenClick,
    handleReciterChange,
    reciterName,
  };
};
