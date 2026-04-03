"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faRotateRight,
  faBullseye,
  faHandsPraying,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../context/general/LanguageContext";
import { useTasbeeh } from "../../../context/features/TasbeehContext";
import { toArabicNumber, toEnglishNumber } from "../../../utils/helpers";
import GoalCelebration from "./GoalCelebration";
import { useTranslation } from "@/hooks/general/useTranslation";

const Counter = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const {
    count,
    goal,
    inputValue,
    incrementCount,
    decrementCount,
    setGoalAndResetCount,
    setInputValue,
    resetAll,
  } = useTasbeeh();

  const [isButtonUpClicked, setIsButtonUpClicked] = useState(false);
  const [isButtonDownClicked, setIsButtonDownClicked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = goal > 0 ? Math.min((count / goal) * 100, 100) : 0;
    setProgress(percentage);
  }, [count, goal]);

  const handleUp = useCallback(() => {
    if (count >= 999999) return;
    setIsButtonUpClicked(true);
    incrementCount();
    setTimeout(() => setIsButtonUpClicked(false), 150);
  }, [count, incrementCount]);

  const handleDown = useCallback(() => {
    if (count === 0) return;
    setIsButtonDownClicked(true);
    decrementCount();
    setTimeout(() => setIsButtonDownClicked(false), 150);
  }, [count, decrementCount]);

  useEffect(() => {
    if (count === goal && goal !== 0 && goal > 0) {
      setShowCelebration(true);
    }
  }, [count, goal]);

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    resetAll();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const num = parseInt(toEnglishNumber(val)) || 0;
    if (num >= 0 && num <= 999999) {
      setGoalAndResetCount(num);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "Enter") {
        e.preventDefault();
        handleUp();
      } else if (e.code === "ArrowDown" || e.code === "Backspace") {
        e.preventDefault();
        handleDown();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        resetAll();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUp, handleDown, resetAll]);

  return (
    <div className="w-full mt-8 min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      <GoalCelebration
        show={showCelebration}
        message={t("tasbeeh.sucess")}
        onClose={handleCelebrationClose}
      />
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("tasbeeh.title")}
          </h1>
          <div className="hidden lg:flex w-fit mx-auto items-center gap-4 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-card rounded border border-border font-mono text-[10px]">
                Space
              </kbd>
              {language === "ar" ? "أو" : "or"}
              <kbd className="px-2 py-0.5 bg-card rounded border border-border font-mono text-[10px]">
                ↑
              </kbd>
              {language === "ar" ? "للعد" : "Count"}
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-card rounded border border-border font-mono text-[10px]">
                R
              </kbd>
              {language === "ar" ? "إعادة" : "Reset"}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-row gap-3 items-stretch">
          <div className="relative flex-1 min-w-0">
            <input
              className="w-full p-4 bg-card/50 backdrop-blur-sm border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground text-center font-semibold text-lg transition-all"
              name="goal"
              id="goal"
              value={inputValue}
              placeholder={t("tasbeeh.placeholder")}
              onChange={handleChange}
              type="number"
              min="0"
              max="999999"
            />
          </div>
          <button
            onClick={resetAll}
            className="shrink-0 px-4 sm:px-6 py-4 font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-border"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-sm" />
          </button>
        </div>

        {goal > 0 && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
              <span>{language === "ar" ? "التقدم" : "Progress"}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary/50 to-primary rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {progress > 0 && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="relative w-full">
          <div
            className={`absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-3xl blur opacity-20 transition-opacity duration-500 ${count > 0 ? "opacity-30" : "opacity-0"}`}
          />
          <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 px-8 py-10">
            <div className="text-center">
              <div className="text-6xl sm:text-7xl font-bold text-foreground tabular-nums tracking-tight leading-none">
                {language === "ar" ? toArabicNumber(count) : count}
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-4 w-full">
          <button
            onClick={handleUp}
            className={`group relative w-full aspect-square max-w-[240px] rounded-full flex justify-center items-center bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30 transition-all duration-200 active:scale-95 ${isButtonUpClicked ? "scale-95 shadow-primary/50" : "hover:scale-105 hover:shadow-primary/40"}`}
          >
            <div
              className={`absolute inset-0 rounded-full border-4 border-primary-foreground/20 transition-all duration-300 ${isButtonUpClicked ? "scale-110 opacity-0" : "scale-100 opacity-100"}`}
            />
            <div className="absolute inset-4 rounded-full border-2 border-primary-foreground/10" />

            <FontAwesomeIcon
              icon={faAngleUp}
              className={`text-7xl text-primary-foreground transition-transform duration-200 ${isButtonUpClicked ? "scale-110" : "group-hover:-translate-y-1"}`}
            />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-10 bg-white/20 rounded-full blur-xl" />
          </button>

          <button
            onClick={handleDown}
            disabled={count === 0}
            className={`group w-20 h-20 rounded-full flex justify-center items-center bg-card border-2 border-border shadow-lg transition-all duration-200 active:scale-95 ${count === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"} ${isButtonDownClicked ? "scale-95 border-accent" : ""}`}
          >
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`text-3xl text-muted-foreground transition-all duration-200 ${isButtonDownClicked ? "text-accent scale-110" : "group-hover:text-foreground"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Counter;
