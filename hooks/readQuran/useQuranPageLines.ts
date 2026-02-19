"use client";

import { useState, useEffect } from "react";

export interface QuranWord {
  id: number;
  position: number;
  text_uthmani: string;
  code_v2: string;
  line_number: number;
  page_number: number;
  char_type_name: string;
  verse_key?: string;
}

export interface QuranVerse {
  id: number;
  verse_key: string;
  words: QuranWord[];
}

export interface VerseChunk {
  verseKey: string | undefined;
  words: QuranWord[];
}

export const useQuranPageLines = (
  verses: QuranVerse[],
  pageNumber: number | undefined,
) => {
  const [lineOrder, setLineOrder] = useState<string[]>([]);
  const [lines, setLines] = useState<Record<string, VerseChunk[]>>({});

  useEffect(() => {
    if (!verses) return;

    const allWords: QuranWord[] = [];
    verses.forEach((verse) => {
      verse.words.forEach((word) => {
        allWords.push({ ...word, verse_key: verse.verse_key });
      });
    });

    const pageWords = pageNumber
      ? allWords.filter(
          (word) => Number(word.page_number) === Number(pageNumber),
        )
      : allWords;

    const wordsByLine = new Map<string, QuranWord[]>();
    pageWords.forEach((word) => {
      const lineKey = word.line_number.toString();
      if (!wordsByLine.has(lineKey)) {
        wordsByLine.set(lineKey, []);
      }
      wordsByLine.get(lineKey)!.push(word);
    });

    const lineKeys = Array.from(wordsByLine.keys()).sort(
      (a, b) => parseInt(a) - parseInt(b),
    );

    const groupedLines: Record<string, VerseChunk[]> = {};
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

      groupedLines[lineKey] = chunks;
    });

    setLineOrder(lineKeys);
    setLines(groupedLines);
  }, [verses, pageNumber]);

  return { lineOrder, lines };
};
