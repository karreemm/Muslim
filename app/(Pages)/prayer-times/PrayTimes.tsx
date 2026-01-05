"use client";

import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  usePrayerLocation,
  usePrayerTimes,
  useDateFormatting,
  useNextPrayer,
} from "../../../hooks/prayerTimes";
import Loading from "@/components/general/Loading";

const prayerNames = {
  en: ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"],
  ar: ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"],
};

const PrayerTimes: React.FC = () => {
  const { language } = useLanguage() as { language: "en" | "ar" };
  const { t } = useTranslation();

  const {
    address,
    loading: locationLoading,
    error: locationError,
  } = usePrayerLocation();
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

  const loading = locationLoading || prayerTimesLoading;
  const error = locationError || prayerTimesError;

  if (loading)
    return (
      <div className="w-full flex justify-center mt-20">
        <Loading />
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div>
      {prayerTimes && (
        <>
          <div className="w-full flex flex-col gap-20 items-center">
            <h2 className="md:mt-0 mt-28 w-[80%] text-3xl md:text-5xl text-teal-600 dark:text-white text-center">
              {t("prayerTimes.error")}
            </h2>
            <div className="w-[90%] bg-[#FFE0B2] dark:bg-[#2d3748] dark:shadow-lg shadow-lg p-6 rounded-lg flex flex-col gap-5 text-black dark:text-white">
              <div className="flex flex-col gap-4 md:flex md:flex-row md:justify-between md:gap-0">
                <h2 className="text-2xl md:text-4xl">
                  {t("prayerTimes.title")} {address?.[language].city}
                </h2>
                <div
                  className={`mt-3 md:mt-0 md:flex md:flex-col ${
                    language === "ar"
                      ? `flex flex-row justify-between`
                      : `flex flex-col items-center`
                  }`}
                >
                  <h2 className="text-base md:text-lg font-bold">
                    {language === "en"
                      ? formattedDates.gregorian.en
                      : formattedDates.gregorian.ar}
                  </h2>
                  <h2 className="text-base md:text-lg font-bold">
                    {language === "en"
                      ? formattedDates.hijri.en
                      : formattedDates.hijri.ar}
                  </h2>
                </div>
              </div>
              <div className="mt-10 w-full flex flex-col items-center md:flex md:flex-row md:items-center md:justify-center gap-5 md:gap-10">
                {prayerNames[language].map((prayer, index) => {
                  const prayerKeys: (keyof typeof prayerTimes)[] = [
                    "Fajr",
                    "Sunrise",
                    "Dhuhr",
                    "Asr",
                    "Maghrib",
                    "Isha",
                  ];
                  const prayerKey = prayerKeys[index];
                  const time = prayerTimes[prayerKey];
                  const isNext = prayerKey === nextPrayer;

                  return (
                    <div
                      key={prayer}
                      className={`w-[90%] md:w-[15%] rounded-lg shadow-md py-6 px-3 flex flex-col justify-center items-center gap-2 transition-all duration-300 ${
                        isNext
                          ? "bg-teal-600 dark:bg-teal-600 text-white transform scale-110 shadow-xl border-2 border-yellow-400"
                          : "bg-[#FFF5E4] dark:bg-slate-900"
                      }`}
                    >
                      <p
                        className={`text-xl font-bold ${
                          isNext ? "text-yellow-300" : ""
                        }`}
                      >
                        {prayer} :
                      </p>
                      <p dir="ltr" className="text-xl">
                        {time}
                      </p>
                      {isNext && (
                        <div className="mt-2 text-sm font-bold bg-black/20 px-3 py-1 rounded-full animate-pulse">
                          - {timeRemaining}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="h-20 md:h-0"></div>
        </>
      )}
    </div>
  );
};

export default PrayerTimes;
