import { useState, useEffect } from "react";
import { getPrayerTimes } from "../../app/(pages)/prayer-times/service/GetPrayerTimes";
import moment from "moment-hijri";

export interface LocationData {
  city: { en: string; ar: string };
  country: { en: string; ar: string };
  latitude?: number;
  longitude?: number;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
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
  const [rawPrayerTimes, setRawPrayerTimes] = useState<PrayerTimings | null>(
    null
  );
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
          address.longitude
        );

        setRawPrayerTimes(timings);

        const formattedPrayerTimes: PrayerTimings = {
          Fajr: moment(timings.Fajr, "HH:mm").format("h:mm A"),
          Sunrise: moment(timings.Sunrise, "HH:mm").format("h:mm A"),
          Dhuhr: moment(timings.Dhuhr, "HH:mm").format("h:mm A"),
          Asr: moment(timings.Asr, "HH:mm").format("h:mm A"),
          Maghrib: moment(timings.Maghrib, "HH:mm").format("h:mm A"),
          Isha: moment(timings.Isha, "HH:mm").format("h:mm A"),
        };

        setPrayerTimes(formattedPrayerTimes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [address, date, language]);

  return { prayerTimes, rawPrayerTimes, loading, error };
};
