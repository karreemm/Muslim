"use client";

import React from "react";

export const AzkarCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card/50 border border-border/50 p-6 animate-pulse backdrop-blur-sm">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="h-6 w-24 bg-muted/50 rounded-full"></div>
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-muted/50 rounded-xl"></div>
          <div className="w-9 h-9 bg-muted/50 rounded-xl"></div>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="h-6 bg-muted/50 rounded-lg w-full"></div>
        <div className="h-6 bg-muted/50 rounded-lg w-[90%]"></div>
        <div className="h-6 bg-muted/50 rounded-lg w-[95%]"></div>
        <div className="h-6 bg-muted/50 rounded-lg w-[85%]"></div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="h-4 bg-muted/30 rounded-lg w-2/3 mx-auto"></div>
      </div>
    </div>
  );
};