"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface AyahWheelPickerProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
  visibleCount?: number;
  className?: string;
  ariaLabel?: string;
}

const AyahWheelPicker: React.FC<AyahWheelPickerProps> = ({
  min,
  max,
  value,
  onChange,
  itemHeight = 44,
  visibleCount = 3,
  className = "",
  ariaLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [selected, setSelected] = useState<number>(
    Math.min(max, Math.max(min, value)),
  );

  const containerHeight = itemHeight * visibleCount;
  const pad = (containerHeight - itemHeight) / 2;

  const scrollToValue = useCallback(
    (val: number, animate = false) => {
      const el = containerRef.current;
      if (!el) return;
      const target = pad + (val - min) * itemHeight;
      isProgrammaticScroll.current = true;
      el.scrollTo({ top: target, behavior: animate ? "smooth" : "auto" });
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, animate ? 250 : 30);
    },
    [itemHeight, min, pad],
  );

  useLayoutEffect(() => {
    const clamped = Math.min(max, Math.max(min, value));
    setSelected(clamped);
    scrollToValue(clamped);
  }, [min, max]);

  useEffect(() => {
    const clamped = Math.min(max, Math.max(min, value));
    if (clamped !== selected) {
      setSelected(clamped);
      scrollToValue(clamped);
    }
  }, [value]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const raw = Math.round((el.scrollTop - pad) / itemHeight) + min;
      const next = Math.min(max, Math.max(min, raw));
      if (next !== selected) {
        setSelected(next);
        onChange(next);
      }
    });
  }, [itemHeight, min, pad, max, selected, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = Math.min(max, Math.max(min, selected + dir));
      setSelected(next);
      onChange(next);
      scrollToValue(next, true);
    }
  };

  const totalHeight = (max - min) * itemHeight + containerHeight;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        className="pointer-events-none absolute left-0 right-0 z-10 border-y border-primary/40 bg-primary/5"
        style={{ top: pad, height: itemHeight }}
      />
      <div
        ref={containerRef}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="h-full overflow-y-auto overflow-x-hidden no-scrollbar"
        style={{
          scrollSnapType: "y mandatory",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
          maskImage:
            "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
        }}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {Array.from({ length: max - min + 1 }, (_, i) => {
            const val = min + i;
            const distance = Math.abs(val - selected);
            const scale = distance === 0 ? 1.25 : distance === 1 ? 1.05 : 1;
            const opacity =
              distance === 0 ? 1 : distance === 1 ? 0.75 : distance === 2 ? 0.5 : 0.3;
            return (
              <div
                key={val}
                role="option"
                aria-selected={val === selected}
                className="flex items-center justify-center font-bold tabular-nums text-foreground transition-all duration-150"
                style={{
                  position: "absolute",
                  top: pad + i * itemHeight,
                  left: 0,
                  right: 0,
                  height: itemHeight,
                  scrollSnapAlign: "center",
                  transform: `scale(${scale})`,
                  opacity,
                  color: distance === 0 ? "hsl(var(--primary))" : undefined,
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AyahWheelPicker;
