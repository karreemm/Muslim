import { useState, useEffect } from "react";
import moment from "moment-hijri";

const arabicMonthNames = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const englishMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const hijriArabicMonthNames = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوّال",
  "ذو القعدة",
  "ذو الحجة",
];

const hijriMonthNamesInEnglish = [
  "Muharram",
  "Safar",
  "Rabi' al-awwal",
  "Rabi' al-thani",
  "Jumada al-awwal",
  "Jumada al-thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export interface FormattedDates {
  gregorian: {
    en: string;
    ar: string;
  };
  hijri: {
    en: string;
    ar: string;
  };
}

export interface UseDateFormattingReturn {
  formattedDates: FormattedDates;
  date: string;
  setDate: (date: string) => void;
}

const toArabicDate = (date: string): string => {
  const m = moment(date, "DD-MM-YYYY");
  if (!m.isValid()) {
    console.warn("Invalid date passed to toArabicDate:", date);
    return date;
  }

  const day = m.date();
  const year = m.year();
  const monthIndex = m.month();

  const arabicDay = day
    .toString()
    .split("")
    .map((d) => arabicNumbers[Number(d)] ?? d)
    .join("");
  const arabicYear = year
    .toString()
    .split("")
    .map((d) => arabicNumbers[Number(d)] ?? d)
    .join("");
  const arabicMonth = arabicMonthNames[monthIndex] || "";

  return `${arabicDay} ${arabicMonth}، ${arabicYear}`;
};

const toEnglishDate = (date: string): string => {
  const m = moment(date, "DD-MM-YYYY");
  if (!m.isValid()) {
    console.warn("Invalid date passed to toEnglishDate:", date);
    return date;
  }

  const day = m.date();
  const year = m.year();
  const monthIndex = m.month();
  const monthName = englishMonthNames[monthIndex] || "";

  return `${day} ${monthName}, ${year}`;
};

const toHijriDate = (date: string, lang: "en" | "ar"): string => {
  const m = moment(date, "DD-MM-YYYY");
  if (!m.isValid()) {
    console.warn("Invalid date passed to toHijriDate:", date);
    return date;
  }

  const hijriYear = m.iYear();
  const hijriMonth = m.iMonth(); // 0-indexed (0 = Muharram)
  const hijriDay = m.iDate();

  if (hijriMonth < 0 || hijriMonth >= hijriArabicMonthNames.length) {
    console.warn("Invalid Hijri month index for date:", date, "month:", hijriMonth);
    return date;
  }

  if (lang === "en") {
    const monthName = hijriMonthNamesInEnglish[hijriMonth] || "";
    return `${hijriDay} ${monthName}, ${hijriYear}`;
  } else {
    const monthName = hijriArabicMonthNames[hijriMonth] || "";
    const arabicDay = hijriDay
      .toString()
      .split("")
      .map((d) => arabicNumbers[Number(d)] ?? d)
      .join("");
    const arabicYear = hijriYear
      .toString()
      .split("")
      .map((d) => arabicNumbers[Number(d)] ?? d)
      .join("");
    return `${arabicDay} ${monthName}, ${arabicYear}`;
  }
};

export const useDateFormatting = (): UseDateFormattingReturn => {
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  });
  const [formattedDates, setFormattedDates] = useState<FormattedDates>({
    gregorian: { en: "", ar: "" },
    hijri: { en: "", ar: "" },
  });

  useEffect(() => {
    const formattedGregorianDate = toEnglishDate(date);
    const formattedDateAr = toArabicDate(date);
    const formattedHijriDate = toHijriDate(date, "en");
    const formattedHijriDateAr = toHijriDate(date, "ar");

    setFormattedDates({
      gregorian: {
        en: formattedGregorianDate,
        ar: formattedDateAr,
      },
      hijri: {
        en: formattedHijriDate,
        ar: formattedHijriDateAr,
      },
    });
  }, [date]);

  return { formattedDates, date, setDate };
};
