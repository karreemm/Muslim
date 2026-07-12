"use client";

import { useEffect, useRef, useState } from "react";
import { useNextPrayer, usePrayerTimes } from "@/hooks/prayerTimes";
import { useZekrCounter } from "@/context/features/ZekrCounterContext";
import { useLanguage } from "@/context/general/LanguageContext";

const POST_SALAH_CATEGORY = "أذكار بعد السلام من الصلاة المفروضة";

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

  const { rawPrayerTimes, loading } = usePrayerTimes({
    address,
    date,
    language: isArabic ? "ar" : "en",
  });

  const { nextPrayer } = useNextPrayer(rawPrayerTimes);

  const prevNextPrayerRef = useRef<string | null>(null);

  useEffect(() => {
    if (!loading && nextPrayer && prevNextPrayerRef.current !== null) {
      if (prevNextPrayerRef.current !== nextPrayer) {
        resetCategory(POST_SALAH_CATEGORY);
      }
    }
    if (nextPrayer) {
      prevNextPrayerRef.current = nextPrayer;
    }
  }, [nextPrayer, loading, resetCategory]);
}
