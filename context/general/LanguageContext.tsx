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
import { STORAGE_KEYS, readString, writeString } from "@/lib/storage";

interface LanguageContextType {
  language: string;
  dir: string;
  toggleLanguage: () => void;
  isHydrated: boolean;
}

interface IProps {
  children: ReactNode;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const LanguageContextProvider = ({ children }: IProps) => {
  const [language, setLanguage] = useState<string>("ar");
  const [dir, setDir] = useState<string>("rtl");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = readString(STORAGE_KEYS.language);
      const nextLanguage = savedLanguage === "en" ? "en" : "ar";
      if (savedLanguage) {
        setLanguage(nextLanguage);
        setDir(nextLanguage === "en" ? "ltr" : "rtl");
        document.documentElement.dir = nextLanguage === "en" ? "ltr" : "rtl";
        document.documentElement.lang = nextLanguage;
      }
    }
    setIsHydrated(true);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === "ar" ? "en" : "ar";
    const newDir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLanguage;
    if (typeof window !== "undefined") {
      writeString(STORAGE_KEYS.language, newLanguage);
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
    isHydrated,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContextProvider;

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error("useLanguage must be used within a LanguageContextProvider");
  }
  return context;
};
