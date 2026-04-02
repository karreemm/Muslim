"use client";

import { useLanguage } from "../../../context/general/LanguageContext";
import Link from "next/link";
import { surahNames, juzNames } from "../../../constants/quranData";
import QuranNavbar from "./components/general/QuranNavbar";
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
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <QuranNavbar
        onTabChange={(tabName) => setActiveTab(tabName)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="relative z-10 w-[92%] max-w-7xl mx-auto mt-8">
        <div className="mb-6 text-sm text-muted-foreground">
          {activeTab === "Surahs"
            ? `${filteredSurahs.length} ${t("common.surahs")}`
            : `${filteredJuzs.length} ${t("common.juzs")}`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "Surahs"
            ? filteredSurahs.map((surah) => (
                <Link
                  key={surah.number}
                  href={`/read-quran/surah/${surah.number}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 
                    transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 
                    hover:border-primary/30 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/50 text-foreground font-bold text-lg
                        transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
                      >
                        {surah.number}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors dynamic-font">
                          {surah[language as keyof typeof surah]}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {surah.en}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors">
                        {surah.ayahs}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {t("common.ayahs")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            : filteredJuzs.map((juz) => (
                <Link
                  key={juz.number}
                  href={`/read-quran/juz/${juz.number}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 
                    transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 
                    hover:border-primary/30 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/50 text-foreground font-bold text-lg
                        transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
                      >
                        {juz.number}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors dynamic-font">
                          {juz.name[language as keyof typeof juz.name]}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {juz.surahs} {t("common.surahs")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {activeTab === "Surahs" && filteredSurahs.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">{t("common.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
