import { useState, useEffect } from "react";

export default function useShareableUrl(slug: string) {
  const [shareableUrl, setShareableUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getShareableUrl = (currentSlug: string): string => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/sadaqa-garya/${currentSlug}`;
    }
    return `https://muslim-one.vercel.app/sadaqa-garya/${currentSlug}`;
  };

  useEffect(() => {
    const fetchShareableUrl = () => {
      setIsLoading(true);
      try {
        const url = getShareableUrl(slug);
        setShareableUrl(url);
      } catch (error) {
        console.error("Error generating shareable URL:", error);
        setShareableUrl(`https://muslim-one.vercel.app/sadaqa-garya/${slug}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchShareableUrl();
    }
  }, [slug]);

  const regenerateUrl = async () => {
    setIsLoading(true);
    try {
      const url = getShareableUrl(slug);
      setShareableUrl(url);
    } catch (error) {
      console.error("Error regenerating shareable URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    shareableUrl,
    isLoading,
    regenerateUrl,
  };
}
