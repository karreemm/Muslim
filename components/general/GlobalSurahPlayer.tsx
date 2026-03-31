"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuranAudio } from "@/context/QuranAudioContext";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
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
} from "@fortawesome/free-solid-svg-icons";
import {
  useSurahData,
  useAudioPlayer,
  useSurahDownload,
} from "@/hooks/listenQuran";
import { ClipLoader } from "react-spinners";
import styles from "@/app/styles/modules/AudioPlayer.module.css";

export const GlobalSurahPlayer = () => {
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const micBtnRef = useRef<HTMLButtonElement>(null);

  if (!isPlayerVisible || !surahNumber || !reciterId) return null;

  return (
    <GlobalPlayerInner
      surahNumber={surahNumber}
      reciterId={reciterId}
      language={language}
      isListenPage={isListenPage}
      showReciterDropdown={showReciterDropdown}
      setShowReciterDropdown={setShowReciterDropdown}
      dropdownRef={dropdownRef}
      micBtnRef={micBtnRef}
      downloadStatus={downloadStatus}
      setDownloadStatus={setDownloadStatus}
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
      isReadQuranPage={isReadQuranPage}
    />
  );
};

interface InnerProps {
  surahNumber: number;
  reciterId: string;
  language: string;
  isListenPage: boolean;
  showReciterDropdown: boolean;
  setShowReciterDropdown: (v: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  micBtnRef: React.RefObject<HTMLButtonElement>;
  downloadStatus: "idle" | "downloading" | "success" | "error";
  setDownloadStatus: (v: "idle" | "downloading" | "success" | "error") => void;
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
  isReadQuranPage: boolean;
}

const GlobalPlayerInner: React.FC<InnerProps> = ({
  surahNumber,
  reciterId,
  language,
  isListenPage,
  showReciterDropdown,
  setShowReciterDropdown,
  dropdownRef,
  micBtnRef,
  downloadStatus,
  setDownloadStatus,
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
  isReadQuranPage,
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
    if (requestedAyahIndex === null) {
      return;
    }

    if (loading || !surah) {
      return;
    }

    if (requestedAyahIndex < 0 || requestedAyahIndex >= surah.ayahs.length) {
      return;
    }

    playAyah(requestedAyahIndex);
    // The ayah-play request should be handled only when the trigger changes.
    // Including playAyah in dependencies causes a render loop because playAyah
    // is recreated by the hook and itself updates state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playAyahTrigger, requestedAyahIndex, loading, surah]);

  useEffect(() => {
    if (!isPlaying && isLastAyah && surahQueue.length > 0) {
      const idx = surahQueue.indexOf(surahNumber);
      if (idx !== -1 && idx < surahQueue.length - 1) {
        const nextSurah = surahQueue[idx + 1];
        setTimeout(() => {
          playSurah(nextSurah, reciterId, surahQueue);
        }, 800);
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

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileReciterMenu, setShowMobileReciterMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        mobileMenuBtnRef.current &&
        !mobileMenuBtnRef.current.contains(e.target as Node)
      ) {
        setShowMobileMenu(false);
        setShowMobileReciterMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDownload = async () => {
    setDownloadStatus("downloading");
    const result = await downloadSurah();
    setDownloadStatus(result.success ? "success" : "error");
    setTimeout(() => setDownloadStatus("idle"), 3000);
  };

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

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white/95 dark:bg-slate-900/98 backdrop-blur-xl border-t border-teal-600/20 shadow-[0_-8px_32px_rgba(0,0,0,0.15)]">
      <audio ref={audioPlayer} className="hidden" />
      <audio ref={nextAudioPlayer} className="hidden" />

      <div className="max-w-[1500px] mx-auto px-3 py-2">
        <div dir="ltr" className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 min-w-[36px]">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative group">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              onMouseDown={handleSliderMouseDown}
              onMouseUp={(e) => {
                handleSliderMouseUp();
                triggerScrollToAyah();
              }}
              onTouchStart={handleSliderMouseDown}
              onTouchEnd={(e) => {
                handleSliderMouseUp();
                triggerScrollToAyah();
              }}
              className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${styles.audioSlider}`}
              style={{
                background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 min-w-[36px] text-right">
            {formatTime(duration)}
          </span>
        </div>

        <div className="relative flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {surahNumber}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-teal-700 dark:text-teal-400 truncate">
                {language === "ar" ? `سورة ${surahName}` : `Surah ${surahName}`}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {reciterName} · {currentAyahIndex + 1}/{totalAyahs}
              </div>
            </div>
            {loading && <ClipLoader color="#0d9488" size={16} />}
          </div>

          <div dir="ltr" className="flex items-center gap-1 md:gap-3 shrink-0">
            <button
              onClick={previous}
              disabled={isFirstAyah}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isFirstAyah
                  ? "text-gray-300 dark:text-slate-700 cursor-not-allowed"
                  : "text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:scale-110"
              }`}
            >
              <FontAwesomeIcon icon={faStepBackward} className="text-sm" />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={isBuffering}
              className={`w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md hover:bg-teal-500 hover:scale-105 transition-all active:scale-95 ${isBuffering ? styles.loadingButton : ""}`}
            >
              {isBuffering ? (
                <ClipLoader color="white" size={16} />
              ) : (
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className="text-sm"
                />
              )}
            </button>

            <button
              onClick={next}
              disabled={isLastAyah}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isLastAyah
                  ? "text-gray-300 dark:text-slate-700 cursor-not-allowed"
                  : "text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:scale-110"
              }`}
            >
              <FontAwesomeIcon icon={faStepForward} className="text-sm" />
            </button>

            <button
              ref={mobileMenuBtnRef}
              onClick={() => {
                setShowMobileMenu((prev) => {
                  const next = !prev;
                  if (!next) {
                    setShowMobileReciterMenu(false);
                  }
                  return next;
                });
              }}
              className="w-8 h-8 rounded-full flex md:hidden items-center justify-center text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all hover:scale-110"
              title={language === "ar" ? "المزيد" : "More"}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-sm" />
            </button>

            {!isListenPage && (
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex md:hidden items-center justify-center text-slate-400 hover:text-red-500 transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20"
                title={language === "ar" ? "إغلاق" : "Close"}
              >
                <FontAwesomeIcon icon={faXmark} className="text-base" />
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1 md:gap-2 flex-1 justify-end">
            {isReadQuranPage && (
              <button
                onClick={triggerScrollToAyah}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                title={
                  language === "ar"
                    ? "الانتقال للآية الحالية"
                    : "Jump to current ayah"
                }
              >
                <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
              </button>
            )}

            <div className="group">
              <button
                onClick={handleDownload}
                disabled={
                  downloadStatus === "downloading" ||
                  downloadStatus === "success"
                }
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  downloadStatus === "success"
                    ? "text-green-500"
                    : downloadStatus === "error"
                      ? "text-red-500"
                      : "text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                }`}
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
              </button>
            </div>

            <div className="relative">
              <div className="group">
                <button
                  disabled={isListenPage}
                  ref={micBtnRef}
                  onClick={() => setShowReciterDropdown(!showReciterDropdown)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                    showReciterDropdown && !isListenPage
                      ? "text-teal-600 bg-teal-50 dark:bg-teal-900/30"
                      : isListenPage
                        ? "cursor-not-allowed text-slate-400 hover:text-slate-400"
                        : "text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
                >
                  <FontAwesomeIcon icon={faMicrophone} className="text-sm" />
                </button>
              </div>

              {showReciterDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute bottom-[calc(100%+10px)] left-0 w-[min(22rem,calc(100vw-1rem))] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[500]"
                >
                  <div className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    {language === "ar" ? "القراء" : "Reciters"}
                    <span className="text-[10px] text-slate-400">
                      {language === "ar" ? "اختيار القارئ" : "Choose reciter"}
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {reciters.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setReciterId(r.id);
                          localStorage.setItem("preferredReciter", r.id);
                          setShowReciterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30 flex items-center gap-2 ${
                          r.id === reciterId
                            ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {r.id === reciterId && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-teal-600 text-xs shrink-0"
                          />
                        )}
                        <span className={r.id === reciterId ? "" : "pl-4"}>
                          {language === "ar" ? r.NameAr : r.NameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!isListenPage && (
              <div className="relative group">
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-base" />
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[300]">
                  {language === "ar" ? "إغلاق" : "Close"}
                </div>
              </div>
            )}
          </div>

          {showMobileMenu && (
            <div
              ref={mobileMenuRef}
              className="absolute bottom-[calc(100%+8px)] right-0 w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[500] md:hidden"
            >
              <div className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                {language === "ar" ? "خيارات المشغل" : "Player Options"}
                <span className="text-[10px] text-slate-400">
                  {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
                </span>
              </div>

              {!showMobileReciterMenu ? (
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      handleDownload();
                      setShowMobileMenu(false);
                    }}
                    disabled={
                      downloadStatus === "downloading" ||
                      downloadStatus === "success"
                    }
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                      <FontAwesomeIcon
                        icon={
                          downloadStatus === "success"
                            ? faCheck
                            : downloadStatus === "error"
                              ? faExclamationTriangle
                              : faDownload
                        }
                        className={`text-xs ${downloadStatus === "downloading" ? "animate-bounce" : ""}`}
                      />
                    </span>
                    {language === "ar" ? "تنزيل السورة" : "Download Surah"}
                  </button>

                  {isReadQuranPage && (
                    <button
                      onClick={() => {
                        triggerScrollToAyah();
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30 flex items-center gap-3"
                    >
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                        <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
                      </span>
                      {language === "ar"
                        ? "الانتقال للآية الحالية"
                        : "Jump to current ayah"}
                    </button>
                  )}

                  <button
                    disabled={isListenPage}
                    onClick={() => setShowMobileReciterMenu(true)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="text-xs"
                      />
                    </span>
                    <span className="flex-1">
                      {language === "ar" ? "تغيير القارئ" : "Change Reciter"}
                    </span>
                    <FontAwesomeIcon
                      icon={language === "ar" ? faChevronLeft : faChevronRight}
                      className="text-[11px] text-slate-400"
                    />
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowMobileReciterMenu(false)}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-teal-600 dark:text-teal-400 border-b border-slate-100 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/30 flex items-center gap-2"
                  >
                    <FontAwesomeIcon
                      icon={language === "ar" ? faChevronRight : faChevronLeft}
                      className="text-xs"
                    />
                    {language === "ar" ? "رجوع" : "Back"}
                  </button>
                  <div className="max-h-56 overflow-y-auto">
                    {reciters.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setReciterId(r.id);
                          localStorage.setItem("preferredReciter", r.id);
                          setShowMobileReciterMenu(false);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30 flex items-center gap-2 ${
                          r.id === reciterId
                            ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {r.id === reciterId && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-teal-600 text-xs shrink-0"
                          />
                        )}
                        <span className={r.id === reciterId ? "" : "pl-4"}>
                          {language === "ar" ? r.NameAr : r.NameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
