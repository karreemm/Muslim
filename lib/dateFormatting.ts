import { toArabicNumber } from "@/utils/helpers";

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
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

type DateParts = {
  day: number;
  month: number;
  year: number;
};

function parseDate(date: string): DateParts | null {
  const [day, month, year] = date.split("-").map(Number);
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    month < 1 ||
    month > 12 ||
    day < 1
  ) {
    return null;
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > daysInMonth) return null;

  return { day, month, year };
}

function toUtcDate({ day, month, year }: DateParts): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatGregorianDate(date: string, language: "en" | "ar"): string {
  const parts = parseDate(date);
  if (!parts) {
    console.warn("Invalid date passed to formatGregorianDate:", date);
    return date;
  }

  const monthName =
    language === "ar"
      ? arabicMonthNames[parts.month - 1]
      : englishMonthNames[parts.month - 1];

  if (language === "ar") {
    return `${toArabicNumber(parts.day)} ${monthName}، ${toArabicNumber(parts.year)}`;
  }

  return `${parts.day} ${monthName}, ${parts.year}`;
}

export function formatHijriDate(date: string, language: "en" | "ar"): string {
  const parts = parseDate(date);
  if (!parts) {
    console.warn("Invalid date passed to formatHijriDate:", date);
    return date;
  }

  const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const formatted = formatter
    .formatToParts(toUtcDate(parts))
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== "literal") result[part.type] = part.value;
      return result;
    }, {});

  const hijriDay = Number(formatted.day);
  const hijriMonth = Number(formatted.month) - 1;
  const hijriYear = Number(formatted.year);

  if (
    !Number.isInteger(hijriDay) ||
    !Number.isInteger(hijriMonth) ||
    !Number.isInteger(hijriYear) ||
    hijriMonth < 0 ||
    hijriMonth > 11
  ) {
    console.warn("Invalid Hijri date parts for date:", date);
    return date;
  }

  if (language === "en") {
    return `${hijriDay} ${hijriMonthNamesInEnglish[hijriMonth]}, ${hijriYear}`;
  }

  return `${toArabicNumber(hijriDay)} ${hijriArabicMonthNames[hijriMonth]}، ${toArabicNumber(hijriYear)}`;
}

export function formatTime12h(value: string): string {
  const [hourPart, minutePart] = value.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return value;
  }

  const hour12 = hour % 12 || 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}
