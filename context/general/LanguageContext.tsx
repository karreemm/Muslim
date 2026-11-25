"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { STORAGE_KEYS, writeString } from "@/lib/storage";
import { showAppLoader } from "@/lib/loading";
import {
  LANGUAGE_COOKIE,
  type Locale,
  getLocaleFromPathname,
  localeDirection,
  normalizeLocale,
  swapLocaleInPathname,
} from "@/lib/i18n";

interface LanguageContextType {
  language: Locale;
  dir: "rtl" | "ltr";
  setLanguage: (language: Locale) => void;
  toggleLanguage: () => void;
  isHydrated: boolean;
}

interface IProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

function persistLanguage(locale: Locale) {
  if (typeof window === "undefined") return;

  writeString(STORAGE_KEYS.language, locale);
  document.cookie = `${LANGUAGE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = locale;
  document.documentElement.dir = localeDirection(locale);
}

const LanguageContextProvider = ({ children, initialLocale = "ar" }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // The URL is the source of truth. This keeps server-rendered and
  // client-rendered content in the same language.
  const pathLocale = pathname ? getLocaleFromPathname(pathname) : null;
  const language =
    pathLocale && pathname?.match(/^\/(ar|en)(?=\/|$)/)
      ? pathLocale
      : normalizeLocale(initialLocale);
  const dir = localeDirection(language);

  useEffect(() => {
    persistLanguage(language);
    setIsHydrated(true);
  }, [language]);

  const setLanguage = useCallback(
    (nextLanguage: Locale) => {
      if (nextLanguage === language || typeof window === "undefined") return;

      persistLanguage(nextLanguage);

      const search = window.location.search;
      const hash = window.location.hash;
      const nextPath = swapLocaleInPathname(pathname || "/", nextLanguage);

      // Paint the themed cover before the route changes so the outgoing page
      // never flashes and the incoming content arrives under the same cover.
      showAppLoader();
      requestAnimationFrame(() => router.push(`${nextPath}${search}${hash}`));
    },
    [language, pathname, router],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ar" ? "en" : "ar");
  }, [language, setLanguage]);

  const value = {
    language,
    dir,
    setLanguage,
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
