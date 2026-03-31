"use client";

import Link from "next/link";
import { useLanguage } from "../../../context/LanguageContext";
import { AzkarCategories } from "../../../constants/azkarData";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function ListenQuranPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="bg-background text-primary dark:bg-background dark:text-foreground min-h-screen w-full flex justify-center">
      <div className="w-[95%] mt-10 max-w-[1500px] mx-auto flex flex-col items-center gap-10">
        <h1 className="text-2xl md:text-4xl text-center">{t("azkar.title")}</h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center bg-background text-foreground dark:bg-background dark:text-foreground p-5">
          {AzkarCategories.map((item) => (
            <Link
              key={item.id}
              href={`/azkar/category/${item.id}`}
              className="bg-card max-h-[90px] w-full px-5 py-3 border border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-lg flex justify-between group hover:border-border hover:bg-opacity-70"
            >
              <div className="flex gap-5 items-center">
                <div className="w-[65px] h-[65px] flex items-center justify-center bg-primary text-primary-foreground group-hover:bg-primary dark:group-hover:bg-primary rounded-md text-xl">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image?.src}
                    alt={item.en}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="md:text-xl text-lg group-hover:text-primary">
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
