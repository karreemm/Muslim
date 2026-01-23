import type { Metadata } from "next";
import "./globals.css";
import ThemeContextProvider from "../context/ThemeContext";
import LanguageContextProvider from "../context/LanguageContext";
import { SavedAyahsProvider } from "../context/SavedAyahsContext";
import { FavoriteSurahsProvider } from "../context/FavoriteSurahsContext";
import { FavoriteHadithsProvider } from "../context/FavoriteHadithsContext";
import { FavoriteAzkarProvider } from "../context/FavoriteAzkarContext";
import { SadaqaGaryaProvider } from "../context/SadaqatContext";
import TasbeehContextProvider from "../context/TasbeehContext";

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
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cabin+Condensed:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`dynamic-font bg-[#FFF5E4] dark:bg-slate-900`}
      >
        <LanguageContextProvider>
          <ThemeContextProvider>
            <SavedAyahsProvider>
              <FavoriteSurahsProvider>
                <FavoriteHadithsProvider>
                  <FavoriteAzkarProvider>
                    <SadaqaGaryaProvider>
                      <TasbeehContextProvider>
                        {children}
                      </TasbeehContextProvider>
                    </SadaqaGaryaProvider>
                  </FavoriteAzkarProvider>
                </FavoriteHadithsProvider>
              </FavoriteSurahsProvider>
            </SavedAyahsProvider>
          </ThemeContextProvider>
        </LanguageContextProvider>
      </body>
    </html>
  );
}
