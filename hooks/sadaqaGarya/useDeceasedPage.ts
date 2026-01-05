import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DeceasedPerson } from "../../types";
import { safeDecode } from "../../utils/encoding";

export default function useDeceasedPage(slug: string) {
  const router = useRouter();
  const [deceased, setDeceased] = useState<DeceasedPerson | null>(null);
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeceasedData = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedData = params.get("data");

      if (encodedData) {
        try {
          const decodedData = safeDecode(encodedData);
          setDeceased(decodedData);
          setError(null);
        } catch (error) {
          console.error("Error decoding URL data:", error);
          setError("Error loading deceased person data");
          setDeceased(null);
        }
      } else {
        setError("No deceased person data found");
        setDeceased(null);
      }
    } catch (error) {
      console.error("Error loading deceased data:", error);
      setError("Error loading deceased person data");
      setDeceased(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadDeceasedData();
    }
  }, [slug]);

  const toggleSurahExpansion = (index: number) => {
    setExpandedSurah(expandedSurah === index ? null : index);
  };

  const goHome = () => {
    router.push("/");
  };

  const retryLoading = () => {
    setLoading(true);
    setError(null);
    loadDeceasedData();
  };

  return {
    // State
    deceased,
    expandedSurah,
    loading,
    error,

    // Actions
    toggleSurahExpansion,
    goHome,
    retryLoading,

    // Computed values
    isDeceasedFound: deceased !== null,
    hasError: error !== null,
  };
}
