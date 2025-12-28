"use client";

import { toArabicNumber } from "../../../../Utils/Helpers";
import {
  useAyahInteraction,
  useScrollToAyah,
} from "../../../../Hooks/ReadQuran";
import { useTheme } from "@/app/Context/ThemeContext";
import { AyahPopover } from "../../Components/AyahPopover";
import { useState } from "react";

export const RenderQuranText = (
  surahData: any,
  fontSize: number,
  lineHeight: number,
  SNameAr: string | undefined,
  SNameEn: string | undefined,
  SNumber: number | string,
  isFullscreen: boolean = false
) => {
  const { theme } = useTheme();
  const ayahInteraction = useAyahInteraction();
  const scrollToAyah = useScrollToAyah(surahData?.ayahs?.length);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const handleAyahClick = (ayah: any, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left,
      y: rect.top - 10,
    });
    ayahInteraction.handleAyahClick(ayah, SNameAr, SNameEn, SNumber);
  };

  if (!surahData || !surahData.ayahs.length) return null;

  const ayahs = [...surahData.ayahs];

  if (
    surahData.number !== 9 &&
    ayahs[0].text.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")
  ) {
    ayahs[0].text = ayahs[0].text
      .replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/, "")
      .trim();
  }

  return (
    <div dir="rtl" className={`fontAmiri flex flex-col items-center transition-all duration-300 ${isFullscreen ? 'w-full h-full' : ''}`}>
      <div
        dir="rtl"
        className="fontAmiri basmala text-xl md:text-3xl text-center my-4 dark:text-white"
      >
        {surahData.number === 9 ? (
          <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
        ) : (
          <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}
      </div>
      <div
        id="scrollable-div"
        ref={scrollToAyah.containerRef}
        className={`bg-white text-black dark:bg-slate-800 dark:text-white shadow-md rounded-lg px-4 py-2 mt-5 md:mt-10 ayah-container max-w-[1200px] overflow-y-auto flex flex-wrap transition-all duration-300 ${isFullscreen ? 'h-[75vh]' : 'max-h-[300px]'
          }`}
      >
        {ayahs.map((ayah) => (
          <div
            key={ayah.number}
            ref={scrollToAyah.setAyahRef(ayah.numberInSurah)}
            className={`fontAmiri flex items-center relative ${scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
              theme === false
              ? `bg-yellow-200 rounded-lg`
              : scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
                theme === true
                ? `bg-yellow-600 rounded-lg`
                : ""
              }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
            onClick={(e) => handleAyahClick(ayah, e)}
            id={`ayah-${ayah.numberInSurah}`}
          >
            <p
              dir="rtl"
              className="ayah cursor-pointer"
              id={`ayah-${ayah.numberInSurah}`}
            >
              {ayah.text}
              <span className="separator mx-1">
                <span className="icon">
                  ۝
                  <span className="number">
                    {toArabicNumber(ayah.numberInSurah)}
                  </span>
                </span>
              </span>
            </p>
          </div>
        ))}
      </div>

      <AyahPopover
        isOpen={ayahInteraction.showPopover.isOpen}
        ayahNumber={ayahInteraction.showPopover.ayahNumber}
        surahNumber={Number(SNumber)}
        position={popoverPosition}
        onClose={ayahInteraction.handleClosePopover}
        onSave={() => {
          const ayah = ayahs.find(
            (a) => a.numberInSurah === ayahInteraction.showPopover.ayahNumber
          );
          if (ayah) {
            ayahInteraction.handleSaveAyah(ayah);
          }
        }}
      />
    </div>
  );
};
