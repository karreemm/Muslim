import { removeDiacritics } from "@/utils/helpers";
import type { SearchResponse, SearchAyah, MatchInterval } from "../types";

const searchCache = new Map<string, SearchResponse>();

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
      return { count: 0, totalPages: 0, matches: [] };
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

    const params = new URLSearchParams({
      q: normalizedKeyword,
      surah: String(surah),
      page: String(page),
      limit: String(limit),
      wholeWord: String(wholeWord),
    });

    const url = `/api/search-quran?${params.toString()}`;
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

    if (response.status === 404) {
      console.log("No results found (404)");
      return { count: 0, totalPages: 0, matches: [] };
    }

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      const payload = await response.json().catch(() => null);
      const apiError = payload?.error as string | undefined;
      if (language === "en") {
        throw new Error(apiError || `Search failed: ${response.statusText}`);
      }
      throw new Error(apiError || `فشل البحث: ${response.statusText}`);
    }

    const data = (await response.json()) as SearchResponse;

    if (!data || data.count === 0) {
      return { count: 0, totalPages: 0, matches: [] };
    }

    const quranMatches = data.matches.filter(
      (match: SearchAyah) => match.edition.type === "quran",
    );

    const finalResponse = {
      count: quranMatches.length,
      totalPages: data.totalPages || 0,
      matches: quranMatches,
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
