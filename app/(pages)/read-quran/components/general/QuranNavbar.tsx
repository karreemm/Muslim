"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useMainNavbarOffset } from "@/hooks/general/useMainNavbarOffset";

interface QuranNavbarProps {
  onTabChange: (tabName: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function QuranNavbar({
  onTabChange,
  searchTerm,
  setSearchTerm,
}: QuranNavbarProps) {
  const [activeTab, setActiveTab] = useState<string>("Surahs");
  const mainNavbarOffset = useMainNavbarOffset();
  const { t } = useTranslation();

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  return (
    <div
      className="sticky z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-[top] duration-300 ease-out"
      style={{ top: `${mainNavbarOffset}px` }}
    >
      <div className="w-[92%] max-w-7xl mx-auto py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-muted-foreground text-sm"
              />
            </div>
            <input
              className="w-full rounded-2xl bg-card border border-border text-foreground py-3 pl-11 pr-4 
                placeholder:text-muted-foreground/60 
                focus:border-primary/50 focus:ring-2 focus:ring-primary/20 
                transition-all duration-300 hover:border-border/80"
              placeholder={t("readQuran.sidebar.title")}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-muted/50 border border-border/50">
            <button
              onClick={() => handleTabClick("Surahs")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "Surahs"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {t("common.surahs")}
            </button>
            <button
              onClick={() => handleTabClick("Juzs")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "Juzs"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {t("common.juzs")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
