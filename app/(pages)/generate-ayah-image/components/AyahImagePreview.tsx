"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosque } from "@fortawesome/free-solid-svg-icons";
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
  showWebsiteAttribution: boolean;
  isLoading: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onFontReadyChange: (ready: boolean) => void;
  onHeaderReadyChange?: (ready: boolean) => void;
  renderMode?: "preview" | "export";
  specificPartEnabled?: boolean;
  specificPartStartWordIndex?: number;
  specificPartEndWordIndex?: number;
  onSpecificPartStartWordIndexChange?: (index: number) => void;
  onSpecificPartEndWordIndexChange?: (index: number) => void;
}

function AyahImagePreviewSkeleton() {
  const lineWidths = ["96%", "90%", "94%"];

  return (
    <div className="w-full flex flex-col items-center py-1 px-0 animate-pulse">
      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-full h-14 bg-muted rounded-xl mb-2" />
        <div className="w-[48%] h-7 bg-muted rounded-lg mb-4" />
        {lineWidths.map((width, index) => (
          <div
            key={index}
            className="h-7 bg-muted rounded-lg"
            style={{ width }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AyahImagePreview({
  language,
  ayahData,
  paletteMode,
  paletteHue,
  imageTheme,
  showPageNumber,
  showWebsiteAttribution,
  isLoading,
  previewRef,
  onFontReadyChange,
  onHeaderReadyChange,
  renderMode = "preview",
  specificPartEnabled = false,
  specificPartStartWordIndex = 0,
  specificPartEndWordIndex = 0,
  onSpecificPartStartWordIndexChange,
  onSpecificPartEndWordIndexChange,
}: AyahImagePreviewProps) {
  const MIN_SKELETON_DURATION_MS = 500;
  const isArabic = language === "ar";
  const contentRef = useRef<HTMLDivElement>(null);
  const loadingStartRef = useRef<number | null>(null);
  const loadingHideTimerRef = useRef<number | null>(null);
  const [showMinLoadingSkeleton, setShowMinLoadingSkeleton] = useState(false);

  const { fontSize, lineHeight } = useContainerFontSize(contentRef);
  const { fontReady, fontLoadTried } = useQuranPageFont(ayahData?.pageNumber);
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches;

  useEffect(() => {
    if (loadingHideTimerRef.current !== null) {
      window.clearTimeout(loadingHideTimerRef.current);
      loadingHideTimerRef.current = null;
    }

    if (isLoading) {
      loadingStartRef.current = Date.now();
      setShowMinLoadingSkeleton(true);
      return;
    }

    if (!showMinLoadingSkeleton) return;

    const startedAt = loadingStartRef.current;
    const elapsed = startedAt
      ? Date.now() - startedAt
      : MIN_SKELETON_DURATION_MS;
    const remaining = Math.max(0, MIN_SKELETON_DURATION_MS - elapsed);

    if (remaining === 0) {
      setShowMinLoadingSkeleton(false);
      return;
    }

    loadingHideTimerRef.current = window.setTimeout(() => {
      setShowMinLoadingSkeleton(false);
      loadingHideTimerRef.current = null;
    }, remaining);
  }, [isLoading, showMinLoadingSkeleton]);

  useEffect(() => {
    return () => {
      if (loadingHideTimerRef.current !== null) {
        window.clearTimeout(loadingHideTimerRef.current);
      }
    };
  }, []);

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

  const isExportMode = renderMode === "export";
  const showLoadingSkeleton = isExportMode ? isLoading : showMinLoadingSkeleton;
  const wrapperStyle = {
    ...paletteVars,
    backgroundColor: "hsl(var(--quran-surface))",
    color: "hsl(var(--quran-surface-foreground))",
    ...(isExportMode ? {} : { borderColor: "hsl(var(--border))" }),
  } as React.CSSProperties;
  const showSpecificPartControls =
    !isExportMode &&
    specificPartEnabled &&
    ayahData &&
    ayahData.totalSelectableWords > 0 &&
    !!onSpecificPartStartWordIndexChange &&
    !!onSpecificPartEndWordIndexChange;
  const previewVerses =
    showSpecificPartControls && ayahData
      ? ayahData.targetVerses
      : (ayahData?.displayVerses ?? []);

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
        className={`relative w-full overflow-hidden ${
          isExportMode ? "border-0" : "border"
        } ${isExportMode ? "p-4" : "p-2 md:p-4"}`}
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
          {showLoadingSkeleton ? (
            <AyahImagePreviewSkeleton />
          ) : ayahData ? (
            <div className="relative h-full w-full">
              <QuranPageRenderer
                verses={previewVerses}
                fontSize={fontSize}
                lineHeight={lineHeight}
                pageNumber={ayahData.pageNumber}
                highlightedAyahNumber={0}
                forceTopSurahHeaderNumber={ayahData.surahNumber}
                headerColorScopeElement={previewRef.current}
                paletteHueToken={paletteHue}
                imageMode
                showPageNumber={showPageNumber}
                onHeaderReadyChange={onHeaderReadyChange}
                requireColoredHeaderForReady={isExportMode}
                fixedHeaderTypography={isExportMode}
                loadingSkeletonVariant="ayah-image"
                wordRangeSelection={
                  showSpecificPartControls
                    ? {
                        enabled: true,
                        startWordIndex: specificPartStartWordIndex,
                        endWordIndex: specificPartEndWordIndex,
                        onStartWordIndexChange:
                          onSpecificPartStartWordIndexChange,
                        onEndWordIndexChange: onSpecificPartEndWordIndexChange,
                      }
                    : undefined
                }
              />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-center text-muted-foreground px-6">
              {isArabic
                ? "اختر سورة وآية لعرضها هنا"
                : "Select a surah and ayah to preview here"}
            </div>
          )}

          {showWebsiteAttribution && (
            <div
              className={`mt-12 border-t pt-3`}
              style={{
                borderColor: "hsl(var(--primary) / 0.35)",
                fontSize: isExportMode
                  ? "15px"
                  : isMobile
                    ? `${fontSize * 0.65}px`
                    : `${fontSize * 0.45}px`,
              }}
            >
              <div
                dir="ltr"
                className="flex items-center justify-center gap-2 font-semibold"
              >
                <FontAwesomeIcon
                  icon={faMosque}
                  className="text-[hsl(var(--primary))]/30"
                  style={{
                    fontSize: isExportMode
                      ? "15px"
                      : isMobile
                        ? `${fontSize * 0.65}px`
                        : `${fontSize * 0.45}px`,
                  }}
                />
                <span dir="ltr" className="text-[hsl(var(--primary))]/30 mt-1">
                  https://muslim-one.vercel.app
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
