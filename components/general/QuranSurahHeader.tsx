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
            <div className="w-full h-14 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        )}
        <img
          src="/suraha-header-cropped.png"
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
              className="text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] text-[clamp(0.9rem,3vw,2rem)] leading-none"
              style={{
                fontFamily: "'Amiri', serif",
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
          className="mt-2 text-center text-teal-700 dark:text-teal-400 text-[clamp(1.2rem,5vw,3rem)]"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          ﷽
        </p>
      )}
    </div>
  );
}
