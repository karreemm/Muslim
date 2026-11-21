import type { Metadata } from "next";
import { surahNames } from "@/constants/quranData";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}): Promise<Metadata> {
  const { locale, number } = await params;
  if (!isLocale(locale)) return {};

  const surah = surahNames.find((item) => item.number === Number(number));
  const name =
    (locale === "ar" ? surah?.ar : surah?.en) ??
    (locale === "ar" ? `سورة ${number}` : `Surah ${number}`);

  return createMetadata({
    locale,
    title: translate(locale, "seo.surah.title", { name }),
    description: translate(locale, "seo.surah.description", { name }),
    path: `/read-quran/surah/${number}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
