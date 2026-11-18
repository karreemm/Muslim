import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LanguageContextProvider from "@/context/general/LanguageContext";
import ThemeContextProvider from "@/context/general/ThemeContext";
import PaletteContextProvider from "@/context/general/PaletteContext";
import { SavedAyahsProvider } from "@/context/features/SavedAyahsContext";
import { FavoriteSurahsProvider } from "@/context/favourites/FavoriteSurahsContext";
import { FavoriteHadithsProvider } from "@/context/favourites/FavoriteHadithsContext";
import { FavoriteAzkarProvider } from "@/context/favourites/FavoriteAzkarContext";
import { ZekrCounterProvider } from "@/context/features/ZekrCounterContext";
import PrayerAzkarReset from "@/components/azkar/PrayerAzkarReset";
import { SadaqaGaryaProvider } from "@/context/features/SadaqatContext";
import TasbeehContextProvider from "@/context/features/TasbeehContext";
import { ThemeScript } from "@/utils/themeScript";
import PageLayout from "@/components/layout/pageLayout";
import AppHydrationGate from "@/components/general/AppHydrationGate";
import { QuranAudioProvider } from "@/context/features/QuranAudioContext";
import { RadioProvider } from "@/context/features/RadioContext";
import { Analytics } from "@vercel/analytics/next";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";
import { isLocale, localeDirection, locales, type Locale } from "@/lib/i18n";
import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return createMetadata({ locale, root: true });
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const language: Locale = locale;
  const direction = localeDirection(language);

  return (
    <html lang={language} dir={direction} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Cairo:wght@200..1000&family=Kufam:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font bg-background dark:bg-background`}>
        <WebsiteJsonLd locale={language} />
        <LanguageContextProvider initialLocale={language}>
          <ThemeContextProvider>
            <PaletteContextProvider>
              <AppHydrationGate>
                <QuranAudioProvider>
                  <RadioProvider>
                    <SavedAyahsProvider>
                      <FavoriteSurahsProvider>
                        <FavoriteHadithsProvider>
                          <FavoriteAzkarProvider>
                            <ZekrCounterProvider>
                              <PrayerAzkarReset />
                              <SadaqaGaryaProvider>
                                <TasbeehContextProvider>
                                  <PageLayout>{children}</PageLayout>
                                </TasbeehContextProvider>
                              </SadaqaGaryaProvider>
                            </ZekrCounterProvider>
                          </FavoriteAzkarProvider>
                        </FavoriteHadithsProvider>
                      </FavoriteSurahsProvider>
                    </SavedAyahsProvider>
                  </RadioProvider>
                </QuranAudioProvider>
              </AppHydrationGate>
            </PaletteContextProvider>
          </ThemeContextProvider>
        </LanguageContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
