"use client";

import styles from "@/app/styles/modules/QuranText.module.css";
import { useEffect, useState, useCallback, memo } from "react";
import { AyahPopover } from "./AyahPopover";
import { surahNames } from "@/constants/quranData";
import { useSavedAyahs } from "@/context/SavedAyahsContext";
import { toArabicNumber } from "@/utils/helpers";

interface Word {
  id: number;
  position: number;
  text_uthmani: string;
  code_v2: string;
  line_number: number;
  page_number: number;
  char_type_name: string;
  verse_key?: string;
}

interface Verse {
  id: number;
  verse_key: string;
  words: Word[];
}

interface VerseChunk {
  verseKey: string | undefined;
  words: Word[];
}

interface QuranPageRendererProps {
  verses: Verse[];
  fontSize: number;
  lineHeight: number;
  pageNumber?: number;
  highlightedAyahNumber?: number;
}

const QuranPageRenderer: React.FC<QuranPageRendererProps> = memo(
  ({ verses, fontSize, lineHeight, pageNumber, highlightedAyahNumber = 0 }) => {
    const { saveAyah } = useSavedAyahs();
    const [hoveredVerseKey, setHoveredVerseKey] = useState<string | null>(null);
    const [selectedVerseKey, setSelectedVerseKey] = useState<string | null>(
      null,
    );
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
    const [fontReady, setFontReady] = useState(false);

    const isSpecialPage = pageNumber === 1 || pageNumber === 2;
    const pageFontName = pageNumber ? `p${pageNumber}-font` : null;

    // Inject page-specific @font-face and wait for font to load
    useEffect(() => {
      if (!pageNumber) {
        setFontReady(true);
        return;
      }
      const fontName = `p${pageNumber}-font`;
      const fontUrl = `/quran-fonts/p${pageNumber}.woff2`;
      const styleId = `quran-font-${pageNumber}`;

      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `@font-face { font-family: '${fontName}'; src: url('${fontUrl}') format('woff2'); }`;
        document.head.appendChild(style);
      }

      document.fonts
        .load(`1em ${fontName}`)
        .then(() => {
          setFontReady(true);
        })
        .catch(() => {
          setFontReady(true); // fall back gracefully
        });
    }, [pageNumber]);

    // Track line order based on first appearance in the data
    const [lineOrder, setLineOrder] = useState<string[]>([]);
    const [lines, setLines] = useState<Record<string, VerseChunk[]>>({});

    useEffect(() => {
      if (verses) {
        // Extract all words from verses in document order
        const allWords: Word[] = [];
        verses.forEach((verse) => {
          verse.words.forEach((word) => {
            allWords.push({ ...word, verse_key: verse.verse_key });
          });
        });

        console.log(
          `[QuranPageRenderer] Page ${pageNumber}: Total words received:`,
          allWords.length,
        );
        console.log(
          `[QuranPageRenderer] Page ${pageNumber}: Verses:`,
          verses.map((v) => v.verse_key).join(", "),
        );

        // Filter words to only include those for current page
        const pageWords = pageNumber
          ? allWords.filter(
              (word) => Number(word.page_number) === Number(pageNumber),
            )
          : allWords;

        console.log(
          `[QuranPageRenderer] Page ${pageNumber}: Words after filtering by page:`,
          pageWords.length,
        );
        const uniqueVerseKeys = Array.from(
          new Set(pageWords.map((w) => w.verse_key)),
        );
        const lineNumbersInFiltered = Array.from(
          new Set(pageWords.map((w) => w.line_number)),
        ).sort((a, b) => a - b);
        console.log(
          `[QuranPageRenderer] Page ${pageNumber}: Line numbers in filtered words:`,
          lineNumbersInFiltered.join(", "),
        );
        console.log(
          `[QuranPageRenderer] Page ${pageNumber}: Unique verse keys in filtered words:`,
          uniqueVerseKeys.join(", "),
        );

        // Group words by line - Map preserves insertion order from API
        const wordsByLine = new Map<string, Word[]>();

        pageWords.forEach((word) => {
          const lineKey = word.line_number.toString();
          if (!wordsByLine.has(lineKey)) {
            wordsByLine.set(lineKey, []);
          }
          wordsByLine.get(lineKey)!.push(word);
        });

        console.log(
          `[QuranPageRenderer] Page ${pageNumber}: Lines found:`,
          Array.from(wordsByLine.keys()).join(", "),
        );

        // Convert to verse chunks for rendering
        const groupedLines: Record<string, VerseChunk[]> = {};

        // Sort lines numerically
        const lineKeys = Array.from(wordsByLine.keys()).sort(
          (a, b) => parseInt(a) - parseInt(b),
        );

        lineKeys.forEach((lineKey) => {
          const lineWords = wordsByLine.get(lineKey)!;
          const chunks: VerseChunk[] = [];
          let currentChunk: VerseChunk | null = null;

          lineWords.forEach((word) => {
            if (!currentChunk) {
              currentChunk = { verseKey: word.verse_key, words: [word] };
            } else if (currentChunk.verseKey === word.verse_key) {
              currentChunk.words.push(word);
            } else {
              chunks.push(currentChunk);
              currentChunk = { verseKey: word.verse_key, words: [word] };
            }
          });

          if (currentChunk) {
            chunks.push(currentChunk);
          }

          console.log(
            `[QuranPageRenderer] Page ${pageNumber}, Line ${lineKey}: ${chunks.map((c) => `${c.verseKey}(${c.words.length} words)`).join(", ")}`,
          );

          groupedLines[lineKey] = chunks;
        });

        setLineOrder(lineKeys);
        setLines(groupedLines);
      }
    }, [verses, pageNumber]);

    const handleWordClick = useCallback(
      (event: React.MouseEvent, verseKey: string | undefined) => {
        if (!verseKey) return;
        event.stopPropagation();
        setSelectedVerseKey(verseKey);

        const x = event.clientX;
        const y = event.clientY;
        setPopoverPosition({ x, y });
      },
      [],
    );

    const handleClosePopover = useCallback(() => {
      setSelectedVerseKey(null);
    }, []);

    const getSurahAndAyah = (verseKey: string | null) => {
      if (!verseKey) return { surah: 0, ayah: 0 };
      const [surah, ayah] = verseKey.split(":").map(Number);
      return { surah, ayah };
    };

    const handleSaveAyah = useCallback(() => {
      if (!selectedVerseKey) return;

      const { surah: surahNumber, ayah: ayahNumber } =
        getSurahAndAyah(selectedVerseKey);

      const verse = verses.find((v) => v.verse_key === selectedVerseKey);

      if (!verse) return;

      const text = verse.words
        .map((word) => word.text_uthmani || word.code_v2)
        .join(" ");

      const surahInfo = surahNames.find((s) => s.number === surahNumber);

      if (!surahInfo) return;

      saveAyah({
        surahNameEn: surahInfo.en,
        surahNameAr: surahInfo.ar,
        ayahNumberAr: toArabicNumber(ayahNumber),
        text: text,
        ayahNumberEn: ayahNumber,
        SurahNumber: surahNumber,
      });

      handleClosePopover();
    }, [selectedVerseKey, verses, saveAyah, handleClosePopover]);

    const { surah: surahNumber, ayah: ayahNumber } =
      getSurahAndAyah(selectedVerseKey);

    const surahInfo = surahNames.find((s) => s.number === surahNumber);
    const surahNameAr = surahInfo?.ar;
    const surahNameEn = surahInfo?.en;

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
          {lineOrder.map((lineNumber) => (
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
                      isHighlighted ? "bg-yellow-200 dark:bg-yellow-700" : ""
                    }`}
                    onMouseEnter={() =>
                      chunk.verseKey && setHoveredVerseKey(chunk.verseKey)
                    }
                    onMouseLeave={() => setHoveredVerseKey(null)}
                    onClick={(e) => handleWordClick(e, chunk.verseKey)}
                  >
                    {pageFontName && fontReady
                      ? // code_v2 mode: concatenate all glyph codes with no spaces
                        chunk.words.map((word) => word.code_v2 || "").join("")
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
          ))}
        </div>
        {pageNumber && (
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 font-sans w-full text-center">
            {pageNumber}
          </div>
        )}

        {selectedVerseKey && (
          <AyahPopover
            isOpen={!!selectedVerseKey}
            ayahNumber={ayahNumber}
            surahNumber={surahNumber}
            position={popoverPosition}
            onClose={handleClosePopover}
            onSave={handleSaveAyah}
            surahNameAr={surahNameAr}
            surahNameEn={surahNameEn}
          />
        )}
      </div>
    );
  },
);

QuranPageRenderer.displayName = "QuranPageRenderer";

export default QuranPageRenderer;
