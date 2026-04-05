"use client";

import { useState, useEffect, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

interface PopoverPositionResult {
  contentRef: React.RefObject<HTMLDivElement>;
  left: number;
  top: number;
  isMobile: boolean;
  POPOVER_WIDTH: number;
}

export const useAyahPopoverPosition = (
  position: Position,
  isOpen: boolean,
): PopoverPositionResult => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [actualHeight, setActualHeight] = useState(220);
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (contentRef.current && isOpen) {
      const height = contentRef.current.getBoundingClientRect().height;
      setActualHeight(height);
    }
  }, [isOpen, viewport.width]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateViewport);
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateViewport);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("scroll", handleScroll, true);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const isMobile = viewport.width < 640;
  const POPOVER_WIDTH = Math.min(isMobile ? 280 : 320, viewport.width - 32);
  const MARGIN = 16;
  const VERTICAL_OFFSET = 12;

  const calculatePosition = () => {
    let left = position.x - POPOVER_WIDTH / 2;
    left = Math.max(MARGIN, Math.min(left, viewport.width - POPOVER_WIDTH - MARGIN));

    const spaceBelow = viewport.height - position.y - MARGIN;
    const spaceAbove = position.y - MARGIN;

    let top: number;

    if (spaceBelow >= actualHeight + VERTICAL_OFFSET) {
      top = position.y + VERTICAL_OFFSET;
    } else if (spaceAbove >= actualHeight + VERTICAL_OFFSET) {
      top = position.y - actualHeight - VERTICAL_OFFSET;
    } else {
      top = spaceBelow > spaceAbove
        ? viewport.height - actualHeight - MARGIN
        : MARGIN;
    }

    return { left, top };
  };

  const { left, top } = calculatePosition();

  return { contentRef, left, top, isMobile, POPOVER_WIDTH };
};