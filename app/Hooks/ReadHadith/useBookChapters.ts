import { useState, useEffect } from "react";
import { HadithChapter } from "@/app/Types";
import { getChapters } from "@/app/(Pages)/ReadHadith/Service/HadithApiService";

export function useBookChapters(bookSlug: string, itemsPerPage: number = 20) {
  const [allChapters, setAllChapters] = useState<HadithChapter[]>([]);
  const [chapters, setChapters] = useState<HadithChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchChapters() {
      if (!bookSlug) return;

      try {
        setLoading(true);
        const data = await getChapters(bookSlug, itemsPerPage, currentPage);

        if ("chapters" in data && data.chapters) {
          setChapters(data.chapters.data);
          setAllChapters(data.chapters.data);
          setTotalPages(data.chapters.last_page);
        } else if (Array.isArray(data)) {
          setChapters(data);
          setAllChapters(data);
          setTotalPages(1);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load chapters");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChapters();
  }, [bookSlug, currentPage, itemsPerPage]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setChapters(allChapters);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allChapters.filter(
      (chapter) =>
        chapter.chapterArabic?.toLowerCase().includes(query) ||
        chapter.chapterEnglish?.toLowerCase().includes(query) ||
        chapter.chapterNumber?.toString().includes(query)
    );

    setChapters(filtered);
  }, [searchQuery, allChapters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    chapters,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    handlePageChange,
    handleSearch,
    clearSearch,
  };
}
