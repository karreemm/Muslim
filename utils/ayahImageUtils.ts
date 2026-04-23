import { surahNames } from "@/constants/quranData";
import type { QuranVerse } from "@/hooks/readQuran";
import type { AyahImageData } from "@/app/(pages)/generate-ayah-image/types";
import type { AyahSelectionState } from "@/hooks/generateAyahImage/useAyahSelection";

export const MAX_AYAH_IMAGE_LINES = 15;

export function getAyahNumber(verse: QuranVerse): number {
  const [, ayahPart] = verse.verse_key.split(":");
  return Number(ayahPart);
}

export function flattenSelectableWords(verses: QuranVerse[]) {
  return verses.flatMap((verse) =>
    verse.words
      .filter((word) => word.char_type_name !== "end")
      .map((word) => word),
  );
}

export function sliceVersesByWordRange(
  verses: QuranVerse[],
  start: number,
  end: number,
  includeAyahNumberAtVerseEnd: boolean,
) {
  let globalIndex = 0;

  return verses
    .map((verse) => {
      const lastSelectableIndexInVerse = verse.words.reduce(
        (lastIndex, word, index) =>
          word.char_type_name === "end" ? lastIndex : index,
        -1,
      );
      let lastSelectableWordIncluded = false;

      const words = verse.words.filter((word, wordIndex) => {
        if (word.char_type_name === "end") {
          return includeAyahNumberAtVerseEnd && lastSelectableWordIncluded;
        }
        const isSelected = globalIndex >= start && globalIndex <= end;
        if (isSelected && wordIndex === lastSelectableIndexInVerse) {
          lastSelectableWordIncluded = true;
        }
        globalIndex += 1;
        return isSelected;
      });

      return { ...verse, words };
    })
    .filter((verse) => verse.words.length > 0);
}

export function countUniqueLines(verses: QuranVerse[], pageNumber?: number) {
  const lines = new Set<string>();
  verses.forEach((verse) => {
    verse.words.forEach((word) => {
      const lineNumber = Number(word.line_number);
      const wordPageNumber = Number(word.page_number);
      if (
        Number.isFinite(pageNumber) &&
        pageNumber! > 0 &&
        wordPageNumber !== pageNumber
      ) {
        return;
      }
      if (Number.isFinite(lineNumber) && lineNumber > 0) {
        const lineKey =
          Number.isFinite(wordPageNumber) && wordPageNumber > 0
            ? `${wordPageNumber}:${lineNumber}`
            : `0:${lineNumber}`;
        lines.add(lineKey);
      }
    });
  });
  return lines.size;
}

export function areVersesWithinPage(verses: QuranVerse[], pageNumber: number) {
  if (!Number.isFinite(pageNumber) || pageNumber <= 0) return false;
  return verses.every((verse) =>
    verse.words.every((word) => Number(word.page_number) === pageNumber),
  );
}

export function buildAyahImageData(
  selection: AyahSelectionState,
  surahVerses: QuranVerse[],
): AyahImageData | null {
  if (surahVerses.length === 0) return null;

  const surahMeta = surahNames.find((s) => s.number === selection.surahNumber);
  if (!surahMeta) return null;

  const ayahCount = surahMeta.ayahs;
  const clampedAyah = Math.min(Math.max(selection.ayahNumber, 1), ayahCount);
  const rangeStartAyah = Math.max(
    1,
    clampedAyah - Math.max(selection.beforeCount, 0),
  );
  const rangeEndAyah = Math.min(
    ayahCount,
    clampedAyah + Math.max(selection.afterCount, 0),
  );

  const targetVerse = surahVerses.find(
    (verse) => getAyahNumber(verse) === clampedAyah,
  );
  const targetVerses = surahVerses.filter((verse) => {
    const ayah = getAyahNumber(verse);
    return ayah >= rangeStartAyah && ayah <= rangeEndAyah;
  });

  if (!targetVerse || targetVerses.length === 0) return null;

  const firstWord = targetVerses[0]?.words[0];
  if (!firstWord) return null;

  const totalSelectableWords = flattenSelectableWords(targetVerses).length;
  const isSingleAyahSelection = rangeStartAyah === rangeEndAyah;
  const shouldIncludeAyahNumbersInSelection =
    !isSingleAyahSelection || selection.showAyahNumber;
  const committedStart = selection.committedPartStartWordIndex;
  const committedEnd = selection.committedPartEndWordIndex;

  let specificPartStartWordIndex: number | null = null;
  let specificPartEndWordIndex: number | null = null;
  let displayVerses = targetVerses;

  if (selection.specificPartEnabled && totalSelectableWords > 0) {
    const fallbackEnd = totalSelectableWords - 1;
    const rawStart =
      selection.specificPartStartWordIndex ?? committedStart ?? 0;
    const rawEnd =
      selection.specificPartEndWordIndex ?? committedEnd ?? fallbackEnd;
    const start = Math.max(0, Math.min(rawStart, rawEnd, fallbackEnd));
    const end = Math.max(
      start,
      Math.min(Math.max(rawStart, rawEnd), fallbackEnd),
    );

    displayVerses = sliceVersesByWordRange(
      targetVerses,
      start,
      end,
      shouldIncludeAyahNumbersInSelection,
    );

    specificPartStartWordIndex = start;
    specificPartEndWordIndex = end;
  } else if (
    committedStart !== null &&
    committedEnd !== null &&
    totalSelectableWords > 0
  ) {
    displayVerses = sliceVersesByWordRange(
      targetVerses,
      Math.max(
        0,
        Math.min(committedStart, committedEnd, totalSelectableWords - 1),
      ),
      Math.max(
        0,
        Math.min(
          Math.max(committedStart, committedEnd),
          totalSelectableWords - 1,
        ),
      ),
      shouldIncludeAyahNumbersInSelection,
    );
  } else if (isSingleAyahSelection && !selection.showAyahNumber) {
    displayVerses = targetVerses.map((verse) => ({
      ...verse,
      words: verse.words.filter((word) => word.char_type_name !== "end"),
    }));
  }

  if (displayVerses.length === 0) {
    displayVerses = targetVerses;
  }

  const previewPageNumber = Number(firstWord.page_number);
  const lineCount = countUniqueLines(displayVerses, previewPageNumber);

  return {
    surahNumber: selection.surahNumber,
    ayahNumber: clampedAyah,
    rangeStartAyah,
    rangeEndAyah,
    pageNumber: previewPageNumber,
    lineNumber: Number(firstWord.line_number),
    lineCount,
    surahNameAr: surahMeta.arTashkeel,
    surahNameEn: surahMeta.en,
    targetVerse,
    targetVerses,
    displayVerses,
    isSingleAyahSelection,
    showAyahNumber: isSingleAyahSelection ? selection.showAyahNumber : false,
    specificPartEnabled: selection.specificPartEnabled,
    specificPartStartWordIndex,
    specificPartEndWordIndex,
    totalSelectableWords,
  };
}
