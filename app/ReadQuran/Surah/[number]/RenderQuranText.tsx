"use client";

import { useSavedAyahs } from '../../../Context/SavedAyahsContext';
import { useState, useEffect, useRef } from 'react';
import { toArabicNumber } from '../../../Lib/Helpers';
import TranslationPair from '../../../Lib/Types';
import { useLanguage } from '../../../Context/LanguageContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from 'next/navigation';

export const RenderQuranText = (surahData: any, fontSize: number, lineHeight: number, SNameAr: string | undefined, SNameEn: string | undefined, SNumber: number | string ) => {

  const { language } = useLanguage();
  const { saveAyah } = useSavedAyahs();
  const [showPopover, setShowPopover] = useState<{ ayahNumber: number; isOpen: boolean }>({
    ayahNumber: 0,
    isOpen: false,
  });

  const [AyahNumberEn, SetAyahNumberEn] = useState<number | null>(null);
  const [AyahNumberAr, SetAyahNumberAr] = useState<number | null | string>(null);
  const [refsReady, setRefsReady] = useState(false);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const highlightedAyahNumber = parseInt(searchParams.get('ayah') || '0', 10);

  const handleAyahClick = (numberInSurah: number) => {
    console.log('Ayah clicked:', numberInSurah);
    setShowPopover({ ayahNumber: numberInSurah, isOpen: true });
    SetAyahNumberEn(numberInSurah);
    SetAyahNumberAr(toArabicNumber(numberInSurah));
  };

  const handleSaveAyah = (ayah: any) => {
    saveAyah({
      surahNameEn: SNameEn, surahNameAr: SNameAr, ayahNumberAr: AyahNumberAr, text: ayah.text,
      ayahNumberEn: AyahNumberEn, SurahNumber: SNumber
    });
    console.log('Ayah saved:', ayah.text);
    setShowPopover({ ayahNumber: 0, isOpen: false });
  };

  const handleClosePopover = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    setShowPopover({ ayahNumber: 0, isOpen: false });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setShowPopover({ ayahNumber: 0, isOpen: false });
    }
  };

  useEffect(() => {
    if (showPopover.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover.isOpen]);

  useEffect(() => {
    if (Object.keys(ayahRefs.current).length === surahData?.ayahs.length) {
      setRefsReady(true);
    }
  }, [ayahRefs.current, surahData?.ayahs.length]);

  useEffect(() => {
    if (refsReady && highlightedAyahNumber) {
      const element = document.getElementById(`ayah-${highlightedAyahNumber}`);
      console.log("highlightedAyahNumber:", highlightedAyahNumber);
      console.log("ayahRefs:", ayahRefs.current);
      console.log("element:", element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.log('Element not found.');
      }
    }
  }, [refsReady, highlightedAyahNumber]);

  const Message: TranslationPair = {
    en: "save this ayah?",
    ar: " حفظ هذه الآية؟"
  };

  const Yes: TranslationPair = {
    en: "Yes",
    ar: "نعم"
  };

  const No: TranslationPair = {
    en: "No",
    ar: "لا"
  };

  if (!surahData || !surahData.ayahs.length) return null;

  const ayahs = [...surahData.ayahs];
  const surahName = surahData.name;

  if (surahData.number !== 9 && ayahs[0].text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')) {
    ayahs[0].text = ayahs[0].text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/, '').trim();
  }

  return (
    <div dir='rtl' className='flex flex-col items-center'>
      <div dir='rtl' className='basmala text-xl md:text-3xl text-center my-4'>
        {surahData.number === 9 ? (
          <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
        ) : (
          <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}
      </div>
      <div id="scrollable-div" ref={containerRef} className='shadow-md rounded-lg px-4 py-2 mt-5 md:mt-10 ayah-container max-w-[1200px] max-h-[300px] overflow-y-auto flex flex-wrap'>
        {ayahs.map(ayah => (
          <div
            key={ayah.number}
            ref={(el: HTMLDivElement | null) => { 
              ayahRefs.current[ayah.numberInSurah] = el; 
              console.log(`Assigned ref for ayah number ${ayah.numberInSurah}`, el);
            }}
            className={`flex items-center relative ${highlightedAyahNumber === ayah.numberInSurah ? 'bg-yellow-200 dark:bg-yellow-700 rounded-lg' : ''}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
            onClick={() => handleAyahClick(ayah.numberInSurah)}
            id={`ayah-${ayah.numberInSurah}`}
          >
            <p 
              dir='rtl'
              className='ayah cursor-pointer'
              id={`ayah-${ayah.numberInSurah}`}
            >
              {ayah.text}
              <span className='separator mx-1'>
                <span className='icon'>
                  ۝<span className='number'>{toArabicNumber(ayah.numberInSurah)}</span>
                </span>
              </span>
            </p>

            {/* Popover */}
            {showPopover.isOpen && showPopover.ayahNumber === ayah.numberInSurah && (
              <div
                dir = {language === 'ar' ? 'rtl' : 'ltr'}
                ref={popoverRef}
                className=' z-40 absolute dark:bg-gray-700 bg-white  w-64 p-2 flex flex-col rounded shadow-lg top-0'
                style={{ [language === 'ar' ? 'left' : 'right']: 0 }}
                onClick={(e) => e.stopPropagation()} 
              >
                {/* Close icon */}
                <button
                  className='absolute top-2'
                  style={{ [language === 'ar' ? 'left' : 'right']: '1rem' }}
                  onClick={handleClosePopover}
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
                <p className='ml-5'>{Message[language]}</p>
                <div className='flex gap-3 items-center w-full justify-center'>
                  <button
                    className='bg-green-500 hover:opacity-80 text-white w-[40%] rounded-lg text-sm py-1'
                    onClick={() => handleSaveAyah(ayah)}
                  >
                    {Yes[language]}
                  </button>
                  <button
                    className='bg-red-500 hover:opacity-80 text-white w-[40%] rounded-lg text-sm py-1'
                    onClick={handleClosePopover}
                  >
                    {No[language]}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};