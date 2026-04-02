"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useSearchAyah } from "@/hooks/searchAyah";
import { AyahSearchCard } from "./components/AyahSearchCard";
import { AyahSearchCardSkeleton } from "./components/AyahSearchCardSkeleton";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

export default function SearchAyah() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const {
    keyword,
    setKeyword,
    searchedKeyword,
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
    wholeWord,
    setWholeWord,
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
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="w-full max-w-7xl mx-auto min-h-screen flex flex-col items-center gap-10"
      >
        <div className="w-full mt-10">
          <div className="w-[90%] mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-3 sm:p-6 border border-transparent hover:border-border transition-all">
              <div className="flex items-center gap-2 sm:gap-3">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-lg sm:text-2xl text-primary flex-shrink-0"
                />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("searchAyah.placeholder")}
                  className="flex-1 text-base sm:text-xl  outline-none bg-transparent text-foreground placeholder:text-muted-foreground min-w-0"
                  dir={language === "ar" ? "rtl" : "ltr"}
                />

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={wholeWord}
                      onChange={(e) => setWholeWord(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-border rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center group-hover:border-primary">
                      <svg
                        className={`w-3 h-3 text-primary-foreground transition-all duration-200 ${
                          wholeWord
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50"
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base  text-muted-foreground group-hover:text-primary transition-colors select-none">
                    {t("searchAyah.exactPhrase")}
                  </span>
                </label>

                {keyword && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors flex-shrink-0"
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
                  className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all  text-sm sm:text-base flex-shrink-0 whitespace-nowrap"
                >
                  {t("searchAyah.searchButton")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[90%] flex-1 flex flex-col bg-background dark:bg-background text-foreground dark:text-foreground p-5 rounded-lg min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5">
              <AyahSearchCardSkeleton />
              <AyahSearchCardSkeleton />
              <AyahSearchCardSkeleton />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-center py-20">
              <p className="text-lg  text-destructive">{error}</p>
            </div>
          ) : results && totalResults > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold ">
                  {t("searchAyah.resultsFound", { count: totalResults })}
                </h2>
                <p className="text-sm mt-1  opacity-70">
                  {t("searchAyah.searchingFor")} &quot;{searchedKeyword}&quot;
                </p>
                <p className="text-sm mt-1  opacity-70">
                  {t("searchAyah.showingPage", {
                    current: currentPage,
                    total: totalPages,
                  })}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {results.matches.map((ayah, index) => (
                  <AyahSearchCard
                    key={`${ayah.number}-${index}`}
                    ayah={ayah}
                    highlightKeyword={searchedKeyword}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all "
                  >
                    {t("searchAyah.previous")}
                  </button>
                  <span className="px-4 ">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages || isLoading}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all "
                  >
                    {t("searchAyah.next")}
                  </button>
                </div>
              )}
            </>
          ) : hasSearched && totalResults === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center py-20">
              <p className="text-lg ">
                {t("searchAyah.noResults")}
              </p>
              <p className="text-sm mt-2  opacity-70">
                {t("searchAyah.tryDifferent")}
              </p>
            </div>
          ) : (
            <div className="flex-1 text-center py-20 flex justify-center items-center flex-col">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-6xl text-primary mb-4"
              />
              <p className="text-xl ">
                {t("searchAyah.startSearch")}
              </p>
            </div>
          )}
        </div>
        <div className="h-10"></div>
      </div>
    </>
  );
}
