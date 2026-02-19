"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export const useQuranPages = (
  verses: any[],
  onLoadedPagesChange?: (loadedPages: number, totalPages: number) => void,
) => {
  const searchParams = useSearchParams();
  const highlightedAyahNumber = parseInt(searchParams.get("ayah") || "0", 10);
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
    if (!highlightedAyahNumber || !verses) return null;
    const verse = verses.find(
      (v) => v.verse_key.split(":")[1] === highlightedAyahNumber.toString(),
    );
    return verse?.page_number ?? null;
  }, [highlightedAyahNumber, verses]);

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

  return {
    pages,
    sortedPageNumbers,
    visiblePages,
    highlightedAyahNumber,
    highlightedPage,
  };
};
