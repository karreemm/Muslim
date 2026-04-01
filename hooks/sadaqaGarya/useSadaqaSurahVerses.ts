"use client";

import { useEffect, useState } from "react";

export interface SadaqaQuranWord {
  id: number;
  position: number;
  text_uthmani: string;
  code_v2: string;
  line_number: number;
  page_number: number;
  char_type_name: string;
}

export interface SadaqaQuranVerse {
  id: number;
  verse_key: string;
  words: SadaqaQuranWord[];
}

export interface SadaqaSurahConfig {
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  showBasmala: boolean;
}

export const SADAQA_SURAH_CONFIG: SadaqaSurahConfig[] = [
  { surahNumber: 1, startAyah: 1, endAyah: 7, showBasmala: false },
  { surahNumber: 2, startAyah: 1, endAyah: 5, showBasmala: true },
  { surahNumber: 2, startAyah: 285, endAyah: 286, showBasmala: false },
  { surahNumber: 112, startAyah: 1, endAyah: 4, showBasmala: true },
  { surahNumber: 36, startAyah: 1, endAyah: 83, showBasmala: true },
];

const uniqueSurahNumbers = Array.from(
  new Set(SADAQA_SURAH_CONFIG.map((cfg) => cfg.surahNumber)),
);

export default function useSadaqaSurahVerses() {
  const [versesByCard, setVersesByCard] = useState<
    Record<number, SadaqaQuranVerse[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchVerses = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          uniqueSurahNumbers.map(async (surahNumber) => {
            const response = await fetch(
              `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?words=true&word_fields=text_uthmani,code_v2,line_number,page_number&per_page=1000`,
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch surah ${surahNumber}`);
            }

            const data = await response.json();
            return {
              surahNumber,
              verses: (data.verses || []) as SadaqaQuranVerse[],
            };
          }),
        );

        if (!isMounted) return;

        const bySurah = new Map<number, SadaqaQuranVerse[]>();
        results.forEach(({ surahNumber, verses }) => {
          bySurah.set(surahNumber, verses);
        });

        const nextByCard: Record<number, SadaqaQuranVerse[]> = {};

        SADAQA_SURAH_CONFIG.forEach((cfg, index) => {
          const surahVerses = bySurah.get(cfg.surahNumber) || [];
          nextByCard[index] = surahVerses.filter((verse) => {
            const ayahNumber = Number(verse.verse_key.split(":")[1] || 0);
            return ayahNumber >= cfg.startAyah && ayahNumber <= cfg.endAyah;
          });
        });

        setVersesByCard(nextByCard);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load verses");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVerses();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    versesByCard,
    loading,
    error,
  };
}
