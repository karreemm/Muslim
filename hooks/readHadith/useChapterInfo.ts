import { useEffect, useState } from "react";
import type { HadithChapter } from "@/types/hadith";
import { getChapters } from "@/lib/services/readHadith/HadithApiService";

/** Resolves a chapter's name from the book's chapter list. */
export function useChapterInfo(bookSlug: string, chapterNumber: string) {
  const [chapter, setChapter] = useState<HadithChapter | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchChapter() {
      if (!bookSlug || !chapterNumber) return;

      try {
        const data = await getChapters(bookSlug, 500, 1);
        const chapters = Array.isArray(data) ? data : (data.chapters?.data ?? []);
        const match = chapters.find(
          (item) => Number(item.chapterNumber) === Number(chapterNumber),
        );
        if (active) setChapter(match ?? null);
      } catch {
        if (active) setChapter(null);
      }
    }

    fetchChapter();
    return () => {
      active = false;
    };
  }, [bookSlug, chapterNumber]);

  return chapter;
}
