"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
import { memo, Fragment } from "react";
import { AyahPopover } from "./AyahPopover";
import { surahNames } from "@/constants/quranData";
import QuranSurahHeader from "@/components/general/QuranSurahHeader";
import { useQuranPageFont } from "@/hooks/readQuran/useQuranPageFont";
import { useQuranPageLines } from "@/hooks/readQuran/useQuranPageLines";
import { useAyahInteraction } from "@/hooks/readQuran/useAyahInteraction";
import type { QuranVerse } from "@/hooks/readQuran";

interface SurahHeaderInfo {
  surahNumber: number;
  firstAyah: number;
  lastAyah: number;
}

interface QuranPageRendererProps {
  verses: QuranVerse[];
  fontSize: number;
  lineHeight: number;
  pageNumber?: number;
  highlightedAyahNumber?: number;
  surahHeaders?: SurahHeaderInfo[];
}

const SKELETON_LINE_WIDTHS = [
  "92%",
  "88%",
  "95%",
  "85%",
  "90%",
  "93%",
  "87%",
  "91%",
  "86%",
  "94%",
  "89%",
  "92%",
  "84%",
  "90%",
  "88%",
];

interface QuranPageSkeletonProps {
  hasSurahHeader?: boolean;
}

const QuranPageSkeleton: React.FC<QuranPageSkeletonProps> = ({
  hasSurahHeader,
}) => (
  <div className="w-full flex flex-col items-center py-4 px-2 lg:p-4 bg-white dark:bg-[#1d293d] rounded-lg border-2 border-slate-900 dark:border-slate-400 shadow-inner mb-4">
    <div className="mt-3 w-full max-w-[800px] flex flex-col items-center gap-3 animate-pulse">
      {hasSurahHeader && (
        <>
          <div className="w-full h-14 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
          <div className="w-[60%] h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
        </>
      )}
      {SKELETON_LINE_WIDTHS.map((width, i) => (
        <div
          key={i}
          className="h-8 bg-gray-200 dark:bg-slate-700 rounded"
          style={{ width }}
        />
      ))}
    </div>
  </div>
);

const QuranPageRenderer: React.FC<QuranPageRendererProps> = memo(
  ({
    verses,
    fontSize,
    lineHeight,
    pageNumber,
    highlightedAyahNumber = 0,
    surahHeaders,
  }) => {
    const { fontReady, pageFontName, isSpecialPage } =
      useQuranPageFont(pageNumber);
    const { lineOrder, lines } = useQuranPageLines(verses, pageNumber);
    const {
      hoveredVerseKey,
      setHoveredVerseKey,
      selectedVerseKey,
      popoverPosition,
      handleWordClick,
      handleClosePopover,
      handleSaveAyah,
      selectedSurahNumber,
      selectedAyahNumber,
      selectedSurahNameAr,
      selectedSurahNameEn,
    } = useAyahInteraction(verses);

    if (!fontReady && pageNumber) {
      return <QuranPageSkeleton hasSurahHeader={!!surahHeaders?.length} />;
    }

    const headerLineMap = new Map<string, SurahHeaderInfo>();
    if (surahHeaders?.length) {
      surahHeaders.forEach((header) => {
        const line = lineOrder.find((ln) =>
          lines[ln]?.some(
            (chunk) =>
              chunk.verseKey?.split(":")[0] === header.surahNumber.toString() &&
              chunk.verseKey?.split(":")[1] === "1",
          ),
        );
        if (line) headerLineMap.set(line, header);
      });
    }

    return (
      <div
        className="w-full flex flex-col items-center justify-center py-4 px-2 lg:p-4 bg-white dark:bg-[#1d293d] rounded-lg border-2 border-slate-900 dark:border-slate-400 shadow-inner mb-4 relative"
        style={{ direction: "rtl" }}
      >
        <div
          className="mt-3 text-center w-full max-w-[800px]"
          style={{
            fontFamily:
              pageFontName && fontReady
                ? `'${pageFontName}'`
                : "'Amiri', serif",
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          {lineOrder.map((lineNumber) => {
            const headerForLine = headerLineMap.get(lineNumber) ?? null;
            const surahHeaderInfo = headerForLine
              ? surahNames.find((s) => s.number === headerForLine.surahNumber)
              : null;

            return (
              <Fragment key={lineNumber}>
                {surahHeaderInfo && headerForLine && (
                  <div
                    key={`header-${lineNumber}`}
                    className="w-full mb-4 mt-6"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    <QuranSurahHeader
                      surahNameAr={surahHeaderInfo.arTashkeel}
                      surahNumber={headerForLine.surahNumber}
                    />
                  </div>
                )}
                <div
                  key={lineNumber}
                  className="w-full px-4 mb-2 block"
                  style={
                    pageFontName && fontReady
                      ? {
                          textAlign: "center",
                          width: "100%",
                          wordSpacing: "0",
                          letterSpacing: "0",
                        }
                      : isSpecialPage
                        ? {
                            textAlign: "center",
                            width: "100%",
                            wordSpacing: "0",
                            letterSpacing: "0",
                          }
                        : {
                            textAlignLast: "justify",
                            textAlign: "justify",
                            width: "100%",
                          }
                  }
                >
                  {lines[lineNumber]?.map((chunk, chunkIndex) => {
                    const isHighlighted =
                      highlightedAyahNumber > 0 &&
                      chunk.verseKey?.split(":")[1] ===
                        highlightedAyahNumber.toString();

                    return (
                      <span
                        key={`${lineNumber}-${chunkIndex}`}
                        id={
                          isHighlighted
                            ? `ayah-${highlightedAyahNumber}`
                            : undefined
                        }
                        className={`cursor-pointer rounded px-1 ${
                          hoveredVerseKey === chunk.verseKey ||
                          selectedVerseKey === chunk.verseKey
                            ? "text-teal-500 dark:text-teal-400"
                            : ""
                        } ${
                          isHighlighted
                            ? "bg-yellow-200 dark:bg-yellow-700"
                            : ""
                        }`}
                        onMouseEnter={() =>
                          chunk.verseKey && setHoveredVerseKey(chunk.verseKey)
                        }
                        onMouseLeave={() => setHoveredVerseKey(null)}
                        onClick={(e) => handleWordClick(e, chunk.verseKey)}
                      >
                        {pageFontName && fontReady
                          ? chunk.words
                              .map((word) => word.code_v2 || "")
                              .join("")
                          : chunk.words.map((word, wordIndex) => (
                              <span key={`${word.id}-${wordIndex}`}>
                                {word.char_type_name === "end" ? (
                                  <span className={styles.ayahNumberWrapper}>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: word.text_uthmani,
                                      }}
                                      className={styles.ayahNumberText}
                                    />
                                  </span>
                                ) : (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: word.text_uthmani,
                                    }}
                                    className={styles.quranWord}
                                  />
                                )}{" "}
                              </span>
                            ))}
                      </span>
                    );
                  })}
                </div>
              </Fragment>
            );
          })}
        </div>
        {pageNumber && (
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 font-sans w-full text-center">
            {pageNumber}
          </div>
        )}

        {selectedVerseKey && (
          <AyahPopover
            isOpen={!!selectedVerseKey}
            ayahNumber={selectedAyahNumber}
            surahNumber={selectedSurahNumber}
            position={popoverPosition}
            onClose={handleClosePopover}
            onSave={handleSaveAyah}
            surahNameAr={selectedSurahNameAr}
            surahNameEn={selectedSurahNameEn}
          />
        )}
      </div>
    );
  },
);

QuranPageRenderer.displayName = "QuranPageRenderer";

export default QuranPageRenderer;
