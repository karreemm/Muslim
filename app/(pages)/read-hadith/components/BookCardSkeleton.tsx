import React from "react";

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-gray-200 dark:border-slate-700 animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-4/5"></div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-12 bg-gray-300 dark:bg-slate-600 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 dark:bg-slate-600 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-12 bg-gray-300 dark:bg-slate-600 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 dark:bg-slate-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
