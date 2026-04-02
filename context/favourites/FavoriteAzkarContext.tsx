"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AzkarItem {
  category: string;
  count: string;
  description: string;
  reference: string;
  content: string;
  number?: number;
}

interface FavoriteAzkarItem extends AzkarItem {
  categoryId: string;
}

interface FavoriteAzkarContextType {
  favoriteAzkar: FavoriteAzkarItem[];
  addFavoriteAzkar: (azkar: FavoriteAzkarItem) => void;
  removeFavoriteAzkar: (number: number, categoryId: string) => void;
  removeAllFavoriteAzkar: () => void;
}

const FavoriteAzkarContext = createContext<FavoriteAzkarContextType | undefined>(undefined);

export const FavoriteAzkarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteAzkar, setFavoriteAzkar] = useState<FavoriteAzkarItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteAzkar') || '[]');
      return storedFavorites;
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteAzkar', JSON.stringify(favoriteAzkar));
    }
  }, [favoriteAzkar]);

  const addFavoriteAzkar = (azkar: FavoriteAzkarItem) => {
    setFavoriteAzkar((prevFavorites) => [...prevFavorites, azkar]);
  };

  const removeFavoriteAzkar = (number: number, categoryId: string) => {
    setFavoriteAzkar((prevFavorites) =>
      prevFavorites.filter((fav) => fav.number !== number || fav.categoryId !== categoryId)
    );
  };

  const removeAllFavoriteAzkar = () => {
    setFavoriteAzkar([]);
  };

  return (
    <FavoriteAzkarContext.Provider value={{ favoriteAzkar, addFavoriteAzkar, removeFavoriteAzkar, removeAllFavoriteAzkar }}>
      {children}
    </FavoriteAzkarContext.Provider>
  );
};

export const useFavoriteAzkar = () => {
  const context = useContext(FavoriteAzkarContext);
  if (context === undefined) {
    throw new Error('useFavoriteAzkar must be used within a FavoriteAzkarProvider');
  }
  return context;
};