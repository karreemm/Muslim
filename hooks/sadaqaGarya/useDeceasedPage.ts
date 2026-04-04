import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DeceasedPerson } from "../../app/(pages)/sadaqa-garya/types";

export default function useDeceasedPage(slug: string) {
  const router = useRouter();
  const [deceased, setDeceased] = useState<DeceasedPerson | null>(null);
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeceasedData = async () => {
    try {
      const response = await fetch(`/api/sadaqa-garya/${slug}`, {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        const data = (await response.json()) as { deceased: DeceasedPerson };
        setDeceased(data.deceased);
        setError(null);
        return;
      }

      setError("No deceased person data found");
      setDeceased(null);
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
    deceased,
    expandedSurah,
    loading,
    error,

    toggleSurahExpansion,
    goHome,
    retryLoading,

    isDeceasedFound: deceased !== null,
    hasError: error !== null,
  };
}
