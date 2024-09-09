"use client";

import { useSavedAyahs } from '../../../Context/SavedAyahsContext';
import { useState, useEffect, useRef } from 'react';
import { toArabicNumber } from '../../../Lib/Helpers';
import TranslationPair from '../../../Lib/Types';
import { useLanguage } from '../../../Context/LanguageContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from 'next/navigation';
import { surahNames } from '../../../Lib/Constants';
import "../../../globals.css";
import { ClipLoader } from 'react-spinners';

export const RenderJuzText = (
  juzData: any, 
  fontSize: number, 
  lineHeight: number
) => {

  const { language } = useLanguage();
  const { saveAyah } = useSavedAyahs();
  const [showPopover, setShowPopover] = useState<{ ayahNumber: number; isOpen: boolean }>({
    ayahNumber: 0,
    isOpen: false,
  });

  const [AyahNumberEn, SetAyahNumberEn] = useState<number | null>(null);
  const [AyahNumberAr, SetAyahNumberAr] = useState<number | null | string>(null);
  const [SNumber, SetSNumber] = useState<number | string | null>(null);
  const [SNameAr, SetSNameAr] = useState<string | undefined>(undefined);
  const [SNameEn, SetSNameEn] = useState<string | undefined>(undefined);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const highlightedAyahNumber = parseInt(searchParams.get('ayah') || '0', 10);
  const [refsReady, setRefsReady] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAyahClick = (ayah: any) => {
    console.log('Ayah clicked:', ayah.numberInSurah);
    setShowPopover({ ayahNumber: ayah.numberInSurah, isOpen: true });
    SetAyahNumberEn(ayah.numberInSurah);
    SetAyahNumberAr(toArabicNumber(ayah.numberInSurah));
    SetSNumber(ayah.surah.number); 

    const surah = surahNames.find(s => s.number === ayah.surah.number);
    if (surah) {
      SetSNameAr(surah.ar);
      SetSNameEn(surah.en);
    }
  };

  useEffect(() => {
    if (SNumber !== null) {
      console.log("from surah number:", SNumber);
      console.log("from surah name:", SNameEn);
      console.log("from surah name:", SNameAr);
    }
  }, [SNumber]);

  const handleSaveAyah = (ayah: any) => {
    console.log('handleSaveAyah called');
    console.log('Saving Ayah with the following details:');
    console.log('Surah Name (EN):', SNameEn);
    console.log('Surah Name (AR):', SNameAr);
    console.log('Ayah Number (AR):', AyahNumberAr);
    console.log('Ayah Number (EN):', AyahNumberEn);
    console.log('Surah Number:', SNumber);
    console.log('Ayah Text:', ayah.text);

    saveAyah({
      surahNameEn: SNameEn, 
      surahNameAr: SNameAr, 
      ayahNumberAr: AyahNumberAr, 
      text: ayah.text,
      ayahNumberEn: AyahNumberEn, 
      SurahNumber: SNumber
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
    if (highlightedAyahNumber && ayahRefs.current[highlightedAyahNumber]) {
      const element = ayahRefs.current[highlightedAyahNumber];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedAyahNumber]);

  useEffect(() => {
    if (Object.keys(ayahRefs.current).length === juzData?.length) {
      setRefsReady(true);
    }
  }, [ayahRefs.current, juzData?.length]);

  useEffect(() => {
    if (juzData) {
      setLoading(false);
    }
  }, [juzData]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  if (!juzData || !juzData.length) return null;

  const ayahs = juzData;
  const surahNumber = ayahs[0]?.surah.number;
  const firstAyahText = ayahs[0]?.text;

  const displayBasmala = surahNumber !== 9 && firstAyahText?.includes('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');

  // Remove basmala from the first Ayah if necessary
  if (displayBasmala) {
    ayahs[0].text = firstAyahText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
  }

  return (
    <div dir="rtl" className="flex flex-col items-center">
      {/* Display Basmala or Ta'awwudh (for Surah 9) */}
      <div className="basmala text-xl md:text-3xl text-center my-4">
        {surahNumber === 9 ? (
          <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
        ) : (
          <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}
      </div>

      {/* Ayah container */}
      <div id='scrollable-div' ref={containerRef} className="shadow-md bg-white text-black rounded-lg px-4 py-2 mt-5 md:mt-10 ayah-container max-w-[1200px] max-h-[300px] overflow-y-auto flex flex-wrap">
        {ayahs.map((ayah: any) => (
          <div
            key={ayah.number}
            ref={(el: HTMLDivElement | null) => { 
              ayahRefs.current[ayah.numberInSurah] = el; 
            }}
            className={`flex flex-col relative items-start ${ayah.text.includes('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') ? 'w-full' : ''}  ${highlightedAyahNumber === ayah.numberInSurah ? 'bg-yellow-200 dark:bg-teal-800 rounded-lg' : ''}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
            onClick={() => handleAyahClick(ayah)}
            id={`ayah-${ayah.numberInSurah}`}
          >
            {ayah.text.includes('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') ? (
              <>
                <div className="w-full text-center my-4 md:my-8">
                  <p className="w-full ayah block text-2xl md:text-4xl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱللرَّحِيمِ
                  </p>
                </div>
                <p className="ayah cursor-pointer w-full">
                  {ayah.text.replace('بِسْمِ ٱللَّهِ ٱللرَّحْمَٰنِ ٱللرَّحِيمِ', '').trim()}
                  <span className="separator mx-1">
                    <span className="icon">
                      ۝<span className="number">{toArabicNumber(ayah.numberInSurah)}</span>
                    </span>
                  </span>
                </p>
              </>
            ) : (
              <p className="ayah w-full cursor-pointer">
                {ayah.text}
                <span className="separator mx-1">
                  <span className="icon">
                    ۝<span className="number">{toArabicNumber(ayah.numberInSurah)}</span>
                  </span>
                </span>
              </p>
            )}

            {/* Popover */}
            {showPopover.isOpen && showPopover.ayahNumber === ayah.numberInSurah && (
              <div
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                ref={popoverRef}
                className='z-40 absolute bg-white w-64 p-2 flex flex-col rounded shadow-lg top-0'
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
                    onClick={() => 
                      handleSaveAyah(ayah)
                    }
                  >
                    {Yes[language]}
                  </button>
                  <button
                    className='bg-red-500 hover:opacity-80 text-white w-[40%] rounded-lg text-sm py-1'
                    onClick={ 
                      handleClosePopover
                    }
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