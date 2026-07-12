"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
import { useZekrCounter } from "@/context/features/ZekrCounterContext";
import { toArabicNumber } from "@/utils/helpers";
import { useCallback, useState } from "react";

interface ZekrCounterProps {
  categoryId: string;
  number: number;
  totalCount: number;
}

export default function ZekrCounter({
  categoryId,
  number,
  totalCount,
}: ZekrCounterProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const { getCount, increment, isCompleted } = useZekrCounter();
  const [justTapped, setJustTapped] = useState(false);

  const current = getCount(categoryId, number);
  const completed = isCompleted(categoryId, number, totalCount);
  const progress = Math.min((current / totalCount) * 100, 100);

  const display = (value: number) =>
    isArabic ? toArabicNumber(value) : `${value}`;

  const handleClick = useCallback(() => {
    if (completed) return;
    increment(categoryId, number, totalCount);
    setJustTapped(true);
    setTimeout(() => setJustTapped(false), 250);
  }, [completed, increment, categoryId, number, totalCount]);

  const circumference = 2 * Math.PI * 8;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={completed}
      className={`group relative flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed ${
        completed
          ? "bg-primary/15 text-primary"
          : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
      }`}
      aria-label={isArabic ? "زيادة العداد" : "Increase count"}
    >
      {!completed && (
        <span className="pointer-events-none absolute inset-0 rounded-xl border-2 border-primary/0 animate-pulse-border" />
      )}

      <div
        className={`relative flex h-5 w-5 shrink-0 items-center justify-center ${
          !completed ? "animate-pulse-ring" : ""
        }`}
      >
        <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            opacity="0.15"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="hsl(var(--primary))"
            strokeWidth={completed ? 1.5 : 2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            className={`transition-all duration-500 ease-out ${
              !completed ? "animate-pulse-stroke" : ""
            } ${completed ? "opacity-100" : "opacity-80"}`}
          />
        </svg>

        <span
          className={`absolute inset-0 flex items-center justify-center ${
            !completed ? "animate-pulse-icon" : ""
          }`}
        >
          <FontAwesomeIcon
            icon={completed ? faCheck : faPlus}
            className={`transition-all duration-300 ${
              completed
                ? "text-[9px] text-primary"
                : "text-[8px] text-primary/80 group-hover:text-primary"
            }`}
          />
        </span>
      </div>

      <span className="flex items-baseline gap-1 tabular-nums">
        <span
          className={
            completed
              ? "text-primary font-bold"
              : "text-muted-foreground font-normal"
          }
        >
          {display(current)}
        </span>
        <span className="text-muted-foreground/60 text-[10px] font-normal">
          {isArabic ? "من" : "of"}
        </span>
        <span className="text-primary font-bold">{display(totalCount)}</span>
      </span>
    </button>
  );
}