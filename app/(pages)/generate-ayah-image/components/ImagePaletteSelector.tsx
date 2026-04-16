"use client";

import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { PALETTE_PRESETS, type PaletteMode } from "@/utils/paletteEngine";

interface ImagePaletteSelectorProps {
  language: string;
  title: string;
  presetsTitle: string;
  customTitle: string;
  themeTitle: string;
  pageNumberTitle: string;
  showLabel: string;
  hideLabel: string;
  lightLabel: string;
  darkLabel: string;
  presetKeys: Exclude<PaletteMode, "custom">[];
  selectedMode: PaletteMode;
  selectedHue: number;
  imageTheme: "light" | "dark";
  showPageNumber: boolean;
  onThemeChange: (theme: "light" | "dark") => void;
  onShowPageNumberChange: (show: boolean) => void;
  onSelectPreset: (mode: Exclude<PaletteMode, "custom">) => void;
  onCustomHueChange: (hue: number) => void;
}

export default function ImagePaletteSelector({
  language,
  title,
  presetsTitle,
  customTitle,
  themeTitle,
  pageNumberTitle,
  showLabel,
  hideLabel,
  lightLabel,
  darkLabel,
  presetKeys,
  selectedMode,
  selectedHue,
  imageTheme,
  showPageNumber,
  onThemeChange,
  onShowPageNumberChange,
  onSelectPreset,
  onCustomHueChange,
}: ImagePaletteSelectorProps) {
  const defaultCollapsed =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches;

  const [isPaletteCollapsed, setIsPaletteCollapsed] =
    useState(defaultCollapsed);
  const [isPageNumberCollapsed, setIsPageNumberCollapsed] =
    useState(defaultCollapsed);

  const trackRef = useRef<HTMLDivElement>(null);

  const hueGradient = `linear-gradient(to right,${Array.from(
    { length: 13 },
    (_, index) => `hsl(${index * 30},75%,48%)`,
  ).join(",")})`;

  const getHueFromEvent = (event: MouseEvent | TouchEvent) => {
    if (!trackRef.current) return selectedHue;

    const rect = trackRef.current.getBoundingClientRect();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const percent = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    return Math.round(percent * 359);
  };

  const startDrag = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();

    const move = (nativeEvent: MouseEvent | TouchEvent) => {
      onCustomHueChange(getHueFromEvent(nativeEvent));
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

    move(event.nativeEvent as MouseEvent);
  };

  return (
    <div className="space-y-3">
      <div className="bg-card/70 rounded-2xl border border-border/50 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setIsPaletteCollapsed((prev) => !prev)}
          className="w-full flex items-center justify-between text-base font-bold text-foreground mb-3"
          aria-expanded={!isPaletteCollapsed}
        >
          <span>{title}</span>
          <FontAwesomeIcon
            icon={isPaletteCollapsed ? faChevronDown : faChevronUp}
            className="text-xs text-muted-foreground"
          />
        </button>

        {!isPaletteCollapsed && (
          <>
            <p className="text-xs text-muted-foreground mb-2">{themeTitle}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => onThemeChange("light")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  imageTheme === "light"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {lightLabel}
              </button>
              <button
                type="button"
                onClick={() => onThemeChange("dark")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  imageTheme === "dark"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {darkLabel}
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-2">{presetsTitle}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {presetKeys.map((key) => {
                const preset = PALETTE_PRESETS[key];
                const isActive = selectedMode === key;

                return (
                  <button
                    key={key}
                    type="button"
                    title={language === "ar" ? preset.labelAr : preset.label}
                    onClick={() => onSelectPreset(key)}
                    className="relative w-8 h-8 rounded-full border-2 transition-transform duration-200 hover:scale-110"
                    style={{
                      background: `hsl(${preset.hue},70%,45%)`,
                      borderColor: isActive
                        ? "hsl(var(--foreground))"
                        : "transparent",
                    }}
                  >
                    {isActive && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="absolute inset-0 m-auto text-[9px] text-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mb-2">{customTitle}</p>
            <div
              ref={trackRef}
              className="relative h-6 flex items-center cursor-pointer select-none"
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
                  left: `calc(${(selectedHue / 359) * 100}% - 8px)`,
                  background: `hsl(${selectedHue},80%,50%)`,
                }}
              />
            </div>
          </>
        )}
      </div>

      <div className="bg-card/70 rounded-2xl border border-border/50 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setIsPageNumberCollapsed((prev) => !prev)}
          className="w-full flex items-center justify-between text-base font-bold text-foreground mb-3"
          aria-expanded={!isPageNumberCollapsed}
        >
          <span>{pageNumberTitle}</span>
          <FontAwesomeIcon
            icon={isPageNumberCollapsed ? faChevronDown : faChevronUp}
            className="text-xs text-muted-foreground"
          />
        </button>

        {!isPageNumberCollapsed && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onShowPageNumberChange(true)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                showPageNumber
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {showLabel}
            </button>
            <button
              type="button"
              onClick={() => onShowPageNumberChange(false)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                !showPageNumber
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {hideLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
