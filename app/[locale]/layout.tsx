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
import TasbeehContextProvider from "@/context/features/TasbeehContext";
import { ThemeScript } from "@/utils/themeScript";
import PageLayout from "@/components/layout/pageLayout";
import { QuranAudioProvider } from "@/context/features/QuranAudioContext";
import { RadioProvider } from "@/context/features/RadioContext";
import { Analytics } from "@vercel/analytics/next";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";
import { amiriQuran, kufam } from "@/lib/fonts";
import { isLocale, localeDirection, locales, type Locale } from "@/lib/i18n";
import { cookies } from "next/headers";
import {
  DEFAULT_PALETTE,
  DEFAULT_PALETTE_HUE,
  VALID_PALETTE_MODES,
  generateCSSVars,
  resolveHue,
  type PaletteMode,
} from "@/utils/paletteEngine";
import { PALETTE_COOKIE, PALETTE_HUE_COOKIE, THEME_COOKIE } from "@/lib/theme";
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

  const cookieStore = await cookies();
  const isDark = cookieStore.get(THEME_COOKIE)?.value === "dark";
  const paletteValue = cookieStore.get(PALETTE_COOKIE)?.value;
  const palette: PaletteMode = VALID_PALETTE_MODES.includes(paletteValue as PaletteMode)
    ? (paletteValue as PaletteMode)
    : DEFAULT_PALETTE;
  const rawHue = Number(cookieStore.get(PALETTE_HUE_COOKIE)?.value);
  const hue = Number.isFinite(rawHue) && rawHue > 0 ? rawHue : DEFAULT_PALETTE_HUE;
  const customStyle =
    palette === "custom"
      ? (generateCSSVars(resolveHue("custom", hue), isDark) as React.CSSProperties)
      : undefined;

  return (
    <html
      lang={language}
      dir={direction}
      data-theme={isDark ? "dark" : "light"}
      data-palette={palette}
      style={customStyle}
      className={`${kufam.variable} ${amiriQuran.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className={`font bg-background dark:bg-background`}>
        <WebsiteJsonLd locale={language} />
        <LanguageContextProvider initialLocale={language}>
          <ThemeContextProvider>
            <PaletteContextProvider>
              <QuranAudioProvider>
                <RadioProvider>
                  <SavedAyahsProvider>
                    <FavoriteSurahsProvider>
                      <FavoriteHadithsProvider>
                        <FavoriteAzkarProvider>
                          <ZekrCounterProvider>
                            <PrayerAzkarReset />
                            <TasbeehContextProvider>
                              <PageLayout>{children}</PageLayout>
                            </TasbeehContextProvider>
                          </ZekrCounterProvider>
                        </FavoriteAzkarProvider>
                      </FavoriteHadithsProvider>
                    </FavoriteSurahsProvider>
                  </SavedAyahsProvider>
                </RadioProvider>
              </QuranAudioProvider>
            </PaletteContextProvider>
          </ThemeContextProvider>
        </LanguageContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
