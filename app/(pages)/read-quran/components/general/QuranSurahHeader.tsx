"use client";

import { useState } from "react";
import { useHeaderColor } from "@/hooks/general/useHeaderColor";

interface QuranSurahHeaderProps {
  surahNameAr: string;
  surahNumber: number;
}

export default function QuranSurahHeader({
  surahNameAr,
  surahNumber,
}: QuranSurahHeaderProps) {
  const isAtTawbah = surahNumber === 9;
  const isFatiha = surahNumber === 1;
  const [imageLoaded, setImageLoaded] = useState(false);

  const coloredSrc = useHeaderColor("/surah-header-4.png", {
    strokeVar: "--primary",
    bgVar: "--quran-highlight-soft",
    strokeDarken: 0.7,
  });

  const imageSrc = coloredSrc ?? "/surah-header-4.png"; 

  return (
    <div className="w-full flex flex-col items-center" dir="rtl">
      <div className="relative w-full">

        {!imageLoaded && (
          <div className="w-full animate-pulse">
            <div className="w-full h-14 bg-muted rounded" />
          </div>
        )}

        <img
          key={imageSrc}
          src={imageSrc}
          alt={`سُورَةُ ${surahNameAr}`}
          className={`w-full h-auto block transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
          draggable={false}
          onLoad={() => setImageLoaded(true)}
        />

        {imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="font font-bold leading-none"
              style={{
                color: "hsl(var(--foreground))",
                fontSize: "clamp(0.9rem, 3vw, 2rem)",
                transform: "translateY(0.18em)",
              }}
            >
              سُورَةُ {surahNameAr}
            </p>
          </div>
        )}
      </div>

      {!isFatiha && !isAtTawbah && (
        <p
          className="mt-2 text-center text-foreground"
          style={{ fontSize: "clamp(1.2rem, 5vw, 3rem)" }}
        >
          ﷽
        </p>
      )}
    </div>
  );
}