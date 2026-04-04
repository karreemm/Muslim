"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosque } from "@fortawesome/free-solid-svg-icons";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
}

export default function Loading({ size = "md" }: LoadingProps) {
  const [showSpinnerRing, setShowSpinnerRing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinnerRing(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background dark:bg-background bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm">
      <div
        className={`flex flex-col items-center ${containerSizeClasses[size]} text-primary`}
      >
        <div className="relative">
          {showSpinnerRing && (
            <div className="absolute -inset-4 border-2 border-transparent border-t-primary/60 border-r-primary/40 rounded-full animate-spin" />
          )}

          <FontAwesomeIcon
            icon={faMosque}
            className={`${sizeClasses[size]} animate-pulse drop-shadow-lg`}
          />
        </div>
      </div>
    </div>
  );
}
