"use client";

import { useLanguage } from "@/context/general/LanguageContext";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {
  useReciterSurahSelection,
  useFavoriteSurahActions,
} from "@/hooks/listenQuran";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faHeart as loved,
  faPlay,
  faPause,
  faMicrophone,
  faShareNodes,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import ShareModal from "@/components/modals/ShareModal";
import { useQuranAudio } from "@/context/features/QuranAudioContext";

export default function ReciterPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { playSurah, isPlaying, surahNumber } = useQuranAudio();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const isArabic = language === "ar";

  const {
    reciterId,
    selectedSurah,
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr,
    handleSurahChange: handleReciterSurahChange,
  } = useReciterSurahSelection();

  useEffect(() => {
    if (reciterId) {
      playSurah(1, reciterId);
    }
  }, [reciterId]);

  const handleSurahChange = (id: number) => {
    handleReciterSurahChange(id);
    playSurah(id, reciterId || undefined);
  };

  const { isFavorite, toggleFavorite } = useFavoriteSurahActions(
    selectedSurah || 1,
    reciterId || "",
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr,
  );

  const handlePreviousSurah = () => {
    if (selectedSurah && selectedSurah > 1)
      handleSurahChange(selectedSurah - 1);
  };

  const handleNextSurah = () => {
    if (selectedSurah && selectedSurah < 114)
      handleSurahChange(selectedSurah + 1);
  };

  const canGoPreviousSurah = selectedSurah ? selectedSurah > 1 : false;
  const canGoNextSurah = selectedSurah ? selectedSurah < 114 : false;
  const isCurrentlyPlaying = isPlaying && surahNumber === selectedSurah;

  return (
    <div className="w-full min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="flex flex-1 relative min-h-screen z-10">
        <Sidebar
          onSurahSelect={handleSurahChange}
          selectedSurah={selectedSurah}
          isExpanded={isSidebarExpanded}
          onToggle={setIsSidebarExpanded}
        />

        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            isSidebarExpanded
              ? isArabic
                ? "pr-16 md:pr-80"
                : "pl-16 md:pl-80"
              : isArabic
                ? "pr-16"
                : "pl-16"
          }`}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
            <div className="w-full max-w-4xl flex flex-col items-center gap-5 sm:gap-8">
              <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
                <button
                  onClick={handlePreviousSurah}
                  disabled={!canGoPreviousSurah}
                  className={`group flex h-10 w-10 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl
                    transition-all duration-300 border-2 ${
                      canGoPreviousSurah
                        ? "bg-card border-border text-primary shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                        : "bg-muted/50 border-transparent text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                  title={isArabic ? "السورة السابقة" : "Previous Surah"}
                >
                  <FontAwesomeIcon
                    icon={isArabic ? faChevronRight : faChevronLeft}
                    className="text-base sm:text-2xl transition-transform group-hover:scale-110"
                  />
                </button>

                <div className="flex-1 text-center bg-card/80 backdrop-blur-xl px-4 py-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/50 shadow-2xl shadow-primary/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 text-primary mb-3 sm:mb-4">
                      <span className="font-bold text-sm sm:text-lg">
                        {selectedSurah}
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2 ">
                      {isArabic
                        ? `سورة ${selectedSurahNameAr}`
                        : `Surah ${selectedSurahNameEn}`}
                    </h1>

                    <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2 sm:mt-4">
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="text-xs sm:text-sm"
                      />
                      <p className="text-sm sm:text-base md:text-lg">
                        {isArabic
                          ? `الشيخ ${reciterNameAr}`
                          : `Sheikh ${reciterNameEn}`}
                      </p>
                    </div>

                    {isCurrentlyPlaying && (
                      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-primary">
                        <div className="flex gap-0.5 items-end h-3 sm:h-4">
                          {[0, 0.1, 0.2, 0.3].map((delay) => (
                            <div
                              key={delay}
                              className="w-0.5 bg-primary animate-pulse rounded-full"
                              style={{
                                height: "100%",
                                animationDelay: `${delay}s`,
                                animationDuration: "0.6s",
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {isArabic ? "جاري التشغيل" : "Now Playing"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextSurah}
                  disabled={!canGoNextSurah}
                  className={`group flex h-10 w-10 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl
                    transition-all duration-300 border-2 ${
                      canGoNextSurah
                        ? "bg-card border-border text-primary shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                        : "bg-muted/50 border-transparent text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                  title={isArabic ? "السورة التالية" : "Next Surah"}
                >
                  <FontAwesomeIcon
                    icon={isArabic ? faChevronLeft : faChevronRight}
                    className="text-base sm:text-2xl transition-transform group-hover:scale-110"
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
                <button
                  onClick={toggleFavorite}
                  className={`group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                    isFavorite
                      ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20"
                      : "bg-card border border-border/50 text-foreground hover:border-destructive/30 hover:bg-destructive/5"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={isFavorite ? loved : notLoved}
                    className={`text-base sm:text-xl transition-transform group-hover:scale-110 ${!isFavorite && "group-hover:text-destructive"}`}
                  />
                  <span className=" whitespace-nowrap">
                    {isFavorite
                      ? t("listenQuran.surahPlayer.saved")
                      : t("listenQuran.surahPlayer.loveIt")}
                  </span>
                </button>

                <ShareModal
                  size="xl"
                  url={`https://muslim-one.vercel.app/listen-quran/reciter/${reciterId}?surah=${selectedSurah}`}
                />
              </div>
            </div>
          </div>

          <div className="h-24 shrink-0" />
        </div>
      </div>
    </div>
  );
}
