"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  usePrayerTimes,
  useDateFormatting,
  useNextPrayer,
} from "../../../../hooks/prayerTimes";
import PrayerTimesHeader from "@/app/[locale]/(pages)/prayer-times/components/PrayerTimesHeader";
import NextPrayerCard from "@/app/[locale]/(pages)/prayer-times/components/NextPrayerCard";
import PrayerTimesGrid from "@/app/[locale]/(pages)/prayer-times/components/PrayerTimesGrid";
import Loading from "@/components/general/Loading";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";
import { PageShell } from "@/components/ui/PageShell";

const prayerNames = {
  en: ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"],
  ar: ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"],
};

const prayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

type PrayerKey = (typeof prayerKeys)[number];

const PrayerTimes: React.FC = () => {
  const { language } = useLanguage() as { language: "en" | "ar" };
  const { t } = useTranslation();

  const [selectedGovernorate, setSelectedGovernorate] = useState<{
    en: string;
    ar: string;
  }>(() =>
    readJSON<{ en: string; ar: string }>(STORAGE_KEYS.selectedGovernorate, {
      en: "Cairo",
      ar: "القاهرة",
    }),
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.selectedGovernorate, selectedGovernorate);
  }, [selectedGovernorate]);

  const address = useMemo(
    () => ({
      city: selectedGovernorate,
      country: { en: "Egypt", ar: "مصر" },
    }),
    [selectedGovernorate],
  );

  const { formattedDates, date } = useDateFormatting();
  const {
    prayerTimes,
    rawPrayerTimes,
    loading: prayerTimesLoading,
    error: prayerTimesError,
  } = usePrayerTimes({
    address,
    date,
    language,
  });

  const { nextPrayer, timeRemaining } = useNextPrayer(rawPrayerTimes);

  if (prayerTimesLoading)
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background">
        <Loading />
      </div>
    );

  if (prayerTimesError)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 rounded-2xl bg-destructive/10 border border-destructive/20">
          <p className="text-destructive font-medium">{prayerTimesError}</p>
        </div>
      </div>
    );

  const nextPrayerIndex = nextPrayer ? prayerKeys.indexOf(nextPrayer as PrayerKey) : -1;
  const nextPrayerLabel =
    nextPrayerIndex >= 0 ? prayerNames[language][nextPrayerIndex] : undefined;
  const nextPrayerTime =
    nextPrayer && prayerTimes
      ? prayerTimes[nextPrayer as keyof typeof prayerTimes]
      : "--:--";

  return (
    <PageShell
      className="overflow-x-hidden overflow-y-visible pb-20 lg:pb-0"
      width="medium"
      containerClassName="section-stack"
      decorations={
        <>
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        </>
      }
    >
      {prayerTimes && (
        <>
          <PrayerTimesHeader
            title={t("prayerTimes.title")}
            language={language}
            selectedGovernorate={selectedGovernorate}
            onGovernorateChange={setSelectedGovernorate}
            hijriDate={
              language === "en" ? formattedDates.hijri.en : formattedDates.hijri.ar
            }
            gregorianDate={
              language === "en"
                ? formattedDates.gregorian.en
                : formattedDates.gregorian.ar
            }
          />

          <NextPrayerCard
            language={language}
            nextPrayerLabel={nextPrayerLabel}
            nextPrayerTime={nextPrayerTime}
            timeRemaining={timeRemaining}
            nextPrayerText={t("prayerTimes.nextPrayer")}
            remainingText={t("prayerTimes.remaining")}
          />

          <PrayerTimesGrid
            language={language}
            title={t("prayerTimes.today")}
            prayerNames={prayerNames[language]}
            prayerKeys={prayerKeys}
            prayerTimes={prayerTimes}
            nextPrayer={nextPrayer}
          />
        </>
      )}
    </PageShell>
  );
};

export default PrayerTimes;
