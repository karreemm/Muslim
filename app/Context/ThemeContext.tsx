"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextType {
  theme: boolean;
  toggleTheme: () => void;
}

interface IProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeContextProvider = ({ children }: IProps) => {
  const [theme, setTheme] = useState<boolean>(false);

  // Check if we are on the client side before accessing localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const isDarkMode = savedTheme === "dark";
      setTheme(isDarkMode);
      document.body.classList.toggle("dark", isDarkMode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme ? "dark" : "light");
        document.body.classList.toggle("dark", newTheme);
      }
      return newTheme;
    });
  }, []);

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};
