"use client";

import { useState } from "react";

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

  return (
    <div className="w-full flex flex-col items-center" dir="rtl">
      <div className="relative w-full">
        {!imageLoaded && (
          <div className="w-full animate-pulse">
            <div className="w-full h-14 bg-muted rounded" />
          </div>
        )}
        <img
          src="/surah-header-4.png"
          alt={`سورة ${surahNameAr}`}
          className={`w-full h-auto block transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
          draggable={false}
          onLoad={() => setImageLoaded(true)}
        />
        {imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="text-[#4a1e08] font-bold font text-[clamp(0.9rem,3vw,2rem)] leading-none"
              style={{
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
          className="mt-2 text-center text-[clamp(1.2rem,5vw,3rem)]"
        >
          ﷽
        </p>
      )}
    </div>
  );
}
