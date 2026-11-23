"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../../../../context/general/LanguageContext";
import Loading from "@/components/general/Loading";
import {
  useDeceasedPage,
  useShareableUrl,
  useSadaqaSurahVerses,
} from "../../../../../hooks/sadaqaGarya";
import { useTranslation } from "@/hooks/general/useTranslation";
import { PageShell } from "@/components/ui/PageShell";
import DeceasedNotFound from "./components/DeceasedNotFound";
import DeceasedHero from "./components/DeceasedHero";
import SurahSection from "./components/SurahSection";
import DuaSection from "./components/DuaSection";

export default function DeceasedPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  const { deceased, expandedSurah, loading, toggleSurahExpansion, goHome } =
    useDeceasedPage(slug);
  const {
    versesByCard,
    loading: versesLoading,
    error: versesError,
  } = useSadaqaSurahVerses();

  const { shareableUrl } = useShareableUrl(slug);

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
    return <DeceasedNotFound mounted={mounted} language={language} onGoHome={goHome} />;
  }

  return (
    <PageShell
      className="pb-12"
      containerClassName="page-stack"
      decorations={
        <>
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </>
      }
    >
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
    </PageShell>
  );
}
