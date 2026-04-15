import { useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/context/general/LanguageContext";

import type { SearchAyah, SearchResponse } from "@/app/(pages)/search-ayah/types";

const ITEMS_PER_PAGE = 20;

export function useSearchAyah() {
  const { language } = useLanguage();

  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [wholeWord, setWholeWord] = useState(false);

  const isAr = language !== "en";

  function t(ar: string, en: string) {
    return isAr ? ar : en;
  }

  const performSearch = useCallback(
    async (page: number = 1) => {
      if (!keyword.trim()) {
        setResults(null);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setError("");

      if (page === 1) {
        setHasSearched(true);
        setCurrentPage(1);
        setSearchedKeyword(keyword.trim());
      }

      try {
        const params = new URLSearchParams({
          q: keyword.trim(),
          surah: "all",
          page: String(page),
          limit: String(ITEMS_PER_PAGE),
          wholeWord: String(wholeWord),
        });

        const res = await fetch(`/api/search-quran?${params}`, {
          signal: AbortSignal.timeout(15_000),
        });

        if (res.status === 404) {
          setResults({ count: 0, totalPages: 0, matches: [] });
          return;
        }

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(
            payload?.error ??
              t(`فشل البحث: ${res.statusText}`, `Search failed: ${res.statusText}`),
          );
        }

        const data: SearchResponse = await res.json();
        setResults(data);
        setError("");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t("حدث خطأ أثناء البحث", "Search error");

        if (message.includes("short") || message.includes("قصيرة")) {
          setError(
            t(
              "كلمة البحث قصيرة جدًا. يرجى استخدام 3 أحرف على الأقل.",
              "Search term is too short. Please use at least 3 characters.",
            ),
          );
        } else if (message.includes("timeout") || err instanceof DOMException) {
          setError(
            t(
              "البحث يستغرق وقتًا طويلاً. حاول مجددًا.",
              "Search timed out. Please try again.",
            ),
          );
        } else if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
          setError(
            t(
              "خطأ في الشبكة. تحقق من اتصالك بالإنترنت.",
              "Network error. Check your connection.",
            ),
          );
        } else {
          setError(message);
        }

        setResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, wholeWord, language],
  );

  const changePage = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      performSearch(newPage);
    },
    [performSearch],
  );

  const clearSearch = useCallback(() => {
    setKeyword("");
    setSearchedKeyword("");
    setResults(null);
    setError("");
    setHasSearched(false);
    setCurrentPage(1);
  }, []);

  return {
    keyword,
    setKeyword,
    searchedKeyword,
    results,
    totalResults: results?.count ?? 0,
    totalPages: results?.totalPages ?? 0,
    isLoading,
    error,
    hasSearched,
    currentPage,
    wholeWord,
    setWholeWord,
    performSearch,
    changePage,
    clearSearch,
  };
}