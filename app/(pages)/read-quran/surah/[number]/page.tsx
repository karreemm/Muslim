"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useQuranAudio } from "@/context/features/QuranAudioContext";
import { useLanguage } from "@/context/general/LanguageContext";
import GetSurah from "../../service/GetSurah";
import { useQuranNavigation } from "@/hooks/readQuran";
import QuranMultiPageRenderer from "../../components/surah/QuranMultiPageRenderer";
import QuranReadingControls from "../../components/general/QuranReadingControls";
import ReadingProgressBar from "@/components/layout/navbar/ReadingProgressBar";
import { useContainerFontSize } from "@/hooks/readQuran/useContainerFontSize";
import { useTranslation } from "@/hooks/general/useTranslation";

interface SurahData {
  number: number;
  en: string;
  ar: string;
  arTashkeel: string;
  ayahs: number;
  startPage: number;
  endPage: number;
}

export default function SurahPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigation = useQuranNavigation("surah");
  const { playSurah } = useQuranAudio();
  const [surahVerses, setSurahVerses] = useState<any>(null);
  const quranContentRef = useRef<HTMLDivElement>(null);
  const { fontSize, lineHeight } = useContainerFontSize(quranContentRef);

  const [loadedPages, setLoadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const handleLoadedPagesChange = useCallback(
    (loaded: number, total: number) => {
      setLoadedPages(loaded);
      setTotalPages(total);
    },
    [],
  );

  const currentSurah = navigation.navigationData.current as
    | SurahData
    | undefined;
  const nextSurah = navigation.navigationData.next as SurahData | undefined;
  const prevSurah = navigation.navigationData.prev as SurahData | undefined;

  useEffect(() => {
    if (navigation.number) {
      const fetchSurahData = async () => {
        try {
          const data = await GetSurah(navigation.number!);
          setSurahVerses(data);
        } catch (error) {
          console.error("Error fetching Surah:", error);
        }
      };
      fetchSurahData();
    }
  }, [navigation.number]);

  return (
    <>
      <ReadingProgressBar
        totalPages={totalPages || undefined}
        loadedPages={loadedPages || undefined}
      />

      <div className="w-full min-h-screen bg-background text-foreground pb-20">
        {/* Background Glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full mx-auto">
          {currentSurah && (
            <QuranReadingControls
              language={language}
              title={
                currentSurah[language as keyof SurahData]?.toString() ?? ""
              }
              playLabel={
                language === "ar" ? "استماع للسورة" : "Listen to Surah"
              }
              onPlay={() => playSurah(currentSurah.number)}
              previousLabel={t("common.previous")}
              nextLabel={t("common.next")}
              previous={
                navigation.hasPrev && prevSurah
                  ? {
                      href: `/read-quran/surah/${prevSurah.number}`,
                      title:
                        prevSurah[language as keyof SurahData]?.toString() ??
                        "",
                      popoverId: "popover-prev",
                    }
                  : undefined
              }
              next={
                navigation.hasNext && nextSurah
                  ? {
                      href: `/read-quran/surah/${nextSurah.number}`,
                      title:
                        nextSurah[language as keyof SurahData]?.toString() ??
                        "",
                      popoverId: "popover-next",
                    }
                  : undefined
              }
              playVariant="primary"
            />
          )}

          {/* Quran Content */}
          <div
            ref={quranContentRef}
            className="w-[92%] lg:w-full max-w-4xl mx-auto mt-8"
          >
            <QuranMultiPageRenderer
              verses={surahVerses}
              fontSize={fontSize}
              lineHeight={lineHeight}
              surahHeaders={
                currentSurah
                  ? [
                      {
                        surahNumber: currentSurah.number,
                        firstAyah: 1,
                        lastAyah: currentSurah.ayahs,
                      },
                    ]
                  : undefined
              }
              onLoadedPagesChange={handleLoadedPagesChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
