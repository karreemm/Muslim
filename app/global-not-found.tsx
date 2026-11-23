import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { ThemeScript } from "@/utils/themeScript";
import { amiriQuran, kufam } from "@/lib/fonts";
import { localeDirection, normalizeLocale, translate } from "@/lib/i18n";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const locale = normalizeLocale(headerStore.get("x-locale"));

  return {
    title: `${translate(locale, "seo.notFound.title")} | ${translate(
      locale,
      "seo.site.name",
    )}`,
    description: translate(locale, "seo.notFound.description"),
  };
}

/**
 * Unmatched URLs bypass the localized root layout, so this page renders its
 * own document, reads the locale from a proxy header, and returns a real 404.
 */
export default async function GlobalNotFound() {
  const headerStore = await headers();
  const locale = normalizeLocale(headerStore.get("x-locale"));
  const dir = localeDirection(locale);
  const homeHref = `/${locale}`;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${kufam.variable} ${amiriQuran.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        <ThemeScript />
      </head>
      <body className="font bg-background text-foreground">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/50 bg-card/80 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">
            <div
              aria-hidden="true"
              className="mb-6 bg-gradient-to-b from-primary/20 to-primary/5 bg-clip-text text-[8rem] font-black leading-none text-transparent md:text-[10rem]"
            >
              {translate(locale, "common.notFoundCode")}
            </div>
            <h1 className="type-page mb-4">
              {translate(locale, "common.notFoundTitle")}
            </h1>
            <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {translate(locale, "common.notFoundDescription")}
            </p>
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center rounded-xl bg-foreground px-8 py-4 font-semibold text-background transition-all duration-300 hover:shadow-lg"
            >
              {translate(locale, "common.backHome")}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
