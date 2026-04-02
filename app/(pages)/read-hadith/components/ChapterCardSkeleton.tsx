import React from "react";

export const ChapterCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card/50 border border-border/50 p-5 animate-pulse backdrop-blur-sm">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-shrink-0 w-12 h-12 bg-muted/50 rounded-xl"></div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-4 bg-muted/50 rounded-lg w-24"></div>

          <div className="space-y-2">
            <div className="h-4 bg-muted/50 rounded-lg w-full"></div>
            <div className="h-4 bg-muted/50 rounded-lg w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};