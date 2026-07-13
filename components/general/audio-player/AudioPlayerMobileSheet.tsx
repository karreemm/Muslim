"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faExclamationTriangle,
  faMicrophone,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { reciters } from "@/constants/recitersData";
import RepeatModePanel from "@/components/general/audio-player/RepeatModePanel";
import {
  RepeatConfig,
  RepeatRangeMode,
  PLAYBACK_SPEED_OPTIONS,
} from "@/components/general/audio-player/types";

interface AudioPlayerMobileSheetProps {
  language: string;
  isListenPage: boolean;
  isReadQuranPage: boolean;
  reciterId: string;
  showMobileSheet: boolean;
  setShowMobileSheet: (value: boolean) => void;
  showReciterSheet: boolean;
  setShowReciterSheet: (value: boolean) => void;
  showRepeatSheet: boolean;
  setShowRepeatSheet: (value: boolean) => void;
  showSpeedSheet: boolean;
  setShowSpeedSheet: (value: boolean) => void;
  playbackRate: number;
  setPlaybackRate: (value: number) => void;
  setReciterId: (value: string) => void;
  mobileSheetRef: React.RefObject<HTMLDivElement>;
  surahNumber: number;
  surahName: string;
  reciterName?: string;
  currentAyahIndex: number;
  totalAyahs: number;
  downloadStatus: "idle" | "downloading" | "success" | "error";
  onJumpToAyah: () => void;
  onDownload: () => void;
  skipMode: "verse" | "15sec";
  setSkipMode: (mode: "verse" | "15sec") => void;
  onStartRepeat: (config: RepeatConfig) => void;
  repeatInitial: {
    startAyah?: number;
    mode?: RepeatRangeMode;
    openEndPicker?: boolean;
  };
}

