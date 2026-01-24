"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { surahNames } from "../../../../../constants/quranData";
import { ClipLoader } from "react-spinners";
import {
  useAyahInteraction,
  useScrollToAyah,
} from "../../../../../hooks/readQuran";
import { useTheme } from "@/context/ThemeContext";
import { AyahPopover } from "../../components/AyahPopover";
import { JuzAyahText } from "../../components/JuzAyahText";

export const RenderJuzText = (
  juzData: any,
  fontSize: number,
  lineHeight: number,
  isFullscreen: boolean = false,
) => {
  const { theme } = useTheme();
  const ayahInteraction = useAyahInteraction();
  const scrollToAyah = useScrollToAyah(juzData?.length);
  const [loading, setLoading] = useState<boolean>(true);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const CHUNK_SIZE = 50;

  // Calculate initial visible count based on highlighted ayah
  const initialVisibleCount = useMemo(() => {
    if (scrollToAyah.highlightedAyahNumber > 0 && juzData?.length) {
      // Find the index of the highlighted ayah in juzData
      const ayahIndex = juzData.findIndex(
        (ayah: any) =>
          ayah.numberInSurah === scrollToAyah.highlightedAyahNumber,
      );
      if (ayahIndex !== -1) {
        // Load enough chunks to include the highlighted ayah plus one extra chunk
        const chunksNeeded = Math.ceil((ayahIndex + 1) / CHUNK_SIZE) + 1;
        return chunksNeeded * CHUNK_SIZE;
      }
    }
    return CHUNK_SIZE;
  }, [scrollToAyah.highlightedAyahNumber, juzData?.length]);

  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const loadingMoreRef = useRef(false);

  const handleAyahClick = useCallback(
    (ayah: any, event: React.MouseEvent) => {
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
          ayah.surah.number,
        );
      }
    },
    [ayahInteraction],
  );

  useEffect(() => {
    if (juzData) {
      setLoading(false);
      setVisibleCount(CHUNK_SIZE);
    }
  }, [juzData]);

  useEffect(() => {
    const container = scrollToAyah.containerRef.current;
    if (!container || !juzData?.length) return;

    const handleScroll = () => {
      if (loadingMoreRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage > 0.7 && visibleCount < juzData.length) {
        loadingMoreRef.current = true;
        requestAnimationFrame(() => {
          setVisibleCount((prev) =>
            Math.min(prev + CHUNK_SIZE, juzData.length),
          );
          loadingMoreRef.current = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [juzData?.length, visibleCount, scrollToAyah.containerRef]);

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
        className={`${
          styles.quranText
        } bg-[#FEFDF8] text-gray-900 dark:bg-slate-800 dark:text-gray-100 shadow-lg rounded-lg px-6 md:px-8 py-6 mt-5 md:mt-10 overflow-y-auto overflow-x-hidden transition-all duration-300 w-full max-w-[1200px] ${
          isFullscreen ? "h-[75vh]" : "max-h-[400px]"
        }`}
        style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
      >
        {ayahs.slice(0, visibleCount).map((ayah: any) => (
          <JuzAyahText
            key={ayah.number}
            ayah={ayah}
            fontSize={fontSize}
            lineHeight={lineHeight}
            isHighlighted={
              scrollToAyah.highlightedAyahNumber === ayah.numberInSurah
            }
            theme={theme}
            onClick={handleAyahClick}
            setAyahRef={scrollToAyah.setAyahRef}
          />
        ))}
        {visibleCount < ayahs.length && (
          <div className="w-full text-center py-4 text-gray-500 dark:text-gray-400">
            <span className="text-sm">...</span>
          </div>
        )}
      </div>

      <AyahPopover
        isOpen={ayahInteraction.showPopover.isOpen}
        ayahNumber={ayahInteraction.showPopover.ayahNumber}
        surahNumber={
          ayahs.find(
            (a: any) =>
              a.numberInSurah === ayahInteraction.showPopover.ayahNumber,
          )?.surah.number || 1
        }
        position={popoverPosition}
        onClose={ayahInteraction.handleClosePopover}
        onSave={() => {
          const ayah = ayahs.find(
            (a: any) =>
              a.numberInSurah === ayahInteraction.showPopover.ayahNumber,
          );
          if (ayah) {
            const surah = surahNames.find(
              (s) => s.number === ayah.surah.number,
            );
            ayahInteraction.handleSaveAyah(
              ayah,
              surah?.en,
              surah?.ar,
              ayah.surah.number,
            );
          }
        }}
        surahNameAr={
          ayahs.find(
            (a: any) =>
              a.numberInSurah === ayahInteraction.showPopover.ayahNumber,
          )?.surah.name
        }
        surahNameEn={
          surahNames.find(
            (s) =>
              s.number ===
              ayahs.find(
                (a: any) =>
                  a.numberInSurah === ayahInteraction.showPopover.ayahNumber,
              )?.surah.number,
          )?.en
        }
      />
    </div>
  );
};
