import React from "react";

export const AyahSearchCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card/50 border border-border/50 p-6 animate-pulse backdrop-blur-sm">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted/50"></div>
            <div>
              <div className="h-5 bg-muted/50 rounded-lg w-32 mb-2"></div>
              <div className="h-3 bg-muted/30 rounded w-20"></div>
            </div>
          </div>
          <div className="h-7 w-16 bg-muted/50 rounded-full"></div>
        </div>

        <div className="mb-6 space-y-2">
          <div className="h-8 bg-muted/50 rounded-lg w-full"></div>
          <div className="h-8 bg-muted/50 rounded-lg w-5/6 mx-auto"></div>
          <div className="h-8 bg-muted/50 rounded-lg w-4/5 mx-auto"></div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="h-10 bg-muted/50 rounded-xl w-28"></div>
          <div className="h-10 bg-muted/50 rounded-xl w-24"></div>
          <div className="h-10 bg-muted/50 rounded-xl w-28"></div>
          <div className="h-10 bg-muted/50 rounded-xl w-32 ml-auto"></div>
        </div>
      </div>
    </div>
  );
};