"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  usePrayerTimes,
  useDateFormatting,
  useNextPrayer,
} from "../../../hooks/prayerTimes";
import PrayerTimesHeader from "@/app/(pages)/prayer-times/components/PrayerTimesHeader";
import NextPrayerCard from "@/app/(pages)/prayer-times/components/NextPrayerCard";
import PrayerTimesGrid from "@/app/(pages)/prayer-times/components/PrayerTimesGrid";
import Loading from "@/components/general/Loading";

const prayerNames = {
  en: ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"],
  ar: ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"],
};

const prayerKeys = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
] as const;

type PrayerKey = (typeof prayerKeys)[number];

const PrayerTimes: React.FC = () => {
  const { language } = useLanguage() as { language: "en" | "ar" };
  const { t } = useTranslation();

  const [selectedGovernorate, setSelectedGovernorate] = useState<{
    en: string;
    ar: string;
  }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedGovernorate");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return { en: "Cairo", ar: "القاهرة" };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "selectedGovernorate",
        JSON.stringify(selectedGovernorate),
      );
    }
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

  const nextPrayerIndex = nextPrayer
    ? prayerKeys.indexOf(nextPrayer as PrayerKey)
    : -1;
  const nextPrayerLabel =
    nextPrayerIndex >= 0 ? prayerNames[language][nextPrayerIndex] : undefined;
  const nextPrayerTime =
    nextPrayer && prayerTimes
      ? prayerTimes[nextPrayer as keyof typeof prayerTimes]
      : "--:--";

  return (
    <div className="w-full min-h-screen bg-background pb-20 lg:pb-0 relative overflow-x-hidden overflow-y-visible">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {prayerTimes && (
        <div className="relative z-10 mx-auto mt-6 lg:mt-8 w-[92%] max-w-5xl space-y-6 text-foreground">
          <PrayerTimesHeader
            title={t("prayerTimes.title")}
            language={language}
            selectedGovernorate={selectedGovernorate}
            onGovernorateChange={setSelectedGovernorate}
            hijriDate={
              language === "en"
                ? formattedDates.hijri.en
                : formattedDates.hijri.ar
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
            title={
              language === "ar" ? "مواقيت الصلاة اليوم" : "Today's Prayer Times"
            }
            prayerNames={prayerNames[language]}
            prayerKeys={prayerKeys}
            prayerTimes={prayerTimes}
            nextPrayer={nextPrayer}
          />
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;
