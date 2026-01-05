"use client";

import Link from "next/link";
import { useLanguage } from "../../../context/LanguageContext";
import { AzkarCategories } from "../../../constants/azkarData";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function ListenQuranPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white min-h-screen w-full flex justify-center">
      <div className="w-[95%] mt-32 flex flex-col items-center gap-10">
        <h1 className="text-2xl md:text-4xl text-center">{t("azkar.title")}</h1>
        <div className="w-full flex flex-wrap gap-5 justify-center bg-[#FFF5E4] text-black dark:bg-slate-900 dark:text-white p-5">
          {AzkarCategories.map((item) => (
            <Link
              key={item.id}
              href={`/azkar/category/${item.id}`}
              className="bg-white dark:bg-slate-800 max-h-[90px] w-full md:w-[30%] px-5 py-3 border border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-lg flex justify-between group hover:border-teal-600 hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:hover:border-teal-500"
            >
              <div className="flex gap-5 items-center">
                <div className="w-[65px] h-[65px] flex items-center justify-center bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image?.src}
                    alt={item.en}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="md:text-xl text-lg group-hover:text-teal-600 dark:group-hover:text-teal-500">
                    {language === "ar" ? item.ar : item.en}
                  </h1>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="h-20 md:h-0"></div>
      </div>
    </div>
  );
}
