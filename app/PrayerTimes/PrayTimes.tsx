"use client";

import React, { useState, useEffect } from "react";
import { getLocation } from "./GetLocation";
import { getPrayerTimes } from "./GetPrayerTimes";
import { useLanguage } from "../Context/LanguageContext";
import TranslationPair from "../Lib/Types";
import moment from "moment-hijri";
import { ClipLoader } from 'react-spinners';

const arabicMonthNames = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const hijriArabicMonthNames = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
  "رجب", "شعبان", "رمضان", "شوّال", "ذو القعدة", "ذو الحجة"
];

const hijriMonthNamesInEnglish = [
  "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani", "Jumada al-awwal", "Jumada al-thani",
  "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

const prayerNames = {
  en: ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"],
  ar: ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"]
};

const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const amPmArabic = { AM: "ص", PM: "م" };

const toArabicNumerals = (time: string): string => {
  return time.split('').map(char => {
    const num = parseInt(char, 10);
    return isNaN(num) ? char : arabicNumbers[num];
  }).join('');
};

const convertToArabicTime = (time: string): string => {
  const [hour, minute, period] = time.split(/[:\s]/);
  const hourInArabic = toArabicNumerals(hour);
  const minuteInArabic = toArabicNumerals(minute);
  const periodInArabic = amPmArabic[period.toUpperCase() as 'AM' | 'PM'];
  return `${minuteInArabic}:${hourInArabic} ${periodInArabic}`;
};

const PrayerTimes: React.FC = () => {
  const { language } = useLanguage() as { language: "en" | "ar" };

  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [address, setAddress] = useState<{
    en: { city: string; country: string };
    ar: { city: string; country: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toLocaleDateString("en-GB").replace(/\//g, "-"));
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [dateAr, setDateAr] = useState<string>("");
  const [dateHijri, setDateHijri] = useState<string>("");
  const [dateHijriAr, setDateHijriAr] = useState<string>("");

  const PrayerTimesText: TranslationPair = {
    en: "Prayer Times in",
    ar: "أوقات الصلاة في",
  };

  const Errorr: TranslationPair = {
    en: "These Times Might have an Error of ± Minute",
    ar: "هذه الأوقات قد تحتوي على خطأ ± دقيقة",
  }

  const toArabicDate = (date: string): string => {
    const gregorianDate = moment(date, "DD-MM-YYYY").format("D MMMM, YYYY");
    const [day, month, year] = gregorianDate.split(" ");
    const arabicDay = day.split('').map(d => arabicNumbers[Number(d)]).join('');
    const arabicYear = year.split('').map(d => arabicNumbers[Number(d)]).join('');
    const arabicMonth = arabicMonthNames[moment(date, "DD-MM-YYYY").month()];
    return `${arabicDay} ${arabicMonth}، ${arabicYear}`;
  };

  const toHijriDate = (date: string, lang: "en" | "ar"): string => {
    const hijriDate = moment(date, "DD-MM-YYYY").format("iYYYY/iM/iD");
    const [year, month, day] = hijriDate.split('/');
    if (lang === "en") {
      return `${day} ${hijriMonthNamesInEnglish[parseInt(month) - 1]}, ${year}`;
    } else {
      return `${day.split('').map(d => arabicNumbers[Number(d)]).join('')} ${hijriArabicMonthNames[parseInt(month) - 1]}, ${year.split('').map(d => arabicNumbers[Number(d)]).join('')}`;
    }
  };

  useEffect(() => {
    const formattedGregorianDate = moment(date, "DD-MM-YYYY").format("D MMMM, YYYY");
    const formattedDateAr = toArabicDate(date);
    const formattedHijriDate = toHijriDate(date, "en");
    const formattedHijriDateAr = toHijriDate(date, "ar");

    setFormattedDate(formattedGregorianDate);
    setDateAr(formattedDateAr);
    setDateHijri(formattedHijriDate);
    setDateHijriAr(formattedHijriDateAr);
  }, [date]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      setLoading(true);
      try {
        const location = await getLocation();
        setAddress({
          en: { city: location.city.en, country: location.country.en },
          ar: { city: location.city.ar, country: location.country.ar },
        });
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (!address) return; 

      setLoading(true);
      try {
        const timings = await getPrayerTimes(
          address[language].city,
          address[language].country,
          date
        );
        const formattedPrayerTimes = {
          Fajr: moment(timings.Fajr, "HH:mm").format("h:mm A"),
          Sunrise: moment(timings.Sunrise, "HH:mm").format("h:mm A"),
          Dhuhr: moment(timings.Dhuhr, "HH:mm").format("h:mm A"),
          Asr: moment(timings.Asr, "HH:mm").format("h:mm A"),
          Maghrib: moment(timings.Maghrib, "HH:mm").format("h:mm A"),
          Isha: moment(timings.Isha, "HH:mm").format("h:mm A"),
        };
        setPrayerTimes(formattedPrayerTimes);
        setLoading(false); 
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [address, date, language]);

  if (loading) return(
    <div className="w-full flex justify-center mt-20">
      <ClipLoader color="#36D7B7" loading={loading} size={50} />
    </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div>
      {prayerTimes && (
        <>
        <div className="w-full flex flex-col gap-20 items-center">
          <h2 className="md:mt-0 mt-28 w-[80%] text-3xl md:text-5xl text-teal-600 dark:text-teal-500 text-center">
            {Errorr[language]}
          </h2>
          <div className="w-[90%] bg-[#FFE0B2] dark:bg-[#2d3748] dark:shadow-lg shadow-lg p-6 rounded-lg flex flex-col gap-5 text-black dark:text-white">
            <div className="flex flex-col gap-4 md:flex md:flex-row md:justify-between md:gap-0">
              <h2 className="text-2xl md:text-4xl">
                {PrayerTimesText[language]} {address?.[language].city}
              </h2>
              <div className={`mt-3 md:mt-0 md:flex md:flex-col ${language === "ar"? `flex flex-row justify-between` : `flex flex-col items-center`}`}>
                <h2 className="text-base md:text-lg font-bold">
                  {language === "en" ? formattedDate : dateAr}
                </h2>
                <h2 className="text-base md:text-lg font-bold">
                  {language === "en" ? dateHijri : dateHijriAr}
                </h2>
              </div>
            </div>
            <div className="mt-10 w-full flex flex-col items-center md:flex md:flex-row md:items-baseline md:justify-center gap-5 md:gap-10">
              {prayerNames[language].map((prayer, index) => {
                const time = prayerTimes[["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"][index]];
                const timeInArabic = convertToArabicTime(time);
                return (
                  <div
                    key={prayer}
                    className="w-[90%] md:w-[15%] rounded-lg bg-[#FFF5E4] dark:bg-slate-900 shadow-md py-6 px-3 flex flex-col justify-center items-center gap-2"
                  >
                    <p className="text-xl font-bold">{prayer} :</p>
                    <p className="text-xl">{language==="ar"? timeInArabic : time}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="h-20 md:h-0">
        </div>
        </>

      )}
    </div>
  );
  
};

export default PrayerTimes;
