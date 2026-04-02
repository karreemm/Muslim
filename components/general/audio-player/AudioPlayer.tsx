"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuranAudio } from "@/context/features/QuranAudioContext";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/general/LanguageContext";
import { reciters } from "@/constants/recitersData";
import { surahNames } from "@/constants/quranData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faDownload,
  faCheck,
  faExclamationTriangle,
  faXmark,
  faMicrophone,
  faArrowUp,
  faEllipsisVertical,
  faChevronLeft,
  faChevronRight,
  faVolumeHigh,
  faVolumeMute,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  useSurahData,
  useAudioPlayer,
  useSurahDownload,
} from "@/hooks/listenQuran";
import PlayerIconButton from "@/components/general/PlayerIconButton";
import { ClipLoader } from "react-spinners";
import styles from "@/app/styles/modules/AudioPlayer.module.css";
import AudioPlayerProgressBar from "@/components/general/audio-player/AudioPlayerProgressBar";
import AudioPlayerReciterDropdown from "@/components/general/audio-player/AudioPlayerReciterDropdown";
import AudioPlayerMobileSheet from "@/components/general/audio-player/AudioPlayerMobileSheet";

type DownloadStatus = "idle" | "downloading" | "success" | "error";

interface AudioPlayerRefs {
  dropdownRef: React.RefObject<HTMLDivElement>;
  micBtnRef: React.RefObject<HTMLButtonElement>;
  mobileSheetRef: React.RefObject<HTMLDivElement>;
  progressRef: React.RefObject<HTMLInputElement>;
}

export const AudioPlayer = () => {
  const {
    surahNumber,
    reciterId,
    isPlayerVisible,
    setIsPlayerVisible,
    setActiveAyahIndex,
    setIsPlaying: setContextIsPlaying,
    setReciterId,
    setCurrentAyahTime,
    setCurrentAyahDuration,
    surahQueue,
    playSurah,
    playTrigger,
    playAyahTrigger,
    requestedAyahIndex,
    triggerScrollToAyah,
  } = useQuranAudio();

  const pathname = usePathname();
  const { language } = useLanguage();
  const isListenPage = pathname.includes("/listen-quran");
  const isReadQuranPage = pathname.includes("/read-quran");

  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "success" | "error"
  >("idle");
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [showReciterSheet, setShowReciterSheet] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const micBtnRef = useRef<HTMLButtonElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const playerRefs: AudioPlayerRefs = {
    dropdownRef,
    micBtnRef,
    mobileSheetRef,
    progressRef,
  };

  if (!isPlayerVisible || !surahNumber || !reciterId) return null;

  return (
    <AudioPlayerInner
      surahNumber={surahNumber}
      reciterId={reciterId}
      language={language}
      isListenPage={isListenPage}
      isReadQuranPage={isReadQuranPage}
      showReciterDropdown={showReciterDropdown}
      setShowReciterDropdown={setShowReciterDropdown}
      showMobileSheet={showMobileSheet}
      setShowMobileSheet={setShowMobileSheet}
      showReciterSheet={showReciterSheet}
      setShowReciterSheet={setShowReciterSheet}
      dropdownRef={playerRefs.dropdownRef}
      micBtnRef={playerRefs.micBtnRef}
      mobileSheetRef={playerRefs.mobileSheetRef}
      progressRef={playerRefs.progressRef}
      downloadStatus={downloadStatus}
      setDownloadStatus={setDownloadStatus}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
      setIsPlayerVisible={setIsPlayerVisible}
      setContextIsPlaying={setContextIsPlaying}
      setActiveAyahIndex={setActiveAyahIndex}
      setReciterId={setReciterId}
      setCurrentAyahTime={setCurrentAyahTime}
      setCurrentAyahDuration={setCurrentAyahDuration}
      surahQueue={surahQueue}
      playSurah={playSurah}
      playTrigger={playTrigger}
      playAyahTrigger={playAyahTrigger}
      requestedAyahIndex={requestedAyahIndex}
      triggerScrollToAyah={triggerScrollToAyah}
    />
  );
};

