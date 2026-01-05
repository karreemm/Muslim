"use client";

import Link from "next/link";
import { useLanguage } from "../../../context/LanguageContext";
import { hadithBooks } from "../../../constants/hadithData";
import { ClipLoader } from "react-spinners";
import { useHadithBooks } from "@/hooks/readHadith/useHadithBooks";
import { useTranslation } from "@/hooks/general/useTranslation";

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
    <div className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white min-h-screen w-full flex justify-center">
      <div className="w-[95%] mt-32 flex flex-col items-center gap-10">
        <h1 className="text-2xl md:text-4xl text-center font-bold">
          {t("hadith.title")}
        </h1>

        {loading ? (
          <div className="flex flex-col items-center gap-4 mt-10">
            <ClipLoader color={"#14b8a6"} loading={loading} size={50} />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-xl mt-10">
            {t("hadith.error")}
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {displayBooks.map((book) => (
              <Link
                key={book.id}
                href={`/read-hadith/book/${book.slug}`}
                className="group relative overflow-hidden bg-white dark:bg-slate-800 text-[#134B70] dark:text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-teal-500"
              >
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl p-2 shadow-md">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={book.image?.src}
                        alt={book.name_en}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {language === "en" ? book.name_en : book.name_ar}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    {language === "en"
                      ? book.description_en
                      : book.description_ar}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-800 dark:border-gray-300">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {book.chapters_count}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("common.chapters")}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {book.hadiths_count}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("common.hadiths")}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`absolute top-6 opacity-0 group-hover:opacity-100 transition-opacity ${
                      language === "ar" ? "left-4" : "right-4"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-teal-600 dark:text-teal-400"
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

        <div className="h-20 md:h-0"></div>
      </div>
    </div>
  );
}
