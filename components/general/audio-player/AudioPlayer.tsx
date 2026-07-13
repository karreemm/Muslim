"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuranAudio } from "@/context/features/QuranAudioContext";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/general/LanguageContext";
import { reciters } from "@/constants/recitersData";
import { surahNames } from "@/constants/quranData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SkipIcon from "@/components/general/audio-player/SkipIcon";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faDownload,
  faCheck,
  faExclamationTriangle,
  faXmark,
  faArrowUp,
  faEllipsisVertical,
  faVolumeHigh,
  faVolumeMute,
  faSpinner,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import {
  useSurahData,
  useAudioPlayer,
  useSurahDownload,
} from "@/hooks/listenQuran";
import PlayerIconButton from "@/components/general/PlayerIconButton";
import { ClipLoader } from "react-spinners";
import AudioPlayerProgressBar from "@/components/general/audio-player/AudioPlayerProgressBar";
import AudioPlayerReciterDropdown from "@/components/general/audio-player/AudioPlayerReciterDropdown";
import AudioPlayerMobileSheet from "@/components/general/audio-player/AudioPlayerMobileSheet";
import RepeatModePanel from "@/components/general/audio-player/RepeatModePanel";
import { useMediaQuery } from "@/hooks/general/useMediaQuery";
import {
  RepeatConfig,
  RepeatRangeMode,
  PlaybackSpeed,
  PLAYBACK_SPEED_OPTIONS,
} from "@/components/general/audio-player/types";
import { toArabicNumber } from "@/utils/helpers";

interface RepeatPanelInitial {
  startAyah?: number;
  mode?: RepeatRangeMode;
  openEndPicker?: boolean;
}

