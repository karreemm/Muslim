
import type { Metadata } from "next";
import "./globals.css";
import ThemeContextProvider from './Context/ThemeContext'; 
import LanguageContextProvider from "./Context/LanguageContext";
import { SavedAyahsProvider } from "./Context/SavedAyahsContext";
import { FavoriteSurahsProvider } from "./Context/FavoriteSurahsContext";
import { FavoriteHadithsProvider } from "./Context/FavoriteHadithsContext";
import { FavoriteAzkarProvider } from "./Context/FavoriteAzkarContext";


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
    <html lang="ar" dir="rtl" className="dark:bg-slate-900 bg-[#FFF5E4]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="fontAmiri dark:bg-slate-900 bg-[#FFF5E4]">
        <LanguageContextProvider>
          <ThemeContextProvider>
            <SavedAyahsProvider>
              <FavoriteSurahsProvider>
                <FavoriteHadithsProvider>
                  <FavoriteAzkarProvider>
                {children}
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