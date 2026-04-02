"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedAyah {
  surahNameEn: string | undefined;
  surahNameAr: string | undefined;
  ayahNumberEn: number | null;
  ayahNumberAr: number | null | string;
  text: string;
  SurahNumber: number | string | null;
}

interface SavedAyahsContextProps {
  savedAyahs: SavedAyah[];
  saveAyah: (ayah: SavedAyah) => void;
  clearSavedAyahs: () => void;
  removeAyah: (ayah: SavedAyah) => void;
}

const SavedAyahsContext = createContext<SavedAyahsContextProps | undefined>(undefined);

export const SavedAyahsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedAyahs, setSavedAyahs] = useState<SavedAyah[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedAyahs');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const saveAyah = (ayah: SavedAyah) => {
    setSavedAyahs((prev) => {
      const newSavedAyahs = [...prev, ayah];
      localStorage.setItem('savedAyahs', JSON.stringify(newSavedAyahs));
      return newSavedAyahs;
    });
  };

  const clearSavedAyahs = () => {
    localStorage.removeItem('savedAyahs');
    setSavedAyahs([]); 
  };

  const removeAyah = (ayah: SavedAyah) => {
    setSavedAyahs((prev) => {
      const newSavedAyahs = prev.filter(
        (item) =>
          item.surahNameEn !== ayah.surahNameEn ||
          item.ayahNumberEn !== ayah.ayahNumberEn
      );
      localStorage.setItem('savedAyahs', JSON.stringify(newSavedAyahs));
      return newSavedAyahs;
    });
  };

  useEffect(() => {
    localStorage.setItem('savedAyahs', JSON.stringify(savedAyahs));
  }, [savedAyahs]);

  return (
    <SavedAyahsContext.Provider value={{ savedAyahs, saveAyah, clearSavedAyahs, removeAyah }}>
      {children}
    </SavedAyahsContext.Provider>
  );
};

export const useSavedAyahs = () => {
  const context = useContext(SavedAyahsContext);
  if (!context) {
    throw new Error('useSavedAyahs must be used within a SavedAyahsProvider');
  }
  return context;
};