import type { Metadata } from "next";
import { AzkarCategories } from "@/constants/azkarData";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};

  const category = AzkarCategories.find((item) => item.id === id);
  const name =
    (locale === "ar" ? category?.ar : category?.en) ??
    (locale === "ar" ? "الأذكار" : "Azkar");

  return createMetadata({
    locale,
    title: translate(locale, "seo.azkarCategory.title", { name }),
    description: translate(locale, "seo.azkarCategory.description", { name }),
    path: `/azkar/category/${id}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
