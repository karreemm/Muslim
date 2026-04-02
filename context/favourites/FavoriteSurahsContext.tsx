"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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

const FavoriteSurahsContext = createContext<FavoriteSurahsContextProps | undefined>(undefined);

export const FavoriteSurahsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteSurahs, setFavoriteSurahs] = useState<FavoriteSurah[]>(() => {
    if(typeof window != 'undefined'){ 
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteSurahs') || '[]');
    return storedFavorites;
  }
  });

  useEffect(() => {
    if(typeof window != 'undefined'){
    localStorage.setItem('favoriteSurahs', JSON.stringify(favoriteSurahs));
  }
  }, [favoriteSurahs]);

  const addFavoriteSurah = (surah: FavoriteSurah) => {
    setFavoriteSurahs((prev) => [...prev, surah]);
  };

  const removeFavoriteSurah = (surahNumber: number, reciterId: string | null) => {
    setFavoriteSurahs((prev) => prev.filter((surah) => surah.number !== surahNumber || surah.reciterId !== reciterId));
    };

  return (
    <FavoriteSurahsContext.Provider value={{ favoriteSurahs, addFavoriteSurah, removeFavoriteSurah }}>
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