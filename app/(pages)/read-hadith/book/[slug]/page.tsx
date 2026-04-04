"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/general/LanguageContext";
import { hadithBooks } from "@/constants/hadithData";
import { useBookChapters } from "@/hooks/readHadith/useBookChapters";
import Pagination from "@/components/general/Pagination";
import { useTranslation } from "@/hooks/general/useTranslation";
import { ChapterCardSkeleton } from "../../components/ChapterCardSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faBookOpen,
  faListOl,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground  mb-2">
            {language === "en" ? book?.name_en : book?.name_ar}
          </h1>
          <p className="text-muted-foreground">{t("hadith.book.title")}</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-muted-foreground text-sm"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("hadith.book.searchPlaceholder")}
              className="w-full rounded-2xl bg-card border border-border text-foreground py-4 pl-12 pr-12 
                placeholder:text-muted-foreground/60 
                focus:border-primary/50 focus:ring-2 focus:ring-primary/20 
                transition-all duration-300 hover:border-border/80 "
              dir={language === "ar" ? "rtl" : "ltr"}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          {searchQuery && !loading && (
            <p className="mt-3 text-sm text-muted-foreground text-center">
              {language === "ar"
                ? `تم العثور على ${chapters.length} باب`
                : `Found ${chapters.length} chapter${chapters.length !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <ChapterCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive text-xl">
            {t("hadith.book.error")}
          </div>
        ) : (
          <>
            {chapters.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
                  <FontAwesomeIcon icon={faListOl} className="text-2xl" />
                </div>
                <p className="text-xl text-muted-foreground">
                  {t("hadith.book.noChaptersFound")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/read-hadith/book/${bookSlug}/chapter/${chapter.chapterNumber}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 
                      transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 
                      hover:border-primary/30 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center 
                        group-hover:bg-primary group-hover:text-primary-foreground font-bold text-lg transition-all duration-300"
                      >
                        {chapter.chapterNumber}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                          {t("hadith.book.chapterLabel")}
                        </h3>
                        <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-relaxed line-clamp-3 ">
                          {language === "ar"
                            ? chapter.chapterArabic
                            : chapter.chapterEnglish}
                        </p>
                      </div>

                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className={`text-sm ${language === "ar" ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}
