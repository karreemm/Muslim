"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

const SavedAyahsContext = createContext<SavedAyahsContextProps | undefined>(
  undefined,
);

export const SavedAyahsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [savedAyahs, setSavedAyahs] = useState<SavedAyah[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("savedAyahs");
      setSavedAyahs(saved ? JSON.parse(saved) : []);
    } catch {
      setSavedAyahs([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const saveAyah = (ayah: SavedAyah) => {
    setSavedAyahs((prev) => [...prev, ayah]);
  };

  const clearSavedAyahs = () => {
    setSavedAyahs([]);
  };

  const removeAyah = (ayah: SavedAyah) => {
    setSavedAyahs((prev) => {
      return prev.filter(
        (item) =>
          item.surahNameEn !== ayah.surahNameEn ||
          item.ayahNumberEn !== ayah.ayahNumberEn,
      );
    });
  };

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    localStorage.setItem("savedAyahs", JSON.stringify(savedAyahs));
  }, [savedAyahs, isHydrated]);

  return (
    <SavedAyahsContext.Provider
      value={{ savedAyahs, saveAyah, clearSavedAyahs, removeAyah }}
    >
      {children}
    </SavedAyahsContext.Provider>
  );
};

export const useSavedAyahs = () => {
  const context = useContext(SavedAyahsContext);
  if (!context) {
    throw new Error("useSavedAyahs must be used within a SavedAyahsProvider");
  }
  return context;
};
