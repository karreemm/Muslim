"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface TasbeehContextType {
  count: number;
  goal: number;
  inputValue: string;
  incrementCount: () => void;
  decrementCount: () => void;
  setGoal: (goal: number) => void;
  setGoalAndResetCount: (goal: number) => void;
  setInputValue: (value: string) => void;
  resetCounter: () => void;
  resetAll: () => void;
}

interface IProps {
  children: ReactNode;
}

export const TasbeehContext = createContext<TasbeehContextType | null>(null);

const TasbeehContextProvider = ({ children }: IProps) => {
  const [count, setCount] = useState<number>(0);
  const [goal, setGoal] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const savedCount = localStorage.getItem("tasbeeh_count");
      const savedGoal = localStorage.getItem("tasbeeh_goal");
      const savedInputValue = localStorage.getItem("tasbeeh_input_value");

      let parsedCount = 0;
      let parsedGoal = 0;
      let loadedInputValue = "";

      if (savedCount && savedCount !== "0") {
        const parsed = parseInt(savedCount);
        if (!isNaN(parsed)) {
          parsedCount = parsed;
        }
      }
      if (savedGoal && savedGoal !== "0") {
        const parsed = parseInt(savedGoal);
        if (!isNaN(parsed)) {
          parsedGoal = parsed;
        }
      }
      if (savedInputValue && savedInputValue !== "") {
        loadedInputValue = savedInputValue;
      }

      setCount(parsedCount);
      setGoal(parsedGoal);
      setInputValue(loadedInputValue);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      localStorage.setItem("tasbeeh_count", count.toString());
    }
  }, [count, isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      localStorage.setItem("tasbeeh_goal", goal.toString());
    }
  }, [goal, isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      localStorage.setItem("tasbeeh_input_value", inputValue);
    }
  }, [inputValue, isInitialized]);

  const incrementCount = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const setGoalValue = useCallback((newGoal: number) => {
    setGoal(newGoal);
  }, []);

  const setGoalAndResetCount = useCallback((newGoal: number) => {
    setGoal(newGoal);
    setCount(0);
  }, []);

  const setInputValueCallback = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const resetCounter = useCallback(() => {
    setCount(0);
    if (typeof window !== "undefined") {
      localStorage.setItem("tasbeeh_count", "0");
    }
  }, []);

  const resetAll = useCallback(() => {
    setCount(0);
    setGoal(0);
    setInputValue("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("tasbeeh_count");
      localStorage.removeItem("tasbeeh_goal");
      localStorage.removeItem("tasbeeh_input_value");
    }
  }, []);

  const value = {
    count,
    goal,
    inputValue,
    incrementCount,
    decrementCount,
    setGoal: setGoalValue,
    setGoalAndResetCount,
    setInputValue: setInputValueCallback,
    resetCounter,
    resetAll,
  };

  return (
    <TasbeehContext.Provider value={value}>{children}</TasbeehContext.Provider>
  );
};

export const useTasbeeh = () => {
  const context = useContext(TasbeehContext);
  if (!context) {
    throw new Error("useTasbeeh must be used within a TasbeehContextProvider");
  }
  return context;
};

export default TasbeehContextProvider;