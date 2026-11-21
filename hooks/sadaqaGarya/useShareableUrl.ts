import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/general/LanguageContext";
import { localizePath } from "@/lib/i18n";

export default function useShareableUrl(slug: string) {
  const { language } = useLanguage();
  const [shareableUrl, setShareableUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getShareableUrl = useCallback(
    (currentSlug: string): string => {
      const path = localizePath(language, `/sadaqa-garya/${currentSlug}`);

      if (typeof window !== "undefined") {
        return `${window.location.origin}${path}`;
      }

      return `https://muslim-one.vercel.app${path}`;
    },
    [language],
  );

  useEffect(() => {
    const fetchShareableUrl = () => {
      setIsLoading(true);
      try {
        setShareableUrl(getShareableUrl(slug));
      } catch (error) {
        console.error("Error generating shareable URL:", error);
        setShareableUrl(
          `https://muslim-one.vercel.app${localizePath(language, `/sadaqa-garya/${slug}`)}`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchShareableUrl();
    }
  }, [slug, language, getShareableUrl]);

  const regenerateUrl = async () => {
    setIsLoading(true);
    try {
      setShareableUrl(getShareableUrl(slug));
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
