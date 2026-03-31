import React from "react";

export const ChapterCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-lg shadow-md p-5 border border-border animate-pulse">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg"></div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-4 bg-muted rounded w-24"></div>

          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
