"use client";

import { useMemo, memo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import QuranPageRenderer from "./QuranPageRenderer";

interface QuranMultiPageRendererProps {
  verses: any[];
  fontSize: number;
  lineHeight: number;
}

const QuranMultiPageRenderer: React.FC<QuranMultiPageRendererProps> = memo(
  ({ verses, fontSize, lineHeight }) => {
    const searchParams = useSearchParams();
    const highlightedAyahNumber = parseInt(searchParams.get("ayah") || "0", 10);
    const [visiblePages, setVisiblePages] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadingMoreRef = useRef(false);
    const hasScrolledRef = useRef(false);

    const pages = useMemo(() => {
      if (!verses) return {};
      const groupedPages: Record<number, any[]> = {};
      verses.forEach((verse) => {
        const pageNum = verse.page_number;
        if (!groupedPages[pageNum]) {
          groupedPages[pageNum] = [];
        }
        groupedPages[pageNum].push(verse);
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

      return verse?.page_number || null;
    }, [highlightedAyahNumber, verses]);

    useEffect(() => {
      if (highlightedPage && sortedPageNumbers.length > 0) {
        const pageIndex = sortedPageNumbers.indexOf(highlightedPage.toString());
        if (pageIndex !== -1) {
          const pagesToLoad = Math.max(3, pageIndex + 2);
          setVisiblePages(pagesToLoad);
        }
      }
    }, [highlightedPage, sortedPageNumbers]);

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
      if (!highlightedPage) {
        setVisiblePages(3);
      }
    }, [verses, highlightedPage]);

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
              pageElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [highlightedPage, highlightedAyahNumber, visiblePages]);

    return (
      <div
        ref={containerRef}
        className="flex flex-col gap-8 w-full items-center"
      >
        {sortedPageNumbers.slice(0, visiblePages).map((pageNum) => (
          <div
            key={pageNum}
            id={`page-${pageNum}`}
            className="w-full flex justify-center"
          >
            <QuranPageRenderer
              verses={pages[parseInt(pageNum)]}
              fontSize={fontSize}
              lineHeight={lineHeight}
              pageNumber={parseInt(pageNum)}
              highlightedAyahNumber={
                parseInt(pageNum) === highlightedPage
                  ? highlightedAyahNumber
                  : 0
              }
            />
          </div>
        ))}
        {visiblePages < sortedPageNumbers.length && (
          <div className="w-full text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">...</p>
          </div>
        )}
      </div>
    );
  },
);

QuranMultiPageRenderer.displayName = "QuranMultiPageRenderer";

export default QuranMultiPageRenderer;
