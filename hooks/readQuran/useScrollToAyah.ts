"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export const useScrollToAyah = (dataLength?: number) => {
  const searchParams = useSearchParams();
  const [refsReady, setRefsReady] = useState(false);
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const highlightedAyahNumber = parseInt(searchParams.get("ayah") || "0", 10);

  const setAyahRef = (ayahNumber: number) => (el: HTMLDivElement | null) => {
    ayahRefs.current[ayahNumber] = el;
  };

  useEffect(() => {
    if (dataLength && Object.keys(ayahRefs.current).length === dataLength) {
      setRefsReady(true);
    }
  }, [dataLength, ayahRefs.current]);

  useEffect(() => {
    if (refsReady && highlightedAyahNumber) {
      const element = document.getElementById(`ayah-${highlightedAyahNumber}`);
      console.log("highlightedAyahNumber:", highlightedAyahNumber);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.log("Element not found.");
      }
    }
  }, [refsReady, highlightedAyahNumber]);

  useEffect(() => {
    if (highlightedAyahNumber && ayahRefs.current[highlightedAyahNumber]) {
      const element = ayahRefs.current[highlightedAyahNumber];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedAyahNumber]);

  const scrollToAyah = (ayahNumber: number) => {
    const element = document.getElementById(`ayah-${ayahNumber}`) || 
                   ayahRefs.current[ayahNumber];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ 
        top: containerRef.current.scrollHeight, 
        behavior: "smooth" 
      });
    }
  };

  return {
    highlightedAyahNumber,
    ayahRefs,
    containerRef,
    refsReady,
    setAyahRef,
    scrollToAyah,
    scrollToTop,
    scrollToBottom,
  };
};