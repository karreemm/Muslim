"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
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
  const { t } = useTranslation();

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  return (
    <div className="bg-background text-foreground border-b-2 border-border w-full flex justify-center">
      <div className="w-[90%] md:w-[80%] flex flex-col gap-10 items-center justify-normal md:flex-row md:items-center md:justify-between px-10 py-5">
        <div className="w-full md:w-[50%] flex flex-row gap-10">
          <input
            className="w-full md:w-[70%] rounded-xl bg-card text-foreground outline-hidden py-2 pl-10 pr-4 placeholder:text-muted-foreground border border-border focus:border-ring focus:ring-2 focus:ring-ring"
            placeholder={t("readQuran.sidebar.title")}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-2xl text-primary"
            />
          </button>
        </div>
        <div className="flex gap-10 text-xl md:text-2xl">
          <button
            onClick={() => handleTabClick("Surahs")}
            className={`${
              activeTab === "Surahs" ? "bg-primary text-primary-foreground" : ""
            } px-3 py-1 rounded-md`}
          >
            {t("common.surahs")}
          </button>
          <button
            onClick={() => handleTabClick("Juzs")}
            className={`${
              activeTab === "Juzs" ? "bg-primary text-primary-foreground" : ""
            } px-3 py-1 rounded-md`}
          >
            {t("common.juzs")}
          </button>
        </div>
      </div>
    </div>
  );
}
