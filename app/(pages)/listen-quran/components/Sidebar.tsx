"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faMagnifyingGlass,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { surahNames } from "../../../../constants/quranData";
import { useLanguage } from "../../../../context/LanguageContext";
import { toArabicNumber } from "../../../../utils/helpers";
import { useTranslation } from "@/hooks/general/useTranslation";

interface SidebarProps {
  onSurahSelect: (surahNumber: number) => void;
  selectedSurah?: number | null;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSurahSelect,
  selectedSurah,
  isExpanded,
  onToggle,
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleSidebar = () => {
    onToggle(!isExpanded);
  };

  const handleSurahClick = (surahNumber: number) => {
    onSurahSelect(surahNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredSurahNames = surahNames.filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.en.toLowerCase().includes(query) ||
      surah.ar.includes(query) ||
      surah.number.toString().includes(query)
    );
  });

  const sidebarDirectionClass =
    language === "ar" ? "right-0 border-l" : "left-0 border-r";

  return (
    <aside
      className={`z-20 fixed top-16 bottom-0 ${sidebarDirectionClass} border-border/80 bg-background/95 text-primary shadow-2xl backdrop-blur-md transition-[width,box-shadow] duration-300 ease-out ${
        isExpanded ? "w-[84vw] sm:w-80 md:w-[21rem]" : "w-16"
      }`}
      aria-label={t("listenQuran.sidebar.title")}
    >
      <div className="flex h-full min-h-0 flex-col pb-24 md:pb-28">
        <div className="sticky top-0 z-10 border-b border-border/70 bg-background/90 px-3 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleSidebar}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-card text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
              aria-label={
                isExpanded ? "Collapse surah list" : "Expand surah list"
              }
            >
              <FontAwesomeIcon
                icon={isExpanded ? faX : faMagnifyingGlass}
                className="text-lg"
              />
            </button>
          </div>

          {isExpanded && (
            <div className="mt-3">
              <input
                type="search"
                placeholder={t("listenQuran.sidebar.searchPlaceholder")}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                aria-label={t("listenQuran.sidebar.searchPlaceholder")}
              />
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 pb-4">
            <div className="flex flex-col gap-2">
              {filteredSurahNames.length > 0 ? (
                filteredSurahNames.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => handleSurahClick(surah.number)}
                    className={`w-full rounded-xl border px-3 py-2.5 shadow-sm transition-all duration-200 text-start ${
                      selectedSurah === surah.number
                        ? "border-primary/60 bg-primary/10"
                        : "border-border/80 bg-card/40 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-secondary"
                    }`}
                    aria-current={
                      selectedSurah === surah.number ? "true" : "false"
                    }
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-10 min-w-12 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                        {language === "en"
                          ? surah.number
                          : toArabicNumber(surah.number)}
                      </span>
                      <span className="truncate text-base md:text-lg text-foreground">
                        {language === "en" ? surah.en : surah.ar}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="rounded-xl border border-border/80 bg-card/40 px-3 py-4 text-center text-sm text-muted-foreground">
                  {language === "ar"
                    ? "لا توجد نتائج مطابقة"
                    : "No matching surahs found"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
