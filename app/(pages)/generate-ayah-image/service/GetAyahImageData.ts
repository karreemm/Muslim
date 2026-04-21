import { surahNames } from "@/constants/quranData";
import type { QuranVerse, QuranWord } from "@/hooks/readQuran";
import GetSurah from "@/app/(pages)/read-quran/service/GetSurah";
import type { AyahImageData } from "../types";

interface AyahImageDataResponse {
  ayahData: AyahImageData;
  surahVerses: QuranVerse[];
}

export async function getAyahImageData(
  surahNumber: number,
  ayahNumber: number,
): Promise<AyahImageDataResponse> {
  const surah = surahNames.find((s) => s.number === surahNumber);
  if (!surah) {
    throw new Error("Invalid surah number");
  }

  const verses = (await GetSurah(String(surahNumber))) as QuranVerse[];
  const targetVerse = verses.find((verse) => {
    const [, ayah] = verse.verse_key.split(":");
    return Number(ayah) === ayahNumber;
  });

  if (!targetVerse) {
    throw new Error("Ayah not found");
  }

  const words = targetVerse.words as QuranWord[];
  const firstWord = words[0];

  if (!firstWord) {
    throw new Error("Ayah has no words");
  }

  const pageNumber = Number(firstWord.page_number);
  const lineNumber = Number(firstWord.line_number);

  return {
    ayahData: {
      surahNumber,
      ayahNumber,
      rangeStartAyah: ayahNumber,
      rangeEndAyah: ayahNumber,
      pageNumber,
      lineNumber,
      lineCount: 1,
      surahNameAr: surah.arTashkeel,
      surahNameEn: surah.en,
      targetVerse,
      targetVerses: [targetVerse],
      displayVerses: [targetVerse],
      isSingleAyahSelection: true,
      showAyahNumber: true,
      specificPartEnabled: false,
      specificPartStartWordIndex: null,
      specificPartEndWordIndex: null,
      totalSelectableWords: targetVerse.words.filter(
        (word) => word.char_type_name !== "end",
      ).length,
    },
    surahVerses: verses,
  };
}
