"use client";

import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  FIXED_AYAH_PALETTES,
  type AyahImagePaletteMode,
  type FixedAyahPalette,
  type FixedAyahPaletteId,
} from "../palettePresets";

interface ImagePaletteSelectorProps {
  language: string;
  title: string;
  presetsTitle: string;
  customTitle: string;
  themeTitle: string;
  separatorLabel: string;
  pageNumberTitle: string;
  showLabel: string;
  hideLabel: string;
  lightLabel: string;
  darkLabel: string;
  selectedMode: AyahImagePaletteMode;
  selectedHue: number;
  imageTheme: "light" | "dark";
  showPageNumber: boolean;
  onThemeChange: (theme: "light" | "dark") => void;
  onShowPageNumberChange: (show: boolean) => void;
  onSelectPreset: (mode: FixedAyahPaletteId) => void;
  onCustomHueChange: (hue: number) => void;
}

function fixedPaletteSwatchStyle(palette: FixedAyahPalette) {
  return {
    background: `linear-gradient(135deg, ${palette.backgroundHex} 0 49.5%, ${palette.decorationHex} 50% 100%)`,
  };
}

export default function ImagePaletteSelector({
  language,
  title,
  presetsTitle,
  customTitle,
  themeTitle,
  separatorLabel,
  pageNumberTitle,
  showLabel,
  hideLabel,
  lightLabel,
  darkLabel,
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
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-3">
                {presetsTitle}
              </p>
              <div className="grid grid-cols-5 gap-3">
                {FIXED_AYAH_PALETTES.map((palette) => {
                  const isActive = selectedMode === palette.id;

                  return (
                    <button
                      key={palette.id}
                      type="button"
                      title={
                        language === "ar" ? palette.labelAr : palette.label
                      }
                      onClick={() => onSelectPreset(palette.id)}
                      className={`group relative flex  h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isActive
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
                          : "opacity-90 hover:opacity-100 hover:scale-[1.03]"
                      }`}
                    >
                      <span
                        className="block h-full w-full rounded-full"
                        style={fixedPaletteSwatchStyle(palette)}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.35em] text-muted-foreground mt-8 mb-4">
              <div className="h-px flex-1 bg-border/60" />
              <span>{separatorLabel}</span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {customTitle}
              </p>

              <div className="mb-4">
                <p className="text-[11px] font-medium text-muted-foreground mb-2">
                  {themeTitle}
                </p>
                <div className="grid grid-cols-2 gap-2">
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
              </div>

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
            </div>
          </div>
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
