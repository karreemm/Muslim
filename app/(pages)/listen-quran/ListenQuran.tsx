"use client";

import Link from "next/link";
import { useLanguage } from "../../../context/LanguageContext";
import { reciters } from "../../../constants/recitersData";
import { useTranslation } from "@/hooks/general/useTranslation";
export default function ListenQuranPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white min-h-screen w-full flex justify-center">
      <div className="w-[95%] mt-32 flex flex-col items-center gap-10">
        <h1 className="text-2xl md:text-4xl text-center">{t("listenQuran.title")}</h1>
        <div className="w-full flex flex-wrap gap-5 justify-center bg-[#FFF5E4] text-black dark:bg-slate-900 dark:text-white p-5">
          {reciters.map((reciter) => (
            <Link
              key={reciter.id}
              href={`/listen-quran/reciter/${reciter.id}`}
              className="bg-white dark:bg-slate-800 w-full md:w-[30%] px-5 py-3 border border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-lg flex justify-between group hover:border-teal-600 hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:hover:border-teal-500"
            >
              <div className="flex gap-5 items-center">
                <div className="w-[65px] h-[65px] flex items-center justify-center bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={reciter.image.src}
                    alt={reciter.NameEn}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="md:text-2xl text-xl">{t("listenQuran.reciter")}</h1>
                  <span className="text-lg md:text-xl group-hover:text-teal-600 dark:group-hover:text-teal-500">
                    {language === "en" ? reciter.NameEn : reciter.NameAr}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="h-20"></div>
      </div>
    </div>
  );
}
