"use client";

import type { RouteQuote } from "@/constants/routeQuotes";
import { useLanguage } from "@/context/general/LanguageContext";
import { toArabicNumber } from "@/utils/helpers";
import { cn } from "./cn";

export type PageQuoteProps = {
  quote: RouteQuote;
  className?: string;
};

export function PageQuote({ quote, className }: PageQuoteProps) {
  const { language } = useLanguage();
  const reference =
    language === "ar"
      ? `${quote.surahNameAr} · ${toArabicNumber(quote.ayah)}`
      : `${quote.surahNameEn} · ${quote.ayah}`;

  return (
    <figure className={cn("mx-auto mt-6 max-w-2xl", className)} dir="rtl">
      <blockquote className="quran-text text-lg text-foreground md:text-xl">
        {quote.text}
      </blockquote>
      <figcaption className="mt-2 text-xs text-muted-foreground md:text-sm">
        {reference}
      </figcaption>
    </figure>
  );
}
