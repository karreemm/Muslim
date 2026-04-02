import React from "react";
import { useLanguage } from "@/context/general/LanguageContext";

export const HadithCardSkeleton: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card/50 border border-border/50 p-6 animate-pulse backdrop-blur-sm">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className={`absolute ${language === "ar" ? "left-4" : "right-4"} top-4 flex gap-2`}>
        <div className="w-9 h-9 bg-muted/50 rounded-xl"></div>
        <div className="w-9 h-9 bg-muted/50 rounded-xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-7 w-28 bg-muted/50 rounded-full"></div>
          <div className="h-7 w-20 bg-muted/50 rounded-full"></div>
        </div>

        <div className="mb-5 space-y-2">
          <div className="h-6 bg-muted/50 rounded-lg w-3/4"></div>
        </div>

        <div className="mb-5 space-y-3">
          <div className="h-5 bg-muted/50 rounded-lg w-full"></div>
          <div className="h-5 bg-muted/50 rounded-lg w-full"></div>
          <div className="h-5 bg-muted/50 rounded-lg w-5/6"></div>
          <div className="h-5 bg-muted/50 rounded-lg w-4/5"></div>
        </div>

        <div className="mt-5 pt-5 border-t border-border/30 space-y-3">
          <div className="h-5 bg-muted/50 rounded-lg w-2/3"></div>
          <div className="h-4 bg-muted/30 rounded-lg w-full"></div>
          <div className="h-4 bg-muted/30 rounded-lg w-full"></div>
          <div className="h-4 bg-muted/30 rounded-lg w-3/4"></div>
        </div>
      </div>
    </div>
  );
};