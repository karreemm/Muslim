import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}): Promise<Metadata> {
  const { locale, number } = await params;
  if (!isLocale(locale)) return {};

  return createMetadata({
    locale,
    title: translate(locale, "seo.juz.title", { number }),
    description: translate(locale, "seo.juz.description", { number }),
    path: `/read-quran/juz/${number}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
