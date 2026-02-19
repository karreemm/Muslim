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
  surahHeader?: SurahHeaderInfo;
}

const QuranPageRenderer: React.FC<QuranPageRendererProps> = memo(
  ({
    verses,
    fontSize,
    lineHeight,
    pageNumber,
    highlightedAyahNumber = 0,
    surahHeader,
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

    const firstAyah1Line = surahHeader
      ? (lineOrder.find((ln) =>
          lines[ln]?.some(
            (chunk) =>
              chunk.verseKey?.split(":")[0] ===
                surahHeader.surahNumber.toString() &&
              chunk.verseKey?.split(":")[1] === "1",
          ),
        ) ?? null)
      : null;

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
            const isHeaderLine = surahHeader && lineNumber === firstAyah1Line;
            const surahHeaderInfo = isHeaderLine
              ? surahNames.find((s) => s.number === surahHeader!.surahNumber)
              : null;

            return (
              <Fragment key={lineNumber}>
                {surahHeaderInfo && (
                  <div
                    key={`header-${lineNumber}`}
                    className="w-full mb-4 mt-6"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    <QuranSurahHeader
                      surahNameAr={surahHeaderInfo.arTashkeel}
                      surahNumber={surahHeader!.surahNumber}
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
