import React from "react";

export const AyahSearchCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex-1">
          <div className="h-6 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        <div className="h-7 w-16 bg-muted rounded-full"></div>
      </div>

      <div className="mb-5 space-y-3">
        <div className="h-8 bg-muted rounded w-full"></div>
        <div className="h-8 bg-muted rounded w-5/6"></div>
        <div className="h-8 bg-muted rounded w-4/5"></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="h-10 bg-muted rounded-lg w-28"></div>
        <div className="h-10 bg-muted rounded-lg w-24"></div>
        <div className="h-10 bg-muted rounded-lg w-28"></div>
        <div className="h-10 bg-muted rounded-lg w-32 ml-auto"></div>
      </div>
    </div>
  );
};
