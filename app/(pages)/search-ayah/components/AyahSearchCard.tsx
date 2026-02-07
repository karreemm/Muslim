"use client";
import React, { useState, useCallback, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faBook,
  faLanguage,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { TafseerModal } from "@/components/modals/TafseerModal";
import { TranslationModal } from "@/components/modals/TranslationModal";
import type { SearchAyah } from "../service/GetSearchAyah";
import { reciters } from "@/constants/recitersData";
import animationStyles from "@/app/styles/modules/Animations.module.css";
import { useTheme } from "@/context/ThemeContext";
import { highlightText } from "@/utils/highlightText";

interface AyahSearchCardProps {
  ayah: SearchAyah;
  highlightKeyword?: string;
}

export const AyahSearchCard: React.FC<AyahSearchCardProps> = memo(
  ({ ayah, highlightKeyword }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [selectedReciter, setSelectedReciter] =
      useState<string>("ar.alafasy");
    const [showReciterMenu, setShowReciterMenu] = useState(false);
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTafseerModal, setShowTafseerModal] = useState(false);
    const [showTranslationModal, setShowTranslationModal] = useState(false);

    const handleListenClick = useCallback(async () => {
      if (isPlaying && audioRef) {
        audioRef.pause();
        setIsPlaying(false);
        return;
      }

      setIsLoadingAudio(true);

      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${ayah.surah.number}/${selectedReciter}`,
        );

        if (!response.ok) {
          console.error("Failed to fetch surah data");
          setIsLoadingAudio(false);
          return;
        }

        const data = await response.json();
        const ayahData = data.data.ayahs.find(
          (a: any) => a.numberInSurah === ayah.numberInSurah,
        );

        if (!ayahData || !ayahData.audio) {
          console.error("Audio URL not found for this ayah");
          setIsLoadingAudio(false);
          return;
        }

        const audio = new Audio(ayahData.audio);

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onerror = () => {
          console.error("Error playing audio");
          setIsPlaying(false);
          setIsLoadingAudio(false);
        };

        audio.onloadeddata = () => {
          setIsLoadingAudio(false);
        };

        setAudioRef(audio);
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing ayah audio:", error);
        setIsLoadingAudio(false);
      }
    }, [
      isPlaying,
      audioRef,
      ayah.surah.number,
      ayah.numberInSurah,
      selectedReciter,
    ]);

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

    React.useEffect(() => {
      if (typeof window !== "undefined") {
        const savedReciter = localStorage.getItem("preferredReciter");
        if (savedReciter) {
          setSelectedReciter(savedReciter);
        }
      }
    }, []);

    React.useEffect(() => {
      return () => {
        if (audioRef) {
          audioRef.pause();
          audioRef.src = "";
        }
      };
    }, [audioRef]);

    const selectedReciterData = reciters.find((r) => r.id === selectedReciter);
    const reciterName = selectedReciterData
      ? language === "ar"
        ? selectedReciterData.NameAr
        : selectedReciterData.NameEn
      : "";

    return (
      <>
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-transparent hover:border-teal-600 dark:hover:border-teal-500 transition-all duration-300 p-5"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-semibold dynamic-font text-[#134B70] dark:text-white">
                {language === "ar"
                  ? `${ayah.surah.name}`
                  : ayah.surah.englishName}
              </h3>
              <p className="text-sm mt-1 opacity-70">
                {language === "ar"
                  ? `الآية ${ayah.numberInSurah}`
                  : `Ayah ${ayah.numberInSurah}`}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-teal-600 text-white">
              {t("searchAyah.page")} {ayah.page}
            </div>
          </div>

          <div className="mb-5">
            <p
              className="text-2xl leading-loose dynamic-font text-[#134B70] dark:text-white"
              dir="rtl"
            >
              {highlightKeyword
                ? highlightText({
                    text: ayah.text,
                    keyword: highlightKeyword,
                    isDarkMode: theme,
                  })
                : ayah.text}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleListenClick}
              disabled={isLoadingAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:cursor-pointer ${
                isPlaying
                  ? "bg-teal-600 text-white"
                  : "bg-[#FFF5E4] dark:bg-slate-700 text-[#134B70] dark:text-white hover:bg-teal-600 hover:text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FontAwesomeIcon
                icon={isLoadingAudio ? faSpinner : faHeadphones}
                className={isLoadingAudio ? "animate-spin" : ""}
              />
              <span className="dynamic-font text-sm">
                {isLoadingAudio ? t("common.loading") : t("searchAyah.listen")}
              </span>
              {isPlaying && (
                <div className={animationStyles.soundWave}>
                  <div
                    className={animationStyles.waveBar}
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className={animationStyles.waveBar}
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className={animationStyles.waveBar}
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              )}
            </button>

            <button
              onClick={() => setShowTafseerModal(true)}
              className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-lg transition-all bg-[#FFF5E4] dark:bg-slate-700 text-[#134B70] dark:text-white hover:bg-teal-600 hover:text-white"
            >
              <FontAwesomeIcon icon={faBook} />
              <span className="dynamic-font text-sm">
                {t("searchAyah.tafseer")}
              </span>
            </button>

            <button
              onClick={() => setShowTranslationModal(true)}
              className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-lg transition-all bg-[#FFF5E4] dark:bg-slate-700 text-[#134B70] dark:text-white hover:bg-teal-600 hover:text-white"
            >
              <FontAwesomeIcon icon={faLanguage} />
              <span className="dynamic-font text-sm">
                {t("searchAyah.translation")}
              </span>
            </button>

            <div
              className={`relative ${language === "ar" ? "md:mr-auto" : "md:ml-auto"}`}
            >
              <button
                onClick={() => setShowReciterMenu(!showReciterMenu)}
                className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 rounded-lg transition-all bg-[#FFF5E4] dark:bg-slate-700 text-[#134B70] dark:text-white hover:bg-teal-600 hover:text-white"
              >
                <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                <span className="dynamic-font text-sm">{reciterName}</span>
              </button>

              {showReciterMenu && (
                <div
                  className={`absolute ${
                    language === "ar" ? "left-0" : "right-0"
                  } bottom-full mb-2 w-64 rounded-lg shadow-xl border max-h-64 overflow-y-auto z-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600`}
                >
                  {reciters.map((reciter) => (
                    <button
                      key={reciter.id}
                      onClick={() => handleReciterChange(reciter.id)}
                      className={`w-full px-4 py-2 text-start transition-colors hover:bg-[#FFF5E4] dark:hover:bg-slate-700 ${
                        selectedReciter === reciter.id
                          ? "bg-[#FFF5E4] dark:bg-slate-700"
                          : ""
                      }`}
                    >
                      <div className="dynamic-font text-sm text-[#134B70] dark:text-white">
                        {language === "ar" ? reciter.NameAr : reciter.NameEn}
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
