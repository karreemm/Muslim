"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
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
      className={`fontAmiri flex flex-col items-center transition-all duration-300 ${isFullscreen ? "w-full h-full" : ""
        }`}
    >
      <div
        className={`${styles.quranBasmala} text-teal-700 dark:text-teal-400`}
      >
        {surahNumber === 9 ? (
          <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
        ) : (
          <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}
      </div>

      <div
        id="scrollable-div"
        dir="rtl"
        ref={scrollToAyah.containerRef}
        className={`${styles.quranText
          } bg-[#FEFDF8] text-gray-900 dark:bg-slate-800 dark:text-gray-100 shadow-lg rounded-lg px-6 md:px-8 py-6 mt-5 md:mt-10 overflow-y-auto overflow-x-hidden transition-all duration-300 w-full max-w-[1200px] ${isFullscreen ? "h-[75vh]" : "max-h-[400px]"
          }`}
        style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
      >
        {ayahs.map((ayah: any) => (
          <>
            {ayah.text.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ") && (
              <div className="w-full text-center my-6 block">
                <p
                  className={`${styles.quranBasmala} text-2xl md:text-3xl text-teal-700 dark:text-teal-400`}
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
              </div>
            )}
            <span
              key={ayah.number}
              ref={scrollToAyah.setAyahRef(ayah.numberInSurah)}
              className={`${styles.quranVerse
                } inline cursor-pointer transition-colors duration-200 ${scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
                  theme === false
                  ? `bg-yellow-200 rounded px-1`
                  : scrollToAyah.highlightedAyahNumber === ayah.numberInSurah &&
                    theme === true
                    ? `bg-yellow-700 rounded px-1`
                    : `hover:bg-teal-50 dark:hover:bg-slate-700 rounded px-1`
                }`}
              onClick={(e) => handleAyahClick(ayah, e)}
              id={`ayah-${ayah.numberInSurah}`}
            >
              {ayah.text.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")
                ? ayah.text
                  .replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "")
                  .trim()
                : ayah.text}{" "}
              <span className="verse-number text-teal-600 dark:text-teal-400">
                <span>{toArabicNumber(ayah.numberInSurah)}</span>
              </span>{" "}
            </span>
          </>
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
        surahNameAr={
          ayahs.find(
            (a: any) =>
              a.numberInSurah === ayahInteraction.showPopover.ayahNumber
          )?.surah.name
        }
        surahNameEn={
          surahNames.find(
            (s) =>
              s.number ===
              ayahs.find(
                (a: any) =>
                  a.numberInSurah === ayahInteraction.showPopover.ayahNumber
              )?.surah.number
          )?.en
        }
      />
    </div>
  );
};
