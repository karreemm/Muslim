"use client";

import React, { useState } from "react";
import styles from "@/app/styles/modules/AudioPlayer.module.css";
import animationStyles from "@/app/styles/modules/Animations.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { reciters } from "@/constants/recitersData";
import { surahNames } from "@/constants/quranData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import { faHeart as loved } from "@fortawesome/free-solid-svg-icons";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faRedo,
  faDownload,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import ShareModal from "@/components/modals/ShareModal";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "@/hooks/general/useTranslation";

import {
  useSurahData,
  useAudioPlayer,
  useFavoriteSurahActions,
  useSurahDownload,
} from "@/hooks/listenQuran";

interface SurahAudioPlayerProps {
  reciterId: string;
  surahNumber: number;
  onSurahChange?: (surahNumber: number) => void;
}

const SurahAudioPlayer: React.FC<SurahAudioPlayerProps> = ({
  reciterId,
  surahNumber,
  onSurahChange,
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "success" | "error"
  >("idle");

  const selectedSurahNameEn =
    surahNumber <= surahNames.length ? surahNames[surahNumber - 1].en : null;
  const selectedSurahNameAr =
    surahNumber <= surahNames.length ? surahNames[surahNumber - 1].ar : null;

  const reciter = reciters.find((r) => r.id === reciterId);
  const reciterNameEn = reciter?.NameEn || "";
  const reciterNameAr = reciter?.NameAr || "";

  const { surah, loading, error } = useSurahData(surahNumber, reciterId);
  const {
    audioPlayer,
    nextAudioPlayer,
    restart,
    currentAyahIndex,
    totalAyahs,
    next,
    previous,
    isFirstAyah,
    isLastAyah,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    handleSliderChange,
    handleSliderMouseDown,
    handleSliderMouseUp,
    formatTime,
    isBuffering,
  } = useAudioPlayer(surah, reciterId, surahNumber);

  const { isFavorite, toggleFavorite } = useFavoriteSurahActions(
    surahNumber,
    reciterId,
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr
  );
  const { downloadSurah, isDownloading } = useSurahDownload(surah, surahNumber);

  const handleDownload = async () => {
    setDownloadStatus("downloading");
    const result = await downloadSurah();

    if (result.success) {
      setDownloadStatus("success");
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    } else {
      setDownloadStatus("error");
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    }
  };

  const handlePreviousSurah = () => {
    if (surahNumber > 1 && onSurahChange) {
      onSurahChange(surahNumber - 1);
    }
  };

  const handleNextSurah = () => {
    if (surahNumber < 114 && onSurahChange) {
      onSurahChange(surahNumber + 1);
    }
  };

  const handleTogglePlayPause = () => {
    console.log("Button clicked, current isPlaying:", isPlaying);
    togglePlayPause();
  };

  const canGoPreviousSurah = surahNumber > 1;
  const canGoNextSurah = surahNumber < 114;

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
        </div>
      ) : surah ? (
        <div className="flex flex-col items-center gap-3">
          <div>
            <audio ref={audioPlayer} controls className="hidden" />
            <audio ref={nextAudioPlayer} controls className="hidden" />
          </div>

          {/* Enhanced Audio Player Controls */}
          <div className="bg-gray-100 dark:bg-[#2d3748] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 w-full max-w-md">
            {/* Current Ayah Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                {language === "ar" ? "آية" : "Ayah"} {currentAyahIndex + 1}{" "}
                {language === "ar" ? "من" : "of"} {totalAyahs}
              </h3>
            </div>

            {/* Interactive Slider */}
            <div dir="ltr" className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                onMouseDown={handleSliderMouseDown}
                onMouseUp={handleSliderMouseUp}
                onTouchStart={handleSliderMouseDown}
                onTouchEnd={handleSliderMouseUp}
                className={`w-full h-2 bg-gray-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer ${styles.audioSlider}`}
                style={{
                  background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${(currentTime / duration) * 100
                    }%, #d1d5db ${(currentTime / duration) * 100
                    }%, #d1d5db 100%)`,
                }}
              />
            </div>

            {/* Surah Navigation */}
            <div dir="ltr" className="flex items-center justify-between mb-4">
              <button
                onClick={handlePreviousSurah}
                disabled={!canGoPreviousSurah}
                className={`p-2 rounded-lg transition-all flex justify-center items-center ${canGoPreviousSurah
                  ? "bg-emerald-200 dark:bg-teal-900 text-emerald-600 dark:text-teal-400 hover:bg-emerald-300 dark:hover:bg-teal-800"
                  : "bg-gray-300 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                  }`}
                title={language === "ar" ? "السورة السابقة" : "Previous Surah"}
              >
                <FontAwesomeIcon icon={faChevronLeft} className={`text-lg`} />
              </button>

              <div className="text-center flex-1 mx-4">
                <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
                  {language === "ar" ? "سورة" : "Surah"}{" "}
                  {language === "ar"
                    ? selectedSurahNameAr
                    : selectedSurahNameEn}
                </p>
              </div>

              <button
                onClick={handleNextSurah}
                disabled={!canGoNextSurah}
                className={`p-2 rounded-lg transition-all flex justify-center items-center ${canGoNextSurah
                  ? "bg-emerald-200 dark:bg-teal-900 text-emerald-600 dark:text-teal-400 hover:bg-emerald-300 dark:hover:bg-teal-800"
                  : "bg-gray-300 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                  }`}
                title={language === "ar" ? "السورة التالية" : "Next Surah"}
              >
                <FontAwesomeIcon icon={faChevronRight} className={`text-lg`} />
              </button>
            </div>

            {/* Ayah Navigation Controls */}
            <div
              dir="ltr"
              className="flex items-center justify-center gap-4 mb-4"
            >
              <button
                onClick={previous}
                disabled={isFirstAyah}
                className={`p-3 rounded-full transition-all flex justify-center items-center w-10 h-10 ${isFirstAyah
                  ? "bg-gray-300 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-200 dark:bg-teal-900 text-emerald-600 dark:text-teal-400 hover:bg-emerald-300 dark:hover:bg-teal-800"
                  }`}
                title={language === "ar" ? "الآية السابقة" : "Previous Ayah"}
              >
                <FontAwesomeIcon icon={faStepBackward} className={`text-lg`} />
              </button>

              {/* Play/Pause Toggle Button */}
              <button
                onClick={handleTogglePlayPause}
                className={`p-4 rounded-full bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-500 transition-all transform hover:scale-105 flex items-center justify-center h-14 w-14 ${isBuffering ? styles.loadingButton : ""}`}
                title={
                  isPlaying
                    ? language === "ar"
                      ? "إيقاف"
                      : "Pause"
                    : language === "ar"
                      ? "تشغيل"
                      : "Play"
                }
                disabled={isDownloading || isBuffering}
              >
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className="text-2xl"
                />
              </button>

              <button
                onClick={restart}
                className="p-4 rounded-full bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-500 transition-all transform hover:scale-105 flex items-center justify-center h-14 w-14"
                title={language === "ar" ? "إعادة تشغيل" : "Restart"}
                disabled={isDownloading}
              >
                <FontAwesomeIcon icon={faRedo} className="text-2xl" />
              </button>

              <button
                onClick={next}
                disabled={isLastAyah}
                className={`p-3 rounded-full transition-all flex justify-center items-center w-10 h-10 ${isLastAyah
                  ? "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-200 dark:bg-teal-900 text-emerald-600 dark:text-teal-400 hover:bg-emerald-300 dark:hover:bg-teal-800"
                  }`}
                title={language === "ar" ? "الآية التالية" : "Next Ayah"}
              >
                <FontAwesomeIcon icon={faStepForward} className={`text-lg`} />
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${downloadStatus === "success"
                ? "bg-green-600 text-white hover:bg-green-700"
                : downloadStatus === "error"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-500"
                } ${downloadStatus === "downloading" || downloadStatus === "success"
                  ? "cursor-not-allowed opacity-90"
                  : "transform hover:scale-105 cursor-pointer"
                }`}
              disabled={
                downloadStatus === "downloading" || downloadStatus === "success"
              }
            >
              <FontAwesomeIcon
                icon={
                  downloadStatus === "success"
                    ? faCheck
                    : downloadStatus === "error"
                      ? faExclamationTriangle
                      : faDownload
                }
                className={
                  downloadStatus === "downloading" ? "animate-bounce" : ""
                }
              />
              {downloadStatus === "downloading" && t("common.downloading")}
              {downloadStatus === "success" && t("common.downloadedSuccess")}
              {downloadStatus === "error" && t("common.downloadError")}
              {downloadStatus === "idle" && t("common.download")}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <h1 className="text-xl md:text-3xl">
              {isFavorite ? t("listenQuran.surahPlayer.saved") : t("listenQuran.surahPlayer.loveIt")}
            </h1>
            <button
              id={`love-button-${surahNumber}`}
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

          <div className="flex items-center gap-3 mt-5">
            <h1 className="text-xl md:text-3xl">{t("listenQuran.surahPlayer.shareIt")}</h1>

            <ShareModal
              size="2xl"
              url={`https://muslim-one.vercel.app/listen-quran/reciter/${reciterId}?surah=${surahNumber}`}
            />
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <p>No surah data available...</p>
      )}
    </div>
  );
};
export default SurahAudioPlayer;
