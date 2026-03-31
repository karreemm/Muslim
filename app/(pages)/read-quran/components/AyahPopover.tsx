"use client";

import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faHeadphones,
  faTimes,
  faCheck,
  faSpinner,
  faBook,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { TafseerModal } from "../../../../components/modals/TafseerModal";
import { TranslationModal } from "../../../../components/modals/TranslationModal";
import animationStyles from "@/app/styles/modules/Animations.module.css";
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

    if (!isOpen) return null;

    return (
      <>
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          ref={popoverRef}
          className={`
          fixed z-50 rounded-lg shadow-2xl border
          top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-card border-border text-card-foreground
          min-w-[240px] max-w-[280px]
          transition-all duration-200 ease-in-out
        `}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`
          flex items-center justify-between px-4 py-3 border-b
          border-border
        `}
          >
            <span className="dynamic-font font-semibold text-sm">
              {language === "ar" ? `الآية ${ayahNumber}` : `Ayah ${ayahNumber}`}
            </span>
            <button
              onClick={onClose}
              className={`
              rounded-md transition-colors w-6 h-6 flex items-center justify-center
              hover:bg-secondary text-muted-foreground
            `}
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          </div>

          <div className="py-2">
            <button
              onClick={handleSaveClick}
              disabled={isSaved}
              className={`
              w-full px-4 py-3 flex items-center gap-3 transition-colors
              hover:bg-secondary disabled:bg-accent/20
              disabled:cursor-not-allowed
            `}
            >
              <FontAwesomeIcon
                icon={isSaved ? faCheck : faBookmark}
                className={`w-5 ${isSaved ? "text-accent" : ""}`}
              />
              <span className="dynamic-font flex-1 text-start">
                {isSaved ? t("common.saved") : t("readQuran.popover.saveAyah")}
              </span>
            </button>

            <button
              onClick={handleListenClick}
              disabled={isLoadingAudio}
              className={`
              w-full px-4 py-3 flex items-center gap-3 transition-colors
              hover:bg-secondary disabled:opacity-50
              disabled:cursor-not-allowed
            `}
            >
              <FontAwesomeIcon
                icon={isLoadingAudio ? faSpinner : faHeadphones}
                className={`w-5 ${isLoadingAudio ? "animate-spin" : ""} ${
                  isPlaying ? "text-primary" : ""
                }`}
              />
              <span className="dynamic-font flex-1 text-start">
                {isLoadingAudio
                  ? t("common.loading")
                  : t("readQuran.popover.listenAyah")}
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
                  <div
                    className={animationStyles.waveBar}
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setShowTafseerModal(true);
              }}
              className={`
              w-full px-4 py-3 flex items-center gap-3 transition-colors
              hover:bg-secondary
            `}
            >
              <FontAwesomeIcon icon={faBook} className="w-5" />
              <span className="dynamic-font flex-1 text-start">
                {t("readQuran.popover.viewTafseer")}
              </span>
            </button>

            <button
              onClick={() => {
                setShowTranslationModal(true);
              }}
              className={`
              w-full px-4 py-3 flex items-center gap-3 transition-colors
              hover:bg-secondary
            `}
            >
              <FontAwesomeIcon icon={faLanguage} className="w-5" />
              <span className="dynamic-font flex-1 text-start">
                {t("readQuran.popover.viewTranslation")}
              </span>
            </button>
          </div>
        </div>

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
