"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter  } from 'next/navigation';
import { useEffect, useState } from 'react';
import { surahNames } from '../../../Lib/Constants'; 
import TranslationPair from '../../../Lib/Types';
import { useLanguage } from '../../../Context/LanguageContext';
import Navbar from '@/app/Components/Navbar';
import GetSurah from "./GetSurah"
import {toArabicNumber, showPopover, hidePopover} from "../../../Lib/Helpers";
import  { RenderQuranText }  from "./RenderQuranText";

export default function SurahPage() {
    
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const [number, setNumber] = useState<string | null>(null);
  const [surahData, setSurahData] = useState<any>(null); 
  const [fontSize, setFontSize] = useState<number>(18); 
  const [lineHeight, setLineHeight] = useState<number>(2.5);
  const currentSurahNumber = number ? parseInt(number) : 0;
  const hasPrevSurah = currentSurahNumber && currentSurahNumber > 1;
  const hasNextSurah = currentSurahNumber && currentSurahNumber < surahNames.length;

  const SurahNameAr = surahNames.find(s => s.number.toString() === number)?.ar;
  const SurahNameEn = surahNames.find(s => s.number.toString() === number)?.en;

  useEffect(() => {
    const parts = pathname.split('/');
    const surahNumber = parts.pop(); 
  
    if (surahNumber && (parseInt(surahNumber) > 114 || parseInt(surahNumber) < 1)) {
      router.push('/ReadQuran/Surah/1');
      return; 
    }
  
    setNumber(surahNumber ?? null); 
  
    if (surahNumber) {
      const fetchSurahData = async () => {
        try {
          const data = await GetSurah(surahNumber);
          setSurahData(data);
        } catch (error) {
          console.error('Error fetching Surah:', error);
        }
      };
      fetchSurahData();
    }
  }, [pathname, router]);

  const Ayat: TranslationPair = {
    en: "Ayahs",
    ar: "آيات"
  };

  const Size: TranslationPair = {
    en: "Font Size",
    ar: "حجم الخط"
  };

  const Surah: TranslationPair = {
    en: "Surah",
    ar: "سورة"
  }

  const handleFontSizeChange = (increase: boolean) => {
    setFontSize(prevSize => increase ? prevSize + 2 : prevSize - 2);
    setLineHeight(prevLineHeight => increase ? prevLineHeight + 0.2 : prevLineHeight - 0.2);
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    const currentNumber = number ? parseInt(number) : 1;
    const newNumber = direction === 'next' ? currentNumber + 1 : currentNumber - 1;
    router.push(`/ReadQuran/Surah/${newNumber}`);
  };

  return (
    <>
    <Navbar />
    <div className="w-full min-h-screen flex flex-col items-center p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div  className='relative mt-20 w-[90%] flex flex-col items-center'>
            <div>     
                {hasNextSurah && (
                    <>
                    <button
                        onClick={() => handleNavigation('next')}
                        className="absolute top-0 right-0 text-2xl text-teal-600 dark:text-teal-500"
                        onMouseEnter={() => showPopover('popover-next')}
                        onMouseLeave={() => hidePopover('popover-next')}
                        >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>

                    <div data-popover
                        id="popover-next"
                        role="tooltip"
                        className="absolute top-10 right-0 z-10 invisible inline-block w-32 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                        >
                        <div className="flex justify-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{surahNames[currentSurahNumber ][language as keyof typeof surahNames[0]].toString()}</h3>
                        </div>
                    </div>
                    </>             
                )}
                {hasPrevSurah && (
                <>
                <button
                    onClick={() => handleNavigation('prev')}
                    className="absolute top-0 left-0 text-2xl text-teal-600 dark:text-teal-500"
                    onMouseEnter={() => showPopover('popover-prev')}
                    onMouseLeave={() => hidePopover('popover-prev')}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <div data-popover
                        id="popover-prev"
                        role="tooltip"
                        className="absolute top-10 left-0 z-10 invisible inline-block w-32 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                        >
                        <div className="flex justify-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{surahNames[currentSurahNumber - 2][language as keyof typeof surahNames[0]].toString()}</h3>
                        </div>
                </div>
                </>
                )}
            </div>
          <div className='flex flex-col items-center gap-5'>
            <h1 className="md:text-5xl text-3xl font-bold text-teal-600 dark:text-teal-500">{Surah[language]} {surahNames.find(s => s.number.toString() === number)?.[language as keyof typeof surahNames[0]]}</h1>
            <p className="md:text-2xl text-xl flex items-center"> 
                 {Ayat[language]}: {language === "ar" ? toArabicNumber(surahData?.ayahs.length) : surahData?.ayahs.length}
            </p>
          </div>

          <div className='w-full md:w-[80%] py-4 px-2 overflow-auto'>
            {RenderQuranText( surahData, fontSize, lineHeight, SurahNameAr, SurahNameEn, currentSurahNumber)}
          </div>

          <div  dir={language === "ar" ? "rtl" : "ltr"} className='mt-5 flex gap-5'>
            <button onClick={() => handleFontSizeChange(true)} className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-500 text-white font-bold">
                <FontAwesomeIcon icon={faPlus} />
                {Size[language]}
            </button>
            <button onClick={() => handleFontSizeChange(false)} className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-500 text-white font-bold">
                <FontAwesomeIcon icon={faMinus} />
                {Size[language]}
            </button>
          </div>
        </div>
    </div>
    </>
  );
}