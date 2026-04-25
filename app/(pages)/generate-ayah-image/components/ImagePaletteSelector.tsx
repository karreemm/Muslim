"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faGlobe,
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
  detailsTitle: string;
  pageNumberTitle: string;
  websiteAttributionTitle: string;
  websiteAttributionHelper: string;
  selectedMode: AyahImagePaletteMode;
  showPageNumber: boolean;
  showWebsiteAttribution: boolean;
  onShowPageNumberChange: (show: boolean) => void;
  onShowWebsiteAttributionChange: (show: boolean) => void;
  onSelectPreset: (mode: FixedAyahPaletteId) => void;
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
  detailsTitle,
  pageNumberTitle,
  websiteAttributionTitle,
  websiteAttributionHelper,
  selectedMode,
  showPageNumber,
  showWebsiteAttribution,
  onShowPageNumberChange,
  onShowWebsiteAttributionChange,
  onSelectPreset,
}: ImagePaletteSelectorProps) {
  const defaultCollapsed =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches;

  const [isPaletteCollapsed, setIsPaletteCollapsed] =
    useState(defaultCollapsed);
  const [isDetailsCollapsed, setIsDetailsCollapsed] =
    useState(defaultCollapsed);

  const selectedFixedPalette =
    selectedMode === "custom"
      ? null
      : FIXED_AYAH_PALETTES.find((palette) => palette.id === selectedMode);
  const mainImageColor =
    selectedFixedPalette?.decorationHex ?? "hsl(var(--primary))";

  return (
    <div className="space-y-3">
      <div
        className={`bg-card/70 rounded-2xl border border-border/50 ${isPaletteCollapsed ? "px-4 sm:px-5 py-2" : "p-4 sm:p-5"}`}
      >
        <button
          type="button"
          onClick={() => setIsPaletteCollapsed((prev) => !prev)}
          className={`w-full flex items-center justify-between text-base font-bold text-foreground ${isPaletteCollapsed ? "mb-0" : "mb-3"}`}
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
          </div>
        )}
      </div>

      <div
        className={`bg-card/70 rounded-2xl border border-border/50 ${isDetailsCollapsed ? "px-4 sm:px-5 py-2" : "p-4 sm:p-5"}`}
      >
        <button
          type="button"
          onClick={() => setIsDetailsCollapsed((prev) => !prev)}
          className={`w-full flex items-center justify-between text-base font-bold text-foreground ${isDetailsCollapsed ? "mb-0" : "mb-3"}`}
          aria-expanded={!isDetailsCollapsed}
        >
          <span>{detailsTitle}</span>
          <FontAwesomeIcon
            icon={isDetailsCollapsed ? faChevronDown : faChevronUp}
            className="text-xs text-muted-foreground"
          />
        </button>

        {!isDetailsCollapsed && (
          <div className="space-y-3 mt-4">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-2">
              <span className="text-sm text-foreground">{pageNumberTitle}</span>
              <input
                type="checkbox"
                checked={showPageNumber}
                onChange={(event) =>
                  onShowPageNumberChange(event.target.checked)
                }
                className="h-4 w-4 accent-primary"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-sm text-foreground">
                {websiteAttributionTitle}
              </span>
              <input
                type="checkbox"
                checked={showWebsiteAttribution}
                onChange={(event) =>
                  onShowWebsiteAttributionChange(event.target.checked)
                }
                className="h-4 w-4 accent-primary"
              />
            </label>

            <p className="rounded-xl border px-3 py-2 text-xs leading-5 text-primary border-primary/50">
              {websiteAttributionHelper}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
