import type { Metadata } from "next";
import { hadithBooks } from "@/constants/hadithData";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const book = hadithBooks.find((item) => item.slug === slug);
  const name =
    (locale === "ar" ? book?.name_ar : book?.name_en) ??
    (locale === "ar" ? "كتاب حديث" : "Hadith Book");

  return createMetadata({
    locale,
    title: translate(locale, "seo.hadithBook.title", { name }),
    description: translate(locale, "seo.hadithBook.description", { name }),
    path: `/read-hadith/book/${slug}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
