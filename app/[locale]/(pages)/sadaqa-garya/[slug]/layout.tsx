import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { isLocale, translate } from "@/lib/i18n";
import { getSadaqaRecordBySlug } from "@/lib/sadaqaGarya/sadaqaGaryaStore";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  let name: string | null = null;

  try {
    const record = await getSadaqaRecordBySlug(slug);
    name = (locale === "ar" ? record?.nameAr : record?.nameEn) ?? null;
  } catch {
    // Metadata must never fail the page when Supabase is unavailable.
    name = null;
  }

  if (name) {
    return createMetadata({
      locale,
      title: translate(locale, "seo.sadaqaMemorial.title", { name }),
      description: translate(locale, "seo.sadaqaMemorial.description", { name }),
      path: `/sadaqa-garya/${slug}`,
    });
  }

  return createMetadata({
    locale,
    title: translate(locale, "seo.sadaqaMemorialFallback.title"),
    description: translate(locale, "seo.sadaqaMemorialFallback.description"),
    path: `/sadaqa-garya/${slug}`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