interface InnerProps {
  surahNumber: number;
  reciterId: string;
  language: string;
  isListenPage: boolean;
  isReadQuranPage: boolean;
  showReciterDropdown: boolean;
  setShowReciterDropdown: (v: boolean) => void;
  showMobileSheet: boolean;
  setShowMobileSheet: (v: boolean) => void;
  showReciterSheet: boolean;
  setShowReciterSheet: (v: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  micBtnRef: React.RefObject<HTMLButtonElement>;
  mobileSheetRef: React.RefObject<HTMLDivElement>;
  progressRef: React.RefObject<HTMLInputElement>;
  downloadStatus: "idle" | "downloading" | "success" | "error";
  setDownloadStatus: (v: "idle" | "downloading" | "success" | "error") => void;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  setIsPlayerVisible: (v: boolean) => void;
  setContextIsPlaying: (v: boolean) => void;
  setActiveAyahIndex: (v: number) => void;
  setReciterId: (v: string) => void;
  setCurrentAyahTime: (v: number) => void;
  setCurrentAyahDuration: (v: number) => void;
  surahQueue: number[];
  playSurah: (
    surahNumber: number,
    reciterId?: string,
    queue?: number[],
  ) => void;
  playTrigger: number;
  playAyahTrigger: number;
  requestedAyahIndex: number | null;
  triggerScrollToAyah: () => void;
}

const AudioPlayerInner: React.FC<InnerProps> = ({
  surahNumber,
  reciterId,
  language,
  isListenPage,
  isReadQuranPage,
  showReciterDropdown,
  setShowReciterDropdown,
  showMobileSheet,
  setShowMobileSheet,
  showReciterSheet,
  setShowReciterSheet,
  dropdownRef,
  micBtnRef,
  mobileSheetRef,
  progressRef,
  downloadStatus,
  setDownloadStatus,
  isMuted,
  setIsMuted,
  setIsPlayerVisible,
  setContextIsPlaying,
  setActiveAyahIndex,
  setReciterId,
  setCurrentAyahTime,
  setCurrentAyahDuration,
  surahQueue,
  playSurah,
  playTrigger,
  playAyahTrigger,
  requestedAyahIndex,
  triggerScrollToAyah,
}) => {
  const { surah, loading } = useSurahData(surahNumber, reciterId);
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
    currentAyahElapsedTime,
    currentAyahTotalDuration,
    playAyah,
    restart,
  } = useAudioPlayer(surah, reciterId, surahNumber);

  const { downloadSurah } = useSurahDownload(surah, surahNumber);

