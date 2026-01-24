"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
import {
  useAyahInteraction,
  useScrollToAyah,
} from "../../../../../hooks/readQuran";
import { useTheme } from "@/context/ThemeContext";
import { AyahPopover } from "../../components/AyahPopover";
import { AyahText } from "../../components/AyahText";
import { useState, useMemo, useCallback, memo, useEffect, useRef } from "react";

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

  const CHUNK_SIZE = 50;
  
  const initialVisibleCount = useMemo(() => {
    if (scrollToAyah.highlightedAyahNumber > 0) {
      const chunksNeeded = Math.ceil(scrollToAyah.highlightedAyahNumber / CHUNK_SIZE) + 1;
      return chunksNeeded * CHUNK_SIZE;
    }
    return CHUNK_SIZE;
  }, [scrollToAyah.highlightedAyahNumber]);
  
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const loadingMoreRef = useRef(false);

  const processedAyahs = useMemo(() => {
    if (!surahData || !surahData.ayahs || !surahData.ayahs.length) return [];

    const ayahs = surahData.ayahs;

    if (surahData.number !== 9 && surahData.number !== 1 && ayahs[0]) {
      const modifiedAyahs = [...ayahs];
      const originalText = modifiedAyahs[0].text;

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
        modifiedAyahs[0] = {
          ...modifiedAyahs[0],
          text: originalText.substring(basmala.length).trim(),
        };
        return modifiedAyahs;
      } else {
        const raheem = "ٱلرَّحِيمِ";
        const raheemIndex = originalText.indexOf(raheem);

        if (raheemIndex !== -1 && raheemIndex < 50) {
          const afterBasmala = raheemIndex + raheem.length;
          modifiedAyahs[0] = {
            ...modifiedAyahs[0],
            text: originalText.substring(afterBasmala).trim(),
          };
          return modifiedAyahs;
        }
      }
    }

    return ayahs;
  }, [surahData]);

  useEffect(() => {
    const container = scrollToAyah.containerRef.current;
    if (!container || !processedAyahs.length) return;

    const handleScroll = () => {
      if (loadingMoreRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage > 0.7 && visibleCount < processedAyahs.length) {
        loadingMoreRef.current = true;
        requestAnimationFrame(() => {
          setVisibleCount((prev) =>
            Math.min(prev + CHUNK_SIZE, processedAyahs.length),
          );
          loadingMoreRef.current = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [processedAyahs.length, visibleCount, scrollToAyah.containerRef]);

  useEffect(() => {
    if (scrollToAyah.highlightedAyahNumber > 0) {
      const chunksNeeded = Math.ceil(scrollToAyah.highlightedAyahNumber / CHUNK_SIZE) + 1;
      setVisibleCount(chunksNeeded * CHUNK_SIZE);
    } else {
      setVisibleCount(CHUNK_SIZE);
    }
  }, [surahData?.number, scrollToAyah.highlightedAyahNumber]);

  const handleAyahClick = useCallback(
    (ayah: any, event: React.MouseEvent) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setPopoverPosition({
        x: rect.left,
        y: rect.top - 10,
      });
      ayahInteraction.handleAyahClick(ayah, SNameAr, SNameEn, SNumber);
    },
    [ayahInteraction, SNameAr, SNameEn, SNumber],
  );

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
        {processedAyahs.slice(0, visibleCount).map((ayah: any) => (
          <AyahText
            key={ayah.number}
            ayah={ayah}
            isFatiha={isFatiha}
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
        {visibleCount < processedAyahs.length && (
          <div className="w-full text-center py-4 text-gray-500 dark:text-gray-400">
            <span className="text-sm">...</span>
          </div>
        )}
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
            ayahInteraction.handleSaveAyah(ayah, SNameEn, SNameAr, SNumber);
          }
        }}
        surahNameAr={SNameAr}
        surahNameEn={SNameEn}
      />
    </div>
  );
};
