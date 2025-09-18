"use client";

import React from "react";
import { useLanguage } from "../../Context/LanguageContext";
import TranslationPair from "../../Types";
import { usePrayerLocation, usePrayerTimes, useDateFormatting } from "../../Hooks/PrayerTimes";
import Loading from "@/app/Components/general/Loading";

const prayerNames = {
  en: ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"],
  ar: ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"],
};

const PrayerTimes: React.FC = () => {
  const { language } = useLanguage() as { language: "en" | "ar" };

  const { address, loading: locationLoading, error: locationError } = usePrayerLocation();
  const { formattedDates, date } = useDateFormatting();
  const { prayerTimes, loading: prayerTimesLoading, error: prayerTimesError } = usePrayerTimes({ 
    address, 
    date, 
    language 
  });

  const loading = locationLoading || prayerTimesLoading;
  const error = locationError || prayerTimesError;

  const PrayerTimesText: TranslationPair = {
    en: "Prayer Times in",
    ar: "أوقات الصلاة في",
  };

  const Errorr: TranslationPair = {
    en: "These Times Might have an Error of ± Minute",
    ar: "هذه الأوقات قد تحتوي على خطأ ± دقيقة",
  };

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
              {Errorr[language]}
            </h2>
            <div className="w-[90%] bg-[#FFE0B2] dark:bg-[#2d3748] dark:shadow-lg shadow-lg p-6 rounded-lg flex flex-col gap-5 text-black dark:text-white">
              <div className="flex flex-col gap-4 md:flex md:flex-row md:justify-between md:gap-0">
                <h2 className="text-2xl md:text-4xl">
                  {PrayerTimesText[language]} {address?.[language].city}
                </h2>
                <div
                  className={`mt-3 md:mt-0 md:flex md:flex-col ${
                    language === "ar"
                      ? `flex flex-row justify-between`
                      : `flex flex-col items-center`
                  }`}
                >
                  <h2 className="text-base md:text-lg font-bold">
                    {language === "en" ? formattedDates.gregorian.en : formattedDates.gregorian.ar}
                  </h2>
                  <h2 className="text-base md:text-lg font-bold">
                    {language === "en" ? formattedDates.hijri.en : formattedDates.hijri.ar}
                  </h2>
                </div>
              </div>
              <div className="mt-10 w-full flex flex-col items-center md:flex md:flex-row md:items-baseline md:justify-center gap-5 md:gap-10">
                {prayerNames[language].map((prayer, index) => {
                  const prayerKeys: (keyof typeof prayerTimes)[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
                  const time = prayerTimes[prayerKeys[index]];
                  return (
                    <div
                      key={prayer}
                      className="w-[90%] md:w-[15%] rounded-lg bg-[#FFF5E4] dark:bg-slate-900 shadow-md py-6 px-3 flex flex-col justify-center items-center gap-2"
                    >
                      <p className="text-xl font-bold">{prayer} :</p>
                      <p dir="ltr" className="text-xl">
                        {time}
                      </p>
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
