"use client";

import { useLanguage } from "@/app/Context/LanguageContext";
import Nvbar from "@/app/Components/general/Navbar";
import Footer from "@/app/Components/general/Footer";
import TranslationPair from "@/app/Types";
import Pagination from "../../../../Components/general/Pagination";
import DisplayHadith from "./DisplayHadith";
import DisplayHadiths from "./DisplayHadiths";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import { useBookPage } from "@/app/Hooks/ReadHadith/useBookPage";

export default function BookPage() {
  const { language } = useLanguage();
  const {
    bookId,
    hadithNumberEn,
    bookNameEn,
    bookNameAr,
    currentPage,
    searchQuery,
    searchResult,
    loading,
    searchError,
    totalPages,
    handlePageChange,
    handleSearchChange,
    handleSearch,
  } = useBookPage();

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
            className="w-[80%] bg-white md:w-full p-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-600 text-slate-900"
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
