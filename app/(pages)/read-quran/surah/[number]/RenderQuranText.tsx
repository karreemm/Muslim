"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
import { toArabicNumber } from "../../../../../utils/helpers";
import {
  useAyahInteraction,
  useScrollToAyah,
} from "../../../../../hooks/readQuran";
import { useTheme } from "@/context/ThemeContext";
import { AyahPopover } from "../../components/AyahPopover";
import { useState, useMemo } from "react";

export const RenderQuranText = (
  surahData: any,
  fontSize: number,
  lineHeight: number,
  SNameAr: string | undefined,
  SNameEn: string | undefined,
  SNumber: number | string,
  isFullscreen: boolean = false,
) => {
  const { theme } = useTheme();
  const ayahInteraction = useAyahInteraction();
  const scrollToAyah = useScrollToAyah(surahData?.ayahs?.length);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const processedAyahs = useMemo(() => {
    if (!surahData || !surahData.ayahs || !surahData.ayahs.length) return [];

    const ayahs = surahData.ayahs.map((ayah: any) => ({ ...ayah }));

    if (surahData.number !== 9 && surahData.number !== 1 && ayahs[0]) {
      const originalText = ayahs[0].text;

      const basmala = String.fromCharCode(
        1576,
        1616,
        1587,
        1618,
        1605,
        1616,
        32,
        1649,
        1604,
        1604,
        1617,
        1614,
        1607,
        1616,
        32,
        1649,
        1604,
        1585,
        1617,
        1614,
        1581,
        1618,
        1605,
        1614,
        1648,
        1606,
        1616,
        32,
        1649,
        1604,
        1585,
        1617,
        1614,
        1581,
        1616,
        1610,
        1605,
        1616,
      );

      if (originalText.startsWith(basmala)) {
        ayahs[0].text = originalText.substring(basmala.length).trim();
      } else {
        const raheem = "ٱلرَّحِيمِ";
        const raheemIndex = originalText.indexOf(raheem);

        if (raheemIndex !== -1 && raheemIndex < 50) {
          const afterBasmala = raheemIndex + raheem.length;
          ayahs[0].text = originalText.substring(afterBasmala).trim();
        }
      }
    }

    return ayahs;
  }, [surahData?.ayahs, surahData?.number]);

  const handleAyahClick = (ayah: any, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left,
      y: rect.top - 10,
    });
    ayahInteraction.handleAyahClick(ayah, SNameAr, SNameEn, SNumber);
  };

  if (!surahData || !surahData.ayahs || !surahData.ayahs.length) return null;

  const isFatiha = surahData.number === 1;

  return (
    <div
      dir="rtl"
      className={`flex flex-col items-center transition-all duration-300 ${
        isFullscreen ? "w-full h-full" : ""
      }`}
    >
      <div
        dir="rtl"
        className={`${styles.quranBasmala} text-teal-700 dark:text-teal-400`}
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
        className={`${
          isFatiha ? styles.quranTextFatiha : styles.quranText
        } bg-[#FEFDF8] text-gray-900 dark:bg-slate-800 dark:text-gray-100 shadow-lg rounded-lg px-6 md:px-8 py-6 mt-5 md:mt-10 overflow-y-auto overflow-x-hidden transition-all duration-300 w-full max-w-[1200px] ${
          isFullscreen ? "h-[75vh]" : "max-h-[400px]"
        }`}
      >
        {processedAyahs.map((ayah: any) => (
          <span
            key={ayah.number}
            ref={scrollToAyah.setAyahRef(ayah.numberInSurah)}
            className={`${
              isFatiha ? styles.quranVerseFatiha : styles.quranVerse
            } cursor-pointer transition-colors duration-200 ${
              scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
              theme === false
                ? `bg-yellow-200 rounded px-1`
                : scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
                    theme === true
                  ? `bg-yellow-700 rounded px-1`
                  : `hover:bg-teal-50 dark:hover:bg-slate-700 rounded px-1`
            }`}
            onClick={(e) => handleAyahClick(ayah, e)}
            id={`ayah-${ayah.numberInSurah}`}
            style={
              isFatiha
                ? {
                    fontSize: `${fontSize}px`,
                    display: "block",
                    textAlign: "center",
                    wordSpacing: "0",
                    letterSpacing: "0",
                  }
                : { fontSize: `${fontSize}px` }
            }
          >
            {ayah.text}{" "}
            <span className="verse-number text-teal-600 dark:text-teal-400">
              <span>{toArabicNumber(ayah.numberInSurah)}</span>
            </span>{" "}
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
          const ayah = processedAyahs.find(
            (a: any) =>
              a.numberInSurah === ayahInteraction.showPopover.ayahNumber,
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
