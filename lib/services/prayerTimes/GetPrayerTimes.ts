import { fetchJson } from "@/lib/http";
import { logger } from "@/lib/logger";

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerTimesResponse {
  data: {
    timings: PrayerTimings;
  };
}

export const getPrayerTimes = async (
  city: string,
  country: string,
  date: string,
  latitude?: number,
  longitude?: number,
): Promise<PrayerTimings> => {
  try {
    let url: string;

    if (city && country) {
      const params = new URLSearchParams({
        city,
        country,
        method: "5",
      });
      url = `https://api.aladhan.com/v1/timingsByCity/${date}?${params.toString()}`;
    } else if (latitude !== undefined && longitude !== undefined) {
      const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        method: "5",
      });
      url = `https://api.aladhan.com/v1/timings/${date}?${params.toString()}`;
    } else {
      throw new Error("Could not determine location for prayer times");
    }

    const response = await fetchJson<PrayerTimesResponse>(url, {
      cache: "no-store",
    });

    return response.data.timings;
  } catch (error) {
    logger.error("Failed to fetch prayer times:", error);
    throw new Error("Failed to fetch prayer times");
  }
};
