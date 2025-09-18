import { useEffect, useState } from "react";
import {
  fetchSurahByNumber,
  Surah,
} from "../../(Pages)/ListenQuran/Service/GetSurah";

export function useSurahData(surahNumber: number, reciterId: string) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedSurah = await fetchSurahByNumber(surahNumber, reciterId);

        if (fetchedSurah) {
          setSurah(fetchedSurah);
        } else {
          setSurah(null);
          setError("No surah found for the given number and reciterId.");
        }
      } catch (error) {
        console.error("Error fetching Surah:", error);
        setError("Failed to fetch surah data");
        setSurah(null);
      } finally {
        setLoading(false);
      }
    };

    if (surahNumber && reciterId) {
      fetchData();
    }
  }, [surahNumber, reciterId]);

  return {
    surah,
    loading,
    error,
    refetch: () => {
      if (surahNumber && reciterId) {
        const fetchData = async () => {
          try {
            setLoading(true);
            setError(null);
            const fetchedSurah = await fetchSurahByNumber(
              surahNumber,
              reciterId
            );
            setSurah(fetchedSurah || null);
          } catch (error) {
            console.error("Error refetching Surah:", error);
            setError("Failed to refetch surah data");
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    },
  };
}
