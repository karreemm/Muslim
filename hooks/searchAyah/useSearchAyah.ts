import { useState, useCallback, useMemo } from "react";
import {
  searchAyahs,
  type SearchResponse,
} from "@/app/(pages)/search-ayah/service/GetSearchAyah";
import { useLanguage } from "@/context/LanguageContext";

export const useSearchAyah = () => {
  const { language } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [wholeWord, setWholeWord] = useState(true);
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
        setSearchedKeyword(keyword);
      }

      try {
        const searchResults = await searchAyahs(
          keyword,
          "all",
          page,
          itemsPerPage,
          wholeWord,
          language,
        );

        if (searchResults) {
          setResults(searchResults);
          setTotalCount(searchResults.count);
          setError("");

          if (searchResults.count === 0) {
            console.log("No ayahs matched the search query");
          }
        } else {
          setError("Failed to fetch search results");
          setResults(null);
        }
      } catch (err) {
        console.error("Search error:", err);
        if (err instanceof Error) {
          if (err.message.includes("too short")) {
            if (language === "en") {
              setError(
                "Search term is too short. Please use at least 3 characters.",
              );
            } else {
              setError(
                "كلمة البحث قصيرة جدًا. يرجى استخدام 3 أحرف على الأقل للحصول على نتائج أفضل.",
              );
            }
          } else if (err.message.includes("timeout")) {
            if (language === "en") {
              setError(
                "The search is taking too long. Please try a simpler search or try again later.",
              );
            } else {
              setError(
                "البحث يستغرق وقتًا طويلاً. يرجى تجربة بحث أبسط أو المحاولة مرة أخرى لاحقًا.",
              );
            }
          } else if (err.message.includes("Failed to fetch")) {
            if (language === "en") {
              setError(
                "Network error. Please check your internet connection and try again.",
              );
            } else {
              setError(
                "خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
              );
            }
          } else if (err.message.includes("API server is having trouble")) {
            if (language === "en") {
              setError(
                "The search term caused a server error. Try using a longer or more specific phrase.",
              );
            } else {
              setError(
                "تسبب مصطلح البحث في خطأ في الخادم. حاول استخدام عبارة أطول أو أكثر تحديدًا.",
              );
            }
          } else {
            if (language === "en") {
              setError(err.message || "An error occurred while searching");
            } else {
              setError(err.message || "حدث خطأ أثناء البحث");
            }
          }
        } else {
          if (language === "en") {
            setError("An error occurred while searching");
          } else {
            setError("حدث خطأ أثناء البحث");
          }
        }
        setResults(null);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, itemsPerPage, wholeWord, language],
  );

  const clearSearch = useCallback(() => {
    setKeyword("");
    setSearchedKeyword("");
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
    searchedKeyword,
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
    wholeWord,
    setWholeWord,
  };
};
