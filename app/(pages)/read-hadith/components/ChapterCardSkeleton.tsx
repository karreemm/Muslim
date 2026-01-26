import React from "react";

export const ChapterCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-slate-700 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-300 dark:bg-slate-600 rounded-lg"></div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-24"></div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
