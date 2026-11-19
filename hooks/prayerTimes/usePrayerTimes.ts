import { useState, useEffect } from "react";
import { getPrayerTimes } from "@/lib/services/prayerTimes/GetPrayerTimes";
import type { PrayerTimings } from "@/lib/services/prayerTimes/GetPrayerTimes";
import { formatTime12h } from "@/lib/dateFormatting";

export type { PrayerTimings } from "@/lib/services/prayerTimes/GetPrayerTimes";

export interface LocationData {
  city: { en: string; ar: string };
  country: { en: string; ar: string };
  latitude?: number;
  longitude?: number;
}

export interface UsePrayerTimesReturn {
  prayerTimes: PrayerTimings | null;
  rawPrayerTimes: PrayerTimings | null;
  loading: boolean;
  error: string | null;
}

export interface UsePrayerTimesProps {
  address: LocationData | null;
  date: string;
  language: "en" | "ar";
}

export const usePrayerTimes = ({
  address,
  date,
  language,
}: UsePrayerTimesProps): UsePrayerTimesReturn => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
  const [rawPrayerTimes, setRawPrayerTimes] = useState<PrayerTimings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (!address) return;

      setLoading(true);
      setError(null);

      try {
        const timings = await getPrayerTimes(
          address.city[language],
          address.country[language],
          date,
          address.latitude,
          address.longitude,
        );

        setRawPrayerTimes(timings);

        const formattedPrayerTimes: PrayerTimings = {
          Fajr: formatTime12h(timings.Fajr),
          Sunrise: formatTime12h(timings.Sunrise),
          Dhuhr: formatTime12h(timings.Dhuhr),
          Asr: formatTime12h(timings.Asr),
          Maghrib: formatTime12h(timings.Maghrib),
          Isha: formatTime12h(timings.Isha),
        };

        setPrayerTimes(formattedPrayerTimes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [address, date, language]);

  return { prayerTimes, rawPrayerTimes, loading, error };
};
