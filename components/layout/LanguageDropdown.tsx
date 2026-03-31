"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAfrica,
  faCheck,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../context/LanguageContext";

type Props = {
  className?: string;
};

const labels = {
  ar: {
    title: "اللغة",
    current: "العربية",
    ar: "العربية",
    en: "الإنجليزية",
  },
  en: {
    title: "Language",
    current: "English",
    ar: "Arabic",
    en: "English",
  },
};

export default function LanguageDropdown({ className = "" }: Props) {
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isArabic = language === "ar";
  const copy = isArabic ? labels.ar : labels.en;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (targetLanguage: "ar" | "en") => {
    if (targetLanguage !== language) {
      toggleLanguage();
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="group flex h-10 min-w-10 items-center justify-center gap-2 rounded-xl border border-border/40 bg-card/80 px-3 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-card"
        aria-label={copy.title}
      >
        <FontAwesomeIcon
          icon={faEarthAfrica}
          className="text-sm text-muted-foreground transition-colors group-hover:text-primary"
        />
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`hidden text-xs text-muted-foreground transition-transform lg:inline ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[60] mt-2 w-44 overflow-hidden rounded-xl border border-border/40 bg-popover text-popover-foreground shadow-xl ${
            isArabic ? "left-0 text-right" : "right-0 text-left"
          }`}
        >
          <div className="border-b border-border/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {copy.title}
          </div>

          <button
            onClick={() => changeLanguage("ar")}
            className="flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <span>{copy.ar}</span>
            {language === "ar" && (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-xs text-primary"
              />
            )}
          </button>

          <button
            onClick={() => changeLanguage("en")}
            className="flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <span>{copy.en}</span>
            {language === "en" && (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-xs text-primary"
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
