import { useEffect, useRef, useState } from "react";

interface WordRangeSelectionOptions {
  enabled: boolean;
  startWordIndex: number;
  endWordIndex: number;
  onStartWordIndexChange: (index: number) => void;
  onEndWordIndexChange: (index: number) => void;
}

export interface UseWordRangeSelectionReturn {
  normalizedSelectionStart: number;
  normalizedSelectionEnd: number;
  maxSelectableWordIndex: number;

  wordRefs: React.MutableRefObject<Array<HTMLSpanElement | null>>;

  activeHandle: "start" | "end" | null;

  handleSelectionPointerMove: (
    event: React.PointerEvent<HTMLDivElement>,
  ) => void;
  endSelectionDrag: () => void;
  startSelectionDrag: (
    event: React.PointerEvent<HTMLSpanElement>,
    handle: "start" | "end",
  ) => void;
  handleSelectableWordClick: (wordIndex: number) => void;
}

export function useWordRangeSelection(
  wordRangeSelection: WordRangeSelectionOptions | undefined,
  totalSelectableWords: number,
): UseWordRangeSelectionReturn {
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const dragHandleRef = useRef<"start" | "end" | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pendingPointRef = useRef<{ x: number; y: number } | null>(null);
  const [activeHandle, setActiveHandle] = useState<"start" | "end" | null>(
    null,
  );

  const maxSelectableWordIndex = Math.max(0, totalSelectableWords - 1);

  const normalizedSelectionStart = wordRangeSelection
    ? Math.max(
        0,
        Math.min(
          Math.min(
            wordRangeSelection.startWordIndex,
            wordRangeSelection.endWordIndex,
          ),
          maxSelectableWordIndex,
        ),
      )
    : 0;

  const normalizedSelectionEnd = wordRangeSelection
    ? Math.max(
        normalizedSelectionStart,
        Math.min(
          Math.max(
            wordRangeSelection.startWordIndex,
            wordRangeSelection.endWordIndex,
          ),
          maxSelectableWordIndex,
        ),
      )
    : 0;

  useEffect(() => {
    wordRefs.current = wordRefs.current.slice(0, totalSelectableWords);
  }, [totalSelectableWords]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeHandle) return;

    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [activeHandle]);

  const updateSelectedWordIndex = (
    handle: "start" | "end" | null,
    nextIndex: number,
  ) => {
    if (!wordRangeSelection || !handle || totalSelectableWords === 0) return;

    const clampedIndex = Math.max(
      0,
      Math.min(nextIndex, maxSelectableWordIndex),
    );

    if (handle === "start") {
      wordRangeSelection.onStartWordIndexChange(
        Math.min(clampedIndex, normalizedSelectionEnd),
      );
      return;
    }

    wordRangeSelection.onEndWordIndexChange(
      Math.max(clampedIndex, normalizedSelectionStart),
    );
  };

  const findClosestWordIndex = (x: number, y: number): number => {
    const directTarget = document.elementFromPoint(x, y);
    const directWord = directTarget?.closest("[data-word-range-index]");

    if (directWord instanceof HTMLElement) {
      const index = Number(directWord.dataset.wordRangeIndex);
      if (Number.isFinite(index)) return index;
    }

    const fallbackIndex =
      dragHandleRef.current === "start"
        ? normalizedSelectionStart
        : normalizedSelectionEnd;

    let closestLineY = 0;
    let closestLineYDist = Number.POSITIVE_INFINITY;

    wordRefs.current.forEach((element) => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const dy = Math.abs(centerY - y);
      if (dy < closestLineYDist) {
        closestLineYDist = dy;
        closestLineY = centerY;
      }
    });

    const LINE_TOLERANCE = 20;
    let nearestIndex = fallbackIndex;
    let smallestXDist = Number.POSITIVE_INFINITY;

    wordRefs.current.forEach((element, index) => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const centerX = rect.left + rect.width / 2;

      if (Math.abs(centerY - closestLineY) > LINE_TOLERANCE) return;

      const xDist = Math.abs(centerX - x);
      if (xDist < smallestXDist) {
        smallestXDist = xDist;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  const flushPendingPointer = () => {
    animationFrameRef.current = null;
    const point = pendingPointRef.current;
    pendingPointRef.current = null;

    if (!point || !dragHandleRef.current) return;
    const idx = findClosestWordIndex(point.x, point.y);
    updateSelectedWordIndex(dragHandleRef.current, idx);
  };

  const queuePointerUpdate = (x: number, y: number) => {
    pendingPointRef.current = { x, y };
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = requestAnimationFrame(flushPendingPointer);
  };

  const handleSelectionPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!dragHandleRef.current) return;
    queuePointerUpdate(event.clientX, event.clientY);
  };

  const endSelectionDrag = () => {
    dragHandleRef.current = null;
    setActiveHandle(null);
  };

  const startSelectionDrag = (
    event: React.PointerEvent<HTMLSpanElement>,
    handle: "start" | "end",
  ) => {
    event.preventDefault();
    event.stopPropagation();

    dragHandleRef.current = handle;
    setActiveHandle(handle);

    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);

    const onMove = (e: PointerEvent) => {
      queuePointerUpdate(e.clientX, e.clientY);
    };

    const onEnd = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointercancel", onEnd);
      endSelectionDrag();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onEnd);
    el.addEventListener("pointercancel", onEnd);

    queuePointerUpdate(event.clientX, event.clientY);
  };

  const handleSelectableWordClick = (wordIndex: number) => {
    if (!wordRangeSelection) return;

    if (wordIndex < normalizedSelectionStart) {
      wordRangeSelection.onStartWordIndexChange(wordIndex);
      return;
    }

    if (wordIndex > normalizedSelectionEnd) {
      wordRangeSelection.onEndWordIndexChange(wordIndex);
      return;
    }

    const distanceToStart = Math.abs(wordIndex - normalizedSelectionStart);
    const distanceToEnd = Math.abs(normalizedSelectionEnd - wordIndex);

    if (distanceToStart <= distanceToEnd) {
      wordRangeSelection.onStartWordIndexChange(wordIndex);
      return;
    }

    wordRangeSelection.onEndWordIndexChange(wordIndex);
  };

  return {
    normalizedSelectionStart,
    normalizedSelectionEnd,
    maxSelectableWordIndex,
    wordRefs,
    activeHandle,
    handleSelectionPointerMove,
    endSelectionDrag,
    startSelectionDrag,
    handleSelectableWordClick,
  };
}