"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClipLoader } from "react-spinners";
import { useBookChapters } from "@/hooks/readHadith/useBookChapters";
import { hadithBooks } from "@/constants/hadithData";
import Pagination from "@/components/general/Pagination";
import { useTranslation } from "@/hooks/general/useTranslation";
import { ChapterCardSkeleton } from "../../components/ChapterCardSkeleton";

export default function BookChaptersPage() {
  const params = useParams();
  const bookSlug = params.slug as string;
  const { language } = useLanguage();
  const { t } = useTranslation();
  const {
    chapters,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    handlePageChange,
    handleSearch,
    clearSearch,
  } = useBookChapters(bookSlug, 20);

  const book = hadithBooks.find((b) => b.slug === bookSlug);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col gap-8 p-5 bg-background text-foreground dark:bg-background dark:text-foreground">
        <div className="w-full flex justify-center mt-10">
          <div className="w-[95%] max-w-[1500px] mx-auto flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              {book && (
                <div className="w-24 h-24 bg-primary rounded-xl p-3 shadow-lg">
                  <img
                    src={book.image?.src}
                    alt={book.name_en}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-center">
                {t("hadith.book.title")}{" "}
                {language === "en" ? book?.name_en : book?.name_ar}
              </h1>
            </div>

            <div className="w-full max-w-2xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t("hadith.book.searchPlaceholder")}
                className="w-full px-5 py-3 pr-12 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {!searchQuery && (
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-muted-foreground">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {searchQuery && !loading && (
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? `تم العثور على ${chapters.length} باب`
                  : `Found ${chapters.length} chapter${
                      chapters.length !== 1 ? "s" : ""
                    }`}
              </p>
            )}

            {loading && (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <ChapterCardSkeleton />
                <ChapterCardSkeleton />
                <ChapterCardSkeleton />
                <ChapterCardSkeleton />
                <ChapterCardSkeleton />
                <ChapterCardSkeleton />
              </div>
            )}

            {error && (
              <div className="text-destructive text-center text-xl mt-10">
                {t("hadith.book.error")}
              </div>
            )}

            {!loading && !error && (
              <>
                {chapters.length === 0 ? (
                  <p className="text-center text-xl mt-10">
                    {t("hadith.book.noChaptersFound")}
                  </p>
                ) : (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {chapters.map((chapter) => (
                      <Link
                        key={chapter.id}
                        href={`/read-hadith/book/${bookSlug}/chapter/${chapter.chapterNumber}`}
                        className="group bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-5 border border-transparent hover:border-primary"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                            {chapter.chapterNumber}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm text-muted-foreground mb-2">
                              {t("hadith.book.chapterLabel")}{" "}
                              {chapter.chapterNumber}
                            </h3>
                            {language === "ar" ? (
                              <p
                                dir="rtl"
                                className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-relaxed line-clamp-3"
                              >
                                {chapter.chapterArabic}
                              </p>
                            ) : (
                              <p
                                dir="ltr"
                                className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-relaxed line-clamp-3"
                              >
                                {chapter.chapterEnglish}
                              </p>
                            )}
                          </div>

                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              className={`w-5 h-5 text-primary ${
                                language === "ar" ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="w-full mt-8">
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
        </div>
        <div className="h-10"></div>
      </div>
    </>
  );
}
