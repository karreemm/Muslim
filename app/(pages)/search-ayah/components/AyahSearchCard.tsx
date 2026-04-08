"use client";

import React, { useState, useCallback, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faBook,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { TafseerModal } from "@/components/modals/TafseerModal";
import { TranslationModal } from "@/components/modals/TranslationModal";
import type { SearchAyah } from "../types";
import { reciters } from "@/constants/recitersData";
import { useTheme } from "@/context/general/ThemeContext";
import { highlightText } from "./highlightText";
import { useQuranAudio } from "@/context/features/QuranAudioContext";
import AudioPlayerReciterDropdown from "@/components/general/audio-player/AudioPlayerReciterDropdown";

interface AyahSearchCardProps {
  ayah: SearchAyah;
  highlightKeyword?: string;
}

export const AyahSearchCard: React.FC<AyahSearchCardProps> = memo(
  ({ ayah, highlightKeyword }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isArabic = language === "ar";
    const isDark = theme === "dark";
    const {
      playSurahAyah,
      setReciterId,
      surahNumber,
      activeAyahIndex,
      isPlaying,
      isPlayerVisible,
    } = useQuranAudio();

    const [selectedReciter, setSelectedReciter] =
      useState<string>("ar.alafasy");
    const [showReciterMenu, setShowReciterMenu] = useState(false);
    const [showTafseerModal, setShowTafseerModal] = useState(false);
    const [showTranslationModal, setShowTranslationModal] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    const isCurrentAyahPlaying =
      isPlayerVisible &&
      isPlaying &&
      surahNumber === ayah.surah.number &&
      activeAyahIndex === ayah.numberInSurah - 1;

    const handleListenClick = useCallback(() => {
      setReciterId(selectedReciter);
      localStorage.setItem("preferredReciter", selectedReciter);
      playSurahAyah(
        ayah.surah.number,
        ayah.numberInSurah - 1,
        selectedReciter,
        [],
        true,
      );
    }, [
      ayah.numberInSurah,
      ayah.surah.number,
      playSurahAyah,
      selectedReciter,
      setReciterId,
    ]);

    const handleReciterChange = useCallback(
      (reciterId: string) => {
        setSelectedReciter(reciterId);
        setShowReciterMenu(false);
        setReciterId(reciterId);
        localStorage.setItem("preferredReciter", reciterId);
      },
      [setReciterId],
    );

    React.useEffect(() => {
      const saved = localStorage.getItem("preferredReciter");
      if (saved) setSelectedReciter(saved);
    }, []);

    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setShowReciterMenu(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selectedReciterData = reciters.find((r) => r.id === selectedReciter);
    const reciterName = selectedReciterData
      ? isArabic
        ? selectedReciterData.NameAr
        : selectedReciterData.NameEn
      : "";

    return (
      <>
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="group relative overflow-visible rounded-2xl border border-border bg-card/70 backdrop-blur-sm 
            shadow-lg shadow-primary/5 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 
            hover:border-primary/30 hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="font-bold text-sm">{ayah.surah.number}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground  group-hover:text-primary transition-colors">
                    {isArabic ? ayah.surah.name : ayah.surah.englishName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isArabic
                      ? `الآية ${ayah.numberInSurah}`
                      : `Ayah ${ayah.numberInSurah}`}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-secondary/50 text-secondary-foreground border border-border/30">
                {t("searchAyah.page")} {ayah.page}
              </div>
            </div>

            <div className="mb-6">
              <p
                className="text-2xl leading-loose text-foreground text-center  font-medium"
                dir="rtl"
              >
                {ayah.matchIntervals && ayah.matchIntervals.length > 0
                  ? highlightText({
                    text: ayah.text,
                    matchIntervals: ayah.matchIntervals,
                  })
                  : ayah.text}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleListenClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${isCurrentAyahPlaying
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary/50 text-foreground hover:bg-primary hover:text-primary-foreground border border-border/30 hover:border-primary/30"
                  }`}
              >
                <FontAwesomeIcon icon={faHeadphones} />
                <span>{t("searchAyah.listen")}</span>
                {isCurrentAyahPlaying && (
                  <div className="flex gap-0.5 items-end h-3 ml-1">
                    {[0, 0.1, 0.2].map((delay) => (
                      <div
                        key={delay}
                        className="w-0.5 bg-current rounded-full animate-pulse"
                        style={{
                          height: "100%",
                          animationDelay: `${delay}s`,
                          animationDuration: "0.5s",
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>

              <button
                onClick={() => setShowTafseerModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-secondary/50 text-foreground 
                  border border-border/30 hover:border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <FontAwesomeIcon icon={faBook} />
                <span>{t("searchAyah.tafseer")}</span>
              </button>

              <button
                onClick={() => setShowTranslationModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-secondary/50 text-foreground 
                  border border-border/30 hover:border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <FontAwesomeIcon icon={faLanguage} />
                <span>{t("searchAyah.translation")}</span>
              </button>

              <div
                className={`relative ${isArabic ? "lg:mr-auto" : "lg:ml-auto"}`}
              >
                <AudioPlayerReciterDropdown
                  language={language}
                  reciterId={selectedReciter}
                  showReciterDropdown={showReciterMenu}
                  setShowReciterDropdown={setShowReciterMenu}
                  onReciterChange={handleReciterChange}
                  dropdownRef={dropdownRef}
                  micBtnRef={triggerRef}
                  triggerVariant="label"
                  reciterName={reciterName}
                  align={isArabic ? "start" : "end"}
                />
              </div>
            </div>
          </div>
        </div>

        <TafseerModal
          isOpen={showTafseerModal}
          onClose={() => setShowTafseerModal(false)}
          surahNumber={ayah.surah.number}
          ayahNumber={ayah.numberInSurah}
          surahNameAr={ayah.surah.name}
          surahNameEn={ayah.surah.englishName}
        />

        <TranslationModal
          isOpen={showTranslationModal}
          onClose={() => setShowTranslationModal(false)}
          surahNumber={ayah.surah.number}
          ayahNumber={ayah.numberInSurah}
          surahNameAr={ayah.surah.name}
          surahNameEn={ayah.surah.englishName}
        />
      </>
    );
  },
);

AyahSearchCard.displayName = "AyahSearchCard";
