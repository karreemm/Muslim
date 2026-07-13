"use client";

import { useEffect, useState } from "react";
import { usePrayerTimes, type PrayerTimings } from "@/hooks/prayerTimes";
import { useZekrCounter } from "@/context/features/ZekrCounterContext";
import { useLanguage } from "@/context/general/LanguageContext";

const POST_SALAH_CATEGORY = "أذكار بعد السلام من الصلاة المفروضة";
const RESET_MARKER_KEY = "postSalahResetPrayer";

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof PRAYER_ORDER)[number];

const getCurrentPrayerPeriod = (
  times: PrayerTimings | null,
): PrayerName | null => {
  if (!times) return null;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  const prayers = PRAYER_ORDER.map((name) => {
    const [hours, minutes] = (times[name] as string).split(":").map(Number);
    return { name, time: hours * 60 + minutes };
  }).sort((a, b) => a.time - b.time);

  const passed = prayers.filter((p) => p.time <= current);
  if (passed.length > 0) {
    return passed[passed.length - 1].name;
  }

  return "Isha";
};

export function usePostSalahAzkarReset() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { resetCategory } = useZekrCounter();

  const [address, setAddress] = useState<{
    city: { en: string; ar: string };
    country: { en: string; ar: string };
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("selectedGovernorate");
    if (saved) {
      try {
        const gov = JSON.parse(saved);
        setAddress({
          city: gov,
          country: { en: "Egypt", ar: "مصر" },
        });
      } catch {
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const interval = setInterval(() => {
      const saved = localStorage.getItem("selectedGovernorate");
      if (saved) {
        try {
          const gov = JSON.parse(saved);
          setAddress({
            city: gov,
            country: { en: "Egypt", ar: "مصر" },
          });
        } catch {
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const date = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

  const { rawPrayerTimes } = usePrayerTimes({
    address,
    date,
    language: isArabic ? "ar" : "en",
  });

  useEffect(() => {
    if (typeof window === "undefined" || !rawPrayerTimes) return;

    const check = () => {
      const period = getCurrentPrayerPeriod(rawPrayerTimes);
      if (!period) return;

      const lastReset = localStorage.getItem(RESET_MARKER_KEY);
      if (lastReset !== period) {
        resetCategory(POST_SALAH_CATEGORY);
        localStorage.setItem(RESET_MARKER_KEY, period);
      }
    };

    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [rawPrayerTimes, resetCategory]);
}
