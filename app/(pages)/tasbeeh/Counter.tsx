"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faRotateRight
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
    <div className="w-full min-h-screen flex flex-col items-center bg-background text-foreground relative overflow-hidden p-4 lg:p-8">
      <GoalCelebration
        show={showCelebration}
        message={t("tasbeeh.sucess")}
        onClose={handleCelebrationClose}
      />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("tasbeeh.title")}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm lg:text-base">
            {language === "ar" ? "الا بذكر الله تطمئن القلوب" : "Remember Allah to find peace in your heart"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            
            <div className={`flex flex-col gap-6 ${goal > 0 ? "max-lg:flex-col-reverse" : ""}`}>              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      className="w-full p-4 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground text-center font-semibold text-sm md:text-base transition-all"
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
                    className="shrink-0 px-5 py-4 font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-border"
                    title={language === "ar" ? "إعادة" : "Reset"}
                  >
                    <FontAwesomeIcon icon={faRotateRight} className="text-lg" />
                  </button>
                </div>
              </div>

              {goal > 0 && (
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      {language === "ar" ? "التقدم" : "Progress"}
                    </span>
                    <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
                  </div>
                  
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-3">
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

            </div>

            <div className="hidden lg:block bg-muted/30 border border-border/50 rounded-2xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                {language === "ar" ? "اختصارات لوحة المفاتيح" : "Keyboard Shortcuts"}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-card rounded border border-border font-mono">Space / ↑</kbd>
                  <span>{language === "ar" ? "زيادة" : "Increment"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-card rounded border border-border font-mono">↓ / Backspace</kbd>
                  <span>{language === "ar" ? "نقصان" : "Decrement"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-card rounded border border-border font-mono">R</kbd>
                  <span>{language === "ar" ? "إعادة" : "Reset"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative h-full flex flex-col items-center justify-center">
              <div
                className={`absolute -inset-4 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-[3rem] blur-2xl opacity-20 transition-opacity duration-500 ${count > 0 ? "opacity-30" : "opacity-0"}`}
              />
              
              <div className="relative w-full bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 lg:p-12 flex flex-col items-center gap-8">
                <div className="text-center">
                  <div className="text-7xl sm:text-8xl lg:text-9xl font-bold text-foreground tabular-nums tracking-tight leading-none font-mono">
                    {language === "ar" ? toArabicNumber(count) : count}
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full justify-center">
                  
                  <button
                    onClick={handleDown}
                    disabled={count === 0}
                    className={`group w-16 h-16 lg:w-20 lg:h-20 rounded-full flex justify-center items-center bg-muted border-2 border-border shadow-lg transition-all duration-200 active:scale-95 ${count === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"} ${isButtonDownClicked ? "scale-95 border-accent" : ""}`}
                  >
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className={`text-2xl lg:text-3xl text-muted-foreground transition-all duration-200 ${isButtonDownClicked ? "text-accent scale-110" : "group-hover:text-foreground"}`}
                    />
                  </button>

                  <button
                    onClick={handleUp}
                    className={`group relative w-40 h-40 lg:w-48 lg:h-48 rounded-full flex justify-center items-center bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30 transition-all duration-200 active:scale-95 ${isButtonUpClicked ? "scale-95 shadow-primary/50" : "hover:scale-105 hover:shadow-primary/40"}`}
                  >
                    <div
                      className={`absolute inset-0 rounded-full border-4 border-primary-foreground/20 transition-all duration-300 ${isButtonUpClicked ? "scale-110 opacity-0" : "scale-100 opacity-100"}`}
                    />
                    <div className="absolute inset-6 rounded-full border-2 border-primary-foreground/10" />
                    
                    <div className="flex flex-col items-center gap-1">
                      <FontAwesomeIcon
                        icon={faAngleUp}
                        className={`text-5xl lg:text-6xl text-primary-foreground transition-transform duration-200 ${isButtonUpClicked ? "scale-110" : "group-hover:-translate-y-1"}`}
                      />
                      <span className="text-primary-foreground/80 text-xs lg:text-sm font-medium">
                        {language === "ar" ? "اضغط" : "Tap"}
                      </span>
                    </div>

                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-16 bg-white/20 rounded-full blur-xl" />
                  </button>

                  <div className="w-16 h-16 lg:w-20 lg:h-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;