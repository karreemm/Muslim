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
import { useTheme } from "../../../context/general/ThemeContext";
import { useLanguage } from "../../../context/general/LanguageContext";

type Props = {
  className?: string;
};

const labels = {
  ar: {
    title: "المظهر",
    light: "فاتح",
    dark: "داكن",
    system: "تلقائي",
  },
  en: {
    title: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
};

export default function ThemeDropdown({ className = "" }: Props) {
  const { theme, setTheme } = useTheme();
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
    setTheme(mode);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="group flex h-10 w-auto min-w-10 px-3 items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/80 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-md hover:shadow-primary/5"
        aria-label={copy.title}
      >
        <FontAwesomeIcon
          icon={theme === "dark" ? faMoon : faSun}
          className="text-sm text-muted-foreground transition-all group-hover:text-primary group-hover:scale-110"
        />
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[60] mt-2 w-44 overflow-hidden rounded-2xl border border-border/50 bg-popover/95 text-popover-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-200 ${
            isArabic ? "left-0 text-right" : "right-0 text-left"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2.5 bg-muted/30">
            <FontAwesomeIcon
              icon={faPalette}
              className="text-xs text-primary"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {copy.title}
            </span>
          </div>

          {/* Options */}
          <div className="py-1">
            <button
              onClick={() => selectTheme("light")}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-all duration-200 hover:bg-secondary/50 ${
                theme === "light"
                  ? "bg-primary/5 text-primary"
                  : "text-popover-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-md ${theme === "light" ? "bg-primary/20" : "bg-secondary/50"}`}
                >
                  <FontAwesomeIcon
                    icon={faSun}
                    className="text-xs text-primary"
                  />
                </div>
                {copy.light}
              </span>
              {theme === "light" && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-xs text-primary"
                />
              )}
            </button>

            <button
              onClick={() => selectTheme("dark")}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-all duration-200 hover:bg-secondary/50 ${
                theme === "dark"
                  ? "bg-primary/5 text-primary"
                  : "text-popover-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-md ${theme === "dark" ? "bg-primary/20" : "bg-secondary/50"}`}
                >
                  <FontAwesomeIcon
                    icon={faMoon}
                    className="text-xs text-primary"
                  />
                </div>
                {copy.dark}
              </span>
              {theme === "dark" && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-xs text-primary"
                />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
