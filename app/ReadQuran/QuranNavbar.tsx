"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import TranslationPair from "../Lib/Types";
import { useState } from "react";
import { useLanguage } from "../Context/LanguageContext";

export default function QuranNavbar({ onTabChange, searchTerm, setSearchTerm }: { onTabChange: (tabName: string) => void, searchTerm: string, setSearchTerm: (term: string) => void }) {
  const [activeTab, setActiveTab] = useState<string>("Surahs");
  const { language } = useLanguage();

  const SearchPlaceholder: TranslationPair = { en: "Search for a surah / Juz", ar: "ابحث عن سورة / جزء" };
  const Surahs: TranslationPair = { en: "Surahs", ar: "السور" };
  const Juzs: TranslationPair = { en: "Juzs", ar: "الاجزاء" };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  return (
    <div className="bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-teal-500 border-b-2 border-teal-600 w-full flex justify-center">
      <div className="w-[90%] md:w-[80%] flex flex-col gap-10 items-center justify-normal md:flex-row md:items-center md:justify-between px-10 py-5">
        <div className="w-full md:w-[50%] flex flex-row gap-10">
          <input
            className="w-full md:w-[70%] rounded-xl bg-white text-black dark:outline-none outline-none py-2 pl-10 pr-4 placeholder:text-[#03045e] dark:placeholder:text-slate-500"
            placeholder={SearchPlaceholder[language]}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl text-teal-600 dark:text-teal-500" />
          </button>
        </div>
        <div className="flex gap-10 text-xl md:text-2xl">
          <button onClick={() => handleTabClick("Surahs")} className={`${activeTab === "Surahs" ? "bg-[#03045e] text-white dark:bg-[#6EACDA] dark:text-black" : ""} px-3 py-1 rounded-md`}>
            {Surahs[language]}
          </button>
          <button onClick={() => handleTabClick("Juzs")} className={`${activeTab === "Juzs" ? "bg-[#03045e] text-white dark:bg-[#6EACDA] dark:text-black" : ""} px-3 py-1 rounded-md`}>
            {Juzs[language]}
          </button>
        </div>
      </div>
    </div>
  );
}
