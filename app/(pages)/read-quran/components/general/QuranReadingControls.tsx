"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useMainNavbarOffset } from "@/hooks/general/useMainNavbarOffset";
import { hidePopover, showPopover } from "@/utils/helpers";

type NeighborNav = {
  href: string;
  title: string;
  popoverId?: string;
};

interface QuranReadingControlsProps {
  language: string;
  title: string;
  playLabel: string;
  onPlay: () => void;
  playDisabled?: boolean;
  previousLabel: string;
  nextLabel: string;
  previous?: NeighborNav;
  next?: NeighborNav;
  playVariant?: "primary" | "accent";
}

export default function QuranReadingControls({
  language,
  title,
  playLabel,
  onPlay,
  playDisabled = false,
  previousLabel,
  nextLabel,
  previous,
  next,
  playVariant = "primary",
}: QuranReadingControlsProps) {
  const mainNavbarOffset = useMainNavbarOffset();
  const controlsRef = useRef<HTMLDivElement>(null);
  const isArabic = language === "ar";

  useEffect(() => {
    const root = document.documentElement;
    const updateHeight = () => {
      const height = controlsRef.current?.offsetHeight ?? 0;
      root.style.setProperty("--quran-reading-controls-height", `${height}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (controlsRef.current) observer.observe(controlsRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
      root.style.removeProperty("--quran-reading-controls-height");
    };
  }, []);

  const playButtonClass =
    playVariant === "accent"
      ? "bg-accent text-accent-foreground shadow-accent/25 hover:shadow-accent/30"
      : "bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/30";

  return (
    <div
      ref={controlsRef}
      className="sticky z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-[top] duration-300 ease-out"
      style={{ top: `${mainNavbarOffset}px` }}
    >
      <div className="w-[92%] max-w-7xl mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {previous && (
              <Link
                href={previous.href}
                className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                onMouseEnter={() =>
                  previous.popoverId && showPopover(previous.popoverId)
                }
                onMouseLeave={() =>
                  previous.popoverId && hidePopover(previous.popoverId)
                }
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-all group-hover:border-primary/30 group-hover:bg-primary/10">
                  <FontAwesomeIcon
                    icon={isArabic ? faArrowRight : faArrowLeft}
                    className="text-sm"
                  />
                </div>
                <div className="hidden text-left sm:block">
                  <span className="block text-xs text-muted-foreground">
                    {previousLabel}
                  </span>
                  <span className="dynamic-font font-semibold">
                    {previous.title}
                  </span>
                </div>
              </Link>
            )}
          </div>

          <div className="flex justify-center items-center gap-3">
            <h1 className="dynamic-font text-center text-2xl font-bold text-foreground sm:text-3xl">
              {title}
            </h1>
            <button
              onClick={onPlay}
              disabled={playDisabled}
              className={`group inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${playButtonClass}`}
            >
              <FontAwesomeIcon icon={faPlay} className="text-xs" />
              <span className="hidden lg:inline-block">{playLabel}</span>
            </button>
          </div>

          <div className="flex flex-1 justify-end">
            {next && (
              <Link
                href={next.href}
                className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                onMouseEnter={() =>
                  next.popoverId && showPopover(next.popoverId)
                }
                onMouseLeave={() =>
                  next.popoverId && hidePopover(next.popoverId)
                }
              >
                <div className="hidden text-right sm:block">
                  <span className="block text-xs text-muted-foreground">
                    {nextLabel}
                  </span>
                  <span className="dynamic-font font-semibold">
                    {next.title}
                  </span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-all group-hover:border-primary/30 group-hover:bg-primary/10">
                  <FontAwesomeIcon
                    icon={isArabic ? faArrowLeft : faArrowRight}
                    className="text-sm"
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
