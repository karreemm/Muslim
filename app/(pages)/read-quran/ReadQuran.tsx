"use client";

import { useLanguage } from "../../../context/general/LanguageContext";
import Link from "next/link";
import { surahNames, juzNames } from "../../../constants/quranData";
import QuranNavbar from "./components/QuranNavbar";
import { useState } from "react";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function ReadQuran() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("Surahs");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredSurahs = surahNames.filter((surah) =>
    (surah[language as keyof typeof surah] as string)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const filteredJuzs = juzNames.filter((juz) =>
    juz.name[language as keyof typeof juz.name]
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col items-center gap-20">
      <div className="w-full mt-10">
        <QuranNavbar
          onTabChange={(tabName) => setActiveTab(tabName)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-background text-foreground p-5">
        {activeTab === "Surahs"
          ? filteredSurahs.map((surah) => (
              <Link
                key={surah.number}
                href={`/read-quran/surah/${surah.number}`}
                className="bg-card max-h-[90px] px-5 py-3 border border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-lg flex justify-between group hover:border-border hover:bg-opacity-70"
              >
                <div className="flex gap-2 items-center">
                  <div className="w-[65px] h-[45px] flex items-center justify-center bg-background group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:bg-primary rounded-md text-xl">
                    {surah.number}
                  </div>
                  <h1>
                    <span className="text-2xl group-hover:text-primary">
                      {surah[language as keyof typeof surah]}
                    </span>
                  </h1>
                </div>
                <div className="flex flex-col gap-0 items-center group-hover:text-primary">
                  <span className="text-xl">{t("common.ayahs")}</span>
                  <span className="text-xl font-bold">{surah.ayahs}</span>
                </div>
              </Link>
            ))
          : filteredJuzs.map((juz) => (
              <Link
                key={juz.number}
                href={`/read-quran/juz/${juz.number}`}
                className="bg-card max-h-[90px] px-5 py-3 border border-transparent shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-lg flex justify-between group hover:border-border hover:bg-opacity-70"
              >
                <div className="flex gap-2 items-center">
                  <div className="w-[65px] h-[45px] flex items-center justify-center bg-background group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:bg-primary rounded-md text-xl">
                    {juz.number}
                  </div>
                  <h1>
                    <span className="text-2xl group-hover:text-primary">
                      {juz.name[language as keyof typeof juz.name]}
                    </span>
                  </h1>
                </div>
                <div className="flex flex-col gap-0 items-center group-hover:text-primary">
                  <span className="text-xl">{t("common.surahs")}</span>
                  <span className="text-xl font-bold">{juz.surahs}</span>
                </div>
              </Link>
            ))}
      </div>
      <div className="h-20"></div>
    </div>
  );
}
