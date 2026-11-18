export interface MatchInterval {
  start: number;
  end: number;
}

export interface SearchAyah {
  number: number;
  text: string;
  highlightKeyword: string;
  matchIntervals?: MatchInterval[];
  matchedWordIndices?: number[];
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface SearchResponse {
  count: number;
  totalPages: number;
  matches: SearchAyah[];
}
