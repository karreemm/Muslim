"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export const useScrollToAyah = (dataLength?: number) => {
  const searchParams = useSearchParams();
  const [refsReady, setRefsReady] = useState(false);
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [refCount, setRefCount] = useState(0); 
  const hasScrolledRef = useRef(false);

  const highlightedAyahNumber = parseInt(searchParams.get("ayah") || "0", 10);

  console.log("=== useScrollToAyah Debug ===");
  console.log("highlightedAyahNumber:", highlightedAyahNumber);
  console.log("dataLength:", dataLength);
  console.log("refCount:", refCount);
  console.log("hasScrolledRef.current:", hasScrolledRef.current);
  console.log("Total refs in ayahRefs:", Object.keys(ayahRefs.current).length);
  console.log(
    "Available ayah numbers:",
    Object.keys(ayahRefs.current).join(", "),
  );

  const setAyahRef = (ayahNumber: number) => (el: HTMLDivElement | null) => {
    const prevEl = ayahRefs.current[ayahNumber];
    ayahRefs.current[ayahNumber] = el;

    console.log(`Setting ref for ayah ${ayahNumber}:`, !!el, "was:", !!prevEl);

    if (el && !prevEl) {
      console.log(`New ref for ayah ${ayahNumber}, incrementing refCount`);
      setRefCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (dataLength && Object.keys(ayahRefs.current).length === dataLength) {
      setRefsReady(true);
    }
  }, [dataLength, ayahRefs.current]);

  useEffect(() => {
    console.log("highlightedAyahNumber:", highlightedAyahNumber);
    console.log("hasScrolledRef.current:", hasScrolledRef.current);

    if (!highlightedAyahNumber || hasScrolledRef.current) {
      console.log("Skipping scroll - no highlight number or already scrolled");
      return;
    }

    const targetElement = ayahRefs.current[highlightedAyahNumber];
    console.log(
      "Target element for ayah",
      highlightedAyahNumber,
      ":",
      !!targetElement,
    );

    if (targetElement) {
      hasScrolledRef.current = true; 

      requestAnimationFrame(() => {
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          console.log("Scroll executed");
        }, 300); 
      });
    } else {
      console.log("❌ Target element not found yet");
    }
  }, [highlightedAyahNumber, refCount]); 

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [highlightedAyahNumber]);

  const scrollToAyah = (ayahNumber: number) => {
    const element =
      document.getElementById(`ayah-${ayahNumber}`) ||
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
        behavior: "smooth",
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
