"use client";

import { useState } from "react";
import TranslationPair from "../Lib/Types";
import { useLanguage } from "../Context/LanguageContext";

interface ButtonGroupProps {
    onSelectionChange: (selected: string) => void;
}

export default function ButtonGroup({ onSelectionChange }: ButtonGroupProps) {
    const { language } = useLanguage();
    const [selectedButton, setSelectedButton] = useState<string>("Surahs");

    const FavSurahs: TranslationPair = {
        ar: "السور",
        en: "Surahs"
    };

    const FavHadiths: TranslationPair = {
        ar: "الأحاديث",
        en: "Hadiths"
    };

    const FavAzkar: TranslationPair = {
        en: "Azkar",
        ar: "الأذكار"
    }

    const handleClick = (e: any) => {
        const value = e.target.value;
        setSelectedButton(value);
        onSelectionChange(value);
    };

    return (
        <div className="flex justify-around bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
            <button
                value="Surahs"
                onClick={handleClick}
                className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
                    selectedButton === "Surahs" ? "text-black dark:text-white border-2 border-black dark:border-white" : "bg-teal-600 text-white"
                } hover:opacity-80`}
            >
                {FavSurahs[language]}
            </button>

            <button
                value="Hadiths"
                onClick={handleClick}
                className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
                    selectedButton === "Hadiths" ? "text-black dark:text-white border-2 border-black dark:border-white" : "bg-teal-600 text-white"
                } hover:opacity-80`}
            >
                {FavHadiths[language]}
            </button>

            <button
                value="Azkar"
                onClick={handleClick}
                className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
                    selectedButton === "Azkar" ? "text-black dark:text-white border-2 border-black dark:border-white" : "bg-teal-600 text-white"
                } hover:opacity-80`}
            >
                {FavAzkar[language]}
            </button>

        </div>
    );
}