"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function QuranNavbar({
  onTabChange,
  searchTerm,
  setSearchTerm,
}: {
  onTabChange: (tabName: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<string>("Surahs");
  const { language } = useLanguage();
  const { t } = useTranslation();

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  return (
    <div className="bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white border-b-2 border-teal-600 w-full flex justify-center">
      <div className="w-[90%] md:w-[80%] flex flex-col gap-10 items-center justify-normal md:flex-row md:items-center md:justify-between px-10 py-5">
        <div className="w-full md:w-[50%] flex flex-row gap-10">
          <input
            className="w-full md:w-[70%] rounded-xl bg-white dark:bg-slate-800 text-black dark:text-white dark:outline-hidden outline-hidden py-2 pl-10 pr-4 placeholder:text-[#03045e] dark:placeholder:text-slate-200 border border-[#134B70] dark:border-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
            placeholder={t("readQuran.sidebar.title")}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-2xl text-teal-600 dark:text-white"
            />
          </button>
        </div>
        <div className="flex gap-10 text-xl md:text-2xl">
          <button
            onClick={() => handleTabClick("Surahs")}
            className={`${
              activeTab === "Surahs" ? "bg-teal-600 text-white" : ""
            } px-3 py-1 rounded-md`}
          >
            {t("common.surahs")}
          </button>
          <button
            onClick={() => handleTabClick("Juzs")}
            className={`${
              activeTab === "Juzs" ? "bg-teal-600 text-white" : ""
            } px-3 py-1 rounded-md`}
          >
            {t("common.juzs")}
          </button>
        </div>
      </div>
    </div>
  );
}
