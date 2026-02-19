"use client";

import { useState, useEffect, RefObject } from "react";

interface DisplaySettings {
  fontSize: number;
  lineHeight: number;
}

const BASE_RATIO = 0.049;        
const LINE_HEIGHT_BASE = 1.75;
const LINE_HEIGHT_RATIO = 0.0002; 

export function useContainerFontSize(
  containerRef: RefObject<HTMLElement>,
  manualOffset: number = 0
): DisplaySettings & {
  increase: () => void;
  decrease: () => void;
  reset: () => void;
  manualOffset: number;
} {
  const [containerWidth, setContainerWidth] = useState(0);
  const [offset, setOffset] = useState(manualOffset);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [containerRef]);

  const baseFontSize = containerWidth > 0
    ? Math.round(containerWidth * BASE_RATIO)
    : 32;

  const fontSize = Math.max(8, baseFontSize + offset);
  const lineHeight = LINE_HEIGHT_BASE + containerWidth * LINE_HEIGHT_RATIO + (offset * 0.02);

  return {
    fontSize,
    lineHeight,
    manualOffset: offset,
    increase: () => setOffset(o => o + 2),
    decrease: () => setOffset(o => o - 2),
    reset: () => setOffset(0),
  };
}