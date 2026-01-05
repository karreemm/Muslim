import { useEffect, useState } from "react";
import {
  fetchAzkarItem,
  AzkarItem,
} from "../../app/(pages)/azkar/service/GetAzkar";
import { AzkarCategories } from "@/constants/azkarData";

/**
 * Custom hook to manage fetching a single zekr item
 * @param categoryId - The category ID to fetch the zekr from
 * @param zekrNumber - The specific zekr number to fetch
 * @returns Object containing zekr data, zekr metadata, loading state, and error state
 */
export function useSingleZekr(categoryId: string, zekrNumber: number) {
  const [zekr, setZekr] = useState<AzkarItem | null>(null);
  const [zekrData, setZekrData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedZekr = await fetchAzkarItem(categoryId, zekrNumber);
        setZekr(fetchedZekr);
        console.log(fetchedZekr);
      } catch (error) {
        console.error("Error fetching Zekr:", error);
        setError("Failed to fetch Zekr");
        setZekr(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [zekrNumber, categoryId]);

  useEffect(() => {
    if (zekr) {
      const zekrr = AzkarCategories.find((b) => b.ar === zekr.category);
      setZekrData(zekrr);
    }
  }, [zekr]);

  return {
    zekr,
    zekrData,
    loading,
    error,
    refetch: () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const fetchedZekr = await fetchAzkarItem(categoryId, zekrNumber);
          setZekr(fetchedZekr);
        } catch (error) {
          console.error("Error fetching Zekr:", error);
          setError("Failed to fetch Zekr");
          setZekr(null);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    },
  };
}
