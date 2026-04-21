"use client";

import { useEffect, useMemo, useRef } from "react";
import { generateCSSVars } from "@/utils/paletteEngine";
import QuranPageRenderer from "@/app/(pages)/read-quran/components/general/QuranPageRenderer";
import { useQuranPageFont } from "@/hooks/readQuran/useQuranPageFont";
import { useContainerFontSize } from "@/hooks/readQuran/useContainerFontSize";
import type { AyahImageData } from "../types";
import {
  FIXED_AYAH_PALETTES,
  hexToHslTriplet,
  type AyahImagePaletteMode,
} from "../palettePresets";

interface AyahImagePreviewProps {
  language: string;
  ayahData: AyahImageData | null;
  paletteMode: AyahImagePaletteMode;
  paletteHue: number;
  imageTheme: "light" | "dark";
  showPageNumber: boolean;
  isLoading: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onFontReadyChange: (ready: boolean) => void;
  renderMode?: "preview" | "export";
}

export default function AyahImagePreview({
  language,
  ayahData,
  paletteMode,
  paletteHue,
  imageTheme,
  showPageNumber,
  isLoading,
  previewRef,
  onFontReadyChange,
  renderMode = "preview",
}: AyahImagePreviewProps) {
  const isArabic = language === "ar";
  const contentRef = useRef<HTMLDivElement>(null);

  const { fontSize, lineHeight } = useContainerFontSize(contentRef);
  const { fontReady, fontLoadTried } = useQuranPageFont(ayahData?.pageNumber);

  useEffect(() => {
    onFontReadyChange(!ayahData || (fontLoadTried && fontReady));
  }, [ayahData, fontLoadTried, fontReady, onFontReadyChange]);

  const paletteVars = useMemo(() => {
    if (paletteMode !== "custom") {
      const fixedPalette = FIXED_AYAH_PALETTES.find(
        (palette) => palette.id === paletteMode,
      );

      if (fixedPalette) {
        const background = hexToHslTriplet(fixedPalette.backgroundHex);
        const decoration = hexToHslTriplet(fixedPalette.decorationHex);

        return {
          "--background": background,
          "--foreground": decoration,
          "--card": background,
          "--card-foreground": decoration,
          "--popover": background,
          "--popover-foreground": decoration,
          "--primary": decoration,
          "--primary-foreground": background,
          "--secondary": background,
          "--secondary-foreground": decoration,
          "--muted": background,
          "--muted-foreground": decoration,
          "--accent": decoration,
          "--accent-foreground": background,
          "--destructive": "0 73% 42%",
          "--destructive-foreground": background,
          "--border": decoration,
          "--input": decoration,
          "--ring": decoration,
          "--player-bg": background,
          "--player-foreground": decoration,
          "--player-control": decoration,
          "--player-track": decoration,
          "--player-track-active": decoration,
          "--quran-surface": background,
          "--quran-surface-foreground": decoration,
          "--quran-highlight": decoration,
          "--quran-highlight-soft": background,
          "--scrollbar-track": background,
          "--scrollbar-thumb": decoration,
          "--scrollbar-thumb-hover": decoration,
          "--quran-karaoke-base": decoration,
          "--surah-header-foreground": decoration,
          "--surah-header-shadow": "0 0% 0% / 0.55",
          "--prayer-times-next": decoration,
          "--prayer-times-next-bg": background,
          "--prayer-times-next-foreground": background,
          "--celebration-1": decoration,
          "--celebration-2": background,
          "--celebration-3": decoration,
          "--celebration-4": background,
          "--celebration-5": decoration,
          "--celebration-6": background,
          "--celebration-7": decoration,
        };
      }
    }

    return generateCSSVars(paletteHue, imageTheme === "dark");
  }, [paletteMode, paletteHue, imageTheme]);

  const wrapperStyle = {
    ...paletteVars,
    backgroundColor: "hsl(var(--quran-surface))",
    color: "hsl(var(--quran-surface-foreground))",
    borderColor: "hsl(var(--border))",
  } as React.CSSProperties;

  const isExportMode = renderMode === "export";

  return (
    <div className="bg-card/70 rounded-2xl border border-border/50 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">
          {isArabic ? "الصورة الحالية" : "Image Preview"}
        </h3>
      </div>

      <div
        ref={previewRef}
        style={wrapperStyle}
        className={`relative w-full overflow-hidden border ${
          isExportMode ? "p-4" : "p-2 md:p-4"
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, hsl(var(--primary) / 0.08), transparent, hsl(var(--primary) / 0.08))",
          }}
        />

        <div
          ref={contentRef}
          className={`max-w-4xl mx-auto py-4 ${
            isExportMode ? "w-full" : "w-[92%] lg:w-full"
          }`}
        >
          {isLoading ? (
            <div className="h-full w-full rounded-xl bg-muted/50 animate-pulse" />
          ) : ayahData ? (
            <div className="relative h-full w-full pointer-events-none">
              <QuranPageRenderer
                verses={[ayahData.targetVerse]}
                fontSize={fontSize}
                lineHeight={lineHeight}
                pageNumber={ayahData.pageNumber}
                highlightedAyahNumber={0}
                forceTopSurahHeaderNumber={ayahData.surahNumber}
                headerColorScopeElement={previewRef.current}
                paletteHueToken={paletteHue}
                imageMode
                showPageNumber={showPageNumber}
              />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-center text-muted-foreground px-6">
              {isArabic
                ? "اختر سورة وآية لعرضها هنا"
                : "Select a surah and ayah to preview here"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
