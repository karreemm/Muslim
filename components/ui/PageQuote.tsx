"use client";

import { useQuranPageFont } from "@/hooks/readQuran/useQuranPageFont";
import type { RouteQuote } from "@/constants/routeQuotes";
import { cn } from "./cn";

export type PageQuoteProps = {
  quote: RouteQuote;
  className?: string;
};

const bracket = "select-none text-[1.15em] text-primary/70";
const bracketFont = "var(--font-amiri-quran), 'Amiri Quran', serif";

export function PageQuote({ quote, className }: PageQuoteProps) {
  const { fontReady, fontLoadTried, pageFontName } = useQuranPageFont(quote.page);
  const pageFont = fontReady && pageFontName ? `'${pageFontName}'` : null;
  const showFallback = !pageFont && fontLoadTried;

  const [firstWord = "", ...restWords] = quote.codeV2;
  const lastWord = restWords.length ? restWords[restWords.length - 1] : null;
  const middleWords = lastWord ? restWords.slice(0, -1) : [];

  return (
    <figure className={cn("mx-auto mt-6 w-full", className)} dir="rtl">
      {/* Start the page font download with the HTML, not after hydration. */}
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href={`/quran-fonts/p${quote.page}.woff2`}
        crossOrigin="anonymous"
      />
      <blockquote
        className={cn(
          "quran-text text-center text-2xl text-foreground md:text-3xl",
          !pageFont && !showFallback && "invisible",
        )}
        style={pageFont ? { fontFamily: pageFont } : undefined}
      >
        {pageFont ? (
          lastWord ? (
            <>
              <span aria-hidden className="whitespace-nowrap">
                <span className={bracket} style={{ fontFamily: bracketFont }}>
                  ﴿&nbsp;
                </span>
                <span className="inline-block">{firstWord}</span>
              </span>
              <wbr />
              {middleWords.map((word, index) => (
                <span key={index}>
                  <span className="inline-block">{word}</span>
                  <wbr />
                </span>
              ))}
              <span aria-hidden className="whitespace-nowrap">
                <span className="inline-block">{lastWord}</span>
                <span className={bracket} style={{ fontFamily: bracketFont }}>
                  &nbsp;﴾
                </span>
              </span>
            </>
          ) : (
            <span aria-hidden className="whitespace-nowrap">
              <span className={bracket} style={{ fontFamily: bracketFont }}>
                ﴿&nbsp;
              </span>
              <span className="inline-block">{firstWord}</span>
              <span className={bracket} style={{ fontFamily: bracketFont }}>
                &nbsp;﴾
              </span>
            </span>
          )
        ) : (
          <>
            <span aria-hidden className={bracket} style={{ fontFamily: bracketFont }}>
              ﴿&nbsp;
            </span>
            {quote.text}
            <span aria-hidden className={bracket} style={{ fontFamily: bracketFont }}>
              &nbsp;﴾
            </span>
          </>
        )}
      </blockquote>
      <span className="sr-only">{quote.text}</span>
    </figure>
  );
}
