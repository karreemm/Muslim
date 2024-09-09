"use client";

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMosque, faSun, faMoon, faEarthAfrica, faBookmark, faHeart, faBars, faX, faBookOpen, faHeadphones, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from '../Context/LanguageContext';
import TranslationPair from '../Lib/Types';
import Link from 'next/link';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isQuranDropdownOpen, setIsQuranDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const quranDropdownRef = useRef<HTMLDivElement>(null);
    const quranButtonRef = useRef<HTMLButtonElement>(null);

    const Title: TranslationPair = {
        ar: "مسلم",
        en: "Muslim"
    };

    const Quran: TranslationPair = {
        ar: "القرآن الكريم",
        en: "Quran"
    };

    const Hadith: TranslationPair = {
        ar: "الحديث الشريف",
        en: "Hadith"
    };
    
    const Azkar: TranslationPair = {
        ar: "أذكار",
        en: "Azkar"
    };

    const ReadQuran: TranslationPair = {
        ar: "اقرأ القرآن الكريم",
        en: "Read Quran"
    };

    const ListenQuran: TranslationPair = {
        ar: "استمع للقرآن الكريم",
        en: "Listen Quran"
    };

    const Favourites: TranslationPair = {
        ar: "المفضلة",
        en: "Favourites"
    };

    const SavedAyahs: TranslationPair = {
        ar: "الآيات المحفوظة",
        en: "Saved Ayahs"
    };

    const Home: TranslationPair = { 
        ar: "الرئيسية",
        en: "Home"
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
        if (
            quranDropdownRef.current &&
            quranButtonRef.current &&
            !quranDropdownRef.current.contains(event.target as Node) &&
            !quranButtonRef.current.contains(event.target as Node)
        ) {
            setIsQuranDropdownOpen(false);
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

            <div className='hidden md:flex items-center gap-14 text-xl font-semibold'>

                <Link href="/">
                    {Home[language]}
                </Link>

                <div className="relative">
                    <button
                        ref={quranButtonRef}
                        onClick={() => setIsQuranDropdownOpen(!isQuranDropdownOpen)}
                        className="flex items-center justify-center transition-colors duration-200"
                    >
                        {Quran[language]}
                    </button>
                    {isQuranDropdownOpen && (
                        <div
                            ref={quranDropdownRef}
                            className={`absolute ${language === 'ar' ? 'left-0 text-right w-36' : 'right-0 text-left w-36'} mt-2 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 border-teal-600 dark:border-teal-500 rounded shadow-lg`}
                        >
                            <Link href="/ReadQuran" className="text-lg block w-full px-4 py-2 hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                                {ReadQuran[language]}
                            </Link>
                            <Link href="/ListenQuran" className="block w-full text-lg px-4 py-2 hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                                {ListenQuran[language]}
                            </Link>
                        </div>
                    )}
                </div>

                <Link href="/ReadHadith">
                    {Hadith[language]}
                </Link>

                <Link href="/Azkar">
                    {Azkar[language]}
                </Link>

            </div>

            <div className="flex items-center gap-2 relative">
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

                <Link href="/SavedAyahs" className="hidden md:flex items-center justify-center w-10 h-10 transition-colors duration-200">
                    <FontAwesomeIcon icon={faBookmark} size="lg" />
                </Link>

                <Link href="/Favourites" className="hidden md:flex items-center justify-center w-10 h-10 transition-colors duration-200">
                    <FontAwesomeIcon icon={faHeart} size="lg" />
                </Link>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`flex items-center justify-center w-10 h-10 transition-transform duration-700 md:hidden ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}
                >
                    <FontAwesomeIcon icon={isMobileMenuOpen ? faX : faBars} size="lg" />
                </button>

            </div>

            {isMobileMenuOpen && (
                <div className={`absolute top-16 px-5 py-2 border-b border-black dark:border-white left-0 w-full bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white shadow-md md:hidden ${language === "ar"? `text-right` : `text-left`}`}>

                    <Link href="/" className="flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                        <FontAwesomeIcon icon={faHouse} className="" />
                        {Home[language]}
                    </Link>

                    <Link href="/ReadQuran" className="flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                        <FontAwesomeIcon icon={faBookOpen} className="" />
                        {ReadQuran[language]}
                    </Link>

                    <Link href="/ListenQuran" className="flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                        <FontAwesomeIcon icon={faHeadphones} className="" />
                        {ListenQuran[language]}
                    </Link>

                    <Link href="/ReadHadith" className="flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                        <FontAwesomeIcon icon={faBookOpen} className="" />                  
                        {Hadith[language]}
                    </Link>

                    <Link href="/Azkar" className="flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                        <FontAwesomeIcon icon={faBookOpen} className="" />
                        {Azkar[language]}
                    </Link>

                    <hr className='border border-gray-500 dark:border-gray-400 w-full my-4'/> 

                    <Link href="/SavedAyahs" className="flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                        <FontAwesomeIcon icon={faBookmark} className="" />
                        {SavedAyahs[language]}
                    </Link>

                    <Link href="/Favourites" className="flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800">
                        <FontAwesomeIcon icon={faHeart} className="" />
                        {Favourites[language]}
                    </Link>
                    
                </div>
            )}
        </div>
    );
}