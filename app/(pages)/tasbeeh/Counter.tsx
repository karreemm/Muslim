"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../context/LanguageContext";
import { useTasbeeh } from "../../../context/TasbeehContext";
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

  const handleUp = () => {
    setIsButtonUpClicked(true);
    incrementCount();
    setTimeout(() => setIsButtonUpClicked(false), 500);
  };

  const handleDown = () => {
    if (count === 0) return;
    setIsButtonDownClicked(true);
    decrementCount();
    setTimeout(() => setIsButtonDownClicked(false), 500);
  };

  useEffect(() => {
    if (count === goal && goal !== 0) {
      setShowCelebration(true);
    }
  }, [count, goal]);

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    resetAll();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setGoalAndResetCount(parseInt(toEnglishNumber(e.target.value)) || 0);
  };

  return (
    <div className="w-full min-h-screen px-2 flex flex-col gap-10 items-center bg-background text-foreground dark:bg-background dark:text-foreground">
      <GoalCelebration
        show={showCelebration}
        message={t("tasbeeh.sucess")}
        onClose={handleCelebrationClose}
      />

      <h1 className="text-2xl font-bold text-center">{t("tasbeeh.title")}</h1>

      <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-8">
        <input
          className="w-80 p-4 bg-background text-foreground border-2 border-border rounded-lg focus:outline-hidden placeholder:text-muted-foreground"
          name="goal"
          id="goal"
          value={inputValue}
          placeholder={t("tasbeeh.placeholder")}
          onChange={handleChange}
          type="number"
        />
        <button
          onClick={resetAll}
          className="px-4 py-2 font-semibold bg-primary text-primary-foreground rounded-lg"
        >
          {t("tasbeeh.reset")}
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-lg px-4 py-2 w-80">
        <h2 className="text-4xl font-bold text-center text-foreground">
          {language === "ar" ? toArabicNumber(count) : count}
        </h2>
      </div>

      <div className="relative flex flex-col items-center">
        <button
          onClick={handleUp}
          className={`border-8 rounded-full flex justify-center items-center w-60 h-60 bg-primary shadow-lg ${
            isButtonUpClicked
              ? "border-accent dark:border-accent text-accent"
              : "border-secondary text-primary-foreground"
          }`}
          style={{ clipPath: "circle(50% at 50% 50%)" }}
        >
          <FontAwesomeIcon icon={faAngleUp} className="text-9xl" />
        </button>

        <button
          onClick={handleDown}
          className={`absolute border-8 -bottom-14 rounded-full flex justify-center items-center w-28 h-28 bg-primary shadow-lg ${
            isButtonDownClicked
              ? "border-accent dark:border-accent text-accent"
              : "border-secondary text-primary-foreground"
          }`}
          style={{ clipPath: "circle(50% at 50% 50%)" }}
        >
          <FontAwesomeIcon icon={faAngleDown} className="text-5xl" />
        </button>
      </div>
    </div>
  );
};

export default Counter;
