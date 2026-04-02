"use client";

import Link from "next/link";
import { useLanguage } from "../../../context/general/LanguageContext";
import { hadithBooks } from "../../../constants/hadithData";
import { useHadithBooks } from "@/hooks/readHadith/useHadithBooks";
import { useTranslation } from "@/hooks/general/useTranslation";
import { BookCardSkeleton } from "./components/BookCardSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faLayerGroup, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function ReadHadithPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { books, loading, error } = useHadithBooks();

  const displayBooks = hadithBooks.map((localBook) => {
    const apiBook = books.find((b) => b.bookSlug === localBook.slug);
    return {
      ...localBook,
      chapters_count: apiBook?.chapters_count || "0",
      hadiths_count: apiBook?.hadiths_count || "0",
    };
  });

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("hadith.title")}
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mb-4">
              <FontAwesomeIcon icon={faBookOpen} className="text-3xl" />
            </div>
            <p className="text-destructive text-xl font-medium">{t("hadith.error")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBooks.map((book) => (
              <Link
                key={book.id}
                href={`/read-hadith/book/${book.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 
                  transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 
                  hover:border-primary/30 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-secondary/30 overflow-hidden border border-border/50
                      group-hover:border-primary/30 transition-colors flex items-center justify-center">
                        <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-primary m-auto" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors dynamic-font">
                        {language === "en" ? book.name_en : book.name_ar}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {language === "en" ? book.description_en : book.description_ar}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-border/30">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                        {book.chapters_count}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {t("common.chapters")}
                      </span>
                    </div>
                    <div className="w-px h-10 bg-border/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                        {book.hadiths_count}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {t("common.hadiths")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className={`absolute top-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ${language === "ar" ? "left-4 rotate-180" : "right-4"}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="h-20" />
    </div>
  );
}