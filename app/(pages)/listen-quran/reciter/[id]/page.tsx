"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "../../components/Sidebar";
import SurahPlayer from "./SurahPlayer";
import { useReciterSurahSelection, useFavoriteSurahActions } from "@/hooks/listenQuran";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHeart as loved } from "@fortawesome/free-solid-svg-icons";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import ShareModal from "@/components/modals/ShareModal";
import animationStyles from "@/app/styles/modules/Animations.module.css";

export default function ReciterPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const {
    reciterId,
    selectedSurah,
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr,
    handleSurahChange,
  } = useReciterSurahSelection();

  const { isFavorite, toggleFavorite } = useFavoriteSurahActions(
    selectedSurah || 1,
    reciterId || "",
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr
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
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 relative overflow-x-hidden">
        <Sidebar
          onSurahSelect={handleSurahChange}
          selectedSurah={selectedSurah}
          isExpanded={isSidebarExpanded}
          onToggle={setIsSidebarExpanded}
        />
        <div
          className={`flex-1 min-h-screen flex flex-col items-center gap-5 p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white transition-all duration-300 ${isSidebarExpanded ? (language === "en" ? "md:pl-80" : "md:pr-80") : (language === "en" ? "md:pl-16" : "md:pr-16")
            }`}
        >
          <div className="flex-1 w-full flex flex-col items-center">
            <div className={`scale-75 md:scale-100 w-full flex flex-col flex-1 items-center justify-center ${language === "en" ? "ml-12" : "mr-12"}`}>
              {/* Center Display: Surah Navigation */}
              <div className="flex items-center justify-center gap-10 my-10 w-full max-w-4xl px-5">
                <button
                  onClick={handlePreviousSurah}
                  disabled={!canGoPreviousSurah}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${canGoPreviousSurah
                    ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  title={language === "ar" ? "السورة السابقة" : "Previous Surah"}
                >
                  <FontAwesomeIcon icon={language === "ar" ? faChevronRight : faChevronLeft} className="text-2xl" />
                </button>

                <div className="text-center flex-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                  <h1 className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-400 mb-2">
                    {language === "ar" ? "سورة " + selectedSurahNameAr : "Surah " + selectedSurahNameEn}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {language === "ar" ? "فضيلة الشيخ   " + reciterNameAr : "His Eminence Sheikh   " + reciterNameEn}
                  </p>
                </div>

                <button
                  onClick={handleNextSurah}
                  disabled={!canGoNextSurah}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${canGoNextSurah
                    ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  title={language === "ar" ? "السورة التالية" : "Next Surah"}
                >
                  <FontAwesomeIcon icon={language === "ar" ? faChevronLeft : faChevronRight} className="text-2xl" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-5 mt-5">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl md:text-3xl">
                    {isFavorite ? t("listenQuran.surahPlayer.saved") : t("listenQuran.surahPlayer.loveIt")}
                  </h1>
                  <button
                    id={`love-button-${selectedSurah}`}
                    onClick={toggleFavorite}
                    className="text-red-500 hover:text-red-600"
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
                  <h1 className="text-xl md:text-3xl">{t("listenQuran.surahPlayer.shareIt")}</h1>
                  <ShareModal
                    size="2xl"
                    url={`https://muslim-one.vercel.app/listen-quran/reciter/${reciterId}?surah=${selectedSurah}`}
                  />
                </div>
              </div>
            </div>

            <div
              className={`w-full relative z-20`}
            >
              {reciterId && selectedSurah !== null && (
                <SurahPlayer
                  surahNumber={selectedSurah}
                  reciterId={reciterId}
                  onSurahChange={handleSurahChange}
                  isSidebarExpanded={isSidebarExpanded}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
