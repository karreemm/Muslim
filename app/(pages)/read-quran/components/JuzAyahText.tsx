"use client";

import { memo, useCallback } from "react";
import styles from "@/app/styles/modules/QuranText.module.css";
import { toArabicNumber } from "../../../../utils/helpers";

interface JuzAyahTextProps {
  ayah: any;
  fontSize: number;
  lineHeight: number;
  isHighlighted: boolean;
  theme: boolean;
  onClick: (ayah: any, event: React.MouseEvent) => void;
  setAyahRef: (ayahNumber: number) => (el: HTMLDivElement | null) => void;
}

export const JuzAyahText = memo<JuzAyahTextProps>(
  ({
    ayah,
    fontSize,
    lineHeight,
    isHighlighted,
    theme,
    onClick,
    setAyahRef,
  }) => {
    const hasBasmala = ayah.text.includes(
      "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    );
    const displayText = hasBasmala
      ? ayah.text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim()
      : ayah.text;

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        onClick(ayah, e);
      },
      [ayah, onClick],
    );

    return (
      <>
        {hasBasmala && (
          <div className="w-full text-center my-6 block">
            <p
              className={`${styles.quranBasmala} text-2xl md:text-3xl text-primary`}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        )}
        <span
          key={ayah.number}
          ref={setAyahRef(ayah.numberInSurah)}
          className={`${styles.quranVerse} inline cursor-pointer ${
            isHighlighted
              ? theme
                ? `bg-[hsl(var(--quran-highlight))] rounded px-1`
                : `bg-[hsl(var(--quran-highlight-soft))] rounded px-1`
              : `hover:bg-muted rounded px-1`
          }`}
          onClick={handleClick}
          id={`ayah-${ayah.numberInSurah}`}
          style={{ fontSize: `${fontSize}px`, lineHeight }}
        >
          {displayText}{" "}
          <span className="verse-number text-primary">
            <span>{toArabicNumber(ayah.numberInSurah)}</span>
          </span>{" "}
        </span>
      </>
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

JuzAyahText.displayName = "JuzAyahText";
