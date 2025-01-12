"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../Context/LanguageContext';
import { DeceasedPerson } from '../../Lib/Types';
import TranslationPair from '../../Lib/Types';
import { duas, DiedSurahs } from '../../Lib/Constants';
import Navbar from '@/app/Components/Navbar';
import Footer from '@/app/Components/Footer';
import { ClipLoader } from "react-spinners";


export default function DeceasedPage() {

    const { slug } = useParams();
    const { language } = useLanguage();
    const [deceased, setDeceased] = useState<DeceasedPerson | null>(null);
    const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    const translations: {[key: string]: TranslationPair} = {
        title: {
            en: "Sadaqa Garya for",
            ar: "صدقة جارية على روح"
        },
        readQuran: {
            en: "Read Quran",
            ar: "اقرأ القرآن"
        },
        makeDua: {
            en: "Make Dua",
            ar: "ادعُ له"
        },
        duaTitle: {
            en: "Duas for the Deceased",
            ar: "أدعية للمتوفى"
        },
        recommendedTitle: {
            en: "Recommended Surahs for the Deceased",
            ar: "السور المستحب قراءتها للمتوفى"
        },
        suraha: {
            en: "Surah ",
            ar: "سورة "
        }
    };

    useEffect(() => {
        const existingData = localStorage.getItem('sadaqaGarya');
        if (existingData) {
            const allDeceased = JSON.parse(existingData);
            const found = allDeceased.find((d: DeceasedPerson) => d.slug === slug);
            if (found) {
                setDeceased(found);
                setLoading(false);
            }
        }
    }, [slug]);

    if (loading || !deceased) {
        return (
            <div className="flex justify-center items-center min-h-screen">
            <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
          </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#FFF5E4] dark:bg-slate-900 p-8">
                <div className="w-[90%] mx-auto mt-20">
                    <h1 className={`${language === 'ar' ? 'leading-10' : ''} flex flex-col justify-center text-3xl mb-4 text-center text-[#134B70] dark:text-white`}>
                        {translations.title[language]} 
                        <p>
                            {language === 'en' ? deceased.nameEn : deceased.nameAr}
                        </p>
                        
                    </h1>

                    {/* Custom Message */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8 mt-5">
                        <p className="text-center text-lg text-[#134B70] dark:text-white mb-4">
                            {language === 'en' ? deceased.messageEn : deceased.messageAr}
                        </p>
                    </div>
                    
                    {/* Recommended Surahs */}
                    <div className="mb-8">
                        <h2 className="text-2xl text-center text-[#134B70] dark:text-white mb-6">
                            {translations.recommendedTitle[language]}
                        </h2>
                        <div className="grid gap-4">
                            {DiedSurahs.map((surah, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl text-[#134B70] dark:text-white flex gap-1">
                                            {translations.suraha[language]}
                                            {language === 'en' ? surah.name.en : surah.name.ar}
                                        </h3>
                                        <button
                                            onClick={() => setExpandedSurah(expandedSurah === index ? null : index)}
                                            className="text-teal-600 dark:text-teal-400 hover:text-teal-700"
                                        >
                                            {expandedSurah === index ? 
                                                (language === 'en' ? 'Collapse' : 'اغلق') : 
                                                (language === 'en' ? 'Read Surah' : 'اقرأ السورة')
                                            }
                                        </button>
                                    </div>
                                    
                                    {expandedSurah === index && (
                                        <div className="mt-4">
                                            <div dir="rtl" className="fontAmiri text-lg font-arabic leading-10 text-[#134B70] dark:text-white whitespace-pre-line">
                                                <p className='fontAmiri text-center text-xl font-bold mb-6'>
                                                     بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ        
                                                </p>
                                                {surah.content}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Duas Section */}
                    <h2 className="text-2xl text-center text-[#134B70] dark:text-white mt-12 mb-6">
                        {translations.duaTitle[language]}
                    </h2>

                    <div dir='rtl' className="grid gap-4">
                        {duas.map((dua, index) => (
                            <div
                                key={index}
                                className="relative bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
                            >
                                <p className="fontAmiri text-lg font-arabic leading-loose text-[#134B70] dark:text-white">{dua}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='h-10'></div>
            </div>
            <Footer />
        </>
    );
}