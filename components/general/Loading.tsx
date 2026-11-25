"use client";

import { LoadingMark } from "@/components/ui/LoadingMark";

/** Full-screen loading overlay used by route loading files and data views. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <LoadingMark />
    </div>
  );
}
