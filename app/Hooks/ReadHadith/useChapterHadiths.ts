import { useState, useEffect } from "react";
import { Hadith } from "@/app/Types";
import {
  getChapterHadiths,
  searchHadiths,
  searchHadithByNumber,
} from "@/app/(Pages)/ReadHadith/Service/HadithApiService";
import { useFavoriteHadiths } from "@/app/Context/FavoriteHadithsContext";

export function useChapterHadiths(
  bookSlug: string,
  chapterNumber: string,
  itemsPerPage: number = 10
) {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHadiths, setTotalHadiths] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"number" | "content">("content");
  const [isSearching, setIsSearching] = useState(false);

  const { favoriteHadiths, addFavoriteHadith, removeFavoriteHadith } =
    useFavoriteHadiths();

  useEffect(() => {
    async function fetchHadiths() {
      if (!bookSlug || !chapterNumber) return;

      try {
        setLoading(true);
        const data = await getChapterHadiths(
          bookSlug,
          chapterNumber,
          currentPage,
          itemsPerPage
        );

        if (data.hadiths) {
          setHadiths(data.hadiths.data);
          setTotalPages(data.hadiths.last_page);
          setTotalHadiths(data.hadiths.total);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load hadiths");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!isSearching) {
      fetchHadiths();
    }
  }, [bookSlug, chapterNumber, currentPage, itemsPerPage, isSearching]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setCurrentPage(1);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

      let data;
      if (searchType === "number") {
        data = await searchHadithByNumber(searchQuery, bookSlug);
      } else {
        const hasArabic = /[\u0600-\u06FF]/.test(searchQuery);
        const language = hasArabic ? "ar" : "en";

        data = await searchHadiths(
          searchQuery,
          language,
          bookSlug,
          currentPage,
          itemsPerPage
        );
      }

      if (data.hadiths) {
        setHadiths(data.hadiths.data);
        setTotalPages(data.hadiths.last_page);
        setTotalHadiths(data.hadiths.total);
      }

      setError(null);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
  };

  const isFavorite = (hadithNumber: string, bookSlug: string) => {
    return favoriteHadiths.some(
      (h) => h.numberEn === parseInt(hadithNumber) && h.bookId === bookSlug
    );
  };

  const toggleFavorite = (hadith: Hadith) => {
    const hadithNumber = parseInt(hadith.hadithNumber);

    if (isFavorite(hadith.hadithNumber, bookSlug)) {
      removeFavoriteHadith(hadithNumber, bookSlug);
    } else {
      addFavoriteHadith({
        text: hadith.hadithArabic,
        nameAr: hadith.bookName || null,
        nameEn: hadith.bookName || null,
        numberAr: hadith.hadithNumber,
        numberEn: hadithNumber,
        bookId: bookSlug,
      });
    }
  };

  return {
    hadiths,
    loading,
    error,
    currentPage,
    totalPages,
    totalHadiths,
    searchQuery,
    searchType,
    isSearching,
    setSearchQuery,
    setSearchType,
    handlePageChange,
    handleSearch,
    clearSearch,
    isFavorite,
    toggleFavorite,
  };
}
