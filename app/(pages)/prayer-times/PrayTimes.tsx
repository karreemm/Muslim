"use client";

import React, { useState, useEffect, useMemo } from "react";
import Mosque from "@/assets/general/mosque.webp";
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
        JSON.stringify(selectedGovernorate)
      );
    }
  }, [selectedGovernorate]);

  const address = useMemo(
    () => ({
      city: selectedGovernorate,
      country: { en: "Egypt", ar: "مصر" },
    }),
    [selectedGovernorate]
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

  return (
    <div>
      {prayerTimes && (
        <>
          <div className="w-full flex flex-col gap-20 items-center">
            <h2 className="lg:mt-0 mt-28 w-[80%] text-3xl lg:text-5xl text-teal-600 dark:text-white text-center">
              {t("prayerTimes.error")}
            </h2>
            <div className="w-[90%] bg-[#FFE0B2] dark:bg-[#2d3748] dark:shadow-lg shadow-lg p-6 rounded-lg flex flex-col gap-5 text-black dark:text-white">
              <div className="flex flex-col gap-4 lg:flex lg:flex-row lg:justify-between lg:gap-4">
                <div className="flex flex-row items-center gap-3 lg:gap-4">
                  <h2 className="text-2xl lg:text-4xl whitespace-nowrap">
                    {t("prayerTimes.title")}
                  </h2>
                  <GovernorateSelector
                    selectedGovernorate={selectedGovernorate}
                    onGovernorateChange={setSelectedGovernorate}
                    language={language}
                  />
                </div>
                <div
                  className={`mt-3 lg:mt-0 lg:flex lg:flex-col ${
                    language === "ar"
                      ? `flex flex-row justify-between`
                      : `flex flex-col items-center`
                  }`}
                >
                  <h2 className="text-base lg:text-lg font-bold">
                    {language === "en"
                      ? formattedDates.gregorian.en
                      : formattedDates.gregorian.ar}
                  </h2>
                  <h2 className="text-base lg:text-lg font-bold">
                    {language === "en"
                      ? formattedDates.hijri.en
                      : formattedDates.hijri.ar}
                  </h2>
                </div>
              </div>
              <div className="mt-10 w-full flex flex-col items-center lg:flex lg:flex-row lg:items-center lg:justify-center gap-5 lg:gap-10">
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
                      className={`w-[90%] lg:w-[15%] rounded-lg shadow-lg py-6 px-3 flex flex-col justify-center items-center gap-2 transition-all duration-300 relative overflow-hidden ${
                        isNext
                          ? "text-white transform scale-110 shadow-xl border-2 border-teal-400"
                          : "bg-[#FFF5E4] dark:bg-slate-900"
                      }`}
                      style={
                        isNext
                          ? {
                              backgroundImage: `url(${Mosque.src})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : undefined
                      }
                    >
                      {isNext && (
                        <div className="absolute inset-0 bg-black/40 -z-10"></div>
                      )}
                      <p
                        className={`text-xl font-bold ${
                          isNext ? "text-teal-300" : ""
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
          <div className="h-20 lg:h-0"></div>
        </>
      )}
    </div>
  );
};

export default PrayerTimes;
