"use client";

import { memo, useCallback } from "react";
import styles from "@/app/styles/modules/QuranText.module.css";
import { toArabicNumber } from "../../../../utils/helpers";

interface AyahTextProps {
  ayah: any;
  isFatiha: boolean;
  fontSize: number;
  lineHeight?: number;
  isHighlighted: boolean;
  theme: boolean;
  onClick: (ayah: any, event: React.MouseEvent) => void;
  setAyahRef: (ayahNumber: number) => (el: HTMLDivElement | null) => void;
}

export const AyahText = memo<AyahTextProps>(
  ({
    ayah,
    isFatiha,
    fontSize,
    lineHeight,
    isHighlighted,
    theme,
    onClick,
    setAyahRef,
  }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        onClick(ayah, e);
      },
      [ayah, onClick],
    );

    return (
      <span
        key={ayah.number}
        ref={setAyahRef(ayah.numberInSurah)}
        className={`${
          isFatiha ? styles.quranVerseFatiha : styles.quranVerse
        } cursor-pointer ${
          isHighlighted
            ? theme
              ? `bg-yellow-700 rounded px-1`
              : `bg-yellow-200 rounded px-1`
            : `hover:bg-teal-50 dark:hover:bg-slate-700 rounded px-1`
        }`}
        onClick={handleClick}
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
            : lineHeight
              ? { fontSize: `${fontSize}px`, lineHeight }
              : { fontSize: `${fontSize}px` }
        }
      >
        {ayah.text}{" "}
        <span className="verse-number text-teal-600 dark:text-teal-400">
          <span>{toArabicNumber(ayah.numberInSurah)}</span>
        </span>{" "}
      </span>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.ayah.number === nextProps.ayah.number &&
      prevProps.fontSize === nextProps.fontSize &&
      prevProps.isHighlighted === nextProps.isHighlighted &&
      prevProps.theme === nextProps.theme
    );
  },
);

AyahText.displayName = "AyahText";
