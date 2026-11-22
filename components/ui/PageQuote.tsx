import type { RouteQuote } from "@/constants/routeQuotes";
import { cn } from "./cn";

export type PageQuoteProps = {
  quote: RouteQuote;
  className?: string;
};

export function PageQuote({ quote, className }: PageQuoteProps) {
  return (
    <figure className={cn("mx-auto mt-6 w-full", className)} dir="rtl">
      <blockquote className="quran-text flex items-center justify-center gap-2 text-center text-xl text-foreground md:text-2xl">
        <span aria-hidden className="shrink-0 select-none text-[1.35em] text-primary/70">
          ﴿
        </span>
        <span>{quote.text}</span>
        <span aria-hidden className="shrink-0 select-none text-[1.35em] text-primary/70">
          ﴾
        </span>
      </blockquote>
    </figure>
  );
}
