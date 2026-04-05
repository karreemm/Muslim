"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { usePalette } from "../../../context/general/PaletteContext";
import { useLanguage } from "../../../context/general/LanguageContext";
import { PALETTE_PRESETS, PaletteMode } from "@/utils/paletteEngine";

type Props = { className?: string };

const PRESET_KEYS = Object.keys(PALETTE_PRESETS) as Exclude<PaletteMode, "custom">[];

export default function PaletteDropdown({ className = "" }: Props) {
  const { palette, hue, setPalette } = usePalette();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [sliderHue, setSliderHue] = useState(hue);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isArabic = language === "ar";

  useEffect(() => { setSliderHue(hue); }, [hue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectPreset = (mode: Exclude<PaletteMode, "custom">) => {
    setPalette(mode);
    setSliderHue(PALETTE_PRESETS[mode].hue);
  };

  const getHueFromEvent = (e: MouseEvent | TouchEvent) => {
    if (!trackRef.current) return sliderHue;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * 359);
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    const move = (ev: MouseEvent | TouchEvent) => {
      const newHue = getHueFromEvent(ev);
      setSliderHue(newHue);
      setPalette("custom", newHue);
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);

    move(e.nativeEvent as MouseEvent);
  };

  const hueGradient = `linear-gradient(to right,${
    Array.from({ length: 13 }, (_, i) => `hsl(${i * 30},75%,48%)`).join(",")
  })`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="group flex h-10 w-auto min-w-10 px-3 items-center justify-center gap-2 rounded-xl border border-border/50 bg-card/80 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-md hover:shadow-primary/5"
        aria-label="Palette"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-white/40 flex-shrink-0"
          style={{ background: `hsl(${sliderHue},70%,48%)` }}
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
          className={`absolute z-[60] mt-2 w-56 overflow-hidden rounded-2xl border border-border/50 bg-popover/95 text-popover-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-200 ${
            isArabic ? "left-0" : "right-0"
          }`}
        >
          <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2.5 bg-muted/30">
            <FontAwesomeIcon icon={faPalette} className="text-xs text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isArabic ? "اللون" : "Palette"}
            </span>
          </div>

          <div className="px-3 pt-3 pb-2">
            <p className="text-[10px] text-muted-foreground mb-2">
              {isArabic ? "ألوان مقترحة" : "Presets"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_KEYS.map((key) => {
                const preset = PALETTE_PRESETS[key];
                const isActive = palette === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectPreset(key)}
                    title={isArabic ? preset.labelAr : preset.label}
                    className="relative w-7 h-7 rounded-full border-2 transition-all duration-150 hover:scale-110"
                    style={{
                      background: `hsl(${preset.hue},70%,44%)`,
                      borderColor: isActive
                        ? "hsl(var(--foreground))"
                        : "transparent",
                    }}
                  >
                    {isActive && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="absolute inset-0 m-auto text-[8px] text-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border/50 mx-3" />

          <div className="px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-muted-foreground">
                {isArabic ? "لون مخصص" : "Custom Color"}
              </p>
            </div>

            <div
              ref={trackRef}
              className="relative h-5 flex items-center cursor-pointer select-none"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div
                className="absolute inset-x-0 h-2 rounded-full"
                style={{ background: hueGradient }}
              />
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none"
                style={{
                  left: `calc(${(sliderHue / 359) * 100}% - 8px)`,
                  background: `hsl(${sliderHue},80%,50%)`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}