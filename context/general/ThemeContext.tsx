"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  startTransition,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount to avoid hydration mismatch
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme") as Theme | null;
    
    // Check stored preference or system preference
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
      root.classList.toggle("dark", stored === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
      root.classList.add("dark");
    }
    
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    
    root.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    
    startTransition(() => setThemeState(newTheme));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // Prevent hydration mismatch by rendering light mode initially
  if (!mounted) {
    return (
      <ThemeContext.Provider 
        value={{ theme: "light", setTheme: () => {}, toggleTheme: () => {} }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeContextProvider");
  return context;
};