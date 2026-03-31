"use client";

import { useMemo, memo, useRef } from "react";
import QuranPageRenderer from "./QuranPageRenderer";
import { useQuranPages } from "@/hooks/readQuran/useQuranPages";

interface JuzMultiPageRendererProps {
  verses: any[];
  fontSize: number;
  lineHeight: number;
  onLoadedPagesChange?: (loadedPages: number, totalPages: number) => void;
}

const JuzMultiPageRenderer: React.FC<JuzMultiPageRendererProps> = memo(
  ({ verses, fontSize, lineHeight, onLoadedPagesChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
      pages,
      sortedPageNumbers,
      visiblePages,
      highlightedAyahNumber,
      highlightedPage,
    } = useQuranPages(verses, onLoadedPagesChange);

    const surahHeaders = useMemo(() => {
      if (!verses)
        return {} as Record<
          number,
          { surahNumber: number; firstAyah: number; lastAyah: number }[]
        >;

      const surahHeadersMap: Record<
        number,
        { surahNumber: number; firstAyah: number; lastAyah: number }[]
      > = {};

      Object.keys(pages).forEach((pageNumStr) => {
        const pageNum = parseInt(pageNumStr);
        const versesOnPage = verses.filter((verse) =>
          verse.words.some((word: any) => word.page_number === pageNum),
        );

        const newSurahVerses = versesOnPage.filter((verse) => {
          const ayahNum = parseInt(verse.verse_key.split(":")[1]);
          return ayahNum === 1;
        });

        if (newSurahVerses.length > 0) {
          surahHeadersMap[pageNum] = newSurahVerses.map((surahVerse) => {
            const surahNum = surahVerse.verse_key.split(":")[0];
            const ayahNum = parseInt(surahVerse.verse_key.split(":")[1]);
            const sameSurahVerses = verses.filter(
              (v) => v.verse_key.split(":")[0] === surahNum,
            );
            const lastAyah =
              sameSurahVerses.length > 0
                ? parseInt(
                    sameSurahVerses[sameSurahVerses.length - 1].verse_key.split(
                      ":",
                    )[1],
                  )
                : ayahNum;

            return {
              surahNumber: parseInt(surahNum),
              firstAyah: ayahNum,
              lastAyah,
            };
          });
        }
      });

      return surahHeadersMap;
    }, [verses, pages]);

    return (
      <div
        ref={containerRef}
        className="flex flex-col gap-8 w-full items-center"
        style={{ direction: "rtl" }}
      >
        {sortedPageNumbers.slice(0, visiblePages).map((pageNum) => {
          const pageNumber = parseInt(pageNum);
          const pageHeaders = surahHeaders[pageNumber];

          return (
            <div
              key={pageNum}
              id={`page-${pageNum}`}
              className="w-full flex justify-center"
            >
              <QuranPageRenderer
                verses={pages[pageNumber]}
                fontSize={fontSize}
                lineHeight={lineHeight}
                pageNumber={pageNumber}
                highlightedAyahNumber={
                  pageNumber === highlightedPage ? highlightedAyahNumber : 0
                }
                surahHeaders={pageHeaders}
              />
            </div>
          );
        })}
        {visiblePages < sortedPageNumbers.length && (
          <div className="w-full text-center py-6">
            <p className="text-muted-foreground">...</p>
          </div>
        )}
      </div>
    );
  },
);

JuzMultiPageRenderer.displayName = "JuzMultiPageRenderer";

export default JuzMultiPageRenderer;
