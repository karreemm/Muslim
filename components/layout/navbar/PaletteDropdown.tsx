"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faChevronDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { usePalette } from "../../../context/general/PaletteContext";
import { useLanguage } from "../../../context/general/LanguageContext";

type Props = {
  className?: string;
};

const labels = {
  ar: {
    title: "اللون",
    teal: "أخضر",
    gold: "ذهبي",
  },
  en: {
    title: "Palette",
    teal: "Teal",
    gold: "Gold",
  },
};

const colorBoxClasses = {
  teal: "bg-gradient-to-br from-teal-400 to-teal-600",
  gold: "bg-gradient-to-br from-yellow-400 to-yellow-600",
};

export default function PaletteDropdown({ className = "" }: Props) {
  const { palette, setPalette } = usePalette();
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

  const selectPalette = (mode: "teal" | "gold") => {
    setPalette(mode);
    setIsOpen(false);
  };

  const paletteLabel = palette === "teal" ? copy.teal : copy.gold;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="group flex h-10 w-auto min-w-10 px-3 items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/80 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-md hover:shadow-primary/5"
        aria-label={copy.title}
      >
        <FontAwesomeIcon
          icon={faPalette}
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
              onClick={() => selectPalette("teal")}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-all duration-200 hover:bg-secondary/50 ${
                palette === "teal"
                  ? "bg-primary/5 text-primary"
                  : "text-popover-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md ${colorBoxClasses.teal}`} />
                {copy.teal}
              </span>
              {palette === "teal" && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-xs text-primary"
                />
              )}
            </button>

            <button
              onClick={() => selectPalette("gold")}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-all duration-200 hover:bg-secondary/50 ${
                palette === "gold"
                  ? "bg-primary/5 text-primary"
                  : "text-popover-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md ${colorBoxClasses.gold}`} />
                {copy.gold}
              </span>
              {palette === "gold" && (
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
