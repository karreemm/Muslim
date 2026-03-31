import React from "react";

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border-2 border-border animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-md"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/5"></div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-12 bg-muted rounded"></div>
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-12 bg-muted rounded"></div>
            <div className="h-3 w-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