interface AudioPlayerRefs {
  dropdownRef: React.RefObject<HTMLDivElement>;
  micBtnRef: React.RefObject<HTMLButtonElement>;
  mobileSheetRef: React.RefObject<HTMLDivElement>;
  progressRef: React.RefObject<HTMLInputElement>;
  repeatBtnRef: React.RefObject<HTMLButtonElement>;
  repeatDropdownRef: React.RefObject<HTMLDivElement>;
  speedBtnRef: React.RefObject<HTMLButtonElement>;
  speedDropdownRef: React.RefObject<HTMLDivElement>;
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
    stopAfterAyahIndex,
    triggerScrollToAyah,
    clearStopAfterAyah,
    repeatConfig,
    isRepeatModeActive,
    startRepeatMode,
    stopRepeatMode,
    hifzRequest,
    clearHifzRequest,
    playbackRate,
    setPlaybackRate,
  } = useQuranAudio();

  const pathname = usePathname();
  const { language } = useLanguage();
  const isListenPage = pathname.includes("/listen-quran/reciter/");
  const isReadQuranPage = pathname.includes("/read-quran");

  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "success" | "error"
  >("idle");
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [showReciterSheet, setShowReciterSheet] = useState(false);
  const [showRepeatDropdown, setShowRepeatDropdown] = useState(false);
  const [showRepeatSheet, setShowRepeatSheet] = useState(false);
  const [showSpeedSheet, setShowSpeedSheet] = useState(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [speedDropdownSide, setSpeedDropdownSide] = useState<"left" | "right">(
    "right",
  );
  const [repeatDropdownSide, setRepeatDropdownSide] = useState<
    "left" | "right"
  >("right");
  const [isMuted, setIsMuted] = useState(false);
  const [skipMode, setSkipMode] = useState<"verse" | "15sec">("verse");

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [repeatInitial, setRepeatInitial] = useState<RepeatPanelInitial>({});

  useEffect(() => {
    const saved = localStorage.getItem("audioSkipMode");
    if (saved === "15sec" || saved === "verse") {
      setSkipMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("audioSkipMode", skipMode);
  }, [skipMode]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const micBtnRef = useRef<HTMLButtonElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const repeatBtnRef = useRef<HTMLButtonElement>(null);
  const repeatDropdownRef = useRef<HTMLDivElement>(null);
  const speedBtnRef = useRef<HTMLButtonElement>(null);
  const speedDropdownRef = useRef<HTMLDivElement>(null);
  const playerRefs: AudioPlayerRefs = {
    dropdownRef,
    micBtnRef,
    mobileSheetRef,
    progressRef,
    repeatBtnRef,
    repeatDropdownRef,
    speedBtnRef,
    speedDropdownRef,
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
      stopAfterAyahIndex={stopAfterAyahIndex}
      triggerScrollToAyah={triggerScrollToAyah}
      clearStopAfterAyah={clearStopAfterAyah}
      repeatConfig={repeatConfig}
      isRepeatModeActive={isRepeatModeActive}
      startRepeatMode={startRepeatMode}
      stopRepeatMode={stopRepeatMode}
      hifzRequest={hifzRequest}
      clearHifzRequest={clearHifzRequest}
      showRepeatDropdown={showRepeatDropdown}
      setShowRepeatDropdown={setShowRepeatDropdown}
      showRepeatSheet={showRepeatSheet}
      setShowRepeatSheet={setShowRepeatSheet}
      showSpeedSheet={showSpeedSheet}
      setShowSpeedSheet={setShowSpeedSheet}
      repeatInitial={repeatInitial}
      setRepeatInitial={setRepeatInitial}
      isDesktop={isDesktop}
      repeatBtnRef={playerRefs.repeatBtnRef}
      repeatDropdownRef={playerRefs.repeatDropdownRef}
      showSpeedDropdown={showSpeedDropdown}
      setShowSpeedDropdown={setShowSpeedDropdown}
      speedBtnRef={playerRefs.speedBtnRef}
      speedDropdownRef={playerRefs.speedDropdownRef}
      speedDropdownSide={speedDropdownSide}
      setSpeedDropdownSide={setSpeedDropdownSide}
      repeatDropdownSide={repeatDropdownSide}
      setRepeatDropdownSide={setRepeatDropdownSide}
      playbackRate={playbackRate}
      setPlaybackRate={setPlaybackRate}
      skipMode={skipMode}
      setSkipMode={setSkipMode}
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
  stopAfterAyahIndex: number | null;
  triggerScrollToAyah: () => void;
  clearStopAfterAyah: () => void;
  repeatConfig: RepeatConfig | null;
  isRepeatModeActive: boolean;
  startRepeatMode: (config: RepeatConfig) => void;
  stopRepeatMode: () => void;
  hifzRequest: {
    startAyah: number;
    mode: RepeatRangeMode;
    openEndPicker: boolean;
  } | null;
  clearHifzRequest: () => void;
  showRepeatDropdown: boolean;
  setShowRepeatDropdown: (v: boolean) => void;
  showRepeatSheet: boolean;
  setShowRepeatSheet: (v: boolean) => void;
  showSpeedSheet: boolean;
  setShowSpeedSheet: (v: boolean) => void;
  repeatInitial: {
    startAyah?: number;
    mode?: RepeatRangeMode;
    openEndPicker?: boolean;
  };
  setRepeatInitial: (v: {
    startAyah?: number;
    mode?: RepeatRangeMode;
    openEndPicker?: boolean;
  }) => void;
  isDesktop: boolean;
  repeatBtnRef: React.RefObject<HTMLButtonElement>;
  repeatDropdownRef: React.RefObject<HTMLDivElement>;
  showSpeedDropdown: boolean;
  setShowSpeedDropdown: (v: boolean) => void;
  speedBtnRef: React.RefObject<HTMLButtonElement>;
  speedDropdownRef: React.RefObject<HTMLDivElement>;
  speedDropdownSide: "left" | "right";
  setSpeedDropdownSide: (v: "left" | "right") => void;
  repeatDropdownSide: "left" | "right";
  setRepeatDropdownSide: (v: "left" | "right") => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  skipMode: "verse" | "15sec";
  setSkipMode: (mode: "verse" | "15sec") => void;
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
  stopAfterAyahIndex,
  triggerScrollToAyah,
  clearStopAfterAyah,
  repeatConfig,
  isRepeatModeActive,
  startRepeatMode,
  stopRepeatMode,
  hifzRequest,
  clearHifzRequest,
  showRepeatDropdown,
  setShowRepeatDropdown,
  showRepeatSheet,
  setShowRepeatSheet,
  showSpeedSheet,
  setShowSpeedSheet,
  repeatInitial,
  setRepeatInitial,
  isDesktop,
  repeatBtnRef,
  repeatDropdownRef,
  showSpeedDropdown,
  setShowSpeedDropdown,
  speedBtnRef,
  speedDropdownRef,
  speedDropdownSide,
  setSpeedDropdownSide,
  repeatDropdownSide,
  setRepeatDropdownSide,
  playbackRate,
  setPlaybackRate,
  skipMode,
  setSkipMode,
}) => {
  const { surah, loading } = useSurahData(surahNumber, reciterId);
  const {
    audioPlayer,
    nextAudioPlayer,
    currentAyahIndex,
    totalAyahs,
    next,
    previous,
    skipForward15,
    skipBackward15,
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
    currentRepeatCount,
  } = useAudioPlayer(surah, reciterId, surahNumber, {
    stopAfterAyahIndex,
    repeatConfig,
    isRepeatModeActive,
    onStopRepeat: stopRepeatMode,
    playbackRate,
  });

  const handleTogglePlayPause = () => {
    if (!isPlaying && stopAfterAyahIndex !== null) {
      clearStopAfterAyah();
    }
    togglePlayPause();
  };

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
          handleTogglePlayPause();
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
  }, [handleTogglePlayPause, previous, next, isMuted, audioPlayer]);

  useEffect(() => {
    setContextIsPlaying(isPlaying);
  }, [isPlaying, setContextIsPlaying]);

  useEffect(() => {
    const handleRadioStarted = () => {
      handleClose();
    };
    window.addEventListener("radio:started", handleRadioStarted);
    return () =>
      window.removeEventListener("radio:started", handleRadioStarted);
  }, []);

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
      if (
        repeatDropdownRef.current &&
        !repeatDropdownRef.current.contains(e.target as Node) &&
        repeatBtnRef.current &&
        !repeatBtnRef.current.contains(e.target as Node)
      ) {
        setShowRepeatDropdown(false);
      }
      if (
        speedDropdownRef.current &&
        !speedDropdownRef.current.contains(e.target as Node) &&
        speedBtnRef.current &&
        !speedBtnRef.current.contains(e.target as Node)
      ) {
        setShowSpeedDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [
    dropdownRef,
    micBtnRef,
    setShowReciterDropdown,
    repeatDropdownRef,
    repeatBtnRef,
    setShowRepeatDropdown,
    speedDropdownRef,
    speedBtnRef,
    setShowSpeedDropdown,
  ]);

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

  const handleStartRepeat = (config: RepeatConfig) => {
    startRepeatMode(config);
    playAyah(config.startAyah - 1);
    setShowRepeatDropdown(false);
    setShowMobileSheet(false);
    setShowRepeatSheet(false);
  };

  const handleChangeSpeed = (rate: number) => {
    setPlaybackRate(rate as PlaybackSpeed);
    setShowSpeedDropdown(false);
  };

  const handleCancelRepeat = () => {
    stopRepeatMode();
    playAyah(currentAyahIndex);
  };

  const computeDropdownSide = (
    btn: React.RefObject<HTMLButtonElement>,
    width: number,
  ): "left" | "right" => {
    const el = btn.current;
    if (!el || typeof window === "undefined") return "right";
    const rect = el.getBoundingClientRect();
    const margin = 8;
    if (rect.right - width >= margin) return "right";
    if (rect.left + width <= window.innerWidth - margin) return "left";
    return "right";
  };

  const openRepeatPanel = (initial?: RepeatPanelInitial) => {
    setRepeatInitial(
      initial ?? {
        startAyah: currentAyahIndex + 1,
        mode: "custom",
        openEndPicker: false,
      },
    );
    if (isDesktop) {
      setShowRepeatDropdown(true);
      setRepeatDropdownSide(computeDropdownSide(repeatBtnRef, 320));
    } else {
      setShowMobileSheet(true);
      setShowReciterSheet(false);
      setShowRepeatSheet(true);
    }
  };

  useEffect(() => {
    if (!hifzRequest) return;
    openRepeatPanel({
      startAyah: hifzRequest.startAyah,
      mode: hifzRequest.mode,
      openEndPicker: hifzRequest.openEndPicker,
    });
    clearHifzRequest();
  }, [hifzRequest]);

  const progressPercentage =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const repeatStatus = (() => {
    if (!repeatConfig) return null;
    const reps =
      repeatConfig.repeatsPerAyah === Infinity
        ? Infinity
        : repeatConfig.repeatsPerAyah;
    const repsDisplay = reps === Infinity ? "∞" : String(reps);
    const currentRep =
      reps === Infinity
        ? currentRepeatCount + 1
        : Math.min(currentRepeatCount + 1, reps);
    return { repsDisplay, currentRep };
  })();

  const repeatRange =
    isRepeatModeActive && repeatConfig
      ? { start: repeatConfig.startAyah - 1, end: repeatConfig.endAyah - 1 }
      : null;
  const prevAyahDisabled = repeatRange
    ? currentAyahIndex <= repeatRange.start
    : isFirstAyah;
  const nextAyahDisabled = repeatRange
    ? currentAyahIndex >= repeatRange.end
    : isLastAyah;
  const currentAyah = currentAyahIndex + 1;

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
        {isRepeatModeActive && repeatConfig && repeatStatus && (
          <div className="px-4 max-w-7xl mx-auto w-full">
            <div
              className="flex items-center justify-between rounded-full border px-3 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md"
              style={{
                background: "hsl(var(--primary) / 0.08)",
                borderColor: "hsl(var(--primary) / 0.15)",
              }}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "hsl(var(--primary) / 0.12)" }}
                >
                  <FontAwesomeIcon
                    icon={faRepeat}
                    className="text-[10px] animate-spin"
                    style={{
                      color: "hsl(var(--primary))",
                      animationDuration: "3s",
                    }}
                  />
                </div>
                <span
                  className="text-[11px] font-medium truncate"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {repeatConfig.startAyah === repeatConfig.endAyah
                    ? language === "ar"
                      ? `تكرار الآية ${toArabicNumber(repeatConfig.startAyah)}`
                      : `Repeating ayah ${repeatConfig.startAyah}`
                    : language === "ar"
                      ? `تكرار الآيات ${toArabicNumber(repeatConfig.startAyah)}–${toArabicNumber(repeatConfig.endAyah)}`
                      : `Repeating ayahs ${repeatConfig.startAyah}–${repeatConfig.endAyah}`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span
                  className="text-[11px] font-bold"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {language === "ar"
                    ? `الآية ${toArabicNumber(currentAyah)}`
                    : `Ayah ${currentAyah}`}
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "hsl(var(--primary) / 0.9)" }}
                >
                  {language === "ar"
                    ? `(${toArabicNumber(parseInt(repeatStatus.repsDisplay))}/${toArabicNumber(repeatStatus.currentRep)})`
                    : `(${repeatStatus.currentRep}/${repeatStatus.repsDisplay})`}
                </span>
              </div>

              <button
                onClick={handleCancelRepeat}
                aria-label={
                  language === "ar" ? "إلغاء التكرار" : "Cancel repeat"
                }
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 shrink-0 hover:scale-110"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary) / 0.6)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "hsl(var(--destructive) / 0.12)";
                  e.currentTarget.style.color = "hsl(var(--destructive))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "hsl(var(--primary) / 0.1)";
                  e.currentTarget.style.color = "hsl(var(--primary) / 0.6)";
                }}
              >
                <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
              </button>
            </div>
          </div>
        )}

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

        <div className="py-2.5 px-4 max-w-7xl mx-auto w-full">
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
              {!isListenPage && (
                <>
                  <PlayerIconButton
                    onClick={handleClose}
                    tooltip={language === "ar" ? "إغلاق" : "Close"}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                  </PlayerIconButton>
                  <div className="w-px h-5 bg-border mx-1" />
                </>
              )}

              {isRepeatModeActive || skipMode === "verse" ? (
                <>
                  <PlayerIconButton
                    onClick={previous}
                    disabled={prevAyahDisabled}
                    tooltip={
                      language === "ar" ? "الآية السابقة" : "Previous Verse"
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${prevAyahDisabled ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary"}`}
                  >
                    <FontAwesomeIcon
                      icon={faStepBackward}
                      className="text-xs"
                    />
                  </PlayerIconButton>

                  <PlayerIconButton
                    tooltip={language === "ar" ? "تشغيل/إيقاف" : "Play/Pause"}
                    onClick={handleTogglePlayPause}
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
                    tooltip={language === "ar" ? "الآية التالية" : "Next Verse"}
                    onClick={next}
                    disabled={nextAyahDisabled}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${nextAyahDisabled ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary"}`}
                  >
                    <FontAwesomeIcon icon={faStepForward} className="text-xs" />
                  </PlayerIconButton>
                </>
              ) : (
                <>
                  <PlayerIconButton
                    onClick={skipBackward15}
                    tooltip={
                      language === "ar" ? "تراجع 15 ثانية" : "Back 15 seconds"
                    }
                    className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:text-primary hover:bg-secondary transition-all"
                  >
                    <SkipIcon direction="backward" className="w-5 h-5" />
                  </PlayerIconButton>

                  <PlayerIconButton
                    tooltip={language === "ar" ? "تشغيل/إيقاف" : "Play/Pause"}
                    onClick={handleTogglePlayPause}
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
                    onClick={skipForward15}
                    tooltip={
                      language === "ar"
                        ? "تقديم 15 ثانية"
                        : "Forward 15 seconds"
                    }
                    className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:text-primary hover:bg-secondary transition-all"
                  >
                    <SkipIcon direction="forward" className="w-5 h-5" />
                  </PlayerIconButton>
                </>
              )}

              <div className="w-px h-5 bg-border mx-1" />

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
                disabled={prevAyahDisabled}
                tooltip={language === "ar" ? "الآية السابقة" : "Previous Verse"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${prevAyahDisabled ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary hover:scale-110 active:scale-95"}`}
              >
                <FontAwesomeIcon icon={faStepBackward} className="text-sm" />
              </PlayerIconButton>

              <PlayerIconButton
                onClick={skipBackward15}
                disabled={isRepeatModeActive}
                tooltip={
                  language === "ar" ? "تراجع 15 ثانية" : "Back 15 seconds"
                }
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${isRepeatModeActive ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary"}`}
              >
                <SkipIcon direction="backward" className="w-6 h-6" />
              </PlayerIconButton>

              <PlayerIconButton
                onClick={handleTogglePlayPause}
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
                onClick={skipForward15}
                disabled={isRepeatModeActive}
                tooltip={
                  language === "ar" ? "تقديم 15 ثانية" : "Forward 15 seconds"
                }
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${isRepeatModeActive ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary"}`}
              >
                <SkipIcon direction="forward" className="w-6 h-6" />
              </PlayerIconButton>

              <PlayerIconButton
                onClick={next}
                disabled={nextAyahDisabled}
                tooltip={language === "ar" ? "الآية التالية" : "Next Verse"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${nextAyahDisabled ? "text-muted-foreground/30 cursor-not-allowed" : "text-foreground hover:text-primary hover:bg-secondary hover:scale-110 active:scale-95"}`}
              >
                <FontAwesomeIcon icon={faStepForward} className="text-sm" />
              </PlayerIconButton>
            </div>

            <div className="flex items-center gap-1 flex-1 justify-end">
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

              <div className="relative">
                <PlayerIconButton
                  buttonRef={speedBtnRef}
                  onClick={() => {
                    const next = !showSpeedDropdown;
                    setShowSpeedDropdown(next);
                    if (next)
                      setSpeedDropdownSide(
                        computeDropdownSide(speedBtnRef, 160),
                      );
                  }}
                  tooltip={
                    language === "ar" ? "سرعة التشغيل" : "Playback Speed"
                  }
                  className={`h-9 px-2.5 mt-1 min-w-[2.5rem] rounded-full flex items-center justify-center text-base font-bold tabular-nums transition-all duration-200 ${showSpeedDropdown ? "text-primary bg-secondary ring-2 ring-primary/20" : "text-muted-foreground hover:text-primary hover:bg-secondary hover:scale-110"}`}
                >
                  {playbackRate}×
                </PlayerIconButton>

                {showSpeedDropdown && (
                  <div
                    ref={speedDropdownRef}
                    className={`absolute bottom-[calc(100%+12px)] ${speedDropdownSide === "right" ? "right-0" : "left-0"} w-40 max-w-[calc(100vw-1rem)] bg-popover/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border overflow-hidden z-[500] animate-in slide-in-from-bottom-2 fade-in duration-200`}
                  >
                    <div className="px-4 py-3 bg-muted/50 border-b border-border">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {language === "ar" ? "سرعة التشغيل" : "Playback Speed"}
                      </span>
                    </div>
                    <div className="py-1">
                      {PLAYBACK_SPEED_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleChangeSpeed(s)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${playbackRate === s ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${playbackRate === s ? "border-primary" : "border-muted-foreground/30"}`}
                          >
                            {playbackRate === s && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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

              <div className="w-px h-5 bg-border mx-1" />

              {isReadQuranPage && (
                <PlayerIconButton
                  onClick={triggerScrollToAyah}
                  tooltip={language === "ar" ? "انتقال للآية" : "Jump to Ayah"}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 hover:scale-110"
                >
                  <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
                </PlayerIconButton>
              )}

              <AudioPlayerReciterDropdown
                language={language}
                reciterId={reciterId}
                isListenPage={isListenPage}
                showReciterDropdown={showReciterDropdown}
                setShowReciterDropdown={setShowReciterDropdown}
                onReciterChange={setReciterId}
                dropdownRef={dropdownRef}
                micBtnRef={micBtnRef}
              />

              <div className="relative">
                <PlayerIconButton
                  buttonRef={repeatBtnRef}
                  onClick={() => openRepeatPanel()}
                  tooltip={language === "ar" ? "وضع التكرار" : "Repeat Mode"}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isRepeatModeActive ? "text-primary bg-primary/10 ring-2 ring-primary/20" : "text-muted-foreground hover:text-primary hover:bg-secondary hover:scale-110"}`}
                >
                  <FontAwesomeIcon icon={faRepeat} className="text-sm" />
                </PlayerIconButton>

                {showRepeatDropdown && (
                  <div
                    ref={repeatDropdownRef}
                    className={`absolute bottom-[calc(100%+12px)] ${repeatDropdownSide === "right" ? "right-0" : "left-0"} w-80 max-w-[calc(100vw-1rem)] bg-popover/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border overflow-hidden z-[500] animate-in slide-in-from-bottom-2 fade-in duration-200`}
                  >
                    <RepeatModePanel
                      language={language}
                      totalAyahs={totalAyahs}
                      currentAyahIndex={currentAyahIndex}
                      initialStartAyah={
                        repeatInitial.startAyah ?? currentAyahIndex + 1
                      }
                      initialMode={repeatInitial.mode}
                      openEndPicker={repeatInitial.openEndPicker}
                      onStart={handleStartRepeat}
                      onClose={() => setShowRepeatDropdown(false)}
                      playbackRate={playbackRate}
                      onChangePlaybackRate={setPlaybackRate}
                    />
                  </div>
                )}
              </div>

              {!isListenPage && (
                <>
                  <div className="w-px h-5 bg-border mx-1" />
                  <PlayerIconButton
                    onClick={handleClose}
                    tooltip={language === "ar" ? "إغلاق" : "Close"}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:rotate-90 ml-1"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-base" />
                  </PlayerIconButton>
                </>
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
        showRepeatSheet={showRepeatSheet}
        setShowRepeatSheet={setShowRepeatSheet}
        showSpeedSheet={showSpeedSheet}
        setShowSpeedSheet={setShowSpeedSheet}
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
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
        skipMode={skipMode}
        setSkipMode={setSkipMode}
        onStartRepeat={handleStartRepeat}
        repeatInitial={repeatInitial}
      />
    </>
  );
};
