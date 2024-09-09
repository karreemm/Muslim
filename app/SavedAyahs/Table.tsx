"use client";

import React, { useEffect, useState } from "react";
import { useSavedAyahs } from "../Context/SavedAyahsContext"; 
import TranslationPair from "../Lib/Types";
import { useLanguage } from "../Context/LanguageContext";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from 'react-spinners';

export default function AyahsTable() {
  const { savedAyahs, clearSavedAyahs, removeAyah } = useSavedAyahs();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const router = useRouter();

  const Surah: TranslationPair = {
    en: "Surah",
    ar: "سورة"
  };

  const AyahNumber: TranslationPair = {
    en: "Ayah Number",
    ar: "رقم الآية"
  };

  const Actions: TranslationPair = {
    en: "Actions",
    ar: "الإجراءات"
  };

  const Ayah: TranslationPair = {
    en: "Ayah",
    ar: "الآية"
  };

  const ClearAll: TranslationPair = {
    en: "Clear All Saved Ayahs",
    ar: "مسح جميع الآيات المحفوظة"
  };

  const Title: TranslationPair = {
    en: "You will find all your saved Ayahs here",
    ar: "ستجد جميع الآيات التي قمت بحفظها هنا"
  };

  const NoSavedAyahs: TranslationPair = {
    en: "You have no saved Ayahs",
    ar: "ليس لديك آيات محفوظة"
  };

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (savedAyahs.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [savedAyahs]);

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  const handleGoToAyah = (ayah: any) => {
    const surahNumber = ayah.SurahNumber;
    const ayahNumber = ayah.ayahNumberEn;
    router.push(`/ReadQuran/Surah/${surahNumber}?ayah=${ayahNumber}`);
  };

  return (
    <div className="mt-32 max-w-screen-xl min-h-screen mx-auto px-4 md:px-8">
      {isEmpty && <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">{NoSavedAyahs[language]}</h1>}
      {!isEmpty && 
      <>
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">{Title[language]}</h1>
      <div className="mt-10 shadow-sm border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[60vh]">
        <table className="w-full table-auto text-sm">
          <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6">{Surah[language]}</th>
              <th className="py-3 px-6">{AyahNumber[language]}</th>
              <th className="py-3 px-6 hidden md:table-cell">{Ayah[language]}</th>
              <th className="py-3 px-6">{Actions[language]}</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
            {savedAyahs.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">{language === "ar" ? item.surahNameAr : item.surahNameEn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{language === "ar" ? item.ayahNumberAr : item.ayahNumberEn}</td>
                <td dir="rtl" className="px-6 py-4 whitespace-normal leading-8 hidden md:table-cell">{item.text}</td>
                <td className="px-6 py-4 flex items-center justify-between text-lg">
                <button
                    className="text-teal-600 dark:text-teal-500 hover:opacity-80"
                    onClick={() => handleGoToAyah(item)}
                  >
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </button>
                  <button
                    className="text-red-600 dark:text-red-500 hover:opacity-80"
                    onClick={() => removeAyah(item)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mt-10 bg-teal-600  text-white px-4 py-2 rounded mb-4 flex gap-2 hover:opacity-90"
        onClick={clearSavedAyahs}
        >
        <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
         {ClearAll[language]}
      </button>
      </>
    }
    </div>
  );
}