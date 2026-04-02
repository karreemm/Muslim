"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/styles/modules/AudioPlayer.module.css";
import animationStyles from "@/app/styles/modules/Animations.module.css";
import { useLanguage } from "@/context/general/LanguageContext";
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
  faDownload,
  faCheck,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faMusic,
  faSlash,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "@/hooks/general/useTranslation";

import {
  useSurahData,
  useAudioPlayer,
  useSurahDownload,
} from "@/hooks/listenQuran";
import { useQuranAudio } from "@/context/features/QuranAudioContext";

interface SurahAudioPlayerProps {
  reciterId: string;
  surahNumber: number;
  onSurahChange?: (surahNumber: number) => void;
  onAyahChange?: (ayahIndex: number) => void;
  onPlayPause?: (isPlaying: boolean) => void;
  isSidebarExpanded: boolean;
}

const SurahAudioPlayer: React.FC<SurahAudioPlayerProps> = ({
  reciterId,
  surahNumber,
  onSurahChange,
  onAyahChange,
  onPlayPause,
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

  const {
    showProgressBar,
    setShowProgressBar,
    showDetails,
    setShowDetails,
    setCurrentAyahTime,
    setCurrentAyahDuration,
    surahQueue,
    playSurah,
    reciterId: contextReciterId,
  } = useQuranAudio();

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

  useEffect(() => {
    if (onAyahChange) {
      onAyahChange(currentAyahIndex);
    }
  }, [currentAyahIndex, onAyahChange]);

  useEffect(() => {
    if (onPlayPause) {
      onPlayPause(isPlaying);
    }
  }, [isPlaying, onPlayPause]);

  useEffect(() => {
    setCurrentAyahTime(currentTime);
    setCurrentAyahDuration(duration);
  }, [currentTime, duration, setCurrentAyahTime, setCurrentAyahDuration]);

  // Handle sequential playback for Juz/Queue
  useEffect(() => {
    if (!isPlaying && isLastAyah && surahQueue.length > 0) {
      const currentSurahIndex = surahQueue.indexOf(surahNumber);
      if (
        currentSurahIndex !== -1 &&
        currentSurahIndex < surahQueue.length - 1
      ) {
        const nextSurahNumber = surahQueue[currentSurahIndex + 1];
        setTimeout(() => {
          playSurah(nextSurahNumber, contextReciterId, surahQueue);
          if (onSurahChange) onSurahChange(nextSurahNumber);
        }, 1000);
      }
    }
  }, [
    isPlaying,
    isLastAyah,
    surahQueue,
    surahNumber,
    playSurah,
    contextReciterId,
    onSurahChange,
  ]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader
            color={"hsl(var(--primary))"}
            loading={loading}
            size={50}
          />
        </div>
      ) : surah ? (
        <div className="flex flex-col items-center w-full">
          <div>
            <audio ref={audioPlayer} controls className="hidden" />
            <audio ref={nextAudioPlayer} controls className="hidden" />
          </div>

          {/* Sticky Bottom Bar */}
          <div className="w-full h-fit z-[100] bg-[hsl(var(--player-bg))] backdrop-blur-lg border-t border-border/20 shadow-xl px-4 py-4 md:py-6 animate-slide-up transition-all duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-2 md:gap-4">
              {/* Progress Slider Row */}
              {showProgressBar && (
                <div
                  dir="ltr"
                  className="w-full flex justify-between gap-4 items-center px-2"
                >
                  <div className="flex items-center gap-2 mr-2">
                    <div className="relative group">
                      <button
                        onClick={() => setShowProgressBar(false)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={
                          language === "ar"
                            ? "إخفاء شريط التقدم"
                            : "Hide Progress Bar"
                        }
                      >
                        <span className="fa-layers fa-fw">
                          <FontAwesomeIcon icon={faMusic} />
                          <FontAwesomeIcon
                            icon={faSlash}
                            className="text-destructive opacity-70"
                          />
                        </span>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {language === "ar"
                          ? "إخفاء شريط التقدم"
                          : "Hide Progress Bar"}
                      </div>
                    </div>

                    <div className="relative group">
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`${showDetails ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
                      >
                        <FontAwesomeIcon
                          icon={showDetails ? faEye : faEyeSlash}
                        />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {showDetails
                          ? language === "ar"
                            ? "إخفاء التفاصيل"
                            : "Hide Details"
                          : language === "ar"
                            ? "إظهار التفاصيل"
                            : "Show Details"}
                      </div>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-primary min-w-[45px]">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) =>
                      handleSliderChange(parseFloat(e.target.value))
                    }
                    onMouseDown={handleSliderMouseDown}
                    onMouseUp={handleSliderMouseUp}
                    onTouchStart={handleSliderMouseDown}
                    onTouchEnd={handleSliderMouseUp}
                    className={`flex-1 h-2 bg-input rounded-full appearance-none cursor-pointer accent-primary ${styles.audioSlider}`}
                    style={{
                      accentColor: "hsl(var(--player-track-active))",
                      background: "hsl(var(--player-track))",
                    }}
                  />
                  <span className="text-sm font-medium text-primary min-w-[45px]">
                    {formatTime(duration)}
                  </span>
                </div>
              )}

              {/* Controls and Info Row */}
              <div
                className={`flex items-center justify-between ${!showDetails ? "justify-center" : ""}`}
              >
                {!showProgressBar && (
                  <div className="flex items-center gap-4 mr-4">
                    <button
                      onClick={() => setShowProgressBar(true)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title={
                        language === "ar"
                          ? "إظهار شريط التقدم"
                          : "Show Progress Bar"
                      }
                    >
                      <FontAwesomeIcon icon={faMusic} />
                    </button>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className={`${showDetails ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
                    >
                      <FontAwesomeIcon
                        icon={showDetails ? faEye : faEyeSlash}
                      />
                    </button>
                  </div>
                )}

                {showDetails && (
                  <div className="hidden md:flex flex-col items-start gap-1 w-1/4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      {language === "ar" ? "الآية الحالية" : "Current Ayah"}
                    </span>
                    <span className="text-lg font-semibold text-primary">
                      {currentAyahIndex + 1} / {totalAyahs}
                    </span>
                  </div>
                )}

                {showDetails && (
                  <div className="flex md:hidden flex-col items-center justify-center min-w-[48px] gap-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest leading-none">
                      {language === "ar" ? "آية" : "Ayah"}
                    </span>
                    <span className="text-base font-semibold text-primary">
                      {currentAyahIndex + 1}/{totalAyahs}
                    </span>
                  </div>
                )}

                {/* Main Controls */}
                <div
                  dir="ltr"
                  className="flex items-center justify-center gap-2 md:gap-8 flex-1"
                >
                  <button
                    onClick={previous}
                    disabled={isFirstAyah}
                    className={`p-3 rounded-full transition-all flex justify-center items-center hover:scale-110 active:scale-95 ${
                      isFirstAyah
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-primary hover:bg-secondary"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faStepBackward}
                      className="text-xl md:text-2xl"
                    />
                  </button>

                  <button
                    onClick={handleTogglePlayPause}
                    className={`p-5 rounded-full bg-primary text-primary-foreground shadow-lg transition-all transform active:scale-95 flex items-center justify-center h-14 w-14 md:h-16 md:w-16 ${
                      isBuffering
                        ? "cursor-wait ring-2 ring-primary/40"
                        : "hover:shadow-primary/40 hover:bg-primary/90 hover:scale-110"
                    }`}
                    disabled={isDownloading || isBuffering}
                  >
                    {isBuffering ? (
                      <span className="relative flex items-center justify-center w-8 h-8">
                        <span className="absolute inset-0 rounded-full border-2 border-primary-foreground/25" />
                        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-foreground border-r-primary-foreground animate-spin" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-foreground/90 animate-pulse" />
                      </span>
                    ) : (
                      <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className="text-2xl md:text-3xl"
                      />
                    )}
                  </button>

                  <button
                    onClick={next}
                    disabled={isLastAyah}
                    className={`p-3 rounded-full transition-all flex justify-center items-center hover:scale-110 active:scale-95 ${
                      isLastAyah
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-primary hover:bg-secondary"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faStepForward}
                      className="text-xl md:text-2xl"
                    />
                  </button>

                  <button
                    onClick={handleDownload}
                    className={`md:hidden p-3 rounded-full transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                      downloadStatus === "success"
                        ? "text-accent"
                        : downloadStatus === "error"
                          ? "text-destructive"
                          : "text-primary"
                    } ${
                      downloadStatus === "downloading" ||
                      downloadStatus === "success"
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                    disabled={
                      downloadStatus === "downloading" ||
                      downloadStatus === "success"
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
                      className={`text-xl ${downloadStatus === "downloading" ? "animate-bounce" : ""}`}
                    />
                  </button>
                </div>

                {showDetails && (
                  <div className="hidden md:flex w-1/4 justify-end">
                    <button
                      onClick={handleDownload}
                      className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95 ${
                        downloadStatus === "success"
                          ? "bg-accent text-accent-foreground"
                          : downloadStatus === "error"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-primary text-primary-foreground"
                      } ${
                        downloadStatus === "downloading" ||
                        downloadStatus === "success"
                          ? "cursor-not-allowed opacity-90"
                          : "transform hover:scale-105"
                      }`}
                      disabled={
                        downloadStatus === "downloading" ||
                        downloadStatus === "success"
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
                          downloadStatus === "downloading"
                            ? "animate-bounce"
                            : ""
                        }
                      />
                      <span>
                        {downloadStatus === "downloading" &&
                          t("common.downloading")}
                        {downloadStatus === "success" &&
                          t("common.downloadedSuccess")}
                        {downloadStatus === "error" &&
                          t("common.downloadError")}
                        {downloadStatus === "idle" && t("common.download")}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="text-destructive">Error: {error}</p>
      ) : (
        <p>No surah data available...</p>
      )}
    </div>
  );
};
export default SurahAudioPlayer;
