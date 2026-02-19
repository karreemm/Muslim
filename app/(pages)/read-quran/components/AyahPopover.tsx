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
import { useTheme } from "../../../../context/ThemeContext";
import { reciters } from "../../../../constants/recitersData";
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
    const { theme } = useTheme();

    const {
      popoverRef,
      isSaved,
      showTafseerModal,
      setShowTafseerModal,
      showTranslationModal,
      setShowTranslationModal,
      handleSaveClick,
    } = useAyahPopover({ isOpen, onClose, onSave });

    const {
      selectedReciter,
      showReciterMenu,
      setShowReciterMenu,
      isPlaying,
      isLoadingAudio,
      handleListenClick,
      handleReciterChange,
      reciterName,
    } = useAyahAudio(surahNumber, ayahNumber, isOpen);

    if (!isOpen) return null;

    return (
      <>
        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          ref={popoverRef}
          className={`
          fixed z-50 rounded-lg shadow-2xl border
          top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          ${
            theme
              ? "bg-slate-800 border-slate-600 text-white"
              : "bg-white border-gray-200 text-gray-800"
          }
          min-w-[240px] max-w-[280px]
          transition-all duration-200 ease-in-out
        `}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`
          flex items-center justify-between px-4 py-3 border-b
          ${theme ? "border-slate-600" : "border-gray-200"}
        `}
          >
            <span className="dynamic-font font-semibold text-sm">
              {language === "ar" ? `الآية ${ayahNumber}` : `Ayah ${ayahNumber}`}
            </span>
            <button
              onClick={onClose}
              className={`
              rounded-md transition-colors w-6 h-6 flex items-center justify-center
              ${
                theme
                  ? "hover:bg-slate-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }
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
              ${
                theme
                  ? "hover:bg-slate-700 disabled:bg-green-900/30"
                  : "hover:bg-gray-100 disabled:bg-green-100"
              }
              disabled:cursor-not-allowed
            `}
            >
              <FontAwesomeIcon
                icon={isSaved ? faCheck : faBookmark}
                className={`w-5 ${isSaved ? "text-green-500" : ""}`}
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
              ${
                theme
                  ? "hover:bg-slate-700 disabled:opacity-50"
                  : "hover:bg-gray-100 disabled:opacity-50"
              }
              disabled:cursor-not-allowed
            `}
            >
              <FontAwesomeIcon
                icon={isLoadingAudio ? faSpinner : faHeadphones}
                className={`w-5 ${isLoadingAudio ? "animate-spin" : ""} ${
                  isPlaying ? "text-teal-600 dark:text-teal-500" : ""
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
              ${theme ? "hover:bg-slate-700" : "hover:bg-gray-100"}
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
              ${theme ? "hover:bg-slate-700" : "hover:bg-gray-100"}
            `}
            >
              <FontAwesomeIcon icon={faLanguage} className="w-5" />
              <span className="dynamic-font flex-1 text-start">
                {t("readQuran.popover.viewTranslation")}
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReciterMenu(!showReciterMenu)}
                className={`
                w-full px-4 py-3 flex items-center gap-3 transition-colors
                ${theme ? "hover:bg-slate-700" : "hover:bg-gray-100"}
              `}
              >
                <div className="w-5 flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      theme ? "bg-teal-600" : "bg-teal-500"
                    }`}
                  ></div>
                </div>
                <div className="flex-1 text-start">
                  <div className="dynamic-font text-sm">
                    {t("readQuran.popover.selectReciter")}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${
                      theme ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {reciterName}
                  </div>
                </div>
              </button>

              {showReciterMenu && (
                <div
                  className={`
                  absolute ${language === "ar" ? "left-0" : "right-0"}
                  mt-1 w-full rounded-lg shadow-xl border max-h-64 overflow-y-auto
                  ${
                    theme
                      ? "bg-slate-800 border-slate-600"
                      : "bg-white border-gray-200"
                  }
                `}
                  style={{
                    bottom: "100%",
                    marginBottom: "0.5rem",
                  }}
                >
                  {reciters.map((reciter) => (
                    <button
                      key={reciter.id}
                      onClick={() => handleReciterChange(reciter.id)}
                      className={`
                      w-full px-4 py-2 text-start transition-colors
                      ${theme ? "hover:bg-slate-700" : "hover:bg-gray-100"}
                      ${
                        selectedReciter === reciter.id
                          ? theme
                            ? "bg-slate-700"
                            : "bg-gray-100"
                          : ""
                      }
                    `}
                    >
                      <div className="dynamic-font text-sm">
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
