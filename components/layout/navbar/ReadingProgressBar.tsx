"use client";

import { useEffect, useRef, useState } from "react";
import { useMainNavbarOffset } from "@/hooks/general/useMainNavbarOffset";

interface ReadingProgressBarProps {
  totalPages?: number;
  loadedPages?: number;
}

export default function ReadingProgressBar({
  totalPages,
  loadedPages,
}: ReadingProgressBarProps = {}) {
  const [progress, setProgress] = useState(0);
  const mainNavbarOffset = useMainNavbarOffset();
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalPagesRef = useRef(totalPages);
  const loadedPagesRef = useRef(loadedPages);

  useEffect(() => {
    totalPagesRef.current = totalPages;
    loadedPagesRef.current = loadedPages;
  }, [totalPages, loadedPages]);

  useEffect(() => {
    const compute = () => {
      const scrollTop = window.scrollY;
      const rawDocHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      let docHeight = rawDocHeight;
      const total = totalPagesRef.current;
      const loaded = loadedPagesRef.current;
      if (total && loaded && loaded > 0 && total > loaded && rawDocHeight > 0) {
        docHeight = rawDocHeight * (total / loaded);
      }
      return docHeight > 0
        ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
        : 0;
    };

    const onScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);

      setProgress(compute());
    };

    const resizeObserver = new ResizeObserver(() => {
      if (isScrollingRef.current) setProgress(compute());
    });
    resizeObserver.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    setProgress(compute());

    return () => {
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <div
      className="fixed left-0 right-0 z-30 h-1 bg-transparent transition-[top] duration-300 ease-in-out"
      style={{
        top: `calc(${mainNavbarOffset}px + var(--quran-reading-controls-height, 0px))`,
      }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-player-track-active transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
