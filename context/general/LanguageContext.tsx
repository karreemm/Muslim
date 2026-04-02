"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  startTransition,
} from "react";

interface LanguageContextType {
  language: string;
  dir: string;
  toggleLanguage: () => void;
}

interface IProps {
  children: ReactNode;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const LanguageContextProvider = ({ children }: IProps) => {
  const [language, setLanguage] = useState<string>("ar");
  const [dir, setDir] = useState<string>("rtl");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
        setDir(savedLanguage === "en" ? "ltr" : "rtl");
        document.documentElement.dir = savedLanguage === "en" ? "ltr" : "rtl";
      }
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === "ar" ? "en" : "ar";
    const newDir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = newDir;
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
    startTransition(() => {
      setLanguage(newLanguage);
      setDir(newDir);
    });
  }, [language]);

  const value = {
    language,
    dir,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContextProvider;

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error(
      "useLanguage must be used within a LanguageContextProvider",
    );
  }
  return context;
};
