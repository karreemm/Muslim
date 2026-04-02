"use client";

import { memo, useRef, useEffect } from "react";
import QuranPageRenderer from "../general/QuranPageRenderer";
import { useQuranPages } from "@/hooks/readQuran/useQuranPages";

interface SurahHeaderInfo {
  surahNumber: number;
  firstAyah: number;
  lastAyah: number;
}

interface QuranMultiPageRendererProps {
  verses: any[];
  fontSize: number;
  lineHeight: number;
  surahHeaders?: SurahHeaderInfo[];
  onLoadedPagesChange?: (loadedPages: number, totalPages: number) => void;
}

const QuranMultiPageRenderer: React.FC<QuranMultiPageRendererProps> = memo(
  ({ verses, fontSize, lineHeight, surahHeaders, onLoadedPagesChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastScrolledTargetRef = useRef<string | null>(null);
    const {
      pages,
      sortedPageNumbers,
      visiblePages,
      highlightedAyahNumber,
      highlightedPage,
    } = useQuranPages(verses, onLoadedPagesChange);

    useEffect(() => {
      lastScrolledTargetRef.current = null;
    }, [highlightedAyahNumber, highlightedPage]);

    useEffect(() => {
      if (highlightedAyahNumber > 0 && highlightedPage > 0) {
        const pageIndex = sortedPageNumbers.indexOf(highlightedPage.toString());
        if (pageIndex === -1 || visiblePages < pageIndex + 1) {
          return;
        }

        const matchingVerse = verses?.find(
          (verse) =>
            parseInt(verse.verse_key?.split(":")[1] || "0") ===
            highlightedAyahNumber,
        );

        if (matchingVerse) {
          const surahNum = matchingVerse.verse_key?.split(":")[0];
          const ayahId = `ayah-${highlightedAyahNumber}-${surahNum}`;
          const targetKey = `${ayahId}:${highlightedPage}`;

          if (lastScrolledTargetRef.current === targetKey) {
            return;
          }

          const scrollTimer = setTimeout(() => {
            const ayahElement = document.getElementById(ayahId);
            if (ayahElement) {
              lastScrolledTargetRef.current = targetKey;
              ayahElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 120);

          return () => clearTimeout(scrollTimer);
        }
      }
    }, [
      highlightedPage,
      highlightedAyahNumber,
      verses,
      visiblePages,
      sortedPageNumbers,
    ]);

    return (
      <div
        ref={containerRef}
        className="flex flex-col gap-8 w-full items-center"
      >
        {sortedPageNumbers.slice(0, visiblePages).map((pageNum) => (
          <div
            key={pageNum}
            id={`page-${pageNum}`}
            className="w-full flex justify-center"
          >
            <QuranPageRenderer
              verses={pages[parseInt(pageNum)]}
              fontSize={fontSize}
              lineHeight={lineHeight}
              pageNumber={parseInt(pageNum)}
              highlightedAyahNumber={
                parseInt(pageNum) === highlightedPage
                  ? highlightedAyahNumber
                  : 0
              }
              surahHeaders={surahHeaders}
            />
          </div>
        ))}
        {visiblePages < sortedPageNumbers.length && (
          <div className="w-full text-center py-6">
            <p className="text-muted-foreground">...</p>
          </div>
        )}
      </div>
    );
  },
);

QuranMultiPageRenderer.displayName = "QuranMultiPageRenderer";

export default QuranMultiPageRenderer;
