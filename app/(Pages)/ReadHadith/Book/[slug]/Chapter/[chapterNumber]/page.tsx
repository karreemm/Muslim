"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/app/Context/LanguageContext";
import Navbar from "@/app/Components/general/Navbar";
import Footer from "@/app/Components/general/Footer";
import TranslationPair from "@/app/Types";
import { ClipLoader } from "react-spinners";
import { useChapterHadiths } from "@/app/Hooks/ReadHadith/useChapterHadiths";
import { hadithBooks } from "@/app/Contants/HadithData";
import Pagination from "@/app/Components/general/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHeart as solidHeart,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import ShareModal from "@/app/Components/modals/ShareModal";

export default function ChapterHadithsPage() {
  const params = useParams();
  const bookSlug = params.slug as string;
  const chapterNumber = params.chapterNumber as string;
  const { language } = useLanguage();

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

  const Title: TranslationPair = {
    ar: "أحاديث الباب",
    en: "Chapter Hadiths",
  };

  const HadithNumber: TranslationPair = {
    ar: "رقم الحديث",
    en: "Hadith Number",
  };

  const SearchPlaceholder: TranslationPair = {
    en: "Search in hadiths...",
    ar: "ابحث في الأحاديث...",
  };

  const SearchByNumber: TranslationPair = {
    en: "By Number",
    ar: "بالرقم",
  };

  const SearchByContent: TranslationPair = {
    en: "By Content",
    ar: "بالمحتوى",
  };

  const ClearSearch: TranslationPair = {
    en: "Clear Search",
    ar: "مسح البحث",
  };

  const LoadingText: TranslationPair = {
    ar: "جاري التحميل...",
    en: "Loading...",
  };

  const ErrorText: TranslationPair = {
    ar: "حدث خطأ أثناء تحميل الأحاديث",
    en: "Error loading hadiths",
  };

  const NoHadiths: TranslationPair = {
    ar: "لا توجد أحاديث",
    en: "No hadiths found",
  };

  const TotalResults: TranslationPair = {
    ar: "إجمالي النتائج",
    en: "Total Results",
  };

  const Status: TranslationPair = {
    ar: "الحالة",
    en: "Status",
  };

  const HadithStatus: {
    [key: string]: TranslationPair;
  } = {
    sahih: {
      ar: "صحيح",
      en: "Sahih",
    },
    "da`eef": {
      ar: "ضعيف",
      en: "Daif",
    },
    hasan: {
      ar: "حسن",
      en: "Hasan",
    },
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col gap-8 p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="w-full flex justify-center mt-24">
          <div className="w-[95%] max-w-5xl flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-center">
                {Title[language]}
              </h1>
              <p className="text-lg text-center text-gray-600 dark:text-gray-300">
                {language === "en" ? book?.name_en : book?.name_ar} -{" "}
                {ChapterLabel[language]} {chapterNumber}
              </p>
              {!loading && totalHadiths > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {TotalResults[language]}: {totalHadiths}
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
                      {SearchByContent[language]}
                    </button>
                    <button
                      onClick={() => setSearchType("number")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        searchType === "number"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      {SearchByNumber[language]}
                    </button>
                  </div>

                  <div className="flex-1 flex gap-2">
                    <input
                      type={searchType === "number" ? "number" : "text"}
                      placeholder={SearchPlaceholder[language]}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 dark:bg-slate-700 dark:text-white w-fit max-w-[70%] md:max-w-full"
                    />
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
                        title={ClearSearch[language]}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-4 mt-10">
                <ClipLoader color={"#14b8a6"} loading={loading} size={50} />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-center text-xl mt-10">
                {ErrorText[language]}
              </div>
            )}

            {!loading && !error && (
              <>
                {hadiths.length === 0 ? (
                  <p className="text-center text-xl mt-10">
                    {NoHadiths[language]}
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
                            url={`${window.location.origin}/ReadHadith/Book/${bookSlug}/Chapter/${chapterNumber}?hadith=${hadith.hadithNumber}`}
                          />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="inline-block bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            {HadithNumber[language]}: {hadith.hadithNumber}
                          </span>
                          {hadith.status && (
                            <>
                              {HadithStatus[hadith.status] && (
                                <span
                                  className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                                    hadith.status === "sahih"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : hadith.status === "hasan"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                  }`}
                                >
                                  {HadithStatus[hadith.status][language]}
                                </span>
                              )}
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

const ChapterLabel: TranslationPair = {
  ar: "الباب",
  en: "Chapter",
};
