"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DeceasedPerson } from "@/types/sadaqa";
import { readLocalDeleteTokens } from "@/lib/sadaqaGarya/localDeleteTokens";
import { removeStorage } from "@/lib/storage";

interface SadaqaGaryaContextProps {
  deceasedPersons: DeceasedPerson[];
  isLoading: boolean;
  hasDatabaseError: boolean;
  addDeceasedPerson: (person: DeceasedPerson) => void;
  removeDeceasedPerson: (id: string) => void;
  getDeceasedPerson: (slug: string) => DeceasedPerson | undefined;
  canDeleteDeceased: (slug: string) => boolean;
  clearAllDeceasedPersons: () => void;
}

const SadaqaGaryaContext = createContext<SadaqaGaryaContextProps | undefined>(undefined);

export const SadaqaGaryaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deceasedPersons, setDeceasedPersons] = useState<DeceasedPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasDatabaseError, setHasDatabaseError] = useState(false);
  const [ownedSlugs, setOwnedSlugs] = useState<string[]>([]);

  const getLocalOwnedSlugs = (): string[] => {
    return Object.keys(readLocalDeleteTokens());
  };

  useEffect(() => {
    let isActive = true;

    const loadRecords = async () => {
      try {
        setHasDatabaseError(false);
        const response = await fetch("/api/sadaqa-garya", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to load Sadaqa records");
        }

        const payload = await response.json();
        if (isActive) {
          setDeceasedPersons(Array.isArray(payload?.deceased) ? payload.deceased : []);
          const apiOwned = Array.isArray(payload?.ownedSlugs) ? payload.ownedSlugs : [];
          const localOwned = getLocalOwnedSlugs();
          setOwnedSlugs(Array.from(new Set([...apiOwned, ...localOwned])));
        }
      } catch (error) {
        console.error("Error loading Sadaqa records:", error);
        if (isActive) {
          setHasDatabaseError(true);
          setDeceasedPersons([]);
          setOwnedSlugs([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadRecords();

    // Clean up old client-side storage to prevent stale Sadaqa records.
    removeStorage("sadaqaGarya");

    return () => {
      isActive = false;
    };
  }, []);

  const addDeceasedPerson = (person: DeceasedPerson) => {
    setDeceasedPersons((prev) => {
      const existingIndex = prev.findIndex(
        (storedPerson) => storedPerson.slug === person.slug,
      );

      if (existingIndex === -1) {
        return [...prev, person];
      }

      const next = [...prev];
      next[existingIndex] = person;
      return next;
    });

    setOwnedSlugs((prev) => (prev.includes(person.slug) ? prev : [...prev, person.slug]));
  };

  const removeDeceasedPerson = (id: string) => {
    setDeceasedPersons((prev) => {
      const removed = prev.find((person) => person.id === id);
      if (removed) {
        setOwnedSlugs((current) => current.filter((slug) => slug !== removed.slug));
      }
      return prev.filter((person) => person.id !== id);
    });
  };

  const getDeceasedPerson = (slug: string) => {
    return deceasedPersons.find((person) => person.slug === slug);
  };

  const canDeleteDeceased = (slug: string) => ownedSlugs.includes(slug);

  const clearAllDeceasedPersons = () => {
    setDeceasedPersons([]);
  };

  return (
    <SadaqaGaryaContext.Provider
      value={{
        deceasedPersons,
        isLoading,
        hasDatabaseError,
        addDeceasedPerson,
        removeDeceasedPerson,
        getDeceasedPerson,
        canDeleteDeceased,
        clearAllDeceasedPersons,
      }}
    >
      {children}
    </SadaqaGaryaContext.Provider>
  );
};

export const useSadaqaGarya = () => {
  const context = useContext(SadaqaGaryaContext);
  if (!context) {
    throw new Error("useSadaqaGarya must be used within a SadaqaGaryaProvider");
  }
  return context;
};
