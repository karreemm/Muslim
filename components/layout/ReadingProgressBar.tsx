"use client";

import { useEffect, useRef, useState } from "react";

interface ReadingProgressBarProps {
  totalPages?: number;
  loadedPages?: number;
}

export default function ReadingProgressBar({
  totalPages,
  loadedPages,
}: ReadingProgressBarProps = {}) {
  const [progress, setProgress] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
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
      const currentY = window.scrollY;

      if (currentY < lastScrollY.current || currentY < 10) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
      lastScrollY.current = currentY;

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
      className="fixed left-0 right-0 z-50 h-1 bg-transparent transition-[top] duration-300 ease-in-out"
      style={{ top: isNavVisible ? "64px" : "0px" }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}