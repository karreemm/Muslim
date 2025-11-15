"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faHeadphones,
  faTimes,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../Context/LanguageContext";
import { useTheme } from "../../../Context/ThemeContext";
import TranslationPair from "../../../Types";
import { reciters } from "../../../Contants/RecitersData";

interface AyahPopoverProps {
  isOpen: boolean;
  ayahNumber: number;
  surahNumber: number;
  position: { x: number; y: number };
  onClose: () => void;
  onSave: () => void;
}

export const AyahPopover: React.FC<AyahPopoverProps> = ({
  isOpen,
  ayahNumber,
  surahNumber,
  position,
  onClose,
  onSave,
}) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>("ar.alafasy");
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Translations
  const translations = {
    saveAyah: { en: "Save Ayah", ar: "حفظ الآية" } as TranslationPair,
    listenAyah: { en: "Listen to Ayah", ar: "استمع للآية" } as TranslationPair,
    selectReciter: {
      en: "Select Reciter",
      ar: "اختر القارئ",
    } as TranslationPair,
    saved: { en: "Saved!", ar: "تم الحفظ!" } as TranslationPair,
    loading: { en: "Loading...", ar: "جاري التحميل..." } as TranslationPair,
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
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
  }, [isOpen, onClose]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = "";
      }
    };
  }, [audioRef]);

  // Reset states when popover closes
  useEffect(() => {
    if (!isOpen) {
      setShowReciterMenu(false);
      setIsPlaying(false);
      setIsSaved(false);
      if (audioRef) {
        audioRef.pause();
        audioRef.src = "";
      }
    }
  }, [isOpen, audioRef]);

  const handleSaveClick = () => {
    onSave();
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleListenClick = async () => {
    if (isPlaying && audioRef) {
      audioRef.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);

    try {
      // Fetch the surah data to get the actual audio URL for this ayah
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedReciter}`
      );

      if (!response.ok) {
        console.error("Failed to fetch surah data");
        setIsLoadingAudio(false);
        return;
      }

      const data = await response.json();
      const ayahData = data.data.ayahs.find(
        (a: any) => a.numberInSurah === ayahNumber
      );

      if (!ayahData || !ayahData.audio) {
        console.error("Audio URL not found for this ayah");
        setIsLoadingAudio(false);
        return;
      }

      const audioUrl = ayahData.audio;
      console.log("Playing audio from:", audioUrl);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        console.error("Error playing audio");
        setIsPlaying(false);
        setIsLoadingAudio(false);
      };

      audio.onloadeddata = () => {
        setIsLoadingAudio(false);
      };

      setAudioRef(audio);
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing ayah audio:", error);
      setIsLoadingAudio(false);
    }
  };

  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    setShowReciterMenu(false);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredReciter", reciterId);
    }

    // Stop current audio if playing
    if (audioRef && isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    }
  };

  // Load preferred reciter from localStorage
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
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      ref={popoverRef}
      className={`
        fixed z-50 rounded-lg shadow-2xl border
        ${
          theme
            ? "bg-slate-800 border-slate-600 text-white"
            : "bg-white border-gray-200 text-gray-800"
        }
        min-w-[240px] max-w-[280px]
        transition-all duration-200 ease-in-out
      `}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
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

      {/* Menu Items */}
      <div className="py-2">
        {/* Save Ayah Option */}
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
            {isSaved
              ? translations.saved[language]
              : translations.saveAyah[language]}
          </span>
        </button>

        {/* Listen to Ayah Option */}
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
              ? translations.loading[language]
              : translations.listenAyah[language]}
          </span>
          {isPlaying && (
            <div className="flex items-center gap-0.5">
              <div className="w-1 bg-teal-600 dark:bg-teal-500 rounded-full animate-[wave_0.8s_ease-in-out_infinite]" style={{ height: '12px', animationDelay: '0s' }}></div>
              <div className="w-1 bg-teal-600 dark:bg-teal-500 rounded-full animate-[wave_0.8s_ease-in-out_infinite]" style={{ height: '16px', animationDelay: '0.1s' }}></div>
              <div className="w-1 bg-teal-600 dark:bg-teal-500 rounded-full animate-[wave_0.8s_ease-in-out_infinite]" style={{ height: '10px', animationDelay: '0.2s' }}></div>
              <div className="w-1 bg-teal-600 dark:bg-teal-500 rounded-full animate-[wave_0.8s_ease-in-out_infinite]" style={{ height: '14px', animationDelay: '0.3s' }}></div>
            </div>
          )}
        </button>

        {/* Reciter Selection */}
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
                {translations.selectReciter[language]}
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

          {/* Reciter Dropdown */}
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
  );
};
