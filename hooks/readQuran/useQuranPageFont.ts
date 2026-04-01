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
      style.innerHTML = `@font-face { font-family: '${fontName}'; src: url('${fontUrl}') format('woff2'); }`;
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
