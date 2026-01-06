"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "../../../../context/LanguageContext";
import { duas, DiedSurahs } from "../../../../constants/sadaqaData";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import { ClipLoader } from "react-spinners";
import ShareModal from "../../../../components/modals/ShareModal";
import {
  useDeceasedPage,
  useShareableUrl,
} from "../../../../hooks/sadaqaGarya";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function DeceasedPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const {
    deceased,
    expandedSurah,
    loading,
    toggleSurahExpansion,
    goHome,
  } = useDeceasedPage(slug.toString());

  const { shareableUrl } = useShareableUrl(slug.toString());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  if (!deceased) {
    return (
      <div className="min-h-screen bg-[#FFF5E4] dark:bg-slate-900 p-8 flex justify-center items-center">
        <div className="text-center text-[#134B70] dark:text-white">
          <h1 className="text-2xl mb-4">Person not found</h1>
          <button
            onClick={goHome}
            className="bg-teal-600 text-white px-4 py-2 rounded-sm hover:bg-teal-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FFF5E4] dark:bg-slate-900 p-8">
        <div className="w-[90%] max-w-[1500px] mx-auto mt-20">
          <h1
            className={`${language === "ar" ? "leading-10" : ""
              } flex flex-col justify-center text-3xl mb-4 text-center text-[#134B70] dark:text-white`}
          >
            {t("sadaqa.title")}
            <p className={`text-5xl font-semibold mb-5 mt-8`}>
              {language === "en" ? deceased.nameEn : deceased.nameAr}
            </p>
          </h1>

          {/* Custom Message */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8 mt-5 flex flex-col gap-3 items-center">
            <p className="text-center text-lg md:text-2xl text-[#134B70] dark:text-white mb-4">
              {language === "en" ? deceased.messageEn : deceased.messageAr}
            </p>

            <p className="text-center text-lg md:text-2xl text-[#134B70] dark:text-white mb-4 flex items-center gap-4">
              {t("sadaqa.shareIt")}
              <ShareModal url={shareableUrl} size="2xl" />
            </p>
          </div>

          {/* Recommended Surahs */}
          <div className="mb-8">
            <h2 className="text-2xl text-center text-[#134B70] dark:text-white mb-6">
              {t("sadaqa.recommendedSurahs")}
            </h2>
            <div className="grid gap-4">
              {DiedSurahs.map((surah, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl text-[#134B70] dark:text-white flex gap-1">
                      {t("common.surahWithNoAll")}:{' '}
                      {language === "en" ? surah.name.en : surah.name.ar}
                    </h3>
                    <button
                      onClick={() => toggleSurahExpansion(index)}
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-700"
                    >
                      {expandedSurah === index
                        ? language === "en"
                          ? "Collapse"
                          : "اغلق"
                        : language === "en"
                          ? "Read Surah"
                          : "اقرأ السورة"}
                    </button>
                  </div>

                  {expandedSurah === index && (
                    <div className="mt-4">
                      <div
                        dir="rtl"
                        className="fontAmiri text-lg font-arabic leading-10 text-[#134B70] dark:text-white whitespace-pre-line"
                      >
                        <p className="fontAmiri text-center text-2xl md:text-3xl font-semibold mt-10 md:mt-5">
                          بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                        </p>
                        {surah.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Duas Section */}
          <h2 className="text-2xl text-center text-[#134B70] dark:text-white mt-12 mb-6">
            {t("sadaqa.duaTitle")}
          </h2>

          <div dir="rtl" className="grid gap-4">
            {duas.map((dua, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
              >
                <p className="fontAmiri text-lg font-arabic leading-loose text-[#134B70] dark:text-white">
                  {dua}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-10"></div>
      </div>
      <Footer />
    </>
  );
}
