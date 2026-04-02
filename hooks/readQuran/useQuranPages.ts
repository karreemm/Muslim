"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuranAudio } from "@/context/features/QuranAudioContext";

export const useQuranPages = (
  verses: any[],
  onLoadedPagesChange?: (loadedPages: number, totalPages: number) => void,
) => {
  const searchParams = useSearchParams();
  const highlightedAyahNumber = parseInt(searchParams.get("ayah") || "0", 10);
  const {
    activeAyahIndex,
    surahNumber: audioSurahNumber,
    isPlayerVisible,
    scrollToAyahTrigger,
  } = useQuranAudio();
  const [visiblePages, setVisiblePages] = useState(3);
  const loadingMoreRef = useRef(false);
  const hasScrolledRef = useRef(false);

  const pages = useMemo(() => {
    if (!verses) return {} as Record<number, any[]>;

    const pageNumbersSet = new Set<number>();
    verses.forEach((verse) => {
      verse.words.forEach((word: any) => {
        if (word.page_number) pageNumbersSet.add(word.page_number);
      });
    });

    const pageNumbers = Array.from(pageNumbersSet).sort((a, b) => a - b);
    const groupedPages: Record<number, any[]> = {};
    pageNumbers.forEach((pageNum) => {
      groupedPages[pageNum] = verses;
    });

    return groupedPages;
  }, [verses]);

  const sortedPageNumbers = useMemo(() => {
    return Object.keys(pages).sort((a, b) => parseInt(a) - parseInt(b));
  }, [pages]);

  const highlightedPage = useMemo(() => {
    if (!verses || verses.length === 0) return null;

    if (isPlayerVisible && audioSurahNumber && activeAyahIndex !== undefined) {
      const targetAyahStr = (activeAyahIndex + 1).toString();
      const targetSurahStr = audioSurahNumber.toString();
      const verse = verses.find((v) => {
        if (!v.verse_key) return false;
        const [vSurah, vAyah] = v.verse_key.split(":");
        return vSurah === targetSurahStr && vAyah === targetAyahStr;
      });
      if (verse?.page_number) return verse.page_number;
    }

    if (highlightedAyahNumber) {
      const verse = verses.find(
        (v) => v.verse_key?.split(":")[1] === highlightedAyahNumber.toString(),
      );
      return verse?.page_number ?? null;
    }

    return null;
  }, [
    isPlayerVisible,
    audioSurahNumber,
    activeAyahIndex,
    highlightedAyahNumber,
    verses,
  ]);

  useEffect(() => {
    if (highlightedPage && sortedPageNumbers.length > 0) {
      const pageIndex = sortedPageNumbers.indexOf(highlightedPage.toString());
      if (pageIndex !== -1) {
        setVisiblePages(Math.max(3, pageIndex + 2));
      }
    }
  }, [highlightedPage, sortedPageNumbers]);

  useEffect(() => {
    if (!highlightedPage) {
      setVisiblePages(3);
    }
  }, [verses, highlightedPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMoreRef.current) return;

      const scrollPercentage =
        (window.scrollY + window.innerHeight) /
        document.documentElement.scrollHeight;

      if (scrollPercentage > 0.7 && visiblePages < sortedPageNumbers.length) {
        loadingMoreRef.current = true;
        requestAnimationFrame(() => {
          setVisiblePages((prev) =>
            Math.min(prev + 2, sortedPageNumbers.length),
          );
          loadingMoreRef.current = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePages, sortedPageNumbers.length]);

  useEffect(() => {
    if (onLoadedPagesChange) {
      const loaded = Math.min(visiblePages, sortedPageNumbers.length);
      onLoadedPagesChange(loaded, sortedPageNumbers.length);
    }
  }, [visiblePages, sortedPageNumbers, onLoadedPagesChange]);

  useEffect(() => {
    if (highlightedAyahNumber && highlightedPage && !hasScrolledRef.current) {
      const timer = setTimeout(() => {
        const ayahElement = document.getElementById(
          `ayah-${highlightedAyahNumber}`,
        );
        if (ayahElement) {
          hasScrolledRef.current = true;
          ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const pageElement = document.getElementById(
            `page-${highlightedPage}`,
          );
          if (pageElement) {
            hasScrolledRef.current = true;
            pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightedPage, highlightedAyahNumber, visiblePages]);

  useEffect(() => {
    if (
      isPlayerVisible &&
      audioSurahNumber &&
      activeAyahIndex !== undefined &&
      scrollToAyahTrigger > 0
    ) {
      let retries = 0;
      const targetAyah = activeAyahIndex + 1;
      const targetSurah = audioSurahNumber;

      const tryScroll = () => {
        const element = document.getElementById(
          `ayah-${targetAyah}-${targetSurah}`,
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (retries < 10) {
          retries++;
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
    }
  }, [scrollToAyahTrigger]);

  return {
    pages,
    sortedPageNumbers,
    visiblePages,
    highlightedAyahNumber,
    highlightedPage,
  };
};
