"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import TranslationPair from "@/types";
import { ClipLoader } from "react-spinners";
import { useChapterHadiths } from "@/hooks/readHadith/useChapterHadiths";
import { hadithBooks } from "@/constants/hadithData";
import Pagination from "@/components/general/Pagination";
import { HadithCardSkeleton } from "../../../../components/HadithCardSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHeart as solidHeart,
  faXmark,
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

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col gap-8 p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="w-full flex justify-center mt-24">
          <div className="w-[95%] max-w-5xl flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-center">
                {t("hadith.chapter.title")}
              </h1>
              <p className="text-lg text-center text-gray-600 dark:text-gray-300">
                {language === "en" ? book?.name_en : book?.name_ar} -{" "}
                {t("hadith.book.chapterLabel")} {chapterNumber}
              </p>
              {!loading && totalHadiths > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("hadith.chapter.totalResults")}: {totalHadiths}
                </p>
              )}

              {showingSingleHadith && (
                <button
                  onClick={clearHadithFilter}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  {language === "ar" ? "عرض جميع الأحاديث" : "View All Hadiths"}
                </button>
              )}
            </div>

            {!showingSingleHadith && (
              <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSearchType("content")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        searchType === "content"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      {t("hadith.chapter.byContent")}
                    </button>
                    <button
                      onClick={() => setSearchType("number")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        searchType === "number"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      {t("hadith.chapter.byNumber")}
                    </button>
                  </div>

                  <div className="flex-1 flex gap-2 flex-wrap">
                    <input
                      type={searchType === "number" ? "number" : "text"}
                      placeholder={t("hadith.chapter.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 dark:bg-slate-700 dark:text-white w-fit md:max-w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </button>
                      {isSearching && (
                        <button
                          onClick={clearSearch}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

            {loading && (
              <div className="w-full flex flex-col gap-6 mt-6">
                <HadithCardSkeleton />
                <HadithCardSkeleton />
                <HadithCardSkeleton />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-center text-xl mt-10">
                {t("hadith.chapter.error")}
              </div>
            )}

            {!loading && !error && (
              <>
                {hadiths.length === 0 ? (
                  <p className="text-center text-xl mt-10">
                    {t("hadith.chapter.noHadithsFound")}
                  </p>
                ) : (
                  <div className="w-full flex flex-col gap-6 mt-6">
                    {hadiths.map((hadith) => (
                      <div
                        key={hadith.id}
                        className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                      >
                        <button
                          onClick={() => toggleFavorite(hadith)}
                          className={`absolute ${
                            language === "ar" ? "left-4" : "right-4"
                          } top-4 text-2xl hover:scale-110 transition-transform`}
                        >
                          <FontAwesomeIcon
                            icon={
                              isFavorite(hadith.hadithNumber, bookSlug)
                                ? solidHeart
                                : regularHeart
                            }
                            className={
                              isFavorite(hadith.hadithNumber, bookSlug)
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }
                          />
                        </button>

                        <div
                          className={`absolute ${
                            language === "ar" ? "left-14" : "right-14"
                          } top-4`}
                        >
                          <ShareModal
                            size="2xl"
                            url={`${window.location.origin}/read-hadith/book/${bookSlug}/chapter/${chapterNumber}?hadith=${hadith.hadithNumber}`}
                          />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="inline-block bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            {t("hadith.chapter.hadithNo")}:{" "}
                            {hadith.hadithNumber}
                          </span>
                          {hadith.status && (
                            <>
                              <span
                                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                                  hadith.status.toLowerCase() === "sahih"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : hadith.status.toLowerCase() === "hasan"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                              >
                                {hadith.status.toLowerCase() === "sahih"
                                  ? t("hadith.chapter.sahih")
                                  : hadith.status.toLowerCase() === "hasan"
                                    ? t("hadith.chapter.hasan")
                                    : t("hadith.chapter.da`eef")}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="mb-4">
                          {hadith.headingArabic && (
                            <h3
                              dir="rtl"
                              className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-3"
                            >
                              {hadith.headingArabic}
                            </h3>
                          )}
                          <p
                            dir="rtl"
                            className="text-lg leading-loose text-gray-800 dark:text-gray-100 fontAmiri"
                          >
                            {hadith.hadithArabic}
                          </p>
                        </div>

                        {language === "en" && hadith.hadithEnglish && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {hadith.headingEnglish && (
                              <h3 className="text-lg font-bold text-teal-700 dark:text-teal-400 mb-2">
                                {hadith.headingEnglish}
                              </h3>
                            )}
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                              {hadith.hadithEnglish}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && !showingSingleHadith && (
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
      <Footer />
    </>
  );
}
