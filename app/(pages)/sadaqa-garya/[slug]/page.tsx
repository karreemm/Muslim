"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../../../context/general/LanguageContext";
import Loading from "@/components/general/Loading";
import {
  useDeceasedPage,
  useShareableUrl,
  useSadaqaSurahVerses,
} from "../../../../hooks/sadaqaGarya";
import { useTranslation } from "@/hooks/general/useTranslation";
import DeceasedNotFound from "./components/DeceasedNotFound";
import DeceasedHero from "./components/DeceasedHero";
import SurahSection from "./components/SurahSection";
import DuaSection from "./components/DuaSection";

export default function DeceasedPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  const { deceased, expandedSurah, loading, toggleSurahExpansion, goHome } =
    useDeceasedPage(slug.toString());
  const {
    versesByCard,
    loading: versesLoading,
    error: versesError,
  } = useSadaqaSurahVerses();

  const { shareableUrl } = useShareableUrl(slug.toString());

  useEffect(() => {
    if (!loading) {
      setMounted(true);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loading />
      </div>
    );
  }

  if (!deceased) {
    return (
      <DeceasedNotFound
        mounted={mounted}
        language={language}
        onGoHome={goHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="mx-auto mt-8 w-[92%] max-w-7xl space-y-8 relative z-10">
        <DeceasedHero
          mounted={mounted}
          language={language}
          title={t("sadaqa.title")}
          shareLabel={t("sadaqa.shareIt")}
          nameEn={deceased.nameEn}
          nameAr={deceased.nameAr}
          messageEn={deceased.messageEn}
          messageAr={deceased.messageAr}
          shareableUrl={shareableUrl}
        />

        <SurahSection
          mounted={mounted}
          language={language}
          title={t("sadaqa.recommendedSurahs")}
          expandedSurah={expandedSurah}
          versesByCard={versesByCard}
          versesLoading={versesLoading}
          versesError={versesError}
          onToggleSurah={toggleSurahExpansion}
          loadingVersesText={t("sadaqa.loadingVerses") || "Loading verses..."}
        />

        <DuaSection mounted={mounted} title={t("sadaqa.duaTitle")} />
      </div>
    </div>
  );
}
