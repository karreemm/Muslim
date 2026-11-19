import { useState, useEffect } from "react";
import { formatGregorianDate, formatHijriDate } from "@/lib/dateFormatting";

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

export const useDateFormatting = (): UseDateFormattingReturn => {
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-${now.getFullYear()}`;
  });
  const [formattedDates, setFormattedDates] = useState<FormattedDates>({
    gregorian: { en: "", ar: "" },
    hijri: { en: "", ar: "" },
  });

  useEffect(() => {
    setFormattedDates({
      gregorian: {
        en: formatGregorianDate(date, "en"),
        ar: formatGregorianDate(date, "ar"),
      },
      hijri: {
        en: formatHijriDate(date, "en"),
        ar: formatHijriDate(date, "ar"),
      },
    });
  }, [date]);

  return { formattedDates, date, setDate };
};
