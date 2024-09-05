"use client";

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMosque, faSun, faMoon, faEarthAfrica, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from '../Context/LanguageContext';
import TranslationPair from '../Lib/Types';
import Link from 'next/link';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const Title: TranslationPair = {
        ar: "مسلم",
        en: "Muslim"
    };

    const handleLanguageChange = (lang: string) => {
        if (lang !== language) {
            toggleLanguage();
        }
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            buttonRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="z-50 fixed flex w-full items-center justify-between px-4 py-3 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 shadow-md">
            <div className="flex gap-2 text-xl">
                <FontAwesomeIcon icon={faMosque} className={language === 'ar' ? 'mt-2' : 'mt-1'} />
                <span className="text-2xl font-semibold">
                    {Title[language]}
                </span>
            </div>
            <div className="flex items-center gap-4 relative">
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 transition-colors duration-200"
                >
                    {theme ? (
                        <FontAwesomeIcon icon={faSun} size="lg" />
                    ) : (
                        <FontAwesomeIcon icon={faMoon} size="lg" />
                    )}
                </button>
                <div className="relative">
                    <button
                        ref={buttonRef}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center w-10 h-10 transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faEarthAfrica} size="lg" />
                    </button>
                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 border-teal-600 dark:border-teal-500 rounded shadow-lg`}
                        >
                            <button
                                onClick={() => handleLanguageChange('ar')}
                                className={`block w-full px-4 py-2 text-left ${language === 'ar' ? 'bg-[#f5ead5] dark:bg-slate-800' : ''}`}
                            >
                                العربية
                            </button>
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className={`block w-full px-4 py-2 text-left ${language === 'en' ? 'bg-[#f5ead5] dark:bg-slate-800' : ''}`}
                            >
                                English
                            </button>
                        </div>
                    )}
                </div>
                <Link href="/SavedAyahs" className="flex items-center justify-center w-10 h-10 transition-colors duration-200">
                    <FontAwesomeIcon icon={faBookmark} size="lg" />
                </Link>
            </div>
        </div>
    );
}
