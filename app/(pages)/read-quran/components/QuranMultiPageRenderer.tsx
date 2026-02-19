"use client";

import { memo, useRef } from "react";
import QuranPageRenderer from "./QuranPageRenderer";
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
  surahHeader?: SurahHeaderInfo;
  onLoadedPagesChange?: (loadedPages: number, totalPages: number) => void;
}

const QuranMultiPageRenderer: React.FC<QuranMultiPageRendererProps> = memo(
  ({ verses, fontSize, lineHeight, surahHeader, onLoadedPagesChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
      pages,
      sortedPageNumbers,
      visiblePages,
      highlightedAyahNumber,
      highlightedPage,
    } = useQuranPages(verses, onLoadedPagesChange);

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
              surahHeader={surahHeader}
            />
          </div>
        ))}
        {visiblePages < sortedPageNumbers.length && (
          <div className="w-full text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">...</p>
          </div>
        )}
      </div>
    );
  },
);

QuranMultiPageRenderer.displayName = "QuranMultiPageRenderer";

export default QuranMultiPageRenderer;
