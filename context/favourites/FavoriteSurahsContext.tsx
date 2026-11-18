"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

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

const FavoriteSurahsContext = createContext<FavoriteSurahsContextProps | undefined>(
  undefined,
);

export const FavoriteSurahsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [favoriteSurahs, setFavoriteSurahs] = useState<FavoriteSurah[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedFavorites = readJSON<FavoriteSurah[]>(STORAGE_KEYS.favoriteSurahs, []);
    setFavoriteSurahs(Array.isArray(storedFavorites) ? storedFavorites : []);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    writeJSON(STORAGE_KEYS.favoriteSurahs, favoriteSurahs);
  }, [favoriteSurahs, isHydrated]);

  const addFavoriteSurah = (surah: FavoriteSurah) => {
    setFavoriteSurahs((prev) => {
      const exists = prev.some(
        (item) => item.number === surah.number && item.reciterId === surah.reciterId,
      );
      return exists ? prev : [...prev, surah];
    });
  };

  const removeFavoriteSurah = (surahNumber: number, reciterId: string | null) => {
    setFavoriteSurahs((prev) =>
      prev.filter(
        (surah) => surah.number !== surahNumber || surah.reciterId !== reciterId,
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
    throw new Error("useFavoriteSurahs must be used within a FavoriteSurahsProvider");
  }
  return context;
};
