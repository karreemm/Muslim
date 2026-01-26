import { useLanguage } from "@/context/LanguageContext";

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

type TranslationKey = string;

interface Translations {
  [key: string]: any;
}

const translations: Record<string, Translations> = {
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
  },
};

export function useTranslation() {
  const { language } = useLanguage();

  const t = (
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string => {
    const keys = key.split(".");
    let value: any = translations[language] || translations.en;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
          }
        }
      }
    }

    if (params && typeof value === "string") {
      Object.keys(params).forEach((param) => {
        value = value.replace(`{{${param}}}`, String(params[param]));
      });
    }

    return typeof value === "string" ? value : key;
  };

  const getNamespace = (namespace: string): Record<string, string> => {
    const namespaceData =
      translations[language]?.[namespace] || translations.en[namespace];
    return namespaceData || {};
  };

  return {
    t,
    getNamespace,
    language,
  };
}
