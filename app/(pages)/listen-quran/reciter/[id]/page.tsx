"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
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
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import ShareModal from "@/components/modals/ShareModal";
import { useQuranAudio } from "@/context/QuranAudioContext";
import animationStyles from "@/app/styles/modules/Animations.module.css";

export default function ReciterPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { playSurah } = useQuranAudio();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const {
    reciterId,
    selectedSurah,
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr,
    handleSurahChange: handleReciterSurahChange, // Renamed to avoid conflict
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
    if (selectedSurah && selectedSurah > 1) {
      handleSurahChange(selectedSurah - 1);
    }
  };

  const handleNextSurah = () => {
    if (selectedSurah && selectedSurah < 114) {
      handleSurahChange(selectedSurah + 1);
    }
  };

  const canGoPreviousSurah = selectedSurah ? selectedSurah > 1 : false;
  const canGoNextSurah = selectedSurah ? selectedSurah < 114 : false;

  return (
    <div className="flex flex-1 relative overflow-x-hidden min-h-0">
      <Sidebar
        onSurahSelect={handleSurahChange}
        selectedSurah={selectedSurah}
        isExpanded={isSidebarExpanded}
        onToggle={setIsSidebarExpanded}
      />

      <div
        className={`flex-1 flex flex-col min-h-0 bg-background text-foreground dark:bg-background dark:text-foreground transition-all duration-300 ${
          isSidebarExpanded
            ? language === "en"
              ? "pl-16 md:pl-80"
              : "pr-16 md:pr-80"
            : language === "en"
              ? "pl-16"
              : "pr-16"
        }`}
      >
        <div className="w-full flex-1 overflow-y-auto flex flex-col items-center justify-center gap-5 py-5 px-4">
          <div className="w-full max-w-none md:max-w-4xl flex flex-col items-center gap-5">
            <div className="flex items-center justify-center gap-4 sm:gap-10 w-full px-0 sm:px-5">
              <button
                onClick={handlePreviousSurah}
                disabled={!canGoPreviousSurah}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  canGoPreviousSurah
                    ? "bg-card text-primary shadow-lg hover:shadow-xl hover:-translate-y-1"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
                title={language === "ar" ? "السورة السابقة" : "Previous Surah"}
              >
                <FontAwesomeIcon
                  icon={language === "ar" ? faChevronRight : faChevronLeft}
                  className="text-2xl"
                />
              </button>

              <div className="text-center flex-1 bg-card/80 backdrop-blur-md p-6 rounded-2xl border border-border shadow-xl">
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {language === "ar"
                    ? "سورة " + selectedSurahNameAr
                    : "Surah " + selectedSurahNameEn}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === "ar"
                    ? "فضيلة الشيخ   " + reciterNameAr
                    : "His Eminence Sheikh   " + reciterNameEn}
                </p>
              </div>

              <button
                onClick={handleNextSurah}
                disabled={!canGoNextSurah}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  canGoNextSurah
                    ? "bg-card text-primary shadow-lg hover:shadow-xl hover:-translate-y-1"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                }`}
                title={language === "ar" ? "السورة التالية" : "Next Surah"}
              >
                <FontAwesomeIcon
                  icon={language === "ar" ? faChevronLeft : faChevronRight}
                  className="text-2xl"
                />
              </button>
            </div>

            <div className="flex flex-col items-center gap-5 mt-5">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-3xl">
                  {isFavorite
                    ? t("listenQuran.surahPlayer.saved")
                    : t("listenQuran.surahPlayer.loveIt")}
                </h1>
                <button
                  id={`love-button-${selectedSurah}`}
                  onClick={toggleFavorite}
                  className="text-destructive hover:text-destructive/80"
                >
                  <FontAwesomeIcon
                    icon={isFavorite ? loved : notLoved}
                    className={
                      !isFavorite
                        ? `${animationStyles.vibrate} text-lg md:text-2xl`
                        : "text-lg md:text-2xl"
                    }
                  />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-3xl">
                  {t("listenQuran.surahPlayer.shareIt")}
                </h1>
                <ShareModal
                  size="2xl"
                  url={`https://muslim-one.vercel.app/listen-quran/reciter/${reciterId}?surah=${selectedSurah}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-24 shrink-0" />
      </div>
    </div>
  );
}
