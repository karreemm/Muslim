"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
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
    const { theme } = useTheme();
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const [selectedReciter, setSelectedReciter] =
      useState<string>("ar.alafasy");
    const [showReciterMenu, setShowReciterMenu] = useState(false);
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
    const [popoverState, setPopoverState] = useState({
      isSaved: false,
      isLoadingAudio: false,
      isPlaying: false,
    });
    const [showTafseerModal, setShowTafseerModal] = useState(false);
    const [showTranslationModal, setShowTranslationModal] = useState(false);

    const { isSaved, isLoadingAudio, isPlaying } = popoverState;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('[role="dialog"]')) {
          return;
        }

        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node) &&
          !showTafseerModal &&
          !showTranslationModal
        ) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, onClose, showTafseerModal]);

    useEffect(() => {
      return () => {
        if (audioRef) {
          audioRef.pause();
          audioRef.src = "";
        }
      };
    }, [audioRef]);

    useEffect(() => {
      if (!isOpen) {
        setShowReciterMenu(false);
        setPopoverState({
          isSaved: false,
          isLoadingAudio: false,
          isPlaying: false,
        });
        setShowTafseerModal(false);
        setShowTranslationModal(false);
        if (audioRef) {
          audioRef.pause();
          audioRef.src = "";
        }
      }
    }, [isOpen, audioRef]);

    const handleSaveClick = useCallback(() => {
      onSave();
      setPopoverState((prev) => ({ ...prev, isSaved: true }));
      setTimeout(() => {
        onClose();
      }, 1000);
    }, [onSave, onClose]);

    const handleListenClick = useCallback(async () => {
      if (isPlaying && audioRef) {
        audioRef.pause();
        setPopoverState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }

      setPopoverState((prev) => ({ ...prev, isLoadingAudio: true }));

      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedReciter}`,
        );

        if (!response.ok) {
          console.error("Failed to fetch surah data");
          setPopoverState((prev) => ({ ...prev, isLoadingAudio: false }));
          return;
        }

        const data = await response.json();
        const ayahData = data.data.ayahs.find(
          (a: any) => a.numberInSurah === ayahNumber,
        );

        if (!ayahData || !ayahData.audio) {
          console.error("Audio URL not found for this ayah");
          setPopoverState((prev) => ({ ...prev, isLoadingAudio: false }));
          return;
        }

        const audioUrl = ayahData.audio;
        console.log("Playing audio from:", audioUrl);

        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setPopoverState((prev) => ({ ...prev, isPlaying: false }));
        };

        audio.onerror = () => {
          console.error("Error playing audio");
          setPopoverState((prev) => ({
            ...prev,
            isPlaying: false,
            isLoadingAudio: false,
          }));
        };

        audio.onloadeddata = () => {
          setPopoverState((prev) => ({ ...prev, isLoadingAudio: false }));
        };

        setAudioRef(audio);
        await audio.play();
        setPopoverState((prev) => ({ ...prev, isPlaying: true }));
      } catch (error) {
        console.error("Error playing ayah audio:", error);
        setPopoverState((prev) => ({ ...prev, isLoadingAudio: false }));
      }
    }, [isPlaying, audioRef, surahNumber, selectedReciter, ayahNumber]);

    const handleReciterChange = useCallback(
      (reciterId: string) => {
        setSelectedReciter(reciterId);
        setShowReciterMenu(false);

        if (typeof window !== "undefined") {
          localStorage.setItem("preferredReciter", reciterId);
        }

        if (audioRef && isPlaying) {
          audioRef.pause();
          setPopoverState((prev) => ({ ...prev, isPlaying: false }));
        }
      },
      [audioRef, isPlaying],
    );

    useEffect(() => {
      if (typeof window !== "undefined") {
        const savedReciter = localStorage.getItem("preferredReciter");
        if (savedReciter) {
          setSelectedReciter(savedReciter);
        }
      }
    }, []);

    if (!isOpen) return null;

    const selectedReciterData = reciters.find((r) => r.id === selectedReciter);
    const reciterName = selectedReciterData
      ? language === "ar"
        ? selectedReciterData.NameAr
        : selectedReciterData.NameEn
      : "";

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
