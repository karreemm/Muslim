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
  line_number: number;
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
    const [lines, setLines] = useState<Record<number, VerseChunk[]>>({});
    const [hoveredVerseKey, setHoveredVerseKey] = useState<string | null>(null);
    const [selectedVerseKey, setSelectedVerseKey] = useState<string | null>(
      null,
    );
    const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

    const isSpecialPage = pageNumber === 1 || pageNumber === 2;

    useEffect(() => {
      if (verses) {
        const allWords: Word[] = [];
        verses.forEach((verse) => {
          verse.words.forEach((word) => {
            allWords.push({ ...word, verse_key: verse.verse_key });
          });
        });

        const groupedLines: Record<number, VerseChunk[]> = {};

        const wordsByLine: Record<number, Word[]> = {};
        allWords.forEach((word) => {
          const lineNum = word.line_number;
          if (!wordsByLine[lineNum]) wordsByLine[lineNum] = [];
          wordsByLine[lineNum].push(word);
        });

        Object.keys(wordsByLine).forEach((key) => {
          const lineNum = parseInt(key);
          const lineWords = wordsByLine[lineNum];
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

          groupedLines[lineNum] = chunks;
        });

        setLines(groupedLines);
      }
    }, [verses]);

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

      const text = verse.words.map((word) => word.text_uthmani).join(" ");

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
            fontFamily: "'Amiri', serif",
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          {Object.keys(lines)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((lineNumber) => (
              <div
                key={lineNumber}
                className="w-full px-4 mb-2 block"
                style={
                  isSpecialPage
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
                {lines[parseInt(lineNumber)].map((chunk, chunkIndex) => {
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
                      {chunk.words.map((word, wordIndex) => (
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
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-500 font-sans w-full text-center">
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
