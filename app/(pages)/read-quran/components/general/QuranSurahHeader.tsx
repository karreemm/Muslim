"use client";

import { useEffect, useState } from "react";
import { useHeaderColor } from "@/hooks/general/useHeaderColor";

interface QuranSurahHeaderProps {
  surahNameAr: string;
  surahNumber: number;
  colorScopeElement?: HTMLElement | null;
  usePrimaryText?: boolean;
}

export default function QuranSurahHeader({
  surahNameAr,
  surahNumber,
  colorScopeElement,
  usePrimaryText = false,
}: QuranSurahHeaderProps) {
  const isAtTawbah = surahNumber === 9;
  const isFatiha = surahNumber === 1;
  const [displayColoredSrc, setDisplayColoredSrc] = useState<string | null>(
    null,
  );
  const [useFallbackHeader, setUseFallbackHeader] = useState(false);
  const [isResolvingHeader, setIsResolvingHeader] = useState(true);

  const coloredSrc = useHeaderColor(
    "/surah-header-4.png",
    {
      strokeVar: "--primary",
      bgVar: "--quran-highlight-soft",
      strokeDarken: 0.7,
    },
    colorScopeElement,
  );

  const shouldUseColored = !!displayColoredSrc && !useFallbackHeader;

  useEffect(() => {
    if (!coloredSrc || useFallbackHeader) return;

    let active = true;
    const preload = new Image();
    preload.src = coloredSrc;

    preload.onload = () => {
      if (!active) return;
      setDisplayColoredSrc(coloredSrc);
      setIsResolvingHeader(false);
    };

    preload.onerror = () => {
      if (!active) return;
      setUseFallbackHeader(true);
      setIsResolvingHeader(false);
    };

    return () => {
      active = false;
    };
  }, [coloredSrc, useFallbackHeader]);

  useEffect(() => {
    setIsResolvingHeader(true);
    setUseFallbackHeader(false);
    setDisplayColoredSrc(null);
  }, [surahNumber]);

  useEffect(() => {
    if (displayColoredSrc || useFallbackHeader) {
      setIsResolvingHeader(false);
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      setUseFallbackHeader(true);
      setIsResolvingHeader(false);
    }, 1500);

    return () => window.clearTimeout(fallbackTimer);
  }, [displayColoredSrc, useFallbackHeader]);

  return (
    <div className="w-full flex flex-col items-center" dir="rtl">
      <div className="relative w-full">
        {!isResolvingHeader && (
          <img
            src="/surah-header-4.png"
            alt={`سُورَةُ ${surahNameAr}`}
            className={`w-full h-auto block ${
              useFallbackHeader ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        )}

        {isResolvingHeader && (
          <div className="w-full animate-pulse">
            <div className="w-full h-14 bg-muted rounded" />
          </div>
        )}

        {shouldUseColored && (
          <img
            key={displayColoredSrc}
            src={displayColoredSrc || undefined}
            alt={`سُورَةُ ${surahNameAr}`}
            className="absolute inset-0 w-full h-auto block"
            draggable={false}
            onError={() => {
              setUseFallbackHeader(true);
              setDisplayColoredSrc(null);
              setIsResolvingHeader(false);
            }}
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="font font-bold leading-none"
            style={{
              color: usePrimaryText
                ? "hsl(var(--primary))"
                : "hsl(var(--foreground))",
              fontSize: "clamp(0.9rem, 3vw, 2rem)",
              transform: "translateY(0.18em)",
            }}
          >
            سُورَةُ {surahNameAr}
          </p>
        </div>
      </div>

      {!isFatiha && !isAtTawbah && (
        <p
          className="mt-2 text-center"
          style={{
            fontSize: "clamp(1.2rem, 5vw, 3rem)",
            color: usePrimaryText
              ? "hsl(var(--primary))"
              : "hsl(var(--foreground))",
          }}
        >
          ﷽
        </p>
      )}
    </div>
  );
}
