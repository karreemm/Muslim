"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { DeceasedPerson } from "@/types/sadaqa";
import { readLocalDeleteTokens } from "@/lib/sadaqaGarya/localDeleteTokens";
import { removeStorage } from "@/lib/storage";

interface SadaqaGaryaContextProps {
  deceasedPersons: DeceasedPerson[];
  isLoading: boolean;
  hasDatabaseError: boolean;
  retryLoading: () => void;
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
  const [reloadKey, setReloadKey] = useState(0);

  const getLocalOwnedSlugs = (): string[] => {
    return Object.keys(readLocalDeleteTokens());
  };

  useEffect(() => {
    // Clean up old client-side storage once, regardless of the current page.
    removeStorage("sadaqaGarya");

    let isActive = true;

    const loadRecords = async () => {
      try {
        setHasDatabaseError(false);
        const response = await fetch("/api/sadaqa-garya", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
          signal: AbortSignal.timeout(15_000),
        });

        if (!response.ok) {
          throw new Error("Failed to load Sadaqa records");
        }

        const payload = await response.json();
        const serverDeceased: DeceasedPerson[] = Array.isArray(payload?.deceased)
          ? payload.deceased
          : [];
        const apiOwned: string[] = Array.isArray(payload?.ownedSlugs)
          ? payload.ownedSlugs
          : [];
        const localOwned = getLocalOwnedSlugs();

        // Recover records created before the delete-token cookie existed, or
        // after the cookie was cleared, using locally stored ownership tokens.
        const knownSlugs = new Set(serverDeceased.map((person) => person.slug));
        const missingSlugs = localOwned
          .filter((slug) => !knownSlugs.has(slug))
          .slice(0, 20);

        const recovered = await Promise.all(
          missingSlugs.map(async (slug) => {
            try {
              const recordResponse = await fetch(
                `/api/sadaqa-garya/${encodeURIComponent(slug)}`,
                { cache: "no-store", signal: AbortSignal.timeout(5_000) },
              );
              if (!recordResponse.ok) return null;
              const record = await recordResponse.json();
              return (record?.deceased as DeceasedPerson | undefined) ?? null;
            } catch {
              return null;
            }
          }),
        );

        if (isActive) {
          setDeceasedPersons([
            ...serverDeceased,
            ...recovered.filter((person): person is DeceasedPerson => person !== null),
          ]);
          setOwnedSlugs(Array.from(new Set([...apiOwned, ...localOwned])));
        }
      } catch (error) {
        const isTimeout = error instanceof Error && error.name === "TimeoutError";
        if (!isTimeout) {
          console.error("Error loading Sadaqa records:", error);
        }
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

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const retryLoading = useCallback(() => {
    setHasDatabaseError(false);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
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
        retryLoading,
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
