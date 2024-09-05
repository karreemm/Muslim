"use client";

import TranslationPair from "../Lib/Types";
import { useLanguage } from "../Context/LanguageContext";
import Link from "next/link";
import { surahNames } from "../Lib/Constants";
import { juzNames } from "../Lib/Constants";
import QuranNavbar from "./QuranNavbar";
import { useState } from "react";

export default function ReadQuran() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("Surahs");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const Ayat: TranslationPair = {
    en: "Ayahs",
    ar: "آيات"
  };

  const Surahs: TranslationPair = {
    en: "Surahs",
    ar: "سور"
  };

  const filteredSurahs = surahNames.filter(surah => 
    (surah[language as keyof typeof surah] as string).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJuzs = juzNames.filter(juz => 
    juz.name[language as keyof typeof juz.name].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-20">
      <div className="w-full mt-32">
        <QuranNavbar 
          onTabChange={(tabName) => setActiveTab(tabName)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className="w-[90%] flex flex-wrap gap-3 justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white p-5">
        {activeTab === "Surahs" ? (
          filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              href={`/ReadQuran/Surah/${surah.number}`}
              className="max-h-[90px] w-full md:w-[30%] px-5 py-3 border border-[#134B70] dark:border-white shadow-lg rounded-lg flex justify-between group hover:border-teal-600 hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:hover:border-teal-500"
            >
              <div className="flex gap-2 items-center">
                <div className="w-[65px] h-[45px] flex items-center justify-center bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl">
                  {surah.number}
                </div>
                <h1>
                  <span className="text-2xl group-hover:text-teal-600 dark:group-hover:text-teal-500">
                    {surah[language as keyof typeof surah]}
                  </span>
                </h1>
              </div>
              <div className="flex flex-col gap-0 items-center group-hover:text-teal-600 dark:group-hover:text-teal-500">
                <span className="text-xl">{Ayat[language]}</span>
                <span className="text-xl font-bold">{surah.ayahs}</span>
              </div>
            </Link>
          ))
        ) : (
          filteredJuzs.map((juz) => (
            <Link
              key={juz.number}
              href={`/ReadQuran/Juz/${juz.number}`}
              className="max-h-[90px] w-full md:w-[30%] px-5 py-3 border border-[#134B70] dark:border-white shadow-lg rounded-lg flex justify-between group hover:border-teal-600 hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:hover:border-teal-500"
            >
              <div className="flex gap-2 items-center">
                <div className="w-[65px] h-[45px] flex items-center justify-center bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl">
                  {juz.number}
                </div>
                <h1>
                  <span className="text-2xl group-hover:text-teal-600 dark:group-hover:text-teal-500">
                    {juz.name[language as keyof typeof juz.name]}
                  </span>
                </h1>
              </div>
              <div className="flex flex-col gap-0 items-center group-hover:text-teal-600 dark:group-hover:text-teal-500">
                <span className="text-xl">{Surahs[language]}</span>
                <span className="text-xl font-bold">{juz.surahs}</span>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="h-20"></div>
    </div>
  );
}
