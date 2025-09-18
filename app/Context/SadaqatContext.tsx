"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeceasedPerson } from '../Types';

interface SadaqaGaryaContextProps {
    deceasedPersons: DeceasedPerson[];
    addDeceasedPerson: (person: DeceasedPerson) => void;
    removeDeceasedPerson: (id: string) => void;
    getDeceasedPerson: (slug: string) => DeceasedPerson | undefined;
    clearAllDeceasedPersons: () => void;
}

const SadaqaGaryaContext = createContext<SadaqaGaryaContextProps | undefined>(undefined);

export const SadaqaGaryaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deceasedPersons, setDeceasedPersons] = useState<DeceasedPerson[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sadaqaGarya');
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sadaqaGarya', JSON.stringify(deceasedPersons));
        }
    }, [deceasedPersons]);

    const addDeceasedPerson = (person: DeceasedPerson) => {
        setDeceasedPersons(prev => [...prev, person]);
    };

    const removeDeceasedPerson = (id: string) => {
        setDeceasedPersons(prev => prev.filter(person => person.id !== id));
    };

    const getDeceasedPerson = (slug: string) => {
        return deceasedPersons.find(person => person.slug === slug);
    };

    const clearAllDeceasedPersons = () => {
        setDeceasedPersons([]);
    };

    return (
        <SadaqaGaryaContext.Provider value={{
            deceasedPersons,
            addDeceasedPerson,
            removeDeceasedPerson,
            getDeceasedPerson,
            clearAllDeceasedPersons
        }}>
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