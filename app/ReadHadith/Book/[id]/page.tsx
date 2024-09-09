"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/Context/LanguageContext";
import Nvbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import { hadithBooks } from "@/app/Lib/Constants";
import TranslationPair from "@/app/Lib/Types";
import Pagination from "../../../Components/Pagination";
import { toArabicNumber, toEnglishNumber } from "@/app/Lib/Helpers";
import DisplayHadith from "./DisplayHadith";
import DisplayHadiths from "./DisplayHadiths";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

export default function BookPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

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
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1];
    const hadithNumberr = searchParams.get("hadith");
    console.log(id);
    if (id) {
      setBookId(id);
      setTotalPages(hadithBooks.find((b) => b.id === id)?.number || 0);
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
  console.log(`Converted search query to English number string: ${englishNumberString}`);

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

  const Book: TranslationPair = {
    ar: "كتاب الإمام",
    en: "Book of the Imam",
  };

  const SearchPlaceholder: TranslationPair = {
    en: "Search Hadith By Number",
    ar: "ابحث عن الحديث بالرقم",
  };

  const Error: TranslationPair = {
    en: "Error: Please enter a valid number",
    ar: "خطأ: الرجاء إدخال رقم صحيح",
  };

  return (
    <>
      <Nvbar />
      <div className="w-full min-h-screen flex flex-col gap-5 p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="w-full flex justify-center">
          <h1 className="mt-24 text-4xl font-bold flex gap-1 text-center">
            {Book[language]} {language === "en" ? bookNameEn : bookNameAr}
          </h1>
        </div>
        <div
          className={`mt-10 w-full flex items-center gap-4 md:w-[20%] ${
            language === "ar" ? "mr-4 md:mr-10" : "ml-4 md:ml-10"
          }`}
        >
          {" "}
          <input
            type="search"
            placeholder={SearchPlaceholder[language]}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-[80%] md:w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-600 text-slate-900"
          />
          <button onClick={handleSearch} className="text-teal-600">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl" />
          </button>
        </div>
        <div className="mt-10 w-full bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
            </div>
          ) : hadithNumberEn !== null ? (
            <DisplayHadith hadithNumber={hadithNumberEn} bookId={bookId} />
          ) : searchResult !== null ? (
            searchError ? (
              <h1 className="text-red-600 text-center text-2xl">
                {Error[language]}{" "}
              </h1>
            ) : (
              <DisplayHadith hadithNumber={searchResult} bookId={bookId} />
            )
          ) : (
            <DisplayHadiths
              startingNumber={(currentPage - 1) * 5 + 1}
              bookId={bookId}
            />
          )}
        </div>
        <div className="w-full">
          <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
        <div className="h-10"></div>
      </div>
      <Footer />
    </>
  );
}
