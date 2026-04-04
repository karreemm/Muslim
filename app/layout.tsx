import type { Metadata } from "next";
import ThemeContextProvider from "../context/general/ThemeContext";
import PaletteContextProvider from "../context/general/PaletteContext";
import LanguageContextProvider from "../context/general/LanguageContext";
import { SavedAyahsProvider } from "../context/features/SavedAyahsContext";
import { FavoriteSurahsProvider } from "../context/favourites/FavoriteSurahsContext";
import { FavoriteHadithsProvider } from "../context/favourites/FavoriteHadithsContext";
import { FavoriteAzkarProvider } from "../context/favourites/FavoriteAzkarContext";
import { SadaqaGaryaProvider } from "../context/features/SadaqatContext";
import TasbeehContextProvider from "../context/features/TasbeehContext";
import { ThemeScript } from "@/utils/themeScript";
import PageLayout from "@/components/layout/pageLayout";
import { QuranAudioProvider } from "../context/features/QuranAudioContext";
import "./globals.css";


export const metadata: Metadata = {
  title: "Muslim",
  description: "Muslim is a website for all Muslims",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="color-scheme" content="dark light" />
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Kufam:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`font bg-background dark:bg-background`}>
        <LanguageContextProvider>
          <ThemeContextProvider>
            <PaletteContextProvider>
              <QuranAudioProvider>
                <SavedAyahsProvider>
                  <FavoriteSurahsProvider>
                    <FavoriteHadithsProvider>
                      <FavoriteAzkarProvider>
                        <SadaqaGaryaProvider>
                          <TasbeehContextProvider>
                            <PageLayout>{children}</PageLayout>
                          </TasbeehContextProvider>
                        </SadaqaGaryaProvider>
                      </FavoriteAzkarProvider>
                    </FavoriteHadithsProvider>
                  </FavoriteSurahsProvider>
                </SavedAyahsProvider>
              </QuranAudioProvider>
            </PaletteContextProvider>
          </ThemeContextProvider>
        </LanguageContextProvider>
      </body>
    </html>
  );
}
