"use client";

import { useState, useEffect } from "react";

export const useQuranPageFont = (pageNumber: number | undefined) => {
  const [fontReady, setFontReady] = useState(false);
  const [fontLoadTried, setFontLoadTried] = useState(false);

  const isSpecialPage = pageNumber === 1 || pageNumber === 2;
  const pageFontName = pageNumber ? `p${pageNumber}-font` : null;

  useEffect(() => {
    if (!pageNumber) {
      setFontReady(true);
      setFontLoadTried(true);
      return;
    }

    let isMounted = true;
    setFontReady(false);
    setFontLoadTried(false);

    const fontName = `p${pageNumber}-font`;
    const fontUrl = `/quran-fonts/p${pageNumber}.woff2`;
    const styleId = `quran-font-${pageNumber}`;

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `@font-face { font-family: '${fontName}'; src: url('${fontUrl}') format('woff2'); font-display: swap; }`;
      document.head.appendChild(style);
    }

    document.fonts
      .load(`1em ${fontName}`)
      .then((loadedFonts) => {
        if (!isMounted) return;

        const isLoaded =
          loadedFonts.length > 0 || document.fonts.check(`1em ${fontName}`);
        setFontReady(isLoaded);
        setFontLoadTried(true);
      })
      .catch(() => {
        if (!isMounted) return;

        setFontReady(false);
        setFontLoadTried(true);
      });

    return () => {
      isMounted = false;
    };
  }, [pageNumber]);

  return { fontReady, fontLoadTried, pageFontName, isSpecialPage };
};

export const useQuranFontPrefetch = (pageNumber: number | undefined) => {
  useEffect(() => {
    if (!pageNumber || typeof window === "undefined") return;

    const attribute = `data-quran-font-prefetch-${pageNumber}`;
    if (document.head.querySelector(`link[${attribute}]`)) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let link: HTMLLinkElement | null = null;

    const addPrefetch = () => {
      link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "font";
      link.type = "font/woff2";
      link.href = `/quran-fonts/p${pageNumber}.woff2`;
      link.crossOrigin = "anonymous";
      link.setAttribute(attribute, "");
      document.head.appendChild(link);
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(addPrefetch, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    timeoutId = setTimeout(addPrefetch, 250);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      link?.remove();
    };
  }, [pageNumber]);
};
