import type { Metadata } from "next";
import { SadaqaGaryaProvider } from "@/context/features/SadaqatContext";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return createMetadata({
    locale,
    title: translate(locale, "seo.sadaqat.title"),
    description: translate(locale, "seo.sadaqat.description"),
    path: "/sadaqat",
    noIndex: true,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SadaqaGaryaProvider>{children}</SadaqaGaryaProvider>;
}
