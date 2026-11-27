import type { Metadata } from "next";
import {
  type Locale,
  defaultLocale,
  locales,
  localeDirections,
  translate,
} from "@/lib/i18n";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://muslim-one.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Muslim";

export const OG_IMAGE = {
  url: "/screenshot.png",
  width: 1920,
  height: 970,
  alt: "Muslim — Quran, Hadith, Azkar & Prayer Times",
};

export const SITE_KEYWORDS: Record<Locale, string[]> = {
  en: [
    "Quran",
    "Hadith",
    "Azkar",
    "Prayer Times",
    "Islamic",
    "Muslim",
    "Quran audio",
    "Tafseer",
    "Quran radio",
    "Tasbeeh",
    "Qibla",
  ],
  ar: [
    "القرآن الكريم",
    "الحديث الشريف",
    "الأذكار",
    "مواقيت الصلاة",
    "إسلامي",
    "مسلم",
    "تلاوات القرآن",
    "تفسير القرآن",
    "إذاعة القرآن",
    "تسبيح",
    "القبلة",
  ],
};

const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  ar: "ar_AR",
  en: "en_US",
};

export function localizedUrl(locale: Locale, path = "/"): string {
  const cleanPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

export function siteName(locale: Locale): string {
  return translate(locale, "seo.site.name");
}

export function siteTitle(locale: Locale): string {
  return translate(locale, "seo.site.title");
}

export function siteDescription(locale: Locale): string {
  return translate(locale, "seo.site.description");
}

export function commonSeo(locale: Locale): {
  title: string;
  description: string;
  keywords: string[];
  direction: "rtl" | "ltr";
} {
  return {
    title: siteTitle(locale),
    description: siteDescription(locale),
    keywords: SITE_KEYWORDS[locale] ?? SITE_KEYWORDS[defaultLocale],
    direction: localeDirections[locale],
  };
}

type CreateMetadataInput = {
  locale: Locale;
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  /** The root layout metadata needs a title template and app-level defaults. */
  root?: boolean;
};

export function createMetadata({
  locale,
  title,
  description,
  path = "/",
  keywords,
  noIndex = false,
  root = false,
}: CreateMetadataInput): Metadata {
  const localizedSiteName = siteName(locale);
  const defaultTitle = siteTitle(locale);
  const defaultDescription = siteDescription(locale);
  const pageTitle = title?.trim();
  const fullTitle = pageTitle ? `${pageTitle} | ${localizedSiteName}` : defaultTitle;
  const resolvedDescription = description?.trim() || defaultDescription;
  const canonical = localizedUrl(locale, path);
  const languages = Object.fromEntries(
    locales.map((alternate) => [alternate, localizedUrl(alternate, path)]),
  ) as Record<Locale, string>;

  const metadata: Metadata = {
    title: root
      ? {
          default: defaultTitle,
          template: `%s | ${localizedSiteName}`,
        }
      : {
          // Absolute keeps the same full title across static and dynamic
          // route segments without double-applying a parent template.
          absolute: fullTitle,
        },
    description: resolvedDescription,
    keywords: keywords ?? SITE_KEYWORDS[locale] ?? SITE_KEYWORDS[defaultLocale],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: localizedSiteName,
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: locales
        .filter((alternate) => alternate !== locale)
        .map((alternate) => OPEN_GRAPH_LOCALES[alternate]),
      title: fullTitle,
      description: resolvedDescription,
      url: canonical,
      images: [
        {
          ...OG_IMAGE,
          alt: defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [OG_IMAGE.url],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };

  if (root) {
    metadata.metadataBase = new URL(SITE_URL);
    metadata.applicationName = localizedSiteName;
    metadata.authors = [{ name: localizedSiteName }];
    metadata.creator = localizedSiteName;
    metadata.publisher = localizedSiteName;
    metadata.category = "education";
    metadata.icons = {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        {
          url: "/icons/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    };
    metadata.manifest = "/manifest.webmanifest";
    metadata.robots = {
      index: true,
      follow: true,
    };
    metadata.appleWebApp = {
      capable: true,
      title: localizedSiteName,
      statusBarStyle: "default",
    };
  }

  return metadata;
}
