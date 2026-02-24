import { removeDiacritics } from "@/utils/helpers";

const searchCache = new Map<string, SearchResponse>();
const ayahCache = new Map<number, any>();

export interface SearchAyah {
  number: number;
  text: string;
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
  matches: SearchAyah[];
}

const filterWholeWordMatches = (
  matches: SearchAyah[],
  searchTerm: string,
): SearchAyah[] => {
  const searchWords = searchTerm.trim().split(/\s+/);

  return matches.filter((match) => {
    const normalizedText = removeDiacritics(match.text);

    return searchWords.every((word) => {
      const escapedWord = escapeRegex(word);
      const regex = new RegExp(
        `(^|[\\s\\p{P}])${escapedWord}($|[\\s\\p{P}])`,
        "u",
      );
      return regex.test(normalizedText);
    });
  });
};

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const searchAyahs = async (
  keyword: string,
  surah: string | number = "all",
  page: number = 1,
  limit: number = 20,
  wholeWord: boolean = true,
  language: string = "ar",
): Promise<SearchResponse | null> => {
  try {
    if (!keyword || keyword.trim().length === 0) {
      return { count: 0, matches: [] };
    }

    const normalizedKeyword = removeDiacritics(keyword.trim());

    if (normalizedKeyword.length <= 2) {
      if (language === "en") {
        throw new Error(
          "Search term is too short. Please use at least 3 characters for better results.",
        );
      }
      throw new Error(
        "كلمة البحث قصيرة جدًا. يرجى استخدام 3 أحرف على الأقل للحصول على نتائج أفضل.",
      );
    }

    const cacheKey = `${normalizedKeyword}-${surah}-${page}-${limit}-${wholeWord}`;
    if (searchCache.has(cacheKey)) {
      console.log("Returning cached search results for:", cacheKey);
      return searchCache.get(cacheKey)!;
    }

    console.log("Original Keyword:", keyword);
    console.log("Normalized Keyword:", normalizedKeyword);
    console.log("Page:", page, "Limit:", limit);

    const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(normalizedKeyword)}/${surah}/ar`;
    console.log("Search URL:", url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      console.error("Too many requests (429)");
      if (language === "en") {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }
      throw new Error("تجاوزت حد الطلبات. يرجى الانتظار لحظة والمحاولة مرة أخرى.");
    }

    if (response.status === 404) {
      console.log("No results found (404)");
      return { count: 0, matches: [] };
    }

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      if (language === "en") {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      throw new Error(`فشل البحث: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data || data.data.count === 0) {
      return { count: 0, matches: [] };
    }

    const quranMatches = data.data.matches.filter(
      (match: SearchAyah) => match.edition.type === "quran",
    );

    if (quranMatches.length === 0) {
      return { count: 0, matches: [] };
    }

    const filteredMatches = wholeWord
      ? filterWholeWordMatches(quranMatches, normalizedKeyword)
      : quranMatches;

    if (filteredMatches.length === 0) {
      return { count: 0, matches: [] };
    }

    const uniqueAyahNumbers = Array.from(
      new Set(filteredMatches.map((match: SearchAyah) => match.number)),
    ) as number[];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAyahNumbers = uniqueAyahNumbers.slice(startIndex, endIndex);

    console.log("Fetching ayahs for page:", paginatedAyahNumbers);

    const fullAyahs: any[] = [];

    for (let i = 0; i < paginatedAyahNumbers.length; i++) {
      const num = paginatedAyahNumbers[i];

      if (ayahCache.has(num)) {
        fullAyahs.push(ayahCache.get(num));
        continue;
      }

      try {
        if (i > 0 && i % 3 === 0) {
          await sleep(100);
        }

        const ayahResponse = await fetch(
          `https://api.alquran.cloud/v1/ayah/${num}/quran-uthmani`,
        );

        if (ayahResponse.ok) {
          const ayahData = await ayahResponse.json();
          ayahCache.set(num, ayahData.data);
          fullAyahs.push(ayahData.data);
        } else if (ayahResponse.status === 429) {
          console.warn(`429 encountered for ayah ${num}, waiting longer...`);
          await sleep(1000);

          const retryResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${num}/quran-uthmani`);
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            ayahCache.set(num, retryData.data);
            fullAyahs.push(retryData.data);
          }
        }
      } catch (error) {
        console.error(`Error fetching ayah ${num}:`, error);
      }
    }

    const finalResponse = {
      count: uniqueAyahNumbers.length,
      matches: fullAyahs,
    };

    searchCache.set(cacheKey, finalResponse);

    return finalResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("Request timeout - API took too long to respond");
        throw new Error("Request timeout. Please try again.");
      }
      console.error("Error searching ayahs:", error.message);
    } else {
      console.error("Error searching ayahs:", error);
    }
    throw error;
  }
};

export const searchInEdition = async (
  keyword: string,
  edition: string,
  language: string = "ar",
): Promise<SearchResponse | null> => {
  return searchAyahs(keyword, "all", 1, 20, true, language);
};

export const searchInSurah = async (
  keyword: string,
  surahNumber: number,
  language: string = "ar",
): Promise<SearchResponse | null> => {
  return searchAyahs(keyword, surahNumber, 1, 20, true, language);
};
