"use client";

import { toArabicNumber } from "../../../../../utils/helpers";
import {
  useAyahInteraction,
  useScrollToAyah,
} from "../../../../../hooks/readQuran";
import { useTheme } from "@/context/ThemeContext";
import { AyahPopover } from "../../components/AyahPopover";
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
    <div
      dir="rtl"
      className={`fontAmiri flex flex-col items-center transition-all duration-300 ${isFullscreen ? "w-full h-full" : ""
        }`}
    >
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
        dir="rtl"
        ref={scrollToAyah.containerRef}
        className={`bg-white text-black dark:bg-slate-800 dark:text-white shadow-md rounded-lg px-6 py-4 mt-5 md:mt-10 ayah-container max-w-[1200px] overflow-y-auto transition-all duration-300 text-justify leading-loose ${isFullscreen ? "h-[75vh]" : "max-h-[400px]"
          }`}
        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
      >
        {ayahs.map((ayah) => (
          <span
            key={ayah.number}
            ref={scrollToAyah.setAyahRef(ayah.numberInSurah)}
            className={`fontAmiri inline cursor-pointer ${scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
                theme === false
                ? `bg-yellow-200 rounded px-1`
                : scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
                  theme === true
                  ? `bg-yellow-600 rounded px-1`
                  : ""
              }`}
            onClick={(e) => handleAyahClick(ayah, e)}
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
          </span>
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
        surahNameAr={SNameAr}
        surahNameEn={SNameEn}
      />
    </div>
  );
};
