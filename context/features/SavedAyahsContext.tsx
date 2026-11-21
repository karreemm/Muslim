"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

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

export const SavedAyahsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [savedAyahs, setSavedAyahs] = useState<SavedAyah[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = readJSON<SavedAyah[]>(STORAGE_KEYS.savedAyahs, []);
    if (!Array.isArray(saved)) {
      setIsHydrated(true);
      return;
    }

    // Older builds appended duplicates; keep only the newest copy of each ayah.
    const unique = new Map<string, SavedAyah>();
    for (const item of saved) {
      const key = `${item.SurahNumber}:${item.ayahNumberEn}`;
      unique.delete(key);
      unique.set(key, item);
    }

    setSavedAyahs([...unique.values()]);
    setIsHydrated(true);
  }, []);

  const saveAyah = (ayah: SavedAyah) => {
    setSavedAyahs((prev) => {
      const next = prev.filter(
        (item) =>
          !(
            String(item.SurahNumber) === String(ayah.SurahNumber) &&
            item.ayahNumberEn === ayah.ayahNumberEn
          ),
      );
      return [...next, ayah];
    });
  };

  const clearSavedAyahs = () => {
    setSavedAyahs([]);
  };

  const removeAyah = (ayah: SavedAyah) => {
    setSavedAyahs((prev) => {
      return prev.filter(
        (item) =>
          String(item.SurahNumber) !== String(ayah.SurahNumber) ||
          item.ayahNumberEn !== ayah.ayahNumberEn,
      );
    });
  };

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    writeJSON(STORAGE_KEYS.savedAyahs, savedAyahs);
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
