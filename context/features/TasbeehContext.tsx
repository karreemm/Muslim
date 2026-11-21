"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { STORAGE_KEYS, readString, removeStorage, writeString } from "@/lib/storage";

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
      const savedCount = readString(STORAGE_KEYS.tasbeehCount);
      const savedGoal = readString(STORAGE_KEYS.tasbeehGoal);
      const savedInputValue = readString(STORAGE_KEYS.tasbeehInputValue);

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
      writeString(STORAGE_KEYS.tasbeehCount, count.toString());
    }
  }, [count, isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      writeString(STORAGE_KEYS.tasbeehGoal, goal.toString());
    }
  }, [goal, isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      writeString(STORAGE_KEYS.tasbeehInputValue, inputValue);
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
      writeString(STORAGE_KEYS.tasbeehCount, "0");
    }
  }, []);

  const resetAll = useCallback(() => {
    setCount(0);
    setGoal(0);
    setInputValue("");
    if (typeof window !== "undefined") {
      removeStorage(STORAGE_KEYS.tasbeehCount);
      removeStorage(STORAGE_KEYS.tasbeehGoal);
      removeStorage(STORAGE_KEYS.tasbeehInputValue);
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

  return <TasbeehContext.Provider value={value}>{children}</TasbeehContext.Provider>;
};

export const useTasbeeh = () => {
  const context = useContext(TasbeehContext);
  if (!context) {
    throw new Error("useTasbeeh must be used within a TasbeehContextProvider");
  }
  return context;
};

export default TasbeehContextProvider;
