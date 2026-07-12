import { useEffect, useState } from "react";
import {
  fetchAzkarItems,
  AzkarItem,
} from "../../app/(pages)/azkar/service/GetAzkar";

export function useAzkarData(categoryId: string, startingNumber: number) {
  const [azkarItems, setAzkarItems] = useState<AzkarItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const azkar = await fetchAzkarItems(categoryId, startingNumber);
        setAzkarItems(azkar);
        console.log(azkar);
      } catch (error) {
        console.error("Error fetching Azkar:", error);
        setError("Failed to fetch Azkar items");
        setAzkarItems(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startingNumber, categoryId]);

  return {
    azkarItems,
    loading,
    error,
    refetch: () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const azkar = await fetchAzkarItems(categoryId, startingNumber);
          setAzkarItems(azkar);
        } catch (error) {
          console.error("Error fetching Azkar:", error);
          setError("Failed to fetch Azkar items");
          setAzkarItems(null);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    },
  };
}
