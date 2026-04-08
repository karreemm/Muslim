import quranIndex from "../data/searchQuran/quran-index.json";
import { removeDiacritics } from "./helpers";
import type { SearchResponse, SearchAyah, MatchInterval } from "@/app/(pages)/search-ayah/types";

interface QuranIndexEntry {
  key: string;
  uthmani: string;
  simple: string;
  surah: number;
  ayah: number;
  number: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  surahMeta: {
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}


function normalizeAlef(str: string): string {
  return str.replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627");
}

function toSearchForm(str: string): string {
  return normalizeAlef(removeDiacritics(str)).trim();
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function matchesWholeWord(text: string, phrase: string): boolean {
  const re = new RegExp(`(?:^|\\s)${escapeRegex(phrase)}(?:\\s|$)`, "u");
  return re.test(text);
}

function matchesContains(text: string, phrase: string): boolean {
  return text.includes(phrase);
}

const VOWELS = "\u0622\u0623\u0624\u0625\u0626\u0627\u0648\u0649\u064A\u0670\u0671\u06E5\u06E6";

function getMatchIntervals(originalText: string, searchWords: string[], wholeWord: boolean): MatchInterval[] {
  const mapping: number[] = [];
  let stripped = "";

  for (let i = 0; i < originalText.length; i++) {
    const char = originalText[i];
    
    if (/[\u064B-\u065F\u06D6-\u06E4\u06E7-\u06ED\u0640\uFEFF]/.test(char)) {
      continue;
    } else {
      stripped += char;
      mapping.push(i);
    }
  }

  const finalMapping: number[] = [];
  let finalStripped = "";
  let inSpace = false;

  for (let i = 0; i < stripped.length; i++) {
    const isSpace = /\s/.test(stripped[i]);
    if (isSpace) {
      if (!inSpace) {
        finalStripped += " ";
        finalMapping.push(mapping[i]);
        inSpace = true;
      }
    } else {
      finalStripped += stripped[i];
      finalMapping.push(mapping[i]);
      inSpace = false;
    }
  }

  const intervals: MatchInterval[] = [];
  const vStar = `[${VOWELS}]*`;
  const vPlus = `[${VOWELS}]+`;

  const wordsToIterate = searchWords.length > 0 ? [searchWords.join(" ")] : [];

  for (const word of wordsToIterate) {
    if (!word) continue;
    
    let fuzzyRegexStr = "";
    for (const char of word) {
      if (char === " ") {
        fuzzyRegexStr += "\\s*";
      } else if (new RegExp(`[${VOWELS}]`).test(char)) {
        if (!fuzzyRegexStr.endsWith(vPlus)) {
          if (fuzzyRegexStr.endsWith(vStar)) {
            fuzzyRegexStr = fuzzyRegexStr.slice(0, -vStar.length) + vPlus;
          } else {
            fuzzyRegexStr += vPlus;
          }
        }
      } else {
        fuzzyRegexStr += escapeRegex(char) + vStar;
      }
    }

    const regex = wholeWord 
      ? new RegExp(`(^|\\s)(${fuzzyRegexStr})(?=\\s|$)`, "g")
      : new RegExp(`()(${fuzzyRegexStr})`, "g");
      
    let match;
    while ((match = regex.exec(finalStripped)) !== null) {
      const startStripped = match.index + match[1].length;
      const endStripped = startStripped + match[2].length - 1;
      
      const startOriginal = finalMapping[startStripped];
      let endOriginal = finalMapping[endStripped];

      while (
        endOriginal + 1 < originalText.length && 
        /[\u064B-\u065F\u06D6-\u06E4\u06E7-\u06ED\u0640]/.test(originalText[endOriginal + 1])
      ) {
        endOriginal++;
      }
      
      intervals.push({ start: startOriginal, end: endOriginal });
      
      if (match.index === regex.lastIndex) regex.lastIndex++;
    }
  }

  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a.start - b.start);
  
  const merged: MatchInterval[] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    if (current.start <= last.end + 1) { 
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function extractHighlightKeyword(keyword: string): string {
  return keyword.trim();
}

const index = quranIndex as QuranIndexEntry[];

export function searchLocalQuran(
  keyword: string,
  surah: string | number = "all",
  page: number = 1,
  limit: number = 20,
  wholeWord: boolean = true,
): SearchResponse {
  if (!keyword || keyword.trim() === "") {
    return { count: 0, totalPages: 0, matches: [] };
  }

  const normalizedKeyword = toSearchForm(keyword.trim());
  const searchWords = normalizedKeyword.split(/\s+/).filter(Boolean);

  if (searchWords.length === 0) {
    return { count: 0, totalPages: 0, matches: [] };
  }

  const targetSurah =
    surah === "all" ? "all" : Number.parseInt(String(surah), 10);

  const highlightKeyword = extractHighlightKeyword(keyword);

  const matches: SearchAyah[] = [];

  for (const entry of index) {
    if (targetSurah !== "all" && entry.surah !== targetSurah) continue;

    const phrase = searchWords.join(" ");
    const isMatch = wholeWord
      ? matchesWholeWord(entry.simple, phrase)
      : matchesContains(entry.simple, phrase);

    if (!isMatch) continue;
    
    const matchIntervals = getMatchIntervals(entry.uthmani, searchWords, wholeWord);

    matches.push({
      number: entry.number,
      text: entry.uthmani,
      highlightKeyword,
      matchIntervals,
      edition: {
        identifier: "quran-local",
        language: "ar",
        name: "القرآن الكريم",
        englishName: "Quran",
        format: "text",
        type: "quran",
      },
      surah: {
        number: entry.surah,
        name: entry.surahMeta.name,
        englishName: entry.surahMeta.englishName,
        englishNameTranslation: entry.surahMeta.englishNameTranslation,
        revelationType: entry.surahMeta.revelationType,
        numberOfAyahs: entry.surahMeta.numberOfAyahs,
      },
      numberInSurah: entry.ayah,
      juz: entry.juz,
      manzil: entry.manzil,
      page: entry.page,
      ruku: entry.ruku,
      hizbQuarter: entry.hizbQuarter,
      sajda: entry.sajda,
    });
  }

  const total = matches.length;
  const startIndex = (page - 1) * limit;
  const paginated = matches.slice(startIndex, startIndex + limit);

  return {
    count: total,
    totalPages: Math.ceil(total / limit),
    matches: paginated,
  };
}