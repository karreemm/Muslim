"use client";

import { memo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";
import {
  faBookmark,
  faHeadphones,
  faTimes,
  faCheck,
  faSpinner,
  faBook,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { TafseerModal } from "../../../../../components/modals/TafseerModal";
import { TranslationModal } from "../../../../../components/modals/TranslationModal";
import { useAyahAudio } from "@/hooks/readQuran/useAyahAudio";
import { useAyahPopover } from "@/hooks/readQuran/useAyahPopover";

interface AyahPopoverProps {
  isOpen: boolean;
  ayahNumber: number;
  surahNumber: number;
  position: { x: number; y: number };
  onClose: () => void;
  onSave: () => void;
  surahNameAr?: string;
  surahNameEn?: string;
}

export const AyahPopover: React.FC<AyahPopoverProps> = memo(
  ({
    isOpen,
    ayahNumber,
    surahNumber,
    position,
    onClose,
    onSave,
    surahNameAr,
    surahNameEn,
  }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();

    const {
      popoverRef,
      isSaved,
      showTafseerModal,
      setShowTafseerModal,
      showTranslationModal,
      setShowTranslationModal,
      handleSaveClick,
    } = useAyahPopover({ isOpen, onClose, onSave });

    const { isPlaying, isLoadingAudio, handleListenClick } = useAyahAudio(
      surahNumber,
      ayahNumber,
      onClose,
    );

    const [viewport, setViewport] = useState({
      width: typeof window !== "undefined" ? window.innerWidth : 375,
      height: typeof window !== "undefined" ? window.innerHeight : 667,
    });

    useEffect(() => {
      const updateViewport = () => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      
      window.addEventListener("resize", updateViewport);
      window.addEventListener("scroll", updateViewport, true);
      return () => {
        window.removeEventListener("resize", updateViewport);
        window.removeEventListener("scroll", updateViewport, true);
      };
    }, []);

    const isMobile = viewport.width < 640;
    const POPOVER_WIDTH = Math.min(isMobile ? 280 : 320, viewport.width - 32);
    const POPOVER_HEIGHT = isMobile ? 160 : 220; 
    const MARGIN = 12;
    const VERTICAL_OFFSET = 8;

    const calculatePosition = () => {
      let left = position.x - POPOVER_WIDTH / 2;
      
      if (left < MARGIN) {
        left = MARGIN;
      }
      if (left + POPOVER_WIDTH > viewport.width - MARGIN) {
        left = viewport.width - POPOVER_WIDTH - MARGIN;
      }

      const spaceBelow = viewport.height - position.y - MARGIN;
      const spaceAbove = position.y - MARGIN;
      const canPlaceBelow = spaceBelow >= POPOVER_HEIGHT;
      const canPlaceAbove = spaceAbove >= POPOVER_HEIGHT;

      let top;
      if (canPlaceBelow || (!canPlaceAbove && spaceBelow >= spaceAbove)) {
        top = position.y + VERTICAL_OFFSET;
        if (top + POPOVER_HEIGHT > viewport.height - MARGIN) {
          top = viewport.height - POPOVER_HEIGHT - MARGIN;
        }
      } else {
        top = position.y - POPOVER_HEIGHT - VERTICAL_OFFSET;
        if (top < MARGIN) top = MARGIN;
      }

      return { left, top };
    };

    const { left, top } = calculatePosition();

    if (!isOpen) return null;

    return (
      <>
        {createPortal(
          <div
            dir={language === "ar" ? "rtl" : "ltr"}
            ref={popoverRef}
            className="fixed z-50 rounded-xl sm:rounded-2xl shadow-2xl shadow-primary/20 
            border border-border/50 bg-card/95 backdrop-blur-xl text-card-foreground 
            overflow-hidden transition-all duration-200 ease-out
            min-w-[260px] sm:min-w-[280px] 
            max-w-[calc(100vw-24px)] sm:max-w-[320px]"
            style={{ 
              top: `${top}px`,
              left: `${left}px`,
              width: `${POPOVER_WIDTH}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3 border-b border-border/50 bg-muted/30">
              <span className="font-bold text-foreground text-sm sm:text-base">
                {language === "ar"
                  ? `الآية ${ayahNumber}`
                  : `Ayah ${ayahNumber}`}
              </span>
              <button
                onClick={onClose}
                className="rounded-lg sm:rounded-xl transition-all duration-200 
                w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center
                hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs sm:text-sm" />
              </button>
            </div>

              <div className={`p-1.5 sm:p-2 grid gap-1 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 space-y-1'}`}>              <button
                onClick={handleSaveClick}
                disabled={isSaved}
                className={`w-full px-2 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 rounded-lg sm:rounded-xl transition-all duration-200
                ${isSaved ? "bg-accent/10 text-accent cursor-not-allowed" : "hover:bg-secondary text-foreground hover:text-primary"}`}
              >
                <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg ${isSaved ? "bg-accent/20" : "bg-secondary/50"}`}>
                  <FontAwesomeIcon icon={isSaved ? faCheck : faBookmark} className="text-xs sm:text-sm" />
                </div>
                <span className="flex-1 text-start font-medium text-xs sm:text-sm truncate">
                  {isSaved ? t("common.saved") : t("readQuran.popover.saveAyah")}
                </span>
              </button>

              <button
                onClick={handleListenClick}
                disabled={isLoadingAudio}
                className="w-full px-2 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 rounded-lg sm:rounded-xl transition-all duration-200
                hover:bg-secondary text-foreground hover:text-primary disabled:opacity-50"
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg bg-secondary/50">
                  <FontAwesomeIcon
                    icon={isLoadingAudio ? faSpinner : faHeadphones}
                    className={`text-xs sm:text-sm ${isLoadingAudio ? "animate-spin" : ""} ${isPlaying ? "text-primary" : ""}`}
                  />
                </div>
                <span className="flex-1 text-start font-medium text-xs sm:text-sm truncate">
                  {isLoadingAudio ? t("common.loading") : t("readQuran.popover.listenAyah")}
                </span>
                {isPlaying && (
                  <div className="flex gap-0.5 items-end h-3 sm:h-4">
                    {[0, 0.1, 0.2, 0.3].map((delay) => (
                      <div
                        key={delay}
                        className="w-0.5 bg-primary animate-pulse"
                        style={{ height: "100%", animationDelay: `${delay}s`, animationDuration: "0.6s" }}
                      />
                    ))}
                  </div>
                )}
              </button>

              <button
                onClick={() => setShowTafseerModal(true)}
                className="w-full px-2 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 rounded-lg sm:rounded-xl transition-all duration-200
                hover:bg-secondary text-foreground hover:text-primary"
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg bg-secondary/50">
                  <FontAwesomeIcon icon={faBook} className="text-xs sm:text-sm" />
                </div>
                <span className="flex-1 text-start font-medium text-xs sm:text-sm truncate">
                  {t("readQuran.popover.viewTafseer")}
                </span>
              </button>

              <button
                onClick={() => setShowTranslationModal(true)}
                className="w-full px-2 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 rounded-lg sm:rounded-xl transition-all duration-200
                hover:bg-secondary text-foreground hover:text-primary"
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg bg-secondary/50">
                  <FontAwesomeIcon icon={faLanguage} className="text-xs sm:text-sm" />
                </div>
                <span className="flex-1 text-start font-medium text-xs sm:text-sm truncate">
                  {t("readQuran.popover.viewTranslation")}
                </span>
              </button>
            </div>
          </div>,
          document.body,
        )}

        <TafseerModal
          isOpen={showTafseerModal}
          onClose={() => setShowTafseerModal(false)}
          surahNumber={surahNumber}
          ayahNumber={ayahNumber}
          surahNameAr={surahNameAr}
          surahNameEn={surahNameEn}
        />
        <TranslationModal
          isOpen={showTranslationModal}
          onClose={() => setShowTranslationModal(false)}
          surahNumber={surahNumber}
          ayahNumber={ayahNumber}
          surahNameAr={surahNameAr}
          surahNameEn={surahNameEn}
        />
      </>
    );
  },
);

AyahPopover.displayName = "AyahPopover";