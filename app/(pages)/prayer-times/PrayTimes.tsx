"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloudSun,
  faClock,
  faHourglassHalf,
  faMoon,
  faLocationDot,
  faCalendarAlt,
  faBell,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  usePrayerTimes,
  useDateFormatting,
  useNextPrayer,
} from "../../../hooks/prayerTimes";
import Loading from "@/components/general/Loading";
import GovernorateSelector from "@/app/(pages)/prayer-times/components/GovernorateSelector";

const prayerIcons: Record<string, typeof faSun> = {
  Fajr: faSun,
  Sunrise: faCloudSun,
  Dhuhr: faSun,
  Asr: faSun,
  Maghrib: faMoon,
  Isha: faMoon,
};

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
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <FontAwesomeIcon
            icon={faSpinner}
            className="absolute inset-0 m-auto text-primary text-xl animate-pulse"
          />
        </div>
        <p className="text-muted-foreground animate-pulse">
          {language === "ar"
            ? "جاري تحميل مواقيت الصلاة..."
            : "Loading prayer times..."}
        </p>
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
          {/* Header Card */}
          <div className="relative z-[800] overflow-visible rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 shadow-xl lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                      {t("prayerTimes.title")}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-lg  text-muted-foreground "
                      />
                      <GovernorateSelector
                        selectedGovernorate={selectedGovernorate}
                        onGovernorateChange={setSelectedGovernorate}
                        language={language}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-col gap-1 ${language === "ar" ? "items-end" : "items-start lg:items-end"}`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  {language === "en"
                    ? formattedDates.hijri.en
                    : formattedDates.hijri.ar}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  {language === "en"
                    ? formattedDates.gregorian.en
                    : formattedDates.gregorian.ar}
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6 lg:p-8 shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22hsl(var(--primary))%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                    {t("prayerTimes.nextPrayer")}
                  </p>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  {nextPrayerLabel || "--"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {language === "ar" ? "حان وقت الصلاة" : "Time to pray"}
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 bg-background/40 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                <div className="flex items-center gap-3">
                  <p
                    dir="ltr"
                    className="text-4xl lg:text-5xl font-bold text-primary tabular-nums tracking-tight"
                  >
                    {nextPrayerTime}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary px-4 py-2 rounded-full">
                  <span>{t("prayerTimes.remaining")}:</span>
                  <span dir="ltr" className="tabular-nums font-bold">
                    {timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-5 shadow-xl lg:p-7">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {language === "ar"
                  ? "مواقيت الصلاة اليوم"
                  : "Today's Prayer Times"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prayerNames[language].map((prayer, index) => {
                const prayerKey = prayerKeys[index];
                const time = prayerTimes[prayerKey];
                const isNext = prayerKey === nextPrayer;
                const Icon = prayerIcons[prayerKey] || faClock;

                return (
                  <div
                    key={prayer}
                    className={`group relative rounded-2xl border p-5 flex items-center gap-4 transition-all duration-300 ${
                      isNext
                        ? "border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg shadow-primary/20 scale-[1.02]"
                        : "border-border bg-background/60 hover:border-primary/30 hover:bg-card hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${
                        isNext
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <FontAwesomeIcon icon={Icon} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-lg font-bold truncate ${isNext ? "text-primary" : "text-foreground"}`}
                      >
                        {prayer}
                      </p>
                      <p
                        dir="ltr"
                        className={`text-xl tabular-nums ${isNext ? "text-primary font-semibold" : "text-muted-foreground"} ${language === "ar" ? "text-right" : "text-left"}`}
                      >
                        {time}
                      </p>
                    </div>

                    {isNext && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-[10px] text-primary-foreground font-bold">
                          <FontAwesomeIcon icon={faBell} className="text-[10px]" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;
