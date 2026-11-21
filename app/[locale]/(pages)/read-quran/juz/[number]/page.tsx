"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useQuranAudio } from "@/context/features/QuranAudioContext";
import { useLanguage } from "@/context/general/LanguageContext";
import GetJuz from "@/lib/services/readQuran/GetJuz";
import { useQuranNavigation } from "@/hooks/readQuran";
import JuzMultiPageRenderer from "../../components/juz/JuzMultiPageRenderer";
import QuranReadingControls from "../../components/general/QuranReadingControls";
import ReadingProgressBar from "@/components/layout/navbar/ReadingProgressBar";
import { useContainerFontSize } from "@/hooks/readQuran/useContainerFontSize";
import { useTranslation } from "@/hooks/general/useTranslation";
import { PageShell } from "@/components/ui/PageShell";

interface JuzData {
  number: number;
  name: {
    en: string;
    ar: string;
  };
  surahs: number;
  startPage: number;
}

export default function JuzPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigation = useQuranNavigation("juz");
  const { playSurah } = useQuranAudio();
  const [juzVerses, setJuzVerses] = useState<any>(null);
  const quranContentRef = useRef<HTMLDivElement>(null);
  const { fontSize, lineHeight } = useContainerFontSize(quranContentRef);

  const [loadedPages, setLoadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const handleLoadedPagesChange = useCallback((loaded: number, total: number) => {
    setLoadedPages(loaded);
    setTotalPages(total);
  }, []);

  const nextJuz = navigation.navigationData.next as JuzData | undefined;
  const prevJuz = navigation.navigationData.prev as JuzData | undefined;

  useEffect(() => {
    if (navigation.number) {
      const fetchJuzData = async () => {
        try {
          const data = await GetJuz(navigation.number!);
          setJuzVerses(data);
        } catch (error) {
          console.error("Error fetching Juz:", error);
        }
      };
      fetchJuzData();
    }
  }, [navigation.number]);

  return (
    <>
      <ReadingProgressBar
        totalPages={totalPages || undefined}
        loadedPages={loadedPages || undefined}
      />

      <PageShell
        className="pb-20"
        containerClassName="w-full max-w-none pt-0"
        decorations={
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
        }
      >
        <QuranReadingControls
          language={language}
          title={t("readQuran.juzWithNumber", { number: navigation.number ?? "" })}
          playLabel={t("readQuran.listen")}
          playDisabled={!juzVerses || juzVerses.length === 0}
          onPlay={() => {
            if (!juzVerses || juzVerses.length === 0) return;

            const uniqueSurahs = Array.from(
              new Set(juzVerses.map((v: any) => parseInt(v.verse_key.split(":")[0]))),
            ) as number[];
            playSurah(uniqueSurahs[0], undefined, uniqueSurahs);
          }}
          previousLabel={t("common.previous")}
          nextLabel={t("common.next")}
          previous={
            navigation.hasPrev && prevJuz
              ? {
                  href: `/read-quran/juz/${prevJuz.number}`,
                  title: prevJuz.name[language as keyof typeof prevJuz.name],
                }
              : undefined
          }
          next={
            navigation.hasNext && nextJuz
              ? {
                  href: `/read-quran/juz/${nextJuz.number}`,
                  title: nextJuz.name[language as keyof typeof nextJuz.name],
                }
              : undefined
          }
          playVariant="primary"
        />

        <div ref={quranContentRef} className="w-[92%] lg:w-full max-w-4xl mx-auto mt-8">
          <JuzMultiPageRenderer
            verses={juzVerses}
            fontSize={fontSize}
            lineHeight={lineHeight}
            onLoadedPagesChange={handleLoadedPagesChange}
          />
        </div>
      </PageShell>
    </>
  );
}
