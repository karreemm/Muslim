"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoriteSurah {
  number: number;
  nameEn: string | null;
  nameAr: string | null;
  reciterId: string | null;
  reciterNameEn: string | null;
  reciterNameAr: string | null;
}

interface FavoriteSurahsContextProps {
  favoriteSurahs: FavoriteSurah[];
  addFavoriteSurah: (surah: FavoriteSurah) => void;
  removeFavoriteSurah: (surahNumber: number, reciterId: string | null) => void;
}

const FavoriteSurahsContext = createContext<
  FavoriteSurahsContextProps | undefined
>(undefined);

export const FavoriteSurahsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [favoriteSurahs, setFavoriteSurahs] = useState<FavoriteSurah[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favoriteSurahs") || "[]",
      );
      setFavoriteSurahs(Array.isArray(storedFavorites) ? storedFavorites : []);
    } catch {
      setFavoriteSurahs([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    localStorage.setItem("favoriteSurahs", JSON.stringify(favoriteSurahs));
  }, [favoriteSurahs, isHydrated]);

  const addFavoriteSurah = (surah: FavoriteSurah) => {
    setFavoriteSurahs((prev) => [...prev, surah]);
  };

  const removeFavoriteSurah = (
    surahNumber: number,
    reciterId: string | null,
  ) => {
    setFavoriteSurahs((prev) =>
      prev.filter(
        (surah) =>
          surah.number !== surahNumber || surah.reciterId !== reciterId,
      ),
    );
  };

  return (
    <FavoriteSurahsContext.Provider
      value={{ favoriteSurahs, addFavoriteSurah, removeFavoriteSurah }}
    >
      {children}
    </FavoriteSurahsContext.Provider>
  );
};

export const useFavoriteSurahs = () => {
  const context = useContext(FavoriteSurahsContext);
  if (!context) {
    throw new Error(
      "useFavoriteSurahs must be used within a FavoriteSurahsProvider",
    );
  }
  return context;
};
