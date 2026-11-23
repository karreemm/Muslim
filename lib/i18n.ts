import enNavbar from "@/locales/en/navbar.json";
import enHome from "@/locales/en/home.json";
import enAzkar from "@/locales/en/azkar.json";
import enQuran from "@/locales/en/quran.json";
import enListenQuran from "@/locales/en/listenQuran.json";
import enReadQuran from "@/locales/en/readQuran.json";
import enHadith from "@/locales/en/hadith.json";
import enPrayerTimes from "@/locales/en/prayerTimes.json";
import enTasbeeh from "@/locales/en/tasbeeh.json";
import enSadaqa from "@/locales/en/sadaqa.json";
import enFavourites from "@/locales/en/favourites.json";
import enSavedAyahs from "@/locales/en/savedAyahs.json";
import enCommon from "@/locales/en/common.json";
import enFooter from "@/locales/en/footer.json";
import enSearchAyah from "@/locales/en/searchAyah.json";
import enGenerateAyahImage from "@/locales/en/generateAyahImage.json";
import enRadio from "@/locales/en/radio.json";
import enSeo from "@/locales/en/seo.json";

import arNavbar from "@/locales/ar/navbar.json";
import arHome from "@/locales/ar/home.json";
import arAzkar from "@/locales/ar/azkar.json";
import arQuran from "@/locales/ar/quran.json";
import arListenQuran from "@/locales/ar/listenQuran.json";
import arReadQuran from "@/locales/ar/readQuran.json";
import arHadith from "@/locales/ar/hadith.json";
import arPrayerTimes from "@/locales/ar/prayerTimes.json";
import arTasbeeh from "@/locales/ar/tasbeeh.json";
import arSadaqa from "@/locales/ar/sadaqa.json";
import arFavourites from "@/locales/ar/favourites.json";
import arSavedAyahs from "@/locales/ar/savedAyahs.json";
import arCommon from "@/locales/ar/common.json";
import arFooter from "@/locales/ar/footer.json";
import arSearchAyah from "@/locales/ar/searchAyah.json";
import arGenerateAyahImage from "@/locales/ar/generateAyahImage.json";
import arRadio from "@/locales/ar/radio.json";
import arSeo from "@/locales/ar/seo.json";

export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeDirections: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export const LANGUAGE_COOKIE = "language";

const translations: Record<Locale, Record<string, Record<string, unknown>>> = {
  en: {
    navbar: enNavbar,
    home: enHome,
    azkar: enAzkar,
    quran: enQuran,
    listenQuran: enListenQuran,
    readQuran: enReadQuran,
    hadith: enHadith,
    prayerTimes: enPrayerTimes,
    tasbeeh: enTasbeeh,
    sadaqa: enSadaqa,
    favourites: enFavourites,
    savedAyahs: enSavedAyahs,
    common: enCommon,
    footer: enFooter,
    searchAyah: enSearchAyah,
    generateAyahImage: enGenerateAyahImage,
    radio: enRadio,
    seo: enSeo,
  },
  ar: {
    navbar: arNavbar,
    home: arHome,
    azkar: arAzkar,
    quran: arQuran,
    listenQuran: arListenQuran,
    readQuran: arReadQuran,
    hadith: arHadith,
    prayerTimes: arPrayerTimes,
    tasbeeh: arTasbeeh,
    sadaqa: arSadaqa,
    favourites: arFavourites,
    savedAyahs: arSavedAyahs,
    common: arCommon,
    footer: arFooter,
    searchAyah: arSearchAyah,
    generateAyahImage: arGenerateAyahImage,
    radio: arRadio,
    seo: arSeo,
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return value === "en" ? "en" : defaultLocale;
}

export function localeDirection(locale: Locale): "rtl" | "ltr" {
  return localeDirections[locale];
}

/**
 * Returns the path without its locale prefix, e.g. `/en/read-quran` -> `/read-quran`.
 * A bare locale path (`/ar`) becomes `/`.
 */
export function stripLocaleFromPathname(pathname: string): string {
  const match = pathname.match(/^\/(ar|en)(?=\/|$)/);
  if (!match) return pathname || "/";

  const stripped = pathname.slice(match[0].length);
  return stripped === "" ? "/" : stripped;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const match = pathname.match(/^\/(ar|en)(?=\/|$)/);
  return isLocale(match?.[1]) ? match[1] : defaultLocale;
}

/**
 * Prefixes a root-relative href with a locale. External URLs, hashes, and
 * mailto/tel links are returned untouched. Already-prefixed paths are swapped.
 */
export function localizePath(locale: Locale, href: string): string {
  if (!href) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return href;
  if (!href.startsWith("/")) return href;

  const queryIndex = href.indexOf("?");
  const hashIndex = href.indexOf("#");
  const indexes = [queryIndex, hashIndex].filter((index) => index >= 0);
  const suffixIndex = indexes.length ? Math.min(...indexes) : href.length;
  const pathname = href.slice(0, suffixIndex);
  const suffix = href.slice(suffixIndex);
  const stripped = stripLocaleFromPathname(pathname);

  return `/${locale}${stripped === "/" ? "" : stripped}${suffix}`;
}

/**
 * Replaces the locale segment on an existing pathname.
 */
export function swapLocaleInPathname(pathname: string, locale: Locale): string {
  return localizePath(locale, pathname || "/");
}

/**
 * Resolves the preferred locale from a saved cookie, then Accept-Language,
 * and finally the Arabic default.
 */
export function resolveLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isLocale(cookieLocale)) return cookieLocale;

  if (acceptLanguage) {
    const preferences = acceptLanguage
      .split(",")
      .map((entry) => {
        const [language, quality] = entry.trim().toLowerCase().split(";");
        const parsedQuality = quality?.startsWith("q=")
          ? Number.parseFloat(quality.slice(2))
          : 1;
        return {
          language,
          quality: Number.isFinite(parsedQuality) ? parsedQuality : 0,
        };
      })
      .filter((entry) => entry.language && entry.quality > 0)
      .sort((a, b) => b.quality - a.quality);

    for (const { language } of preferences) {
      if (language === "en" || language.startsWith("en-")) return "en";
      if (language === "ar" || language.startsWith("ar-")) return "ar";
    }
  }

  return defaultLocale;
}

export function getNamespace(locale: string, namespace: string): Record<string, unknown> {
  const language = normalizeLocale(locale);
  return (
    translations[language][namespace] ?? translations[defaultLocale][namespace] ?? {}
  );
}

export function translate(
  locale: string,
  key: string,
  params?: Record<string, string | number>,
): string {
  const language = normalizeLocale(locale);
  const keys = key.split(".");
  let value: unknown = translations[language];

  for (const part of keys) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      value = undefined;
      break;
    }
  }

  let resolved: string;

  if (typeof value === "string") {
    resolved = value;
  } else {
    let fallback: unknown = translations[defaultLocale];
    for (const part of keys) {
      if (fallback && typeof fallback === "object" && part in fallback) {
        fallback = (fallback as Record<string, unknown>)[part];
      } else {
        fallback = undefined;
        break;
      }
    }

    if (typeof fallback !== "string") {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Translation key not found: ${key}`);
      }
      return key;
    }

    resolved = fallback;
  }

  if (params) {
    return Object.keys(params).reduce((result: string, param) => {
      const value = params[param];
      const replacement =
        typeof value === "number"
          ? new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
              useGrouping: false,
            }).format(value)
          : String(value);

      return result.split(`{{${param}}}`).join(replacement);
    }, resolved);
  }

  return resolved;
}
