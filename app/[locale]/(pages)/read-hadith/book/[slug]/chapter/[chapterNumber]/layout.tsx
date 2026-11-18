import type { Metadata } from "next";
import { hadithBooks } from "@/constants/hadithData";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; chapterNumber: string }>;
}): Promise<Metadata> {
  const { locale, slug, chapterNumber } = await params;
  if (!isLocale(locale)) return {};

  const book = hadithBooks.find((item) => item.slug === slug);
  const name =
    (locale === "ar" ? book?.name_ar : book?.name_en) ??
    (locale === "ar" ? "الحديث" : "Hadith");

  return createMetadata({
    locale,
    title: translate(locale, "seo.hadithChapter.title", {
      book: name,
      number: chapterNumber,
    }),
    description: translate(locale, "seo.hadithChapter.description", {
      book: name,
      number: chapterNumber,
    }),
    path: `/read-hadith/book/${slug}/chapter/${chapterNumber}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
