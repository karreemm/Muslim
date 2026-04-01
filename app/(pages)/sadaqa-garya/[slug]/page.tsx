"use client";

import { useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../../../context/LanguageContext";
import { duas, DiedSurahs } from "../../../../constants/sadaqaData";
import { ClipLoader } from "react-spinners";
import ShareModal from "../../../../components/modals/ShareModal";
import {
  useDeceasedPage,
  useShareableUrl,
  useSadaqaSurahVerses,
  SADAQA_SURAH_CONFIG,
} from "../../../../hooks/sadaqaGarya";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useContainerFontSize } from "@/hooks/readQuran";
import type { SadaqaQuranVerse } from "@/hooks/sadaqaGarya/useSadaqaSurahVerses";
import QuranPageRenderer from "@/app/(pages)/read-quran/components/QuranPageRenderer";
function ConcatenatedQuranPages({
  verses,
  surahNumber,
  startAyah,
  endAyah,
}: {
  verses: SadaqaQuranVerse[];
  surahNumber: number;
  startAyah: number;
  endAyah: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { fontSize, lineHeight } = useContainerFontSize(contentRef);
  const pageNumbers = useMemo(() => {
    const pageSet = new Set<number>();

    verses.forEach((verse) => {
      verse.words.forEach((word) => {
        if (word.page_number) {
          pageSet.add(Number(word.page_number));
        }
      });
    });

    return Array.from(pageSet).sort((a, b) => a - b);
  }, [verses]);

  const surahHeaders =
    startAyah === 1
      ? [
          {
            surahNumber,
            firstAyah: startAyah,
            lastAyah: endAyah,
          },
        ]
      : undefined;

  const versesByPage = useMemo(() => {
    const map: Record<number, SadaqaQuranVerse[]> = {};

    pageNumbers.forEach((pageNum) => {
      map[pageNum] = verses.filter((verse) =>
        verse.words.some((word) => Number(word.page_number) === pageNum),
      );
    });

    return map;
  }, [verses, pageNumbers]);

  return (
    <div
      ref={contentRef}
      className="mx-auto w-full md:w-[90%] lg:w-[800px] py-2 px-1 overflow-hidden"
    >
      <div className="flex flex-col gap-6 w-full items-center">
        {pageNumbers.map((pageNum) => (
          <div
            key={`${surahNumber}-${pageNum}`}
            id={`sadaqa-page-${surahNumber}-${pageNum}`}
            className="w-full flex justify-center"
          >
            <QuranPageRenderer
              verses={versesByPage[pageNum] as any}
              fontSize={fontSize}
              lineHeight={lineHeight}
              pageNumber={pageNum}
              highlightedAyahNumber={0}
              surahHeaders={surahHeaders}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeceasedPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const { deceased, expandedSurah, loading, toggleSurahExpansion, goHome } =
    useDeceasedPage(slug.toString());
  const {
    versesByCard,
    loading: versesLoading,
    error: versesError,
  } = useSadaqaSurahVerses();

  const { shareableUrl } = useShareableUrl(slug.toString());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color={"hsl(var(--primary))"} loading={loading} size={50} />
      </div>
    );
  }

  if (!deceased) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-foreground shadow-lg">
          <h1 className="mb-4 text-2xl font-semibold">
            {language === "en" ? "Person not found" : "لم يتم العثور على الشخص"}
          </h1>
          <button
            onClick={goHome}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/90"
          >
            {language === "en" ? "Return Home" : "العودة للرئيسية"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="mx-auto mt-8 w-[92%] max-w-6xl space-y-8">
        <section className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-secondary/30 p-6 text-center shadow-xl lg:p-8">
          <h1
            className={`${language === "ar" ? "leading-10" : ""} text-2xl lg:text-3xl text-foreground`}
          >
            {t("sadaqa.title")}
          </h1>
          <p className="mt-4 text-4xl font-semibold text-primary lg:text-5xl">
            {language === "en" ? deceased.nameEn : deceased.nameAr}
          </p>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-foreground/90 lg:text-2xl">
            {language === "en"
              ? deceased.messageEn ||
                "May Allah forgive them, elevate their rank, and make this page a continuous charity."
              : deceased.messageAr ||
                "اللهم اغفر له وارفع درجته، واجعل هذه الصفحة صدقة جارية له."}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 lg:flex-row">
            <span className="text-base text-muted-foreground lg:text-lg">
              {t("sadaqa.shareIt")}
            </span>
            <ShareModal url={shareableUrl} size="2xl" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-center text-2xl font-semibold text-foreground lg:text-3xl">
            {t("sadaqa.recommendedSurahs")}
          </h2>
          <div className="grid gap-4">
            {DiedSurahs.map((surah, index) => {
              const verses = versesByCard[index] || [];
              const surahConfig = SADAQA_SURAH_CONFIG[index];
              const surahNumber = surahConfig?.surahNumber || 1;
              const startAyah = surahConfig?.startAyah || 1;
              const endAyah = surahConfig?.endAyah || 1;

              return (
                <article
                  key={index}
                  className="rounded-2xl border border-border/70 bg-card p-5 shadow-md transition hover:shadow-lg lg:p-6"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground lg:text-xl">
                      {t("common.surahWithNoAll")}:{" "}
                      {language === "en" ? surah.name.en : surah.name.ar}
                    </h3>
                    <button
                      onClick={() => toggleSurahExpansion(index)}
                      className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                    >
                      {expandedSurah === index
                        ? language === "en"
                          ? "Collapse"
                          : "إخفاء"
                        : language === "en"
                          ? "Read Surah"
                          : "اقرأ السورة"}
                    </button>
                  </div>

                  {expandedSurah === index && (
                    <div className="mt-4 rounded-xl border border-border/60 bg-background/80 p-4 lg:p-5">
                      <div dir="rtl" className="w-full">
                        <div
                          className="mx-auto max-w-[950px] text-foreground"
                          style={{
                            direction: "rtl",
                            textAlign: "center",
                          }}
                        >
                          {versesLoading ? (
                            <div className="flex justify-center py-8">
                              <ClipLoader
                                color={"hsl(var(--primary))"}
                                loading={true}
                                size={32}
                              />
                            </div>
                          ) : versesError ? (
                            <p className="text-center text-destructive">
                              {versesError}
                            </p>
                          ) : verses.length > 0 ? (
                            <ConcatenatedQuranPages
                              verses={verses}
                              surahNumber={surahNumber}
                              startAyah={startAyah}
                              endAyah={endAyah}
                            />
                          ) : (
                            <p className="text-center text-muted-foreground">
                              {language === "en"
                                ? "Surah content is unavailable right now."
                                : "محتوى السورة غير متاح حاليا."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-center text-2xl font-semibold text-foreground lg:text-3xl">
            {t("sadaqa.duaTitle")}
          </h2>

          <div dir="rtl" className="grid gap-4">
            {duas.map((dua, index) => (
              <article
                key={index}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-md lg:p-6"
              >
                <p className="fontAmiri text-lg leading-loose text-foreground lg:text-xl">
                  {dua}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
