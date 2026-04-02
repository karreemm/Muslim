"use client";

import React from "react";

export const ReciterCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card/50 border border-border/50 p-5 animate-pulse backdrop-blur-sm">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-xl bg-muted/50 flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted/50 rounded-lg w-24"></div>
          <div className="h-6 bg-muted/50 rounded-lg w-3/4"></div>
        </div>
      </div>
    </div>
  );
};