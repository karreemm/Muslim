"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/context/general/LanguageContext";
import { hadithBooks } from "@/constants/hadithData";
import { useChapterHadiths } from "@/hooks/readHadith/useChapterHadiths";
import Pagination from "@/components/general/Pagination";
import { HadithCardSkeleton } from "../../../../components/HadithCardSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHeart as solidHeart,
  faXmark,
  faBookOpen,
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import ShareModal from "../../../../../../../components/modals/ShareModal";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function ChapterHadithsPage() {
  const params = useParams();
  const bookSlug = params.slug as string;
  const chapterNumber = params.chapterNumber as string;
  const { language } = useLanguage();
  const { t } = useTranslation();

  const {
    hadiths,
    loading,
    error,
    currentPage,
    totalPages,
    totalHadiths,
    searchQuery,
    searchType,
    isSearching,
    showingSingleHadith,
    setSearchQuery,
    setSearchType,
    handlePageChange,
    handleSearch,
    clearSearch,
    clearHadithFilter,
    isFavorite,
    toggleFavorite,
  } = useChapterHadiths(bookSlug, chapterNumber, 10);

  const book = hadithBooks.find((b) => b.slug === bookSlug);

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "sahih") return faCheckCircle;
    if (s === "hasan") return faExclamationCircle;
    return faQuestionCircle;
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground dynamic-font mb-2">
            {language === "en" ? book?.name_en : book?.name_ar}
          </h1>
          <p className="text-muted-foreground">
             {t("hadith.book.chapterLabel")} {chapterNumber}
          </p>
          {!loading && totalHadiths > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("hadith.chapter.totalResults")}: <span className="font-semibold text-foreground">{totalHadiths}</span>
            </p>
          )}
        </div>

        {!showingSingleHadith && (
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 p-1 rounded-xl bg-muted/50 w-fit">
                  <button
                    onClick={() => setSearchType("content")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      searchType === "content"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {t("hadith.chapter.byContent")}
                  </button>
                  <button
                    onClick={() => setSearchType("number")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      searchType === "number"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {t("hadith.chapter.byNumber")}
                  </button>
                </div>

                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={searchType === "number" ? "number" : "text"}
                      placeholder={t("hadith.chapter.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full rounded-xl bg-background border border-border text-foreground py-2.5 px-4 
                        placeholder:text-muted-foreground/60 
                        focus:border-primary/50 focus:ring-2 focus:ring-primary/20 
                        transition-all duration-300 dynamic-font"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold 
                      shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 
                      hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                  {isSearching && (
                    <button
                      onClick={clearSearch}
                      className="px-4 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 
                        rounded-xl hover:bg-destructive/20 transition-all duration-300"
                      title={t("hadith.chapter.clearSearch")}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showingSingleHadith && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-accent font-medium">{t("hadith.chapter.showingSingle")}</span>
              <button
                onClick={clearHadithFilter}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold 
                  hover:bg-accent/90 transition-all duration-300 text-sm"
              >
                {language === "ar" ? "عرض جميع الأحاديث" : "View All Hadiths"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {[...Array(3)].map((_, i) => <HadithCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive text-xl">
            {t("hadith.chapter.error")}
          </div>
        ) : (
          <>
            {hadiths.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
                  <FontAwesomeIcon icon={faBookOpen} className="text-2xl" />
                </div>
                <p className="text-xl text-muted-foreground">{t("hadith.chapter.noHadithsFound")}</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                {hadiths.map((hadith) => (
                  <div
                    key={hadith.id}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 
                      transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 
                      hover:border-primary/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
                          <span>#{hadith.hadithNumber}</span>
                        </span>
                        
                        {hadith.status && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                            hadith.status.toLowerCase() === "sahih"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                              : hadith.status.toLowerCase() === "hasan"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                          }`}>
                            <FontAwesomeIcon icon={getStatusIcon(hadith.status)} className="text-xs" />
                            {hadith.status.toLowerCase() === "sahih"
                              ? t("hadith.chapter.sahih")
                              : hadith.status.toLowerCase() === "hasan"
                                ? t("hadith.chapter.hasan")
                                : t("hadith.chapter.da`eef")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <ShareModal
                          size="xl"
                          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/read-hadith/book/${bookSlug}/chapter/${chapterNumber}?hadith=${hadith.hadithNumber}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        />
                        <button
                          onClick={() => toggleFavorite(hadith)}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                            isFavorite(hadith.hadithNumber, bookSlug)
                              ? "bg-destructive/10 text-destructive"
                              : "bg-secondary/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={isFavorite(hadith.hadithNumber, bookSlug) ? solidHeart : regularHeart}
                            className="text-lg"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      {hadith.headingArabic && (
                        <h3 dir="rtl" className="text-xl font-bold text-primary mb-3 dynamic-font">
                          {hadith.headingArabic}
                        </h3>
                      )}
                      <p dir="rtl" className="text-lg leading-loose text-foreground dynamic-font">
                        {hadith.hadithArabic}
                      </p>
                    </div>

                    {language === "en" && hadith.hadithEnglish && (
                      <div className="mt-6 pt-6 border-t border-border/30">
                        {hadith.headingEnglish && (
                          <h3 className="text-lg font-bold text-primary mb-2">
                            {hadith.headingEnglish}
                          </h3>
                        )}
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {hadith.hadithEnglish}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && !showingSingleHadith && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="h-20" />
    </div>
  );
}