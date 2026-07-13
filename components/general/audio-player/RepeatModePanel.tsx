"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRepeat,
  faInfinity,
  faXmark,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AyahWheelPicker from "./AyahWheelPicker";
import {
  RepeatConfig,
  RepeatRangeMode,
  RepeatsPerAyah,
  OnRangeComplete,
  REPEAT_REPEATS_OPTIONS,
  PLAYBACK_SPEED_OPTIONS,
  loadRepeatSettings,
  saveRepeatSettings,
} from "./types";

interface RepeatModePanelProps {
  language: string;
  totalAyahs: number;
  currentAyahIndex: number;
  initialStartAyah?: number;
  initialMode?: RepeatRangeMode;
  openEndPicker?: boolean;
  onStart: (config: RepeatConfig) => void;
  onClose: () => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
}

const RepeatModePanel: React.FC<RepeatModePanelProps> = ({
  language,
  totalAyahs,
  currentAyahIndex,
  initialStartAyah,
  initialMode,
  openEndPicker,
  onStart,
  onClose,
  playbackRate,
  onChangePlaybackRate,
}) => {
  const isArabic = language === "ar";
  const txt = (ar: string, en: string) => (isArabic ? ar : en);

  const canCustom = totalAyahs >= 2;

  const persisted = useMemo(() => loadRepeatSettings(), []);

  const [rangeMode, setRangeMode] = useState<RepeatRangeMode>(
    !canCustom ? "this" : initialMode ?? "custom",
  );
  const [startAyah, setStartAyah] = useState<number>(
    Math.min(totalAyahs, Math.max(1, initialStartAyah ?? currentAyahIndex + 1)),
  );
  const [endAyah, setEndAyah] = useState<number>(
    Math.min(totalAyahs, (initialStartAyah ?? currentAyahIndex + 1) + 1),
  );
  const [repeatsPerAyah, setRepeatsPerAyah] =
    useState<RepeatsPerAyah>(persisted.repeatsPerAyah);
  const [onRangeComplete, setOnRangeComplete] =
    useState<OnRangeComplete>(persisted.onRangeComplete);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(
    openEndPicker ?? false,
  );

  useEffect(() => {
    saveRepeatSettings({ repeatsPerAyah, onRangeComplete });
  }, [repeatsPerAyah, onRangeComplete]);

  const handleModeChange = (mode: RepeatRangeMode) => {
    setRangeMode(mode);
    if (mode === "this") {
      const ayah = currentAyahIndex + 1;
      setStartAyah(ayah);
      setEndAyah(ayah);
    } else {
      const start = Math.min(totalAyahs - 1, Math.max(1, currentAyahIndex + 1));
      setStartAyah(start);
      setEndAyah(Math.min(totalAyahs, start + 1));
      setShowEndPicker(true);
    }
  };

  const handleStartChange = (next: number) => {
    const clamped = Math.min(totalAyahs - 1, Math.max(1, next));
    setStartAyah(clamped);
    if (endAyah <= clamped) {
      setEndAyah(Math.min(totalAyahs, clamped + 1));
    }
  };

  const applyWholeSurah = () => {
    setRangeMode("custom");
    setStartAyah(1);
    setEndAyah(totalAyahs);
    setShowEndPicker(true);
  };

  const startRepeat = () => {
    onStart({
      startAyah,
      endAyah,
      repeatsPerAyah,
      onRangeComplete,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FontAwesomeIcon icon={faRepeat} className="text-xs" />
          </div>
          <span className="text-sm font-bold text-foreground">
            {txt("وضع التكرار (الحفظ)", "Repeat Mode")}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label={txt("إغلاق", "Close")}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xs" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
          {(["this", "custom"] as RepeatRangeMode[]).map((mode) => (
            <button
              key={mode}
              disabled={mode === "custom" && !canCustom}
              onClick={() => handleModeChange(mode)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                rangeMode === mode
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              } ${mode === "custom" && !canCustom ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {mode === "this"
                ? txt("هذه الآية", "This Ayah")
                : txt("آيات", "Ayahs")}
            </button>
          ))}
        </div>

        {rangeMode === "this" ? (
          <p className="text-xs text-muted-foreground text-center px-2">
            {txt(
              `سيتم تكرار الآية ${startAyah} وحدها.`,
              `Ayah ${startAyah} will be repeated on its own.`,
            )}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
                {txt("من الآية", "Start Ayah")}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartChange(startAyah - 1)}
                  disabled={startAyah <= 1}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faMinus} className="text-xs" />
                </button>
                <div className="flex-1 h-9 rounded-lg bg-muted flex items-center justify-center font-bold text-base tabular-nums text-foreground">
                  {startAyah}
                </div>
                <button
                  onClick={() => handleStartChange(startAyah + 1)}
                  disabled={startAyah >= totalAyahs - 1}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-xs" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {txt("إلى الآية", "End Ayah")}
                </p>
                <button
                  onClick={applyWholeSurah}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  {txt("السورة كاملة", "Whole Surah")}
                </button>
              </div>
              {!showEndPicker ? (
                <button
                  onClick={() => setShowEndPicker(true)}
                  className="w-full h-12 rounded-xl bg-muted/60 hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="tabular-nums font-bold text-primary">
                    {endAyah}
                  </span>
                  <span className="text-muted-foreground">
                    {txt("اختر الآية", "Tap to pick")}
                  </span>
                </button>
              ) : (
                <div className="rounded-xl bg-muted/40 py-1">
                  <AyahWheelPicker
                    min={startAyah + 1}
                    max={totalAyahs}
                    value={endAyah}
                    onChange={setEndAyah}
                    ariaLabel={txt("اختر الآية الأخيرة", "Pick end ayah")}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
            {txt("تكرار لكل آية", "Repeats per Ayah")}
          </p>
          <div className="flex gap-1.5">
            {REPEAT_REPEATS_OPTIONS.map((r) => (
              <button
                key={String(r)}
                onClick={() => setRepeatsPerAyah(r)}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                  repeatsPerAyah === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-foreground hover:bg-secondary"
                }`}
              >
                {r === Infinity ? (
                  <FontAwesomeIcon icon={faInfinity} className="text-base" />
                ) : (
                  r
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
            {txt("عند انتهاء النطاق", "When Range Finishes")}
          </p>
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
            {(["stop", "loop"] as OnRangeComplete[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setOnRangeComplete(opt)}
                className={`py-2 rounded-lg text-xs font-medium transition-all ${
                  onRangeComplete === opt
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt === "stop"
                  ? txt("إيقاف", "Stop")
                  : txt("تكرار النطاق", "Loop Range")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
            {txt("سرعة التشغيل", "Playback Speed")}
          </p>
          <div className="flex gap-1.5">
            {PLAYBACK_SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onChangePlaybackRate(s)}
                className={`flex-1 h-9 rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${
                  playbackRate === s
                    ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "bg-muted text-foreground hover:bg-secondary"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startRepeat}
          className="mt-1 w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          {txt("ابدأ التكرار", "Start Repeat")}
        </button>
      </div>
    </div>
  );
};

export default RepeatModePanel;