export default function AudioPlayerMobileSheet({
  language,
  isListenPage,
  isReadQuranPage,
  reciterId,
  showMobileSheet,
  setShowMobileSheet,
  showReciterSheet,
  setShowReciterSheet,
  showRepeatSheet,
  setShowRepeatSheet,
  showSpeedSheet,
  setShowSpeedSheet,
  playbackRate,
  setPlaybackRate,
  setReciterId,
  mobileSheetRef,
  surahNumber,
  surahName,
  reciterName,
  currentAyahIndex,
  totalAyahs,
  downloadStatus,
  onJumpToAyah,
  onDownload,
  skipMode,
  setSkipMode,
  onStartRepeat,
  repeatInitial,
}: AudioPlayerMobileSheetProps) {
  if (!showMobileSheet) return null;

  const isArabic = language === "ar";

  return (
    <div
      ref={mobileSheetRef}
      className="fixed bottom-[80px] left-4 right-4 bg-popover/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border overflow-hidden z-[500] md:hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      {showRepeatSheet ? (
        <div className="flex flex-col max-h-[80vh]">
          <div className="sticky top-0 bg-popover/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between z-10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isArabic ? "وضع التكرار" : "Repeat Mode"}
            </span>
            <button
              onClick={() => setShowRepeatSheet(false)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <FontAwesomeIcon
                icon={isArabic ? faChevronRight : faChevronLeft}
                className="text-xs"
              />
              {isArabic ? "رجوع" : "Back"}
            </button>
          </div>
          <div className="overflow-y-auto">
            <RepeatModePanel
              language={language}
              totalAyahs={totalAyahs}
              currentAyahIndex={currentAyahIndex}
              initialStartAyah={repeatInitial.startAyah ?? currentAyahIndex + 1}
              initialMode={repeatInitial.mode}
              openEndPicker={repeatInitial.openEndPicker}
              onStart={onStartRepeat}
              onClose={() => setShowRepeatSheet(false)}
              playbackRate={playbackRate}
              onChangePlaybackRate={setPlaybackRate}
            />
          </div>
        </div>
      ) : showSpeedSheet ? (
        <div className="flex flex-col max-h-[80vh]">
          <div className="sticky top-0 bg-popover/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between z-10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {isArabic ? "سرعة التشغيل" : "Playback Speed"}
            </span>
            <button
              onClick={() => setShowSpeedSheet(false)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <FontAwesomeIcon
                icon={isArabic ? faChevronRight : faChevronLeft}
                className="text-xs"
              />
              {isArabic ? "رجوع" : "Back"}
            </button>
          </div>
          <div className="overflow-y-auto p-2">
            {PLAYBACK_SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPlaybackRate(s);
                  setShowSpeedSheet(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 mb-1 text-foreground hover:bg-muted active:scale-[0.98]"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${playbackRate === s ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`text-[10px] text-primary-foreground ${playbackRate === s ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
                {s}x
              </button>
            ))}
          </div>
        </div>
      ) : !showReciterSheet ? (
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
              {surahNumber}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground truncate">
                {language === "ar" ? `سورة ${surahName}` : `Surah ${surahName}`}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {reciterName}
              </p>
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
              {currentAyahIndex + 1}/{totalAyahs}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {isReadQuranPage && (
              <button
                onClick={() => {
                  onJumpToAyah();
                  setShowMobileSheet(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors active:scale-[0.98] text-left"
              >
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm">
                  <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {language === "ar" ? "انتقال للآية" : "Jump to Ayah"}
                </span>
              </button>
            )}

            <button
              onClick={() => setShowRepeatSheet(true)}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors active:scale-[0.98] text-left col-span-1"
            >
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm">
                <FontAwesomeIcon icon={faRepeat} className="text-xs" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {language === "ar" ? "وضع التكرار" : "Repeat Mode"}
              </span>
            </button>

            <button
              onClick={() => setShowSpeedSheet(true)}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors active:scale-[0.98] text-left col-span-1"
            >
              <div className="min-w-8 h-8 px-2 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm text-xs font-bold tabular-nums">
                {playbackRate}×
              </div>
              <span className="text-xs font-medium text-foreground">
                {language === "ar" ? "سرعة التشغيل" : "Playback Speed"}
              </span>
            </button>

            <button
              onClick={() => {
                onDownload();
                setShowMobileSheet(false);
              }}
              disabled={downloadStatus === "downloading"}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors active:scale-[0.98] text-left disabled:opacity-50 col-span-1"
            >
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm">
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
              </div>
              <span className="text-xs font-medium text-foreground">
                {language === "ar" ? "تنزيل السورة" : "Download"}
              </span>
            </button>

            <button
              onClick={() => setShowReciterSheet(true)}
              disabled={isListenPage}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors active:scale-[0.98] text-left disabled:opacity-50 col-span-1"
            >
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm">
                <FontAwesomeIcon icon={faMicrophone} className="text-xs" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {language === "ar" ? "تغيير القارئ" : "Change Reciter"}
              </span>
            </button>
          </div>

          <div className="border-t border-border pt-6 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                  {language === "ar" ? "التخطي ب" : "Skip By"}
                </p>
              </div>
              <div className="flex-1 flex gap-2">
                <button
                  onClick={() => {
                    setSkipMode("verse");
                    setShowMobileSheet(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 text-foreground hover:bg-muted active:scale-[0.98]"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${skipMode === "verse" ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`text-[10px] ${skipMode === "verse" ? "text-primary-foreground opacity-100" : "opacity-0"}`}
                    />
                  </div>
                  {language === "ar" ? "الآية" : "Verse"}
                </button>
                <button
                  onClick={() => {
                    setSkipMode("15sec");
                    setShowMobileSheet(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 text-foreground hover:bg-muted active:scale-[0.98]"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${skipMode === "15sec" ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`text-[10px] ${skipMode === "15sec" ? "text-primary-foreground opacity-100" : "opacity-0"}`}
                    />
                  </div>
                  {language === "ar" ? "الثواني" : "Seconds"}
                </button>

              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col max-h-[60vh]">
          <div className="sticky top-0 bg-popover/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between z-10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {language === "ar" ? "القراء" : "Reciters"}
            </span>
            <button
              onClick={() => setShowReciterSheet(false)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <FontAwesomeIcon
                icon={language === "ar" ? faChevronRight : faChevronLeft}
                className="text-xs"
              />
              {language === "ar" ? "رجوع" : "Back"}
            </button>
          </div>
          <div className="overflow-y-auto p-2">
            {reciters.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setReciterId(r.id);
                  localStorage.setItem("preferredReciter", r.id);
                  setShowReciterSheet(false);
                  setShowMobileSheet(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 mb-1 text-foreground hover:bg-muted active:scale-[0.98]"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${r.id === reciterId ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`text-[10px] text-primary-foreground ${r.id === reciterId ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
                {language === "ar" ? r.NameAr : r.NameEn}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
