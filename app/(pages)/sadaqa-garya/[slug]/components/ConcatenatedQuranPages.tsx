"use client";

import { useMemo, useRef } from "react";
import QuranPageRenderer from "@/app/(pages)/read-quran/components/general/QuranPageRenderer";
import { useContainerFontSize } from "@/hooks/readQuran";
import type { SadaqaQuranVerse } from "@/hooks/sadaqaGarya/useSadaqaSurahVerses";

interface ConcatenatedQuranPagesProps {
  verses: SadaqaQuranVerse[];
  surahNumber: number;
  startAyah: number;
  endAyah: number;
}

export default function ConcatenatedQuranPages({
  verses,
  surahNumber,
  startAyah,
  endAyah,
}: ConcatenatedQuranPagesProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { fontSize, lineHeight } = useContainerFontSize(contentRef);

  const pageNumbers = useMemo(() => {
    const pageSet = new Set<number>();
    verses.forEach((verse) => {
      verse.words.forEach((word) => {
        if (word.page_number) {
          pageSet.add(Number(word.page_number));
        }
      });
    });
    return Array.from(pageSet).sort((a, b) => a - b);
  }, [verses]);

  const surahHeaders =
    startAyah === 1
      ? [{ surahNumber, firstAyah: startAyah, lastAyah: endAyah }]
      : undefined;

  const versesByPage = useMemo(() => {
    const map: Record<number, SadaqaQuranVerse[]> = {};
    pageNumbers.forEach((pageNum) => {
      map[pageNum] = verses.filter((verse) =>
        verse.words.some((word) => Number(word.page_number) === pageNum),
      );
    });
    return map;
  }, [verses, pageNumbers]);

  return (
    <div
      ref={contentRef}
      className="mx-auto w-full md:w-[90%] lg:w-[800px] py-4 px-2 overflow-hidden"
    >
      <div className="flex flex-col gap-8 w-full items-center">
        {pageNumbers.map((pageNum, idx) => (
          <div
            key={`${surahNumber}-${pageNum}`}
            id={`sadaqa-page-${surahNumber}-${pageNum}`}
            className="w-full flex justify-center animate-fade-in"
            style={{ animationDelay: `${idx * 10}ms` }}
          >
            <QuranPageRenderer
              verses={versesByPage[pageNum] as any}
              fontSize={fontSize}
              lineHeight={lineHeight}
              pageNumber={pageNum}
              highlightedAyahNumber={0}
              surahHeaders={surahHeaders}
              forceTopSurahHeaderNumber={
                idx === 0 && startAyah !== 1 ? surahNumber : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
