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
  const gregorianDate = moment(date, "DD-MM-YYYY").format("D MMMM, YYYY");
  const [day, month, year] = gregorianDate.split(" ");
  const arabicDay = day
    .split("")
    .map((d) => arabicNumbers[Number(d)])
    .join("");
  const arabicYear = year
    .split("")
    .map((d) => arabicNumbers[Number(d)])
    .join("");
  const arabicMonth = arabicMonthNames[moment(date, "DD-MM-YYYY").month()];
  return `${arabicDay} ${arabicMonth}، ${arabicYear}`;
};

const toHijriDate = (date: string, lang: "en" | "ar"): string => {
  const hijriDate = moment(date, "DD-MM-YYYY").format("iYYYY/iM/iD");
  const [year, month, day] = hijriDate.split("/");
  if (lang === "en") {
    return `${day} ${hijriMonthNamesInEnglish[parseInt(month) - 1]}, ${year}`;
  } else {
    return `${day
      .split("")
      .map((d) => arabicNumbers[Number(d)])
      .join("")} ${hijriArabicMonthNames[parseInt(month) - 1]}, ${year
      .split("")
      .map((d) => arabicNumbers[Number(d)])
      .join("")}`;
  }
};

export const useDateFormatting = (): UseDateFormattingReturn => {
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
  );
  const [formattedDates, setFormattedDates] = useState<FormattedDates>({
    gregorian: { en: "", ar: "" },
    hijri: { en: "", ar: "" },
  });

  useEffect(() => {
    const formattedGregorianDate = moment(date, "DD-MM-YYYY").format(
      "D MMMM, YYYY"
    );
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
