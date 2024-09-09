"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import {  useEffect, useState } from 'react';
import { useLanguage } from '@/app/Context/LanguageContext';
import Navbar from '@/app/Components/Navbar';
import Sidebar from '../../Sidebar';
import SurahPlayer from './SurahPlayer';
import { surahNames, reciters } from '@/app/Lib/Constants';
import TranslationPair from '@/app/Lib/Types';

export default function ReciterPage() {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const [reciterId, setReciterId] = useState<string | null>("Abdul-Basit");
    const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
    const [selectedSurahNameEn, setSelectedSurahNameEn] = useState<string | null>(null);
    const [selectedSurahNameAr, setSelectedSurahNameAr] = useState<string | null>(null);
    const [reciterNameEn, setReciterNameEn] = useState<string>("");
    const [reciterNameAr, setReciterNameAr] = useState<string>("");

    useEffect(() => {
        const parts = pathname.split('/');
        const id = parts[parts.length - 1];
        const surahNumber = searchParams.get('surah');
        if (id) setReciterId(id);
        if (surahNumber) setSelectedSurah(parseInt(surahNumber, 10));
        if (!surahNumber) setSelectedSurah(1);
    }, [pathname, searchParams]);

    useEffect(() => {
        const reciter = reciters.find(r => r.id === reciterId);
        if (reciter) {
            setReciterNameEn(reciter.NameEn);
            setReciterNameAr(reciter.NameAr);
        }
    }, [reciterId]);

    useEffect(() => {
        if (selectedSurah) {
            setSelectedSurahNameEn(surahNames[selectedSurah - 1].en);
            setSelectedSurahNameAr(surahNames[selectedSurah - 1].ar);
            console.log('Selected Surah:', selectedSurah);
            console.log('Selected Surah Name (EN):', surahNames[selectedSurah - 1].en);
            console.log('Selected Surah Name (AR):', surahNames[selectedSurah - 1].ar);
        }
    }, [selectedSurah]);

    const handleSurahChange = (surahNumber: number) => {
        setSelectedSurah(surahNumber);
    };

    const Reciter: TranslationPair = {
        ar: 'فضيلة الشيخ',
        en: 'His Eminence Sheikh' 
    };
    

    return (
        <>
            <Navbar />
            <Sidebar onSurahSelect={handleSurahChange} selectedSurah={selectedSurah} />
            <div className={`w-full min-h-screen flex flex-col items-center justify-center gap-5 p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white ${language === 'en' ? ' md:ml-0' : 'md:mr-0'}`}>
                <div className={`mt-14 text-center flex flex-col gap-2 items-center ${language === 'en' ? 'ml-10 md:ml-0' : 'mr-10 md:mr-0'} `}>
                    <h1 className="text-xl md:text-2xl ">{Reciter[language]}</h1>
                    <h2 className="text-2xl md:text-4xl">{language === "ar"? reciterNameAr : reciterNameEn}</h2>
                </div>
                <div className={`mt-5 flex items-center gap-2 ${language === 'en' ? 'ml-10 md:ml-0' : 'mr-10 md:mr-0'} `}>
                    <h3 className='text-2xl md:text-4xl'>{language === "ar"? 'سورة' : 'Surah'}</h3>
                    <h3 className='text-2xl md:text-4xl'>{language === "ar"? selectedSurahNameAr : selectedSurahNameEn}</h3>
                </div>
                <div className={`md:mt-5 scale-75 md:scale-100 ${language === 'en' ? 'ml-10 md:ml-0' : 'mr-10 md:mr-0'} `}>
                    {reciterId && selectedSurah !== null && (
                        <SurahPlayer surahNumber={selectedSurah} reciterId={reciterId} />
                    )}
                </div>
            </div>
        </>
    );
}
