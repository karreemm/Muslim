"use client";

import { useEffect, useMemo, useRef } from "react";
import { generateCSSVars } from "@/utils/paletteEngine";
import QuranPageRenderer from "@/app/(pages)/read-quran/components/general/QuranPageRenderer";
import { useQuranPageFont } from "@/hooks/readQuran/useQuranPageFont";
import { useContainerFontSize } from "@/hooks/readQuran/useContainerFontSize";
import type { AyahImageData } from "../types";

interface AyahImagePreviewProps {
  language: string;
  ayahData: AyahImageData | null;
  paletteHue: number;
  imageTheme: "light" | "dark";
  showPageNumber: boolean;
  isLoading: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onFontReadyChange: (ready: boolean) => void;
}

export default function AyahImagePreview({
  language,
  ayahData,
  paletteHue,
  imageTheme,
  showPageNumber,
  isLoading,
  previewRef,
  onFontReadyChange,
}: AyahImagePreviewProps) {
  const isArabic = language === "ar";
  const contentRef = useRef<HTMLDivElement>(null);

  const { fontSize, lineHeight } = useContainerFontSize(contentRef);
  const { fontReady, fontLoadTried } = useQuranPageFont(ayahData?.pageNumber);

  useEffect(() => {
    onFontReadyChange(!ayahData || (fontLoadTried && fontReady));
  }, [ayahData, fontLoadTried, fontReady, onFontReadyChange]);

  const paletteVars = useMemo(
    () => generateCSSVars(paletteHue, imageTheme === "dark"),
    [paletteHue, imageTheme],
  );

  const wrapperStyle = {
    ...paletteVars,
    backgroundColor: "hsl(var(--quran-surface))",
    color: "hsl(var(--quran-surface-foreground))",
    borderColor: "hsl(var(--border))",
  } as React.CSSProperties;

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
        className="relative w-full overflow-hidden rounded-2xl border p-2 md:p-4"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, hsl(var(--primary) / 0.08), transparent, hsl(var(--primary) / 0.08))",
          }}
        />

        <div ref={contentRef} className="w-[92%] lg:w-full max-w-4xl mx-auto">
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
