"use client";

import styles from "@/app/styles/modules/AudioPlayer.module.css";

interface AudioPlayerProgressBarProps {
  progressRef: React.RefObject<HTMLInputElement>;
  currentTime: number;
  duration: number;
  formatTime: (value: number) => string;
  progressPercentage: number;
  onChange: (value: number) => void;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onJumpToAyah: () => void;
}

export default function AudioPlayerProgressBar({
  progressRef,
  currentTime,
  duration,
  formatTime,
  progressPercentage,
  onChange,
  onPointerDown,
  onPointerUp,
  onTouchStart,
  onTouchEnd,
  onJumpToAyah,
}: AudioPlayerProgressBarProps) {
  return (
    <div className="px-4 pt-2 pb-1 max-w-7xl mx-auto w-full">
      <div dir="ltr" className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground min-w-[40px] tabular-nums hidden sm:block">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 relative group h-5 flex items-center">
          <input
            ref={progressRef}
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              onChange(parseFloat(e.target.value));
            }}
            onMouseDown={() => {
              onPointerDown();
            }}
            onMouseUp={() => {
              onPointerUp();
              onJumpToAyah();
            }}
            onTouchStart={() => {
              onTouchStart();
            }}
            onTouchEnd={() => {
              onTouchEnd();
              onJumpToAyah();
            }}
            className={`w-full h-1.5 sm:h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary ${styles.audioSlider} transition-all`}
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPercentage}%, hsl(var(--muted)) ${progressPercentage}%, hsl(var(--muted)) 100%)`,
            }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground min-w-[40px] text-right tabular-nums hidden sm:block">
          {formatTime(duration)}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground min-w-[40px] text-right tabular-nums sm:hidden">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
}
