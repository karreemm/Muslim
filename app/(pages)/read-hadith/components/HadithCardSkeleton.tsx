import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const HadithCardSkeleton: React.FC = () => {
  const { language } = useLanguage();
  return (
    <div className="relative bg-card rounded-xl shadow-lg p-6 animate-pulse">
      <div
        className={`absolute ${language === "ar" ? "left-4" : "right-4"} top-4 flex gap-2`}
      >
        <div className="w-8 h-8 bg-muted rounded-full"></div>
        <div className="w-8 h-8 bg-muted rounded-full"></div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-32 bg-muted rounded-full"></div>
        <div className="h-7 w-20 bg-muted rounded-full"></div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="h-6 bg-muted rounded w-3/4"></div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="h-5 bg-muted rounded w-full"></div>
        <div className="h-5 bg-muted rounded w-full"></div>
        <div className="h-5 bg-muted rounded w-5/6"></div>
        <div className="h-5 bg-muted rounded w-4/5"></div>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-3">
        <div className="h-5 bg-muted rounded w-2/3"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    </div>
  );
};
