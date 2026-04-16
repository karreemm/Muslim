"use client";

import { useState, useEffect, RefObject } from "react";

interface DisplaySettings {
  fontSize: number;
  lineHeight: number;
}

const BASE_RATIO = 0.046;
const LINE_HEIGHT_BASE = 1.75;
const LINE_HEIGHT_RATIO = 0.0002;

export function useContainerFontSize(
  containerRef: RefObject<HTMLElement>,
  manualOffset: number = 0,
  sizeMode: "width" | "min" = "width",
): DisplaySettings & {
  increase: () => void;
  decrease: () => void;
  reset: () => void;
  manualOffset: number;
} {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [offset, setOffset] = useState(manualOffset);

  useEffect(() => {
    setOffset(manualOffset);
  }, [manualOffset]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    setContainerHeight(el.getBoundingClientRect().height);

    return () => observer.disconnect();
  }, [containerRef]);

  const measurementBase =
    sizeMode === "min" && containerHeight > 0
      ? Math.min(containerWidth, containerHeight)
      : containerWidth;

  const baseFontSize =
    measurementBase > 0 ? Math.round(measurementBase * BASE_RATIO) : 32;

  const fontSize = Math.max(8, baseFontSize + offset);
  const lineHeight =
    LINE_HEIGHT_BASE + measurementBase * LINE_HEIGHT_RATIO + offset * 0.02;

  return {
    fontSize,
    lineHeight,
    manualOffset: offset,
    increase: () => setOffset((o) => o + 2),
    decrease: () => setOffset((o) => o - 2),
    reset: () => setOffset(0),
  };
}
