"use client";

import { useState, useEffect } from "react";

export const useQuranPageFont = (pageNumber: number | undefined) => {
  const [fontReady, setFontReady] = useState(false);

  const isSpecialPage = pageNumber === 1 || pageNumber === 2;
  const pageFontName = pageNumber ? `p${pageNumber}-font` : null;

  useEffect(() => {
    if (!pageNumber) {
      setFontReady(true);
      return;
    }

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
      .then(() => setFontReady(true))
      .catch(() => setFontReady(true));
  }, [pageNumber]);

  return { fontReady, pageFontName, isSpecialPage };
};
