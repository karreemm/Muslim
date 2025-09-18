import { useState, useEffect } from "react";
import { getLocation } from "../../(Pages)/PrayerTimes/Service/GetLocation";

export interface LocationData {
  en: { city: string; country: string };
  ar: { city: string; country: string };
}

export interface UsePrayerLocationReturn {
  address: LocationData | null;
  loading: boolean;
  error: string | null;
}

export const usePrayerLocation = (): UsePrayerLocationReturn => {
  const [address, setAddress] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      setLoading(true);
      setError(null);

      try {
        const location = await getLocation();
        setAddress({
          en: { city: location.city.en, country: location.country.en },
          ar: { city: location.city.ar, country: location.country.ar },
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  return { address, loading, error };
};
