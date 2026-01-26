import { useState, useCallback, useMemo } from "react";
import {
  searchAyahs,
  type SearchResponse,
} from "@/app/(pages)/search-ayah/service/GetSearchAyah";

export const useSearchAyah = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const performSearch = useCallback(
    async (page: number = 1) => {
      if (!keyword || keyword.trim().length === 0) {
        setResults(null);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setError("");

      if (page === 1) {
        setHasSearched(true);
        setCurrentPage(1);
      }

      try {
        const searchResults = await searchAyahs(
          keyword,
          "all",
          page,
          itemsPerPage,
        );

        if (searchResults) {
          setResults(searchResults);
          setTotalCount(searchResults.count);
          setError("");
        } else {
          setError("Failed to fetch search results");
          setResults(null);
        }
      } catch (err) {
        console.error("Search error:", err);
        if (err instanceof Error) {
          setError(err.message || "An error occurred while searching");
        } else {
          setError("An error occurred while searching");
        }
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, itemsPerPage],
  );

  const clearSearch = useCallback(() => {
    setKeyword("");
    setResults(null);
    setTotalCount(0);
    setError("");
    setHasSearched(false);
    setCurrentPage(1);
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      performSearch(newPage);
    },
    [performSearch],
  );

  const totalPages = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.ceil(totalCount / itemsPerPage);
  }, [totalCount, itemsPerPage]);

  return {
    keyword,
    setKeyword,
    results,
    totalResults: totalCount,
    isLoading,
    error,
    hasSearched,
    clearSearch,
    performSearch,
    currentPage,
    changePage,
    totalPages,
  };
};
