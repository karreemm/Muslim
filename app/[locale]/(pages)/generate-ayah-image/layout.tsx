import type { Metadata } from "next";
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
    title: translate(locale, "seo.generateAyahImage.title"),
    description: translate(locale, "seo.generateAyahImage.description"),
    path: "/generate-ayah-image",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