  const surahName =
    surahNumber <= surahNames.length
      ? language === "ar"
        ? surahNames[surahNumber - 1].ar
        : surahNames[surahNumber - 1].en
      : "";
  const currentReciter = reciters.find((r) => r.id === reciterId);
  const reciterName =
    language === "ar" ? currentReciter?.NameAr : currentReciter?.NameEn;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          if (e.shiftKey) previous();
          break;
        case "ArrowRight":
          if (e.shiftKey) next();
          break;
        case "KeyM":
          setIsMuted(!isMuted);
          if (audioPlayer.current) audioPlayer.current.muted = !isMuted;
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, previous, next, isMuted, audioPlayer]);

  useEffect(() => {
    setContextIsPlaying(isPlaying);
  }, [isPlaying, setContextIsPlaying]);

  useEffect(() => {
    setActiveAyahIndex(currentAyahIndex);
    setCurrentAyahTime(currentAyahElapsedTime);
    setCurrentAyahDuration(currentAyahTotalDuration);
  }, [
    currentAyahIndex,
    currentAyahElapsedTime,
    currentAyahTotalDuration,
    setActiveAyahIndex,
    setCurrentAyahTime,
    setCurrentAyahDuration,
  ]);

  const isFirstTrigger = React.useRef(true);
  useEffect(() => {
    if (isFirstTrigger.current) {
      isFirstTrigger.current = false;
      return;
    }
    restart();
  }, [playTrigger]);

  useEffect(() => {
    if (requestedAyahIndex === null || loading || !surah) return;
    if (requestedAyahIndex < 0 || requestedAyahIndex >= surah.ayahs.length)
      return;
    playAyah(requestedAyahIndex);
  }, [playAyahTrigger, requestedAyahIndex, loading, surah]);

  useEffect(() => {
    if (!isPlaying && isLastAyah && surahQueue.length > 0) {
      const idx = surahQueue.indexOf(surahNumber);
      if (idx !== -1 && idx < surahQueue.length - 1) {
        const nextSurah = surahQueue[idx + 1];
        setTimeout(() => playSurah(nextSurah, reciterId, surahQueue), 800);
      }
    }
  }, [isPlaying, isLastAyah, surahQueue, surahNumber, playSurah, reciterId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        micBtnRef.current &&
        !micBtnRef.current.contains(e.target as Node)
      ) {
        setShowReciterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownRef, micBtnRef, setShowReciterDropdown]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        mobileSheetRef.current &&
        !mobileSheetRef.current.contains(e.target as Node)
      ) {
        setShowMobileSheet(false);
        setShowReciterSheet(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileSheetRef]);

  const handleDownload = async () => {
    setDownloadStatus("downloading");
    const result = await downloadSurah();
    setDownloadStatus(result.success ? "success" : "error");
    setTimeout(() => setDownloadStatus("idle"), 3000);
  };

  const progressPercentage =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const handleClose = () => {
    setIsPlayerVisible(false);
    setContextIsPlaying(false);
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.src = "";
    }
    if (nextAudioPlayer.current) {
      nextAudioPlayer.current.pause();
      nextAudioPlayer.current.src = "";
    }
  };

  return (
    <>
      {showMobileSheet && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[199] md:hidden animate-in fade-in duration-200"
          onClick={() => {
            setShowMobileSheet(false);
            setShowReciterSheet(false);
          }}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-background/90 backdrop-blur-2xl border-t border-border/50 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
        <AudioPlayerProgressBar
          progressRef={progressRef}
          currentTime={currentTime}
          duration={duration}
          formatTime={formatTime}
          progressPercentage={progressPercentage}
          onChange={(value) => handleSliderChange(value)}
          onPointerDown={handleSliderMouseDown}
          onPointerUp={handleSliderMouseUp}
          onTouchStart={handleSliderMouseDown}
          onTouchEnd={handleSliderMouseUp}
          onJumpToAyah={triggerScrollToAyah}
        />

        <div className="px-3 sm:px-4 py-2.5">
          <div className="flex md:hidden items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
              <div
                className={`relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 shadow-md ${isPlaying ? "animate-pulse" : ""}`}
              >
                {surahNumber}
                {isPlaying && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-xl">
                    <ClipLoader
                      color="hsl(var(--primary-foreground))"
                      size={16}
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex flex-col justify-center flex-1">
                <h3 className="text-sm font-bold text-foreground truncate leading-tight">
                  {language === "ar"
                    ? `سورة ${surahName}`
                    : `Surah ${surahName}`}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="truncate font-medium">{reciterName}</span>
                </div>
              </div>
            </div>

            <div dir="ltr" className="flex items-center gap-0.5 shrink-0">
              <PlayerIconButton
                onClick={previous}
                disabled={isFirstAyah}
                tooltip={language === "ar" ? "السابق" : "Previous"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFirstAyah ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary"}`}
              >
                <FontAwesomeIcon icon={faStepBackward} className="text-xs" />
              </PlayerIconButton>

              <PlayerIconButton
                tooltip={language === "ar" ? "تشغيل/إيقاف" : "Play/Pause"}
                onClick={togglePlayPause}
                disabled={isBuffering}
                className={`w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 transition-all active:scale-95 ${isBuffering ? "opacity-80" : "hover:scale-105"}`}
              >
                {isBuffering ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin text-sm"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={isPlaying ? faPause : faPlay}
                    className={`text-sm ${!isPlaying ? "ml-0.5" : ""}`}
                  />
                )}
              </PlayerIconButton>

              <PlayerIconButton
                tooltip={language === "ar" ? "التالي" : "Next"}
                onClick={next}
                disabled={isLastAyah}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLastAyah ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary"}`}
              >
                <FontAwesomeIcon icon={faStepForward} className="text-xs" />
              </PlayerIconButton>

              <div className="w-px h-5 bg-border mx-1" />

              <PlayerIconButton
                tooltip={
                  isMuted
                    ? language === "ar"
                      ? "تشغيل الصوت"
                      : "Unmute"
                    : language === "ar"
                      ? "كتم الصوت"
                      : "Mute"
                }
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (audioPlayer.current) audioPlayer.current.muted = !isMuted;
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isMuted ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-primary hover:bg-secondary"}`}
              >
                <FontAwesomeIcon
                  icon={isMuted ? faVolumeMute : faVolumeHigh}
                  className="text-xs"
                />
              </PlayerIconButton>

              <PlayerIconButton
                tooltip={language === "ar" ? "خيارات" : "Options"}
                onClick={() => setShowMobileSheet(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="text-xs"
                />
              </PlayerIconButton>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-md ${isPlaying ? "animate-pulse" : ""}`}
              >
                {surahNumber}
                {isPlaying && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-xl">
                    <ClipLoader
                      color="hsl(var(--primary-foreground))"
                      size={18}
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex flex-col justify-center">
                <h3 className="text-base font-bold text-foreground truncate leading-tight">
                  {language === "ar"
                    ? `سورة ${surahName}`
                    : `Surah ${surahName}`}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="truncate font-medium">{reciterName}</span>
                  <span className="text-border">|</span>
                  <span className="tabular-nums bg-muted px-2 py-0.5 rounded-full">
                    {currentAyahIndex + 1}/{totalAyahs}
                  </span>
                </div>
              </div>
            </div>

            <div
              dir="ltr"
              className="flex items-center gap-2 shrink-0 mx-auto absolute left-1/2 -translate-x-1/2"
            >
              <PlayerIconButton
                onClick={previous}
                disabled={isFirstAyah}
                tooltip={language === "ar" ? "السابق" : "Previous"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isFirstAyah ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary hover:scale-110 active:scale-95"}`}
              >
                <FontAwesomeIcon icon={faStepBackward} className="text-sm" />
              </PlayerIconButton>

              <PlayerIconButton
                onClick={togglePlayPause}
                disabled={isBuffering}
                tooltip={
                  isPlaying
                    ? language === "ar"
                      ? "إيقاف"
                      : "Pause"
                    : language === "ar"
                      ? "تشغيل"
                      : "Play"
                }
                className={`w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-200 active:scale-95 ${isBuffering ? "opacity-80 cursor-wait" : "hover:scale-105 hover:shadow-primary/40"}`}
              >
                {isBuffering ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin text-base"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={isPlaying ? faPause : faPlay}
                    className={`text-base ${!isPlaying ? "ml-0.5" : ""}`}
                  />
                )}
              </PlayerIconButton>

              <PlayerIconButton
                onClick={next}
                disabled={isLastAyah}
                tooltip={language === "ar" ? "التالي" : "Next"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isLastAyah ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary hover:scale-110 active:scale-95"}`}
              >
                <FontAwesomeIcon icon={faStepForward} className="text-sm" />
              </PlayerIconButton>
            </div>

            <div className="flex items-center gap-1 flex-1 justify-end">
              {isReadQuranPage && (
                <PlayerIconButton
                  onClick={triggerScrollToAyah}
                  tooltip={language === "ar" ? "انتقال للآية" : "Jump to Ayah"}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
                </PlayerIconButton>
              )}

              <PlayerIconButton
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (audioPlayer.current) audioPlayer.current.muted = !isMuted;
                }}
                tooltip={
                  isMuted
                    ? language === "ar"
                      ? "إلغاء الكتم"
                      : "Unmute"
                    : language === "ar"
                      ? "كتم الصوت"
                      : "Mute"
                }
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isMuted ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-primary hover:bg-secondary hover:scale-110"}`}
              >
                <FontAwesomeIcon
                  icon={isMuted ? faVolumeMute : faVolumeHigh}
                  className="text-sm"
                />
              </PlayerIconButton>

              <PlayerIconButton
                onClick={handleDownload}
                disabled={
                  downloadStatus === "downloading" ||
                  downloadStatus === "success"
                }
                tooltip={language === "ar" ? "تنزيل السورة" : "Download Surah"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${downloadStatus === "success" ? "text-green-500 bg-green-500/10" : downloadStatus === "error" ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-primary hover:bg-secondary hover:scale-110"}`}
              >
                <FontAwesomeIcon
                  icon={
                    downloadStatus === "success"
                      ? faCheck
                      : downloadStatus === "error"
                        ? faExclamationTriangle
                        : faDownload
                  }
                  className={`text-sm ${downloadStatus === "downloading" ? "animate-bounce" : ""}`}
                />
              </PlayerIconButton>

              <AudioPlayerReciterDropdown
                language={language}
                reciterId={reciterId}
                isListenPage={isListenPage}
                showReciterDropdown={showReciterDropdown}
                setShowReciterDropdown={setShowReciterDropdown}
                setReciterId={setReciterId}
                dropdownRef={dropdownRef}
                micBtnRef={micBtnRef}
              />

              {!isListenPage && (
                <PlayerIconButton
                  onClick={handleClose}
                  tooltip={language === "ar" ? "إغلاق" : "Close"}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:rotate-90 ml-1"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-base" />
                </PlayerIconButton>
              )}
            </div>
          </div>
        </div>

        <audio ref={audioPlayer} className="hidden" muted={isMuted} />
        <audio ref={nextAudioPlayer} className="hidden" muted={isMuted} />
      </div>

      <AudioPlayerMobileSheet
        language={language}
        isListenPage={isListenPage}
        isReadQuranPage={isReadQuranPage}
        reciterId={reciterId}
        showMobileSheet={showMobileSheet}
        setShowMobileSheet={setShowMobileSheet}
        showReciterSheet={showReciterSheet}
        setShowReciterSheet={setShowReciterSheet}
        setReciterId={setReciterId}
        mobileSheetRef={mobileSheetRef}
        surahNumber={surahNumber}
        surahName={surahName}
        reciterName={reciterName}
        currentAyahIndex={currentAyahIndex}
        totalAyahs={totalAyahs}
        downloadStatus={downloadStatus}
        onJumpToAyah={triggerScrollToAyah}
        onDownload={handleDownload}
        onClose={handleClose}
      />
    </>
  );
};
