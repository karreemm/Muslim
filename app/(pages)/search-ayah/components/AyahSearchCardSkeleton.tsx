import React from "react";

export const AyahSearchCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-slate-700">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-20"></div>
        </div>
        <div className="h-7 w-16 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
      </div>

      <div className="mb-5 space-y-3">
        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-5/6"></div>
        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-4/5"></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="h-10 bg-gray-300 dark:bg-slate-600 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-300 dark:bg-slate-600 rounded-lg w-24"></div>
        <div className="h-10 bg-gray-300 dark:bg-slate-600 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-300 dark:bg-slate-600 rounded-lg w-32 ml-auto"></div>
      </div>
    </div>
  );
};
