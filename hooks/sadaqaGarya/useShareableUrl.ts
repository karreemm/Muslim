import { useState, useEffect } from "react";
import { useSadaqaGarya } from "../../context/features/SadaqatContext";
import { safeEncode } from "../../utils/encoding";

export default function useShareableUrl(slug: string) {
  const { getDeceasedPerson } = useSadaqaGarya();
  const [shareableUrl, setShareableUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const shortenURL = async (url: string): Promise<string | undefined> => {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${url}`,
      );
      const shortUrl = await response.text();
      console.log("Short URL:", shortUrl);
      return shortUrl;
    } catch (error) {
      console.error("Error shortening URL:", error);
      return undefined;
    }
  };

  const getShareableUrl = async (slug: string): Promise<string> => {
    const person = getDeceasedPerson(slug);
    if (person) {
      const encodedData = safeEncode(person);
      const shortenedUrl = await shortenURL(
        `https://muslim-one.vercel.app/sadaqa-garya/${slug}?data=${encodedData}`,
      );
      return (
        shortenedUrl || `https://muslim-one.vercel.app/sadaqa-garya/${slug}`
      );
    }
    return `https://muslim-one.vercel.app/sadaqa-garya/${slug}`;
  };

  useEffect(() => {
    const fetchShareableUrl = async () => {
      setIsLoading(true);
      try {
        const url = await getShareableUrl(slug);
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
      const url = await getShareableUrl(slug);
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
