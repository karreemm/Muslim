"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoriteHadith {
  text: string;
  nameAr: string | null;
  nameEn: string | null;
  numberAr: string | null;
  numberEn: number;
  bookId: string | null;
}

interface FavoriteHadithsContextProps {
  favoriteHadiths: FavoriteHadith[];
  addFavoriteHadith: (hadith: FavoriteHadith) => void;
  removeFavoriteHadith: (numberEn: number, bookId: string | null) => void;
  removeAllFavoriteHadiths: () => void;
}

const FavoriteHadithsContext = createContext<FavoriteHadithsContextProps | undefined>(undefined);

export const FavoriteHadithsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteHadiths, setFavoriteHadiths] = useState<FavoriteHadith[]>(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteHadiths') || '[]');
      return storedFavorites;
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteHadiths', JSON.stringify(favoriteHadiths));
    }
  }, [favoriteHadiths]);

  const addFavoriteHadith = (hadith: FavoriteHadith) => {
    setFavoriteHadiths((prev) => [...prev, hadith]);
  };

  const removeFavoriteHadith = (numberEn: number, bookId: string | null) => {
    setFavoriteHadiths((prev) => prev.filter((hadith) => hadith.numberEn !== numberEn || hadith.bookId !== bookId));
  };

  const removeAllFavoriteHadiths = () => {
    setFavoriteHadiths([]);
  };

  return (
    <FavoriteHadithsContext.Provider value={{ favoriteHadiths, addFavoriteHadith, removeFavoriteHadith, removeAllFavoriteHadiths }}>
      {children}
    </FavoriteHadithsContext.Provider>
  );
};

export const useFavoriteHadiths = () => {
  const context = useContext(FavoriteHadithsContext);
  if (!context) {
    throw new Error("useFavoriteHadiths must be used within a FavoriteHadithsProvider");
  }
  return context;
};