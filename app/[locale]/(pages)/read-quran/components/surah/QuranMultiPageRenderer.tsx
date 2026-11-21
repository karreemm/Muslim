"use client";

import { memo, useRef, useEffect } from "react";
import QuranPageRenderer from "../general/QuranPageRenderer";
import { useQuranPages } from "@/hooks/readQuran/useQuranPages";
import { useQuranFontPrefetch } from "@/hooks/readQuran/useQuranPageFont";

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
    const lastScrolledPageRef = useRef<string | null>(null);
    const {
      pages,
      sortedPageNumbers,
      visiblePages,
      highlightedAyahNumber,
      highlightedPage,
    } = useQuranPages(verses, onLoadedPagesChange);

    const nextPageNumber = sortedPageNumbers[visiblePages]
      ? parseInt(sortedPageNumbers[visiblePages])
      : undefined;
    useQuranFontPrefetch(nextPageNumber);

    useEffect(() => {
      lastScrolledTargetRef.current = null;
      lastScrolledPageRef.current = null;
    }, [highlightedAyahNumber, highlightedPage]);

    useEffect(() => {
      if (highlightedAyahNumber > 0 && highlightedPage > 0) {
        const pageIndex = sortedPageNumbers.indexOf(highlightedPage.toString());
        if (pageIndex === -1 || visiblePages < pageIndex + 1) {
          return;
        }

        // Jump to the page as soon as it is mounted. Page fonts load lazily, so
        // waiting for the exact ayah can take several seconds on a long surah.
        if (lastScrolledPageRef.current !== highlightedPage.toString()) {
          const pageElement = document.getElementById(`page-${highlightedPage}`);
          if (pageElement) {
            lastScrolledPageRef.current = highlightedPage.toString();
            pageElement.scrollIntoView({ behavior: "auto", block: "start" });
          }
        }

        const matchingVerse = verses?.find(
          (verse) =>
            parseInt(verse.verse_key?.split(":")[1] || "0") === highlightedAyahNumber,
        );

        if (matchingVerse) {
          const surahNum = matchingVerse.verse_key?.split(":")[0];
          const ayahId = `ayah-${highlightedAyahNumber}-${surahNum}`;
          const targetKey = `${ayahId}:${highlightedPage}`;

          if (lastScrolledTargetRef.current === targetKey) {
            return;
          }

          let retries = 0;
          // Deep links can land on a page whose font loads after the first
          // render, and the reader mounts pages progressively. Keep trying long
          // enough to cover that instead of giving up and leaving the user at
          // the top of the surah.
          const maxRetries = 80;
          let cancelled = false;

          const tryScroll = () => {
            if (cancelled) return;

            const ayahElement = document.getElementById(ayahId);
            if (ayahElement) {
              lastScrolledTargetRef.current = targetKey;
              // Jump instead of smooth-scrolling: a deep link can be tens of
              // thousands of pixels down, and smooth scrolling there looks like
              // nothing happened.
              ayahElement.scrollIntoView({
                behavior: "auto",
                block: "center",
              });
              return;
            }

            if (retries < maxRetries) {
              retries += 1;
              setTimeout(tryScroll, 100);
            }
          };

          const scrollTimer = setTimeout(tryScroll, 120);

          return () => {
            cancelled = true;
            clearTimeout(scrollTimer);
          };
        }
      }
    }, [highlightedPage, highlightedAyahNumber, verses, visiblePages, sortedPageNumbers]);

    return (
      <div ref={containerRef} className="flex flex-col gap-8 w-full items-center">
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
                parseInt(pageNum) === highlightedPage ? highlightedAyahNumber : 0
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
