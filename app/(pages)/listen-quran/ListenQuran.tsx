"use client";

import Link from "next/link";
import { useLanguage } from "../../../context/general/LanguageContext";
import { reciters } from "../../../constants/recitersData";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function ListenQuranPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="bg-background text-primary min-h-screen w-full flex justify-center">
      <div className="w-[95%] max-w-7xl mx-auto mt-10 flex flex-col items-center gap-10">
        <h1 className="text-2xl md:text-4xl text-center">
          {t("listenQuran.title")}
        </h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-background text-foreground p-5">
          {reciters.map((reciter) => (
            <Link
              key={reciter.id}
              href={`/listen-quran/reciter/${reciter.id}`}
              className="bg-card px-5 py-3 border border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-lg flex justify-between group hover:border-border hover:bg-opacity-70"
            >
              <div className="flex gap-5 items-center">
                <div className="w-[65px] h-[65px] flex items-center justify-center bg-background group-hover:text-primary-foreground group-hover:bg-primary dark:group-hover:bg-primary rounded-md text-xl">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={reciter.image.src}
                    alt={reciter.NameEn}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="md:text-2xl text-xl">
                    {t("listenQuran.reciter")}
                  </h1>
                  <span className="text-lg md:text-xl group-hover:text-primary">
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
