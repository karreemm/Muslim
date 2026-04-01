"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  usePrayerTimes,
  useDateFormatting,
  useNextPrayer,
} from "../../../hooks/prayerTimes";
import Loading from "@/components/general/Loading";
import GovernorateSelector from "@/components/general/GovernorateSelector";

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
      <div className="w-full flex justify-center mt-20">
        <Loading />
      </div>
    );

  if (prayerTimesError) return <div>{prayerTimesError}</div>;

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
    <div className="w-full pb-20 lg:pb-0">
      {prayerTimes && (
        <>
          <div className="mx-auto mt-8 w-[92%] max-w-6xl space-y-6 text-foreground">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-xl backdrop-blur-sm lg:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <h2 className="text-2xl lg:text-4xl font-semibold whitespace-nowrap">
                    {t("prayerTimes.title")}
                  </h2>
                  <GovernorateSelector
                    selectedGovernorate={selectedGovernorate}
                    onGovernorateChange={setSelectedGovernorate}
                    language={language}
                  />
                </div>
                <div
                  className={`text-sm lg:text-base ${
                    language === "ar"
                      ? `flex flex-col items-end gap-1`
                      : `flex flex-col items-start lg:items-end gap-1`
                  }`}
                >
                  <h2 className="font-semibold text-muted-foreground">
                    {language === "en"
                      ? formattedDates.gregorian.en
                      : formattedDates.gregorian.ar}
                  </h2>
                  <h2 className="font-semibold text-muted-foreground">
                    {language === "en"
                      ? formattedDates.hijri.en
                      : formattedDates.hijri.ar}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/10 to-secondary p-5 shadow-lg lg:p-6">
              <div
                className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between `}
              >
                <div className="space-y-1">
                  <p className="text-sm lg:text-base font-semibold text-primary/90">
                    {t("prayerTimes.nextPrayer")}
                  </p>
                  <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {nextPrayerLabel || "--"}
                  </h3>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <p dir="ltr" className="text-3xl font-bold text-primary">
                    {nextPrayerTime}
                  </p>
                  <span className="text-sm lg:text-base font-semibold">
                    {t("prayerTimes.remaining")}: {timeRemaining}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-xl backdrop-blur-sm lg:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {prayerNames[language].map((prayer, index) => {
                  const prayerKey = prayerKeys[index];
                  const time = prayerTimes[prayerKey];
                  const isNext = prayerKey === nextPrayer;

                  return (
                    <div
                      key={prayer}
                      className={`rounded-xl border px-4 py-5 flex flex-col justify-center items-center gap-2 transition-all duration-300 ${
                        isNext
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border bg-background/80"
                      }`}
                    >
                      <p
                        className={`text-xl font-bold ${
                          isNext ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {prayer}
                      </p>
                      <p
                        dir="ltr"
                        className={`text-xl ${
                          isNext ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {time}
                      </p>
                      {isNext && (
                        <div className="mt-1 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {t("prayerTimes.remaining")}: {timeRemaining}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrayerTimes;
