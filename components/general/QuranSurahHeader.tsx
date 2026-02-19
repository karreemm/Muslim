"use client";

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

  return (
    <div className="w-full flex flex-col items-center" dir="rtl">
      <div className="relative w-full">
        <img
          src="/suraha-header-cropped.png"
          alt={`سورة ${surahNameAr}`}
          className="w-full h-auto block"
          draggable={false}
        />
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
