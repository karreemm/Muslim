"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface ZekrEntry {
  current: number;
  total: number;
}

interface DailyCounts {
  date: string;
  counts: Record<string, ZekrEntry>;
}

interface ZekrCounterContextType {
  getCount: (categoryId: string, number?: number) => number;
  increment: (categoryId: string, number: number, totalCount: number) => void;
  isCompleted: (
    categoryId: string,
    number: number,
    totalCount: number,
  ) => boolean;
  getCategoryCompletedCount: (categoryId: string) => number;
  resetDay: () => void;
  resetCategory: (categoryId: string) => void;
}

const STORAGE_KEY = "azkar_daily_counts";

const localDateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const zekrKey = (categoryId: string, number: number) =>
  `${categoryId}__${number}`;

const categoryPrefix = (categoryId: string) => `${categoryId}__`;

const loadDailyCounts = (): DailyCounts => {
  const today = localDateKey();
  if (typeof window === "undefined") {
    return { date: today, counts: {} };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as DailyCounts;
      if (parsed && parsed.date === today && parsed.counts) {
        return parsed;
      }
    }
  } catch {}
  return { date: today, counts: {} };
};

const ZekrCounterContext = createContext<ZekrCounterContextType | undefined>(
  undefined,
);

export const ZekrCounterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [daily, setDaily] = useState<DailyCounts>({
    date: localDateKey(),
    counts: {},
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleMidnightReset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    resetTimer.current = setTimeout(() => {
      const today = localDateKey();
      setDaily({ date: today, counts: {} });
      scheduleMidnightReset();
    }, msUntilMidnight);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDaily(loadDailyCounts());
    setIsHydrated(true);
    scheduleMidnightReset();
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [scheduleMidnightReset]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const revalidate = () => {
      const today = localDateKey();
      setDaily((prev) =>
        prev.date === today ? prev : { date: today, counts: {} },
      );
    };
    document.addEventListener("visibilitychange", revalidate);
    window.addEventListener("focus", revalidate);
    return () => {
      document.removeEventListener("visibilitychange", revalidate);
      window.removeEventListener("focus", revalidate);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(daily));
  }, [daily, isHydrated]);

  const getCount = useCallback(
    (categoryId: string, number?: number) => {
      if (number === undefined) return 0;
      return daily.counts[zekrKey(categoryId, number)]?.current || 0;
    },
    [daily],
  );

  const increment = useCallback(
    (categoryId: string, number: number, totalCount: number) => {
      setDaily((prev) => {
        const key = zekrKey(categoryId, number);
        const currentEntry = prev.counts[key];
        const current = currentEntry?.current || 0;
        return {
          ...prev,
          counts: {
            ...prev.counts,
            [key]: { current: current + 1, total: totalCount },
          },
        };
      });
    },
    [],
  );

  const isCompleted = useCallback(
    (categoryId: string, number: number, totalCount: number) => {
      return getCount(categoryId, number) >= totalCount;
    },
    [getCount],
  );

  const getCategoryCompletedCount = useCallback(
    (categoryId: string) => {
      const prefix = categoryPrefix(categoryId);
      return Object.entries(daily.counts).filter(
        ([key, entry]) =>
          key.startsWith(prefix) && entry.current >= entry.total,
      ).length;
    },
    [daily],
  );

  const resetDay = useCallback(() => {
    const today = localDateKey();
    setDaily({ date: today, counts: {} });
  }, []);

  const resetCategory = useCallback((categoryId: string) => {
    const prefix = categoryPrefix(categoryId);
    setDaily((prev) => ({
      ...prev,
      counts: Object.fromEntries(
        Object.entries(prev.counts).filter(
          ([key]) => !key.startsWith(prefix),
        ),
      ),
    }));
  }, []);

  return (
    <ZekrCounterContext.Provider
      value={{
        getCount,
        increment,
        isCompleted,
        getCategoryCompletedCount,
        resetDay,
        resetCategory,
      }}
    >
      {children}
    </ZekrCounterContext.Provider>
  );
};

export const useZekrCounter = () => {
  const context = useContext(ZekrCounterContext);
  if (context === undefined) {
    throw new Error("useZekrCounter must be used within a ZekrCounterProvider");
  }
  return context;
};
