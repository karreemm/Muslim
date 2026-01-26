"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useSearchAyah } from "@/hooks/searchAyah";
import { AyahSearchCard } from "./components/AyahSearchCard";
import { AyahSearchCardSkeleton } from "./components/AyahSearchCardSkeleton";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";

export default function SearchAyah() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const {
    keyword,
    setKeyword,
    results,
    totalResults,
    isLoading,
    error,
    hasSearched,
    clearSearch,
    performSearch,
    currentPage,
    changePage,
    totalPages,
  } = useSearchAyah();

  const handleClearSearch = () => {
    clearSearch();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    performSearch();
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
    scrollToTop();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  return (
    <>
      <Navbar />
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="w-full max-w-[1500px] mx-auto min-h-screen flex flex-col items-center gap-10"
      >
        <div className="w-full mt-32">
          <div className="w-[90%] mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 sm:p-6 border border-transparent hover:border-teal-600 dark:hover:border-teal-500 transition-all">
              <div className="flex items-center gap-2 sm:gap-3">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-lg sm:text-2xl text-teal-600 dark:text-teal-500 flex-shrink-0"
                />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("searchAyah.placeholder")}
                  className="flex-1 text-base sm:text-xl dynamic-font outline-none bg-transparent text-[#134B70] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 min-w-0"
                  dir={language === "ar" ? "rtl" : "ltr"}
                />
                {keyword && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-sm sm:text-base"
                    />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  disabled={!keyword.trim() || isLoading}
                  className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all dynamic-font text-sm sm:text-base flex-shrink-0 whitespace-nowrap"
                >
                  {t("searchAyah.searchButton")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[90%] bg-[#FFF5E4] dark:bg-slate-900 text-[#134B70] dark:text-white p-5 rounded-lg min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5">
              <AyahSearchCardSkeleton />
              <AyahSearchCardSkeleton />
              <AyahSearchCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg dynamic-font text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          ) : results && totalResults > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold dynamic-font">
                  {t("searchAyah.resultsFound", { count: totalResults })}
                </h2>
                <p className="text-sm mt-1 dynamic-font opacity-70">
                  {t("searchAyah.searchingFor")} "{keyword}"
                </p>
                <p className="text-sm mt-1 dynamic-font opacity-70">
                  {t("searchAyah.showingPage", {
                    current: currentPage,
                    total: totalPages,
                  })}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {results.matches.map((ayah, index) => (
                  <AyahSearchCard key={`${ayah.number}-${index}`} ayah={ayah} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all dynamic-font"
                  >
                    {t("searchAyah.previous")}
                  </button>
                  <span className="px-4 dynamic-font">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages || isLoading}
                    className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all dynamic-font"
                  >
                    {t("searchAyah.next")}
                  </button>
                </div>
              )}
            </>
          ) : hasSearched && totalResults === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg dynamic-font">
                {t("searchAyah.noResults")}
              </p>
              <p className="text-sm mt-2 dynamic-font opacity-70">
                {t("searchAyah.tryDifferent")}
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-6xl text-teal-600 dark:text-teal-500 mb-4"
              />
              <p className="text-xl dynamic-font">
                {t("searchAyah.startSearch")}
              </p>
            </div>
          )}
        </div>

        <div className="h-20"></div>
      </div>
      <Footer />
    </>
  );
}
