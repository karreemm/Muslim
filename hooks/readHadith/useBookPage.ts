import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { hadithBooks } from "../../constants/hadithData";
import { toArabicNumber, toEnglishNumber } from "../../utils/helpers";

export interface UseBookPageReturn {
  bookId: string;
  hadithNumberEn: number | null;
  hadithNumberAr: number | string | null;
  bookNameEn: string;
  bookNameAr: string;
  currentPage: number;
  searchQuery: string;
  searchResult: number | null;
  loading: boolean;
  searchError: boolean;
  handlePageChange: (page: number) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => Promise<void>;
}

export const useBookPage = (): UseBookPageReturn => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [bookId, setBookId] = useState<string>("");
  const [hadithNumberEn, setHadithNumberEn] = useState<number | null>(null);
  const [hadithNumberAr, setHadithNumberAr] = useState<number | string | null>(
    null
  );
  const [bookNameEn, setBookNameEn] = useState<string>("");
  const [bookNameAr, setBookNameAr] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<boolean>(false);
  const [totalPages] = useState<number>(0);

  useEffect(() => {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1];
    const hadithNumberr = searchParams.get("hadith");
    console.log(id);
    if (id) {
      setBookId(id);
    } else {
      setBookId("muslim");
    }
    if (hadithNumberr) {
      setHadithNumberEn(parseInt(hadithNumberr, 10));
      setHadithNumberAr(toArabicNumber(parseInt(hadithNumberr, 10)));
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const book = hadithBooks.find((b) => b.id === bookId);
    if (book) {
      setBookNameEn(book.name_en);
      setBookNameAr(book.name_ar);
    }
  }, [bookId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchResult(null);
    setHadithNumberEn(null);
    setHadithNumberAr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log(`Current Page: ${page}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    const englishNumberString = toEnglishNumber(searchQuery);
    console.log(
      `Converted search query to English number string: ${englishNumberString}`
    );

    const hadithNumber = parseInt(englishNumberString, 10);
    console.log(`Parsed hadith number: ${hadithNumber}`);
    console.log(`Original search query: ${searchQuery}`);

    if (
      !isNaN(hadithNumber) &&
      hadithNumber > 0 &&
      hadithNumber <= totalPages * 5
    ) {
      setLoading(true);
      setSearchResult(hadithNumber);
      setLoading(false);
    } else {
      setSearchError(true);
      setTimeout(() => {
        setSearchError(false);
      }, 3000);
    }
  };

  return {
    bookId,
    hadithNumberEn,
    hadithNumberAr,
    bookNameEn,
    bookNameAr,
    currentPage,
    searchQuery,
    searchResult,
    loading,
    searchError,
    handlePageChange,
    handleSearchChange,
    handleSearch,
  };
};
