"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosque } from "@fortawesome/free-solid-svg-icons";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
}

export default function Loading({ size = "md" }: LoadingProps) {

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const containerSizeClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF5E4] dark:bg-slate-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm">
      <div className={`flex flex-col items-center ${containerSizeClasses[size]} text-teal-600 dark:text-teal-400`}>
        <div className="relative">
          <div className="absolute -inset-4 border-2 border-transparent border-t-teal-300 dark:border-t-teal-500 border-r-teal-200 dark:border-r-teal-600 rounded-full animate-spin"></div>

          <FontAwesomeIcon
            icon={faMosque}
            className={`${sizeClasses[size]} animate-pulse drop-shadow-lg`}
          />
        </div>
      </div>
    </div>
  );
}