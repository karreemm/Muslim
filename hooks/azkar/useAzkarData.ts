import { useEffect, useState } from "react";
import {
  fetchThreeAzkarItems,
  AzkarItem,
} from "../../app/(pages)/azkar/service/GetAzkar";

/**
 * Custom hook to manage fetching multiple azkar items
 * @param categoryId - The category ID to fetch azkar from
 * @param startingNumber - The starting number for pagination
 * @returns Object containing azkar items, loading state, and error state
 */
export function useAzkarData(categoryId: string, startingNumber: number) {
  const [azkarItems, setAzkarItems] = useState<AzkarItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const azkar = await fetchThreeAzkarItems(categoryId, startingNumber);
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
          const azkar = await fetchThreeAzkarItems(categoryId, startingNumber);
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
