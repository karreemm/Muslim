import type { MetadataRoute } from "next";
import { localizedUrl } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n";
import { hadithBooks } from "@/constants/hadithData";
import { reciters } from "@/constants/recitersData";
import { AzkarCategories } from "@/constants/azkarData";

type ChangeFrequency = "weekly" | "monthly";

type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
};

const staticRoutes: RouteEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/read-quran", priority: 0.9, changeFrequency: "weekly" },
  { path: "/read-hadith", priority: 0.9, changeFrequency: "weekly" },
  { path: "/listen-quran", priority: 0.9, changeFrequency: "weekly" },
  { path: "/radios", priority: 0.8, changeFrequency: "weekly" },
  { path: "/azkar", priority: 0.9, changeFrequency: "weekly" },
  { path: "/prayer-times", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tasbeeh", priority: 0.7, changeFrequency: "monthly" },
  { path: "/search-ayah", priority: 0.8, changeFrequency: "monthly" },
  { path: "/generate-ayah-image", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sadaqa-garya", priority: 0.6, changeFrequency: "monthly" },
];

function alternatesFor(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, localizedUrl(locale, path)])),
    "x-default": localizedUrl("ar", path),
  };
}

function localizedEntries(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
  lastModified: Date,
): MetadataRoute.Sitemap {
  const languages = alternatesFor(path);

  return locales.map((locale: Locale) => ({
    url: localizedUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages,
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...staticRoutes.flatMap(({ path, priority, changeFrequency }) =>
      localizedEntries(path, priority, changeFrequency, lastModified),
    ),
    ...Array.from({ length: 114 }, (_, index) =>
      localizedEntries(`/read-quran/surah/${index + 1}`, 0.7, "monthly", lastModified),
    ).flat(),
    ...Array.from({ length: 30 }, (_, index) =>
      localizedEntries(`/read-quran/juz/${index + 1}`, 0.6, "monthly", lastModified),
    ).flat(),
    ...hadithBooks.flatMap((book) =>
      localizedEntries(`/read-hadith/book/${book.slug}`, 0.6, "monthly", lastModified),
    ),
    ...reciters.flatMap((reciter) =>
      localizedEntries(
        `/listen-quran/reciter/${reciter.id}`,
        0.6,
        "monthly",
        lastModified,
      ),
    ),
    ...AzkarCategories.flatMap((category) =>
      localizedEntries(`/azkar/category/${category.id}`, 0.6, "monthly", lastModified),
    ),
  ];
}
