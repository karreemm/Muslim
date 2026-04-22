"use client";

import { useEffect, useRef, useState } from "react";
import { useHeaderColor } from "@/hooks/general/useHeaderColor";
import useMediaQuery from "@/hooks/general/useMediaQuery";

interface QuranSurahHeaderProps {
  surahNameAr: string;
  surahNumber: number;
  colorScopeElement?: HTMLElement | null;
  usePrimaryText?: boolean;
  onReadyChange?: (ready: boolean) => void;
  fallbackDelayMs?: number;
  requireColoredReady?: boolean;
  fixedTypography?: boolean;
}

export default function QuranSurahHeader({
  surahNameAr,
  surahNumber,
  colorScopeElement,
  usePrimaryText = false,
  onReadyChange,
  fallbackDelayMs = 5000,
  requireColoredReady = false,
  fixedTypography = false,
}: QuranSurahHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 500px)");
  const isAtTawbah = surahNumber === 9;
  const isFatiha = surahNumber === 1;
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const [headerWidth, setHeaderWidth] = useState(0);
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

  const shouldUseColored = !!displayColoredSrc;

  useEffect(() => {
    onReadyChange?.(
      requireColoredReady ? !!displayColoredSrc : !isResolvingHeader,
    );
  }, [
    displayColoredSrc,
    isResolvingHeader,
    onReadyChange,
    requireColoredReady,
  ]);

  useEffect(() => {
    if (!coloredSrc) return;

    let active = true;
    const preload = new Image();
    preload.src = coloredSrc;

    preload.onload = () => {
      if (!active) return;
      setDisplayColoredSrc(coloredSrc);
      setUseFallbackHeader(false);
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
  }, [coloredSrc]);

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
    }, fallbackDelayMs);

    return () => window.clearTimeout(fallbackTimer);
  }, [displayColoredSrc, fallbackDelayMs, useFallbackHeader]);

  useEffect(() => {
    const element = headerContainerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);
    setHeaderWidth(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const titleFontSize = fixedTypography
    ? 40
    : headerWidth > 0
      ? Math.min(
          isMobile ? 24 : 40,
          Math.max(isMobile ? 12 : 16, headerWidth * (isMobile ? 0.05 : 0.045)),
        )
      : 20;

  const basmalaFontSize = fixedTypography
    ? 40
    : headerWidth > 0
      ? Math.min(
          isMobile ? 26 : 40,
          Math.max(
            isMobile ? 14 : 20,
            headerWidth * (isMobile ? 0.055 : 0.045),
          ),
        )
      : 22;

  return (
    <div className="w-full flex flex-col items-center" dir="rtl">
      <div ref={headerContainerRef} className="relative w-full">
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
              fontSize: `${titleFontSize}px`,
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
            fontSize: `${basmalaFontSize}px`,
            fontFamily: "'Amiri Quran', serif",
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
