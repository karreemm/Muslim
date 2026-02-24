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
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "@/hooks/general/useTranslation";

import {
  useSurahData,
  useAudioPlayer,
  useSurahDownload,
} from "@/hooks/listenQuran";

interface SurahAudioPlayerProps {
  reciterId: string;
  surahNumber: number;
  onSurahChange?: (surahNumber: number) => void;
  isSidebarExpanded: boolean;
}

const SurahAudioPlayer: React.FC<SurahAudioPlayerProps> = ({
  reciterId,
  surahNumber,
  onSurahChange,
  isSidebarExpanded,
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

  const handleTogglePlayPause = () => {
    console.log("Button clicked, current isPlaying:", isPlaying);
    togglePlayPause();
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
        </div>
      ) : surah ? (
        <div className="flex flex-col items-center w-full">
          <div>
            <audio ref={audioPlayer} controls className="hidden" />
            <audio ref={nextAudioPlayer} controls className="hidden" />
          </div>

          {/* Sticky Bottom Bar */}
          <div
            className="w-full mb-8 z-[100] bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-t border-teal-600/20 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-4 py-4 md:py-6 animate-slide-up transition-all duration-300"
          >
            <div className="max-w-[1500px] mx-auto flex flex-col gap-2 md:gap-4">

              {/* Progress Slider */}
              <div dir="ltr" className="w-full flex justify-between gap-4 items-center px-2">
                <span className="text-sm font-medium text-teal-600 dark:text-teal-400">{formatTime(currentTime)}</span>
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
                  className={`flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-600 ${styles.audioSlider}`}
                  style={{
                    background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <span className="text-sm font-medium text-teal-600 dark:text-teal-400">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between">
                {/* Ayah Info — md+ only, left side */}
                <div className="hidden md:flex flex-col items-start gap-1 w-1/4">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                    {language === "ar" ? "الآية الحالية" : "Current Ayah"}
                  </span>
                  <span className="text-lg font-semibold text-teal-700 dark:text-white">
                    {currentAyahIndex + 1} / {totalAyahs}
                  </span>
                </div>

                {/* Mobile only: ayah index on the left */}
                <div className="flex md:hidden flex-col items-center justify-center min-w-[48px] gap-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">
                    {language === "ar" ? "آية" : "Ayah"}
                  </span>
                  <span className="text-base font-semibold text-teal-700 dark:text-white">
                    {currentAyahIndex + 1}/{totalAyahs}
                  </span>
                </div>

                {/* Main Controls */}
                <div dir="ltr" className="flex items-center justify-center gap-2 md:gap-8 flex-1">
                  <button
                    onClick={previous}
                    disabled={isFirstAyah}
                    className={`p-3 rounded-full transition-all flex justify-center items-center hover:scale-110 active:scale-95 ${isFirstAyah
                      ? "text-gray-300 dark:text-slate-700 cursor-not-allowed"
                      : "text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                      }`}
                  >
                    <FontAwesomeIcon icon={faStepBackward} className="text-xl md:text-2xl" />
                  </button>

                  <button
                    onClick={handleTogglePlayPause}
                    className={`p-5 rounded-full bg-teal-600 text-white shadow-lg hover:shadow-teal-500/40 hover:bg-teal-500 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center h-14 w-14 md:h-16 md:w-16 ${isBuffering ? styles.loadingButton : ""}`}
                    disabled={isDownloading || isBuffering}
                  >
                    <FontAwesomeIcon
                      icon={isPlaying ? faPause : faPlay}
                      className="text-2xl md:text-3xl"
                    />
                  </button>

                  <button
                    onClick={restart}
                    className="p-3 rounded-full text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                    disabled={isDownloading}
                  >
                    <FontAwesomeIcon icon={faRedo} className="text-xl md:text-2xl" />
                  </button>

                  <button
                    onClick={next}
                    disabled={isLastAyah}
                    className={`p-3 rounded-full transition-all flex justify-center items-center hover:scale-110 active:scale-95 ${isLastAyah
                      ? "text-gray-300 dark:text-slate-700 cursor-not-allowed"
                      : "text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                      }`}
                  >
                    <FontAwesomeIcon icon={faStepForward} className="text-xl md:text-2xl" />
                  </button>

                  {/* Download icon — mobile only, inline with controls, no background */}
                  <button
                    onClick={handleDownload}
                    className={`md:hidden p-3 rounded-full transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                      downloadStatus === "success"
                        ? "text-green-500"
                        : downloadStatus === "error"
                          ? "text-red-500"
                          : "text-teal-600 dark:text-teal-400"
                    } ${
                      downloadStatus === "downloading" || downloadStatus === "success"
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                    disabled={downloadStatus === "downloading" || downloadStatus === "success"}
                  >
                    <FontAwesomeIcon
                      icon={downloadStatus === "success" ? faCheck : downloadStatus === "error" ? faExclamationTriangle : faDownload}
                      className={`text-xl ${downloadStatus === "downloading" ? "animate-bounce" : ""}`}
                    />
                  </button>
                </div>

                {/* Download Button — md+ with full pill styling */}
                <div className="hidden md:flex w-1/4 justify-end">
                  <button
                    onClick={handleDownload}
                    className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95 ${downloadStatus === "success"
                      ? "bg-green-500 text-white"
                      : downloadStatus === "error"
                        ? "bg-red-500 text-white"
                        : "bg-teal-600 text-white"
                      } ${downloadStatus === "downloading" || downloadStatus === "success"
                        ? "cursor-not-allowed opacity-90"
                        : "transform hover:scale-105"
                      }`}
                    disabled={downloadStatus === "downloading" || downloadStatus === "success"}
                  >
                    <FontAwesomeIcon
                      icon={downloadStatus === "success" ? faCheck : (downloadStatus === "error" ? faExclamationTriangle : faDownload)}
                      className={downloadStatus === "downloading" ? "animate-bounce" : ""}
                    />
                    <span>
                      {downloadStatus === "downloading" && t("common.downloading")}
                      {downloadStatus === "success" && t("common.downloadedSuccess")}
                      {downloadStatus === "error" && t("common.downloadError")}
                      {downloadStatus === "idle" && t("common.download")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
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
