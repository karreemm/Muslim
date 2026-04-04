"use client";

import { AlertCircle, BookOpen, ChevronDown } from "lucide-react";
import { ClipLoader } from "react-spinners";
import Loading from "@/components/general/Loading";
import { DiedSurahs } from "@/constants/sadaqaData";
import type { SadaqaQuranVerse } from "@/hooks/sadaqaGarya/useSadaqaSurahVerses";
import { SADAQA_SURAH_CONFIG } from "@/hooks/sadaqaGarya";
import ConcatenatedQuranPages from "./ConcatenatedQuranPages";

interface SurahSectionProps {
  mounted: boolean;
  language: string;
  title: string;
  expandedSurah: number | null;
  versesByCard: Record<number, SadaqaQuranVerse[]>;
  versesLoading: boolean;
  versesError: string | null;
  onToggleSurah: (index: number) => void;
  loadingVersesText: string;
}

export default function SurahSection({
  mounted,
  language,
  title,
  expandedSurah,
  versesByCard,
  versesLoading,
  versesError,
  onToggleSurah,
  loadingVersesText,
}: SurahSectionProps) {
  return (
    <section className="space-y-6">
      <div
        className={`
          flex items-center gap-3 mb-6
          transition-all duration-500
          ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
        `}
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          {title}
        </h2>
      </div>

      <div className="grid gap-4">
        {DiedSurahs.map((surah, index) => {
          const verses = versesByCard[index] || [];
          const surahConfig = SADAQA_SURAH_CONFIG[index];
          const surahNumber = surahConfig?.surahNumber || 1;
          const startAyah = surahConfig?.startAyah || 1;
          const endAyah = surahConfig?.endAyah || 1;
          const isExpanded = expandedSurah === index;

          return (
            <article
              key={index}
              className={`
                rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <div
                className="p-5 lg:p-6 cursor-pointer"
                onClick={() => onToggleSurah(index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground lg:text-xl">
                        {language === "en" ? surah.name.en : surah.name.ar}
                      </h3>
                    </div>
                  </div>

                  <button
                    className={`
                      rounded-full p-3 transition-all duration-300
                      ${
                        isExpanded
                          ? "bg-primary text-primary-foreground rotate-180"
                          : "bg-secondary hover:bg-primary/10 text-foreground"
                      }
                    `}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                className={`
                  grid transition-all duration-500 ease-in-out
                  ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                `}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/50 bg-background/50 p-4 lg:p-6">
                    <div dir="rtl" className="w-full">
                      <div className="mx-auto max-w-[950px] text-foreground">
                        {versesLoading ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <ClipLoader
                              color={"hsl(var(--primary))"}
                              loading={true}
                              size={40}
                            />
                            <p className="text-muted-foreground text-sm">
                              {loadingVersesText}
                            </p>
                          </div>
                        ) : versesError ? (
                          <div className="flex items-center justify-center gap-2 py-8 text-destructive bg-destructive/10 rounded-xl">
                            <AlertCircle className="w-5 h-5" />
                            <p>{versesError}</p>
                          </div>
                        ) : verses.length > 0 ? (
                          <ConcatenatedQuranPages
                            verses={verses}
                            surahNumber={surahNumber}
                            startAyah={startAyah}
                            endAyah={endAyah}
                          />
                        ) : (
                          <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-xl">
                            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>
                              {language === "en"
                                ? "Surah content is unavailable right now."
                                : "محتوى السورة غير متاح حاليا."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
