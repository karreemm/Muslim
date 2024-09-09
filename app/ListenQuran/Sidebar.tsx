"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import TranslationPair from '../Lib/Types';
import { surahNames } from '../Lib/Constants';
import { useLanguage } from '../Context/LanguageContext';
import { toArabicNumber } from '../Lib/Helpers';

interface SidebarProps {
    onSurahSelect: (surahNumber: number) => void;
    selectedSurah?: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSurahSelect, selectedSurah }) => {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const Title: TranslationPair = {
        en: "Looking for another Surah?",
        ar: "تبحث عن سورة أخرى؟"
    };

    const SearchPlaceholder: TranslationPair = {
        en: "Search Surah",
        ar: "ابحث عن سورة"
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSurahClick = (surahNumber: number) => {
        onSurahSelect(surahNumber);
        setIsExpanded(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredSurahNames = surahNames.filter((surah) => {
        const query = searchQuery.toLowerCase();
        return (
            surah.en.toLowerCase().includes(query) ||
            surah.ar.includes(query) ||
            surah.number.toString().includes(query)
        );
    });

    return (
        <>
            <nav
                className={`z-30 fixed top-16 h-full shadow-lg border-black dark:border-white bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 transition-all duration-300 ${isExpanded ? 'w-[80%] md:w-80' : 'w-16'} ${language === "ar"? `right-0 border-l` : `left-0 border-r`}`}>
                <div className={`flex flex-col h-full ${isExpanded ? 'mt-7' : ''}`}>
                    <div className='h-20 flex items-center justify-between px-4'>
                        <button onClick={toggleSidebar} className=''>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='text-2xl text-teal-600 dark:text-teal-500' />
                        </button>
                        {isExpanded && (
                            <button onClick={toggleSidebar} className='text-xl text-teal-600 dark:text-teal-500'>
                                <FontAwesomeIcon icon={faX} />
                            </button>
                        )}
                    </div>
                    {isExpanded && (
                        <div className='px-4 flex flex-col gap-8 h-full'>
                            <h1 className='mt-5 text-2xl text-center text-slate-800 dark:text-white'>
                                {Title[language]}
                            </h1>
                            <div>
                                <input
                                    type="search"
                                    placeholder={SearchPlaceholder[language]}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-600 text-slate-900'
                                />
                            </div>
                            <div className='flex flex-col gap-3 overflow-y-auto h-full px-2'>
                                {filteredSurahNames.map((surah) => (
                                    <button
                                        key={surah.number}
                                        onClick={() => handleSurahClick(surah.number)}
                                        className={`w-full px-5 py-3 border border-[#134B70] dark:border-white shadow-lg rounded-lg flex items-center gap-5 group hover:border-teal-600 hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:hover:border-teal-500 ${selectedSurah === surah.number ? 'bg-teal-100 dark:bg-teal-700' : ''}`}
                                    >
                                        <div className="w-[65px] h-[45px] flex items-center justify-center bg-[#134B70] text-white group-hover:bg-teal-600 dark:group-hover:bg-teal-600 rounded-md text-xl">
                                            {language === "en" ? surah.number : toArabicNumber(surah.number)}
                                        </div>
                                        <span className="text-lg md:text-xl text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-500">
                                            {language === 'en' ? `${surah.en}` : `${surah.ar}`}
                                        </span>
                                    </button>
                                ))}
                                <div className='mt-32'>
                                    {""}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Sidebar;