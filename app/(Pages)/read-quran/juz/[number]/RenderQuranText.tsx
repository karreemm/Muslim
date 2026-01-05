"use client";

import { useState, useEffect } from "react";
import { toArabicNumber } from "../../../../../utils/helpers";
import { surahNames } from "../../../../../constants/quranData";
import { ClipLoader } from "react-spinners";
import {
  useAyahInteraction,
  useScrollToAyah,
} from "../../../../../hooks/readQuran";
import { useTheme } from "@/context/ThemeContext";
import { AyahPopover } from "../../components/AyahPopover";

export const RenderJuzText = (
  juzData: any,
  fontSize: number,
  lineHeight: number,
  isFullscreen: boolean = false
) => {
  const { theme } = useTheme();
  const ayahInteraction = useAyahInteraction();
  const scrollToAyah = useScrollToAyah(juzData?.length);
  const [loading, setLoading] = useState<boolean>(true);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const handleAyahClick = (ayah: any, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left,
      y: rect.top - 10,
    });
    const surah = surahNames.find((s) => s.number === ayah.surah.number);
    if (surah) {
      ayahInteraction.handleAyahClick(
        ayah,
        surah.ar,
        surah.en,
        ayah.surah.number
      );
    }
  };

  useEffect(() => {
    if (juzData) {
      setLoading(false);
    }
  }, [juzData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  if (!juzData || !juzData.length) return null;

  const ayahs = juzData;
  const surahNumber = ayahs[0]?.surah.number;
  const firstAyahText = ayahs[0]?.text;

  const displayBasmala =
    surahNumber !== 9 &&
    firstAyahText?.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ");

  if (displayBasmala) {
    ayahs[0].text = firstAyahText
      .replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "")
      .trim();
  }

  return (
    <div
      dir="rtl"
      className={`fontAmiri flex flex-col items-center transition-all duration-300 ${
        isFullscreen ? "w-full h-full" : ""
      }`}
    >
      <div className="basmala dark:text-white text-xl md:text-3xl text-center my-4">
        {surahNumber === 9 ? (
          <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
        ) : (
          <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}
      </div>

      <div
        id="scrollable-div"
        ref={scrollToAyah.containerRef}
        className={`bg-white text-black dark:bg-slate-800 dark:text-white shadow-md rounded-lg px-4 py-2 mt-5 md:mt-10 ayah-container max-w-[1200px] overflow-y-auto flex flex-wrap transition-all duration-300 ${
          isFullscreen ? "h-[75vh]" : "max-h-[300px]"
        }`}
      >
        {ayahs.map((ayah: any) => (
          <div
            key={ayah.number}
            ref={scrollToAyah.setAyahRef(ayah.numberInSurah)}
            className={`fontAmiri flex items-center relative ${
              ayah.text.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")
                ? "w-full"
                : ""
            }  ${
              scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
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
            {ayah.text.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ") ? (
              <>
                <div className="w-full text-center my-4 md:my-8">
                  <p className="w-full ayah block text-2xl md:text-4xl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱللرَّحِيمِ
                  </p>
                </div>
                <p
                  dir="rtl"
                  className="ayah cursor-pointer w-full"
                  id={`ayah-${ayah.numberInSurah}`}
                >
                  {ayah.text
                    .replace("بِسْمِ ٱللَّهِ ٱللرَّحْمَٰنِ ٱللرَّحِيمِ", "")
                    .trim()}
                  <span className="separator mx-1">
                    <span className="icon">
                      ۝
                      <span className="number">
                        {toArabicNumber(ayah.numberInSurah)}
                      </span>
                    </span>
                  </span>
                </p>
              </>
            ) : (
              <p
                dir="rtl"
                className="ayah w-full cursor-pointer"
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
            )}
          </div>
        ))}
      </div>

      <AyahPopover
        isOpen={ayahInteraction.showPopover.isOpen}
        ayahNumber={ayahInteraction.showPopover.ayahNumber}
        surahNumber={
          ayahs.find(
            (a: any) =>
              a.numberInSurah === ayahInteraction.showPopover.ayahNumber
          )?.surah.number || 1
        }
        position={popoverPosition}
        onClose={ayahInteraction.handleClosePopover}
        onSave={() => {
          const ayah = ayahs.find(
            (a: any) =>
              a.numberInSurah === ayahInteraction.showPopover.ayahNumber
          );
          if (ayah) {
            ayahInteraction.handleSaveAyah(ayah);
          }
        }}
      />
    </div>
  );
};
