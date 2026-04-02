"use client";

import { useEffect, useRef, useState } from "react";

export const MAIN_NAVBAR_HEIGHT = 64;

export function useMainNavbarVisibility() {
  const [isMainNavbarVisible, setIsMainNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < lastScrollY.current || currentY < 10) {
        setIsMainNavbarVisible(true);
      } else {
        setIsMainNavbarVisible(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isMainNavbarVisible;
}

export function useMainNavbarOffset() {
  const isMainNavbarVisible = useMainNavbarVisibility();
  return isMainNavbarVisible ? MAIN_NAVBAR_HEIGHT : 0;
}
