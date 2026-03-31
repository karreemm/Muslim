"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faChevronDown,
  faCheck,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

type Props = {
  className?: string;
};

const labels = {
  ar: {
    title: "المظهر",
    light: "فاتح",
    dark: "داكن",
  },
  en: {
    title: "Theme",
    light: "Light",
    dark: "Dark",
  },
};

export default function ThemeDropdown({ className = "" }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
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

  const selectTheme = (mode: "light" | "dark") => {
    const shouldBeDark = mode === "dark";
    if (theme !== shouldBeDark) {
      toggleTheme();
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
          icon={theme ? faMoon : faSun}
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
          <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <FontAwesomeIcon icon={faPalette} className="text-[10px]" />
            <span>{copy.title}</span>
          </div>

          <button
            onClick={() => selectTheme("light")}
            className="flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSun} className="text-xs text-primary" />
              {copy.light}
            </span>
            {!theme && (
              <FontAwesomeIcon icon={faCheck} className="text-xs text-primary" />
            )}
          </button>

          <button
            onClick={() => selectTheme("dark")}
            className="flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMoon} className="text-xs text-primary" />
              {copy.dark}
            </span>
            {theme && (
              <FontAwesomeIcon icon={faCheck} className="text-xs text-primary" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
