"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useSearchAyah } from "@/hooks/searchAyah";
import { AyahSearchCard } from "./components/AyahSearchCard";
import { AyahSearchCardSkeleton } from "./components/AyahSearchCardSkeleton";
import Pagination from "@/components/general/Pagination";

export default function SearchAyah() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isArabic = language === "ar";

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

  const handleSearch = () => {
    performSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const handlePageChange = (page: number) => {
    changePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground  mb-3">
            {t("searchAyah.title")}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 border border-border/50 p-2 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <FontAwesomeIcon icon={faSearch} className="text-xl" />
              </div>

              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("searchAyah.placeholder")}
                  className="w-full h-12 px-4 text-lg bg-transparent text-foreground placeholder:text-muted-foreground/60 
                    outline-none border-none "
                  dir={isArabic ? "rtl" : "ltr"}
                />
                {keyword && (
                  <button
                    onClick={handleClearSearch}
                    className={`absolute inset-y-0 ${isArabic ? "left-0" : "right-0"} px-4 text-muted-foreground hover:text-foreground transition-colors`}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer group px-3 py-2 rounded-xl hover:bg-secondary/50 transition-colors shrink-0">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={wholeWord}
                    onChange={(e) => setWholeWord(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-5 h-5 border-2 border-border rounded-md bg-background 
                    peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 
                    flex items-center justify-center group-hover:border-primary/50"
                  >
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
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                  {t("searchAyah.exactPhrase")}
                </span>
              </label>

              <button
                onClick={handleSearch}
                disabled={!keyword.trim() || isLoading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold 
                  shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 
                  hover:-translate-y-0.5 transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
                  active:translate-y-0 shrink-0"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("common.searching")}
                  </span>
                ) : (
                  t("searchAyah.searchButton")
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col gap-5">
              <AyahSearchCardSkeleton />
              <AyahSearchCardSkeleton />
              <AyahSearchCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mb-4">
                <FontAwesomeIcon icon={faTimes} className="text-3xl" />
              </div>
              <p className="text-lg text-destructive font-medium">{error}</p>
            </div>
          ) : results && totalResults > 0 ? (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                <div>
                  <h2 className="text-xl font-bold text-foreground ">
                    {t("searchAyah.resultsFound", { count: totalResults })}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("searchAyah.searchingFor")}{" "}
                    <span className="font-semibold text-primary">
                      &quot;{searchedKeyword}&quot;
                    </span>
                  </p>
                </div>
                <div className="w-fit text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded-full border border-border/30">
                  {t("searchAyah.showingPage", {
                    current: currentPage,
                    total: totalPages,
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {results.matches.map((ayah, index) => (
                  <AyahSearchCard
                    key={`${ayah.number}-${index}`}
                    ayah={ayah}
                    highlightKeyword={searchedKeyword}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : hasSearched && totalResults === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted text-muted-foreground mb-4">
                <FontAwesomeIcon icon={faSearch} className="text-3xl" />
              </div>
              <p className="text-xl text-foreground font-medium mb-2">
                {t("searchAyah.noResults")}
              </p>
              <p className="text-muted-foreground">
                {t("searchAyah.tryDifferent")}
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 text-primary mb-6">
                <FontAwesomeIcon icon={faSearch} className="text-5xl" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-2 ">
                {t("searchAyah.startSearch")}
              </p>
              <p className="text-muted-foreground max-w-md mx-auto">
                {isArabic
                  ? "اكتب كلمة أو عبارة للبحث عنها في القرآن الكريم"
                  : "Type a word or phrase to search for in the Quran"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
