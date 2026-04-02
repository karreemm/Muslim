import React from "react";

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card/50 border border-border/50 p-6 animate-pulse backdrop-blur-sm">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex flex-col gap-5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 bg-muted/50 rounded-xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-7 bg-muted/50 rounded-lg w-3/4"></div>
            <div className="h-4 bg-muted/50 rounded-lg w-1/2"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-muted/50 rounded-lg w-full"></div>
          <div className="h-4 bg-muted/50 rounded-lg w-5/6"></div>
          <div className="h-4 bg-muted/50 rounded-lg w-4/5"></div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border/30">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-14 bg-muted/50 rounded-lg"></div>
            <div className="h-3 w-16 bg-muted/30 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-14 bg-muted/50 rounded-lg"></div>
            <div className="h-3 w-16 bg-muted/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};