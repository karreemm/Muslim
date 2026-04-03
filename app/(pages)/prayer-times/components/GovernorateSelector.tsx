"use client";

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faLocationDot,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { egyptianGovernorates } from "@/constants/egyptianGovernorates";

interface GovernorateSelectorProps {
  selectedGovernorate: { en: string; ar: string };
  onGovernorateChange: (governorate: { en: string; ar: string }) => void;
  language: "en" | "ar";
}

const GovernorateSelector: React.FC<GovernorateSelectorProps> = ({
  selectedGovernorate,
  onGovernorateChange,
  language,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (gov: { en: string; ar: string }) => {
    onGovernorateChange(gov);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const selectedGov = egyptianGovernorates.find(
    (gov) => gov.en === selectedGovernorate.en,
  );

  return (
    <div
      className={`relative ${isOpen ? "z-[700]" : "z-10"}`}
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-3 py-1 border-b border-border transition-all duration-200 hover:border-primary/60 ${isOpen ? "border-primary" : ""}`}
        dir={language === "ar" ? "rtl" : "ltr"}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">
            {selectedGov?.[language] || selectedGovernorate[language]}
          </span>
        </div>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-muted-foreground transition-transform duration-200 ml-2 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className={`absolute top-[calc(100%+8px)] w-[min(280px,calc(100vw-2rem))] max-h-[min(400px,calc(100vh-200px))] bg-popover/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-border overflow-hidden z-[500] animate-in slide-in-from-top-2 fade-in duration-200 ${language === "ar" ? "right-0" : "left-0"}`}
        >
          <div className="px-4 py-3 bg-muted/50 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {language === "ar" ? "اختر المحافظة" : "Select Governorate"}
            </p>
          </div>

          <div className="overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent py-1 touch-pan-y">
            {egyptianGovernorates.map((gov) => {
              const isSelected = gov.en === selectedGovernorate.en;
              return (
                <button
                  key={gov.en}
                  onClick={() => handleSelect(gov)}
                  className={`w-full text-left px-4 py-3 text-sm transition-all duration-150 flex items-center gap-3 hover:bg-muted ${isSelected ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary" : "text-foreground"} ${language === "ar" ? "flex-row-reverse text-right" : "text-left"}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                  >
                    {isSelected && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-[10px] text-primary-foreground"
                      />
                    )}
                  </div>
                  <span className="flex-1 truncate">{gov[language]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernorateSelector;
