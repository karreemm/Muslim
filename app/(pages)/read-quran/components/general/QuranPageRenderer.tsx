"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
import { memo, Fragment } from "react";
import { AyahPopover } from "./AyahPopover";
import { surahNames } from "@/constants/quranData";
import QuranSurahHeader from "./QuranSurahHeader";
import { useQuranPageFont } from "@/hooks/readQuran/useQuranPageFont";
import { useQuranPageLines } from "@/hooks/readQuran/useQuranPageLines";
import { useAyahInteraction } from "@/hooks/readQuran/useAyahInteraction";
import { useQuranAudio } from "@/context/features/QuranAudioContext";
import type { QuranVerse } from "@/hooks/readQuran";
import { TafseerModal } from "@/components/modals/TafseerModal";
import { TranslationModal } from "@/components/modals/TranslationModal";

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
  showPageNumber?: boolean;
  imageLinePaddingClass?: string;
  highlightedAyahNumber?: number;
  surahHeaders?: SurahHeaderInfo[];
  forceTopSurahHeaderNumber?: number;
  headerColorScopeElement?: HTMLElement | null;
  paletteHueToken?: number;
  imageMode?: boolean;
  forcePrimaryText?: boolean;
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

const QuranPageSkeleton = ({ hasSurahHeader = false }) => (
  <div className="w-full flex flex-col items-center py-6 px-4 bg-card/50 rounded-2xl border-2 border-border/50 shadow-inner mb-6 animate-pulse">
    <div className="w-full max-w-[800px] flex flex-col items-center gap-3">
      {hasSurahHeader && (
        <>
          <div className="w-full h-16 bg-muted rounded-xl mb-2" />
          <div className="w-[60%] h-8 bg-muted rounded-lg mb-4" />
        </>
      )}
      {SKELETON_LINE_WIDTHS.map((width, i) => (
        <div key={i} className="h-8 bg-muted rounded-lg" style={{ width }} />
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
    showPageNumber = true,
    imageLinePaddingClass = "px-2",
    highlightedAyahNumber = 0,
    surahHeaders,
    forceTopSurahHeaderNumber,
    headerColorScopeElement,
    paletteHueToken,
    imageMode = false,
    forcePrimaryText = false,
  }) => {
    const { fontReady, fontLoadTried, pageFontName, isSpecialPage } =
      useQuranPageFont(pageNumber);
    const { lineOrder, lines } = useQuranPageLines(verses, pageNumber);
    const { surahNumber, activeAyahIndex, isPlayerVisible } = useQuranAudio();

    const playingSurahStr = isPlayerVisible
      ? surahNumber?.toString()
      : undefined;
    const highlightedAyah = activeAyahIndex + 1;

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
      modalAyahInfo,
      showTafseerModal,
      setShowTafseerModal,
      showTranslationModal,
      setShowTranslationModal,
      handleOpenTafseer,
      handleOpenTranslation,
    } = useAyahInteraction(verses);

    if (!fontLoadTried && pageNumber) {
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

    const firstLineOfPage = lineOrder[0];
    const forcedTopHeaderInfo = forceTopSurahHeaderNumber
      ? surahNames.find((s) => s.number === forceTopSurahHeaderNumber)
      : null;
    let isFirstChunkOfPage = true;
    const seenAyahs = new Set<string>();

    return (
      <div
        className={`w-full flex flex-col items-center relative ${
          imageMode
            ? "h-full justify-start py-0 px-0 bg-transparent border-0 shadow-none mb-0 backdrop-blur-none"
            : "justify-center py-6 px-4 bg-card/40 rounded-2xl border border-border/50 shadow-lg shadow-primary/5 mb-6 backdrop-blur-sm"
        }`}
        style={{ direction: "rtl" }}
      >
        {!imageMode && (
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 rounded-2xl pointer-events-none" />
        )}
        <div
          className={`relative z-10 text-center w-full ${
            imageMode ? "h-full max-w-none" : "max-w-[800px]"
          }`}
          style={{
            fontFamily:
              pageFontName && fontReady
                ? `'${pageFontName}'`
                : "'Amiri', serif",
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            color: forcePrimaryText
              ? "hsl(var(--primary))"
              : imageMode
                ? "hsl(var(--quran-surface-foreground))"
                : undefined,
          }}
        >
          {forcedTopHeaderInfo && (
            <div
              className="w-full mb-6"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              <QuranSurahHeader
                surahNameAr={forcedTopHeaderInfo.arTashkeel}
                surahNumber={forcedTopHeaderInfo.number}
                colorScopeElement={headerColorScopeElement}
                usePrimaryText={forcePrimaryText}
              />
            </div>
          )}

          {lineOrder.map((lineNumber) => {
            const headerForLine = headerLineMap.get(lineNumber) ?? null;
            const surahHeaderInfo = headerForLine
              ? surahNames.find((s) => s.number === headerForLine.surahNumber)
              : null;

            const isHeaderAtTop = lineNumber === firstLineOfPage;

            return (
              <Fragment key={lineNumber}>
                {surahHeaderInfo && headerForLine && (
                  <div
                    key={`header-${lineNumber}`}
                    className={`w-full mb-6 ${isHeaderAtTop ? "" : "mt-8"}`}
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    <QuranSurahHeader
                      surahNameAr={surahHeaderInfo.arTashkeel}
                      surahNumber={headerForLine.surahNumber}
                      colorScopeElement={headerColorScopeElement}
                      usePrimaryText={forcePrimaryText}
                    />
                  </div>
                )}
                <div
                  key={lineNumber}
                  className={`w-full block ${
                    imageMode
                      ? `${imageLinePaddingClass} mb-1 leading-relaxed`
                      : "px-4 mb-2 leading-loose"
                  }`}
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
                    const chunkSurah = chunk.verseKey?.split(":")[0];
                    const chunkAyah = chunk.verseKey?.split(":")[1];
                    const isHighlightedByPlayer =
                      !!playingSurahStr &&
                      chunkSurah === playingSurahStr &&
                      chunkAyah === highlightedAyah.toString();
                    const isHighlightedByNavigation =
                      highlightedAyahNumber > 0 &&
                      chunkAyah === highlightedAyahNumber.toString();
                    const isHighlighted =
                      isHighlightedByPlayer || isHighlightedByNavigation;

                    const applySpaceFix = isFirstChunkOfPage;
                    if (isFirstChunkOfPage) isFirstChunkOfPage = false;

                    const isFirstChunkOfThisAyah =
                      chunk.verseKey && !seenAyahs.has(chunk.verseKey);
                    if (chunk.verseKey) seenAyahs.add(chunk.verseKey);

                    return (
                      <span
                        key={`${lineNumber}-${chunkIndex}`}
                        id={
                          isFirstChunkOfThisAyah
                            ? `ayah-${chunkAyah}-${chunkSurah}`
                            : undefined
                        }
                        className={`cursor-pointer rounded transition-all duration-200 px-0.5
                          ${isHighlighted ? "text-primary" : ""}
                          ${
                            hoveredVerseKey === chunk.verseKey ||
                            selectedVerseKey === chunk.verseKey
                              ? "text-primary"
                              : "hover:text-primary"
                          }`}
                        style={
                          forcePrimaryText && !isHighlighted
                            ? { color: "hsl(var(--primary))" }
                            : undefined
                        }
                        onMouseEnter={() =>
                          chunk.verseKey && setHoveredVerseKey(chunk.verseKey)
                        }
                        onMouseLeave={() => setHoveredVerseKey(null)}
                        onClick={(e) => handleWordClick(e, chunk.verseKey)}
                      >
                        {pageFontName && fontReady
                          ? applySpaceFix
                            ? chunk.words
                                .map((word) => word.code_v2 || "")
                                .reduce(
                                  (acc, curr, idx) =>
                                    idx === 1 ? acc + " " + curr : acc + curr,
                                  "",
                                )
                            : chunk.words
                                .map((word) => word.code_v2 || "")
                                .join("")
                          : chunk.words.map((word, wordIndex) => (
                              <span key={`${word.id}-${wordIndex}`}>
                                {word.char_type_name === "end" ? (
                                  <span
                                    className={`${styles.ayahNumberWrapper} inline-flex items-center gap-1 mx-1`}
                                  >
                                    <span
                                      className="text-sm"
                                      style={{
                                        color: forcePrimaryText
                                          ? "hsl(var(--primary))"
                                          : undefined,
                                        opacity: 0.6,
                                      }}
                                    >
                                      ﴿
                                    </span>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: word.text_uthmani,
                                      }}
                                      className={styles.ayahNumberText}
                                    />
                                    <span
                                      className="text-sm"
                                      style={{
                                        color: forcePrimaryText
                                          ? "hsl(var(--primary))"
                                          : undefined,
                                        opacity: 0.6,
                                      }}
                                    >
                                      ﴾
                                    </span>
                                  </span>
                                ) : (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: word.text_uthmani,
                                    }}
                                    className={styles.quranWord}
                                  />
                                )}
                                {word.char_type_name !== "end" && " "}
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

        {pageNumber && showPageNumber && (
          <div
            className={`text-sm font-medium w-full text-center ${
              imageMode
                ? "mt-2 pt-2 border-t border-border/20"
                : "mt-6 pt-4 border-t border-border/30"
            } ${forcePrimaryText ? "" : "text-muted-foreground"}`}
            style={
              forcePrimaryText
                ? { color: "hsl(var(--primary))", opacity: 0.7 }
                : imageMode
                  ? {
                      color: "hsl(var(--quran-surface-foreground))",
                      opacity: 0.65,
                    }
                  : undefined
            }
          >
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
            onOpenTafseer={handleOpenTafseer}
            onOpenTranslation={handleOpenTranslation}
            surahNameAr={selectedSurahNameAr}
            surahNameEn={selectedSurahNameEn}
          />
        )}

        <TafseerModal
          isOpen={showTafseerModal}
          onClose={() => setShowTafseerModal(false)}
          surahNumber={modalAyahInfo?.surahNumber || 0}
          ayahNumber={modalAyahInfo?.ayahNumber || 0}
          surahNameAr={modalAyahInfo?.surahNameAr}
          surahNameEn={modalAyahInfo?.surahNameEn}
        />
        <TranslationModal
          isOpen={showTranslationModal}
          onClose={() => setShowTranslationModal(false)}
          surahNumber={modalAyahInfo?.surahNumber || 0}
          ayahNumber={modalAyahInfo?.ayahNumber || 0}
          surahNameAr={modalAyahInfo?.surahNameAr}
          surahNameEn={modalAyahInfo?.surahNameEn}
        />
      </div>
    );
  },
);

QuranPageRenderer.displayName = "QuranPageRenderer";

export default QuranPageRenderer;
