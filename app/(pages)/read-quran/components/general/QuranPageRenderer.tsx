"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
import { memo, Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  onHeaderReadyChange?: (ready: boolean) => void;
  requireColoredHeaderForReady?: boolean;
  fixedHeaderTypography?: boolean;
  wordRangeSelection?: {
    enabled: boolean;
    startWordIndex: number;
    endWordIndex: number;
    onStartWordIndexChange: (index: number) => void;
    onEndWordIndexChange: (index: number) => void;
  };
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
    imageMode = false,
    forcePrimaryText = false,
    onHeaderReadyChange,
    requireColoredHeaderForReady = false,
    fixedHeaderTypography = false,
    wordRangeSelection,
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

    const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const dragHandleRef = useRef<"start" | "end" | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const pendingPointRef = useRef<{ x: number; y: number } | null>(null);
    const [activeHandle, setActiveHandle] = useState<"start" | "end" | null>(
      null,
    );
    const [dragTooltip, setDragTooltip] = useState<{
      x: number;
      y: number;
      text: string;
    } | null>(null);

    const isWordRangeSelectionEnabled = !!wordRangeSelection?.enabled;
    const allowAyahInteraction = !imageMode && !isWordRangeSelectionEnabled;
    const totalSelectableWords = useMemo(
      () =>
        verses.reduce(
          (count, verse) =>
            count +
            verse.words.filter((word) => word.char_type_name !== "end").length,
          0,
        ),
      [verses],
    );
    const maxSelectableWordIndex = Math.max(0, totalSelectableWords - 1);
    const normalizedSelectionStart = wordRangeSelection
      ? Math.max(
          0,
          Math.min(
            Math.min(
              wordRangeSelection.startWordIndex,
              wordRangeSelection.endWordIndex,
            ),
            maxSelectableWordIndex,
          ),
        )
      : 0;
    const normalizedSelectionEnd = wordRangeSelection
      ? Math.max(
          normalizedSelectionStart,
          Math.min(
            Math.max(
              wordRangeSelection.startWordIndex,
              wordRangeSelection.endWordIndex,
            ),
            maxSelectableWordIndex,
          ),
        )
      : 0;

    useEffect(() => {
      wordRefs.current = wordRefs.current.slice(0, totalSelectableWords);
    }, [totalSelectableWords]);

    useEffect(() => {
      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

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
    let globalSelectableWordIndex = -1;

    const updateSelectedWordIndex = (
      handle: "start" | "end" | null,
      nextIndex: number,
    ) => {
      if (!wordRangeSelection || !handle || totalSelectableWords === 0) return;

      const clampedIndex = Math.max(
        0,
        Math.min(nextIndex, maxSelectableWordIndex),
      );

      if (handle === "start") {
        wordRangeSelection.onStartWordIndexChange(
          Math.min(clampedIndex, normalizedSelectionEnd),
        );
        return;
      }

      wordRangeSelection.onEndWordIndexChange(
        Math.max(clampedIndex, normalizedSelectionStart),
      );
    };

    const findClosestWordIndex = (x: number, y: number) => {
      const directTarget = document.elementFromPoint(x, y);
      const directWord = directTarget?.closest("[data-word-range-index]");

      if (directWord instanceof HTMLElement) {
        const index = Number(directWord.dataset.wordRangeIndex);
        if (Number.isFinite(index)) return index;
      }

      let nearestIndex = normalizedSelectionStart;
      let smallestDistance = Number.POSITIVE_INFINITY;

      wordRefs.current.forEach((element, index) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = (centerX - x) ** 2 + (centerY - y) ** 2;

        if (distance < smallestDistance) {
          smallestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    const flushPendingPointer = () => {
      animationFrameRef.current = null;
      const point = pendingPointRef.current;
      pendingPointRef.current = null;

      if (!point || !dragHandleRef.current) return;
      const idx = findClosestWordIndex(point.x, point.y);
      updateSelectedWordIndex(dragHandleRef.current, idx);

      setDragTooltip({
        x: point.x,
        y: point.y - 44,
        text: `Word ${idx + 1}`,
      });
    };

    const queuePointerUpdate = (x: number, y: number) => {
      pendingPointRef.current = { x, y };
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = requestAnimationFrame(flushPendingPointer);
    };

    const handleSelectionPointerMove = (
      event: React.PointerEvent<HTMLDivElement>,
    ) => {
      if (!dragHandleRef.current) return;
      queuePointerUpdate(event.clientX, event.clientY);
    };

    const endSelectionDrag = () => {
      dragHandleRef.current = null;
      setActiveHandle(null);
      setDragTooltip(null);
    };

    const startSelectionDrag = (
      event: React.PointerEvent<HTMLSpanElement>,
      handle: "start" | "end",
    ) => {
      event.preventDefault();
      event.stopPropagation();
      dragHandleRef.current = handle;
      setActiveHandle(handle);
      event.currentTarget.setPointerCapture(event.pointerId);
      queuePointerUpdate(event.clientX, event.clientY);
    };

    const handleSelectableWordClick = (wordIndex: number) => {
      if (!wordRangeSelection) return;

      if (wordIndex < normalizedSelectionStart) {
        wordRangeSelection.onStartWordIndexChange(wordIndex);
        return;
      }

      if (wordIndex > normalizedSelectionEnd) {
        wordRangeSelection.onEndWordIndexChange(wordIndex);
        return;
      }

      const distanceToStart = Math.abs(wordIndex - normalizedSelectionStart);
      const distanceToEnd = Math.abs(normalizedSelectionEnd - wordIndex);

      if (distanceToStart <= distanceToEnd) {
        wordRangeSelection.onStartWordIndexChange(wordIndex);
        return;
      }

      wordRangeSelection.onEndWordIndexChange(wordIndex);
    };

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
            userSelect:
              isWordRangeSelectionEnabled && imageMode ? "none" : undefined,
            WebkitUserSelect:
              isWordRangeSelectionEnabled && imageMode ? "none" : undefined,
          }}
          onPointerMove={
            isWordRangeSelectionEnabled ? handleSelectionPointerMove : undefined
          }
          onPointerUp={
            isWordRangeSelectionEnabled ? endSelectionDrag : undefined
          }
          onPointerCancel={
            isWordRangeSelectionEnabled ? endSelectionDrag : undefined
          }
          onPointerLeave={
            isWordRangeSelectionEnabled ? endSelectionDrag : undefined
          }
        >
          {forcedTopHeaderInfo && (
            <div
              className="w-full mb-12"
              style={{ fontFamily: "'Amiri Quran', serif" }}
            >
              <QuranSurahHeader
                surahNameAr={forcedTopHeaderInfo.arTashkeel}
                surahNumber={forcedTopHeaderInfo.number}
                colorScopeElement={headerColorScopeElement}
                usePrimaryText={forcePrimaryText}
                onReadyChange={onHeaderReadyChange}
                requireColoredReady={requireColoredHeaderForReady}
                fixedTypography={fixedHeaderTypography}
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
                    className={`w-full mb-12 ${isHeaderAtTop ? "" : "mt-8"}`}
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    <QuranSurahHeader
                      surahNameAr={surahHeaderInfo.arTashkeel}
                      surahNumber={headerForLine.surahNumber}
                      colorScopeElement={headerColorScopeElement}
                      usePrimaryText={forcePrimaryText}
                      onReadyChange={onHeaderReadyChange}
                      requireColoredReady={requireColoredHeaderForReady}
                      fixedTypography={fixedHeaderTypography}
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
                        className={`rounded transition-all duration-200 px-0.5
                          ${isHighlighted ? "text-primary" : ""}
                          ${
                            allowAyahInteraction &&
                            (hoveredVerseKey === chunk.verseKey ||
                              selectedVerseKey === chunk.verseKey)
                              ? "text-primary"
                              : allowAyahInteraction
                                ? "cursor-pointer hover:text-primary"
                                : ""
                          }`}
                        style={
                          forcePrimaryText && !isHighlighted
                            ? { color: "hsl(var(--primary))" }
                            : undefined
                        }
                        onMouseEnter={() =>
                          allowAyahInteraction &&
                          chunk.verseKey &&
                          setHoveredVerseKey(chunk.verseKey)
                        }
                        onMouseLeave={() =>
                          allowAyahInteraction && setHoveredVerseKey(null)
                        }
                        onClick={(e) => {
                          if (!allowAyahInteraction) return;
                          handleWordClick(e, chunk.verseKey);
                        }}
                      >
                        {pageFontName &&
                        fontReady &&
                        !isWordRangeSelectionEnabled
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
                          : chunk.words.map((word, wordIndex) => {
                              const isAyahNumber =
                                word.char_type_name === "end";

                              if (!isAyahNumber) {
                                globalSelectableWordIndex += 1;
                              }

                              const wordRangeIndex = globalSelectableWordIndex;
                              const isSelectedWord =
                                !isAyahNumber &&
                                isWordRangeSelectionEnabled &&
                                wordRangeIndex >= normalizedSelectionStart &&
                                wordRangeIndex <= normalizedSelectionEnd;
                              const isUnselectedWord =
                                !isAyahNumber &&
                                isWordRangeSelectionEnabled &&
                                !isSelectedWord;
                              const isSelectionStartWord =
                                !isAyahNumber &&
                                isWordRangeSelectionEnabled &&
                                wordRangeIndex === normalizedSelectionStart;
                              const isSelectionEndWord =
                                !isAyahNumber &&
                                isWordRangeSelectionEnabled &&
                                wordRangeIndex === normalizedSelectionEnd;
                              const isCollapsedSelection =
                                normalizedSelectionStart ===
                                normalizedSelectionEnd;
                              const isSelectedAyahNumber =
                                isAyahNumber &&
                                isWordRangeSelectionEnabled &&
                                wordRangeIndex >= normalizedSelectionStart &&
                                wordRangeIndex <= normalizedSelectionEnd;

                              const isPrevInSelection =
                                !isAyahNumber &&
                                isWordRangeSelectionEnabled &&
                                wordRangeIndex > 0 &&
                                wordRangeIndex - 1 >=
                                  normalizedSelectionStart &&
                                wordRangeIndex - 1 <= normalizedSelectionEnd;
                              const isNextInSelection =
                                !isAyahNumber &&
                                isWordRangeSelectionEnabled &&
                                wordRangeIndex < maxSelectableWordIndex &&
                                wordRangeIndex + 1 >=
                                  normalizedSelectionStart &&
                                wordRangeIndex + 1 <= normalizedSelectionEnd;

                              return (
                                <span
                                  key={`${word.id}-${wordIndex}`}
                                  className="relative inline-block align-baseline"
                                >
                                  {isAyahNumber ? (
                                    pageFontName && fontReady ? (
                                      <span
                                        className="inline-block align-baseline"
                                        style={
                                          isWordRangeSelectionEnabled
                                            ? {
                                                opacity: isSelectedAyahNumber
                                                  ? 1
                                                  : 0.45,
                                                fontFamily: "inherit",
                                              }
                                            : { fontFamily: "inherit" }
                                        }
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            word.code_v2 || word.text_uthmani,
                                        }}
                                      />
                                    ) : (
                                      <span
                                        className={`${styles.ayahNumberWrapper} inline-flex items-center gap-1 mx-1`}
                                        style={
                                          pageFontName && fontReady
                                            ? { fontFamily: "inherit" }
                                            : undefined
                                        }
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
                                          style={
                                            pageFontName && fontReady
                                              ? { fontFamily: "inherit" }
                                              : undefined
                                          }
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
                                    )
                                  ) : (
                                    <span
                                      ref={(element) => {
                                        if (isWordRangeSelectionEnabled) {
                                          wordRefs.current[wordRangeIndex] =
                                            element;
                                        }
                                      }}
                                      data-word-range-index={
                                        isWordRangeSelectionEnabled
                                          ? wordRangeIndex
                                          : undefined
                                      }
                                      className={`${styles.quranWord} ${
                                        isWordRangeSelectionEnabled
                                          ? "relative inline-block rounded-[0.1em] px-[0.08em]"
                                          : ""
                                      } ${
                                        isSelectedWord &&
                                        isWordRangeSelectionEnabled &&
                                        !isPrevInSelection
                                          ? "rounded-s-[0.1em]"
                                          : ""
                                      } ${
                                        isSelectedWord &&
                                        isWordRangeSelectionEnabled &&
                                        !isNextInSelection
                                          ? "rounded-e-[0.1em]"
                                          : ""
                                      }`}
                                      style={
                                        isWordRangeSelectionEnabled
                                          ? {
                                              backgroundImage: isSelectedWord
                                                ? "linear-gradient(to bottom, hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.18))"
                                                : "none",
                                              backgroundSize: "100% 45%",
                                              backgroundPosition: "0 92%",
                                              backgroundRepeat: "no-repeat",
                                              boxShadow: isSelectedWord
                                                ? "inset 0 -2px 0 0 hsl(var(--primary) / 0.55)"
                                                : "none",
                                              opacity: isUnselectedWord
                                                ? 0.45
                                                : 1,
                                              cursor: "pointer",
                                              fontFamily: "inherit",
                                              transition:
                                                "opacity 0.3s ease, box-shadow 0.15s ease",
                                            }
                                          : pageFontName && fontReady
                                            ? { fontFamily: "inherit" }
                                            : undefined
                                      }
                                      onMouseEnter={(e) => {
                                        if (
                                          isWordRangeSelectionEnabled &&
                                          !isSelectedWord
                                        ) {
                                          e.currentTarget.style.backgroundImage =
                                            "linear-gradient(to bottom, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.1))";
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (
                                          isWordRangeSelectionEnabled &&
                                          !isSelectedWord
                                        ) {
                                          e.currentTarget.style.backgroundImage =
                                            "none";
                                          e.currentTarget.style.boxShadow =
                                            "none";
                                        }
                                      }}
                                      onClick={() =>
                                        isWordRangeSelectionEnabled &&
                                        handleSelectableWordClick(
                                          wordRangeIndex,
                                        )
                                      }
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          pageFontName && fontReady
                                            ? word.code_v2 || word.text_uthmani
                                            : word.text_uthmani,
                                      }}
                                    />
                                  )}
                                  {!isAyahNumber && isSelectionStartWord && (
                                    <span
                                      role="slider"
                                      aria-label="Selection start"
                                      aria-valuemin={1}
                                      aria-valuemax={totalSelectableWords}
                                      aria-valuenow={
                                        normalizedSelectionStart + 1
                                      }
                                      className={`
                                        absolute right-0 bottom-0 z-30 translate-x-1/2
                                        flex flex-col items-center justify-between
                                        h-[1.05em] w-3 cursor-ew-resize
                                        transition-transform duration-150 ease-out
                                        hover:scale-110
                                        ${activeHandle === "start" ? "scale-125" : ""}
                                      `}
                                      onPointerDown={(event) =>
                                        startSelectionDrag(event, "start")
                                      }
                                    >
                                      <span
                                        className="w-2 h-2 rounded-full border shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
                                        style={{
                                          backgroundColor:
                                            "hsl(var(--quran-surface-foreground))",
                                          borderColor:
                                            "hsl(var(--quran-surface) / 0.95)",
                                        }}
                                      />
                                      <span
                                        className="w-[2px] flex-1"
                                        style={{
                                          backgroundColor:
                                            "hsl(var(--quran-surface-foreground) / 0.9)",
                                        }}
                                      />
                                      <span
                                        className="w-2 h-2 rounded-full border shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
                                        style={{
                                          backgroundColor:
                                            "hsl(var(--quran-surface-foreground))",
                                          borderColor:
                                            "hsl(var(--quran-surface) / 0.95)",
                                        }}
                                      />
                                    </span>
                                  )}
                                  {!isAyahNumber &&
                                    isSelectionEndWord &&
                                    !isCollapsedSelection && (
                                      <span
                                        role="slider"
                                        aria-label="Selection end"
                                        aria-valuemin={1}
                                        aria-valuemax={totalSelectableWords}
                                        aria-valuenow={
                                          normalizedSelectionEnd + 1
                                        }
                                        className={`
                                          absolute left-0 bottom-0 z-30 -translate-x-1/2
                                          flex flex-col items-center justify-between
                                          h-[1.05em] w-3 cursor-ew-resize
                                          transition-transform duration-150 ease-out
                                          hover:scale-110
                                          ${activeHandle === "end" ? "scale-125" : ""}
                                        `}
                                        onPointerDown={(event) =>
                                          startSelectionDrag(event, "end")
                                        }
                                      >
                                        <span
                                          className="w-2 h-2 rounded-full border shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
                                          style={{
                                            backgroundColor:
                                              "hsl(var(--quran-surface-foreground))",
                                            borderColor:
                                              "hsl(var(--quran-surface) / 0.95)",
                                          }}
                                        />
                                        <span
                                          className="w-[2px] flex-1"
                                          style={{
                                            backgroundColor:
                                              "hsl(var(--quran-surface-foreground) / 0.9)",
                                          }}
                                        />
                                        <span
                                          className="w-2 h-2 rounded-full border shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
                                          style={{
                                            backgroundColor:
                                              "hsl(var(--quran-surface-foreground))",
                                            borderColor:
                                              "hsl(var(--quran-surface) / 0.95)",
                                          }}
                                        />
                                      </span>
                                    )}
                                  {!isAyahNumber && " "}
                                </span>
                              );
                            })}
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

        {dragTooltip && (
          <div
            className="fixed z-[60] pointer-events-none px-2.5 py-1 rounded-md text-xs font-semibold shadow-xl border"
            style={{
              left: dragTooltip.x,
              top: dragTooltip.y,
              transform: "translateX(-50%)",
              backgroundColor: "hsl(var(--quran-surface-foreground))",
              color: "hsl(var(--quran-surface))",
              borderColor: "hsl(var(--quran-surface-foreground) / 0.2)",
            }}
          >
            {dragTooltip.text}
          </div>
        )}
      </div>
    );
  },
);

QuranPageRenderer.displayName = "QuranPageRenderer";

export default QuranPageRenderer;
