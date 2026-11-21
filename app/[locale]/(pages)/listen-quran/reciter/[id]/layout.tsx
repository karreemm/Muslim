import type { Metadata } from "next";
import { reciters } from "@/constants/recitersData";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};

  const reciter = reciters.find((item) => item.id === id);
  const name =
    (locale === "ar" ? reciter?.NameAr : reciter?.NameEn) ??
    (locale === "ar" ? "قارئ القرآن" : "Quran Reciter");

  return createMetadata({
    locale,
    title: translate(locale, "seo.reciter.title", { name }),
    description: translate(locale, "seo.reciter.description", { name }),
    path: `/listen-quran/reciter/${id}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
