import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "@/hooks/general/useTranslation";

import type { SearchAyah, SearchResponse } from "@/types/searchAyah";

const ITEMS_PER_PAGE = 20;

export function useSearchAyah() {
  const { t } = useTranslation();

  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [wholeWord, setWholeWord] = useState(false);

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

        if (res.status === 400) {
          throw new Error("SHORT_QUERY");
        }

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(
            payload?.error ?? t("common.searchFailed", { status: res.statusText }),
          );
        }

        const data: SearchResponse = await res.json();
        setResults(data);
        setError("");
      } catch (err) {
        const message = err instanceof Error ? err.message : t("common.searchError");

        if (message === "SHORT_QUERY" || message.includes("short")) {
          setError(t("common.searchShort"));
        } else if (
          message.toLowerCase().includes("timeout") ||
          err instanceof DOMException
        ) {
          setError(t("common.searchTimeout"));
        } else if (
          message.includes("Failed to fetch") ||
          message.includes("NetworkError")
        ) {
          setError(t("common.networkError"));
        } else {
          setError(t("common.searchError"));
        }

        setResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, wholeWord, t],
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
