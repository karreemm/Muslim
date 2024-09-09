"use client";

import React, { useEffect, useState } from "react";
import { useFavoriteHadiths } from "../Context/FavoriteHadithsContext";
import TranslationPair from "../Lib/Types";
import { useLanguage } from "../Context/LanguageContext";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLocationArrow, faHeartCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { hadithBooks } from "../Lib/Constants";
import { ClipLoader } from 'react-spinners';

export default function HadithTable() {

  const { favoriteHadiths, removeFavoriteHadith } = useFavoriteHadiths();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const router = useRouter();

  const Hadith: TranslationPair = {
    en: "Hadith No.",
    ar: "رقم الحديث"
  };

  const Book: TranslationPair = {
    en: "Book",
    ar: "كتاب"
  };

  const Actions: TranslationPair = {
    en: "Actions",
    ar: "الإجراءات"
  };

  const Text: TranslationPair = {
    en: "Text",
    ar: "النص"
  };
  
  const ClearAll: TranslationPair = {
    en: "Clear All Favorite Hadith",
    ar: "مسح جميع الأحاديث المفضلة"
  };

  const NoFavoriteHadiths: TranslationPair = {
    en: "You have no favorite Hadiths",
    ar: "ليس لديك أحاديث مفضلة"
  };

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
    console.log(favoriteHadiths);
  }, []);

  useEffect(() => {
    if (favoriteHadiths.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [favoriteHadiths]);

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  const handleGoToHadith = (hadith: any) => {
    const hadithNumber = hadith.numberEn;
    router.push(`/ReadHadith/Book/${hadith.bookId}?hadith=${hadithNumber}`);
  };

  return (
    <div className="mt-20 max-w-screen-xl min-h-screen mx-auto px-4 md:px-8">
      {isEmpty && <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">{NoFavoriteHadiths[language]}</h1>}
      {!isEmpty && 
      <>
      <div className="mt-10 shadow-sm border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[50vh] ">
        <table className="w-full table-auto text-sm">
          <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6">{Hadith[language]}</th>
              <th className="py-3 px-6">{Book[language]}</th>
              <th className="hidden md:table-cell py-3 px-6">{Text[language]}</th>
              <th className="py-3 px-6">{Actions[language]}</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
            {favoriteHadiths.map((item, idx) => {
             const book = hadithBooks.find(b => b.id === item.bookId);
              return(
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-center">{language === "ar" ? item.numberAr : item.numberEn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{language === "ar" ? book?.name_ar : book?.name_en }</td>
                <td dir="rtl" className="px-6 py-4 hidden md:table-cell leading-8">{item.text}</td>
                <td className="px-6 py-4 flex items-center justify-center gap-3 text-lg">
                  <button
                    className="text-teal-600 dark:text-teal-500 hover:opacity-80"
                    onClick={() => handleGoToHadith(item)}
                  >
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </button>
                  <button
                    className="text-red-600 dark:text-red-500 hover:opacity-80"
                    onClick={() => removeFavoriteHadith(item.numberEn, item.bookId)}
                  >
                    <FontAwesomeIcon icon={faHeartCircleMinus} />
                  </button>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
      <button
        className="mt-10 bg-teal-600 text-white px-4 py-2 rounded mb-4 flex gap-2 hover:opacity-90"
        onClick={() => favoriteHadiths.forEach(surah => removeFavoriteHadith(surah.numberEn, surah.bookId))}
      >
        <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
        {ClearAll[language]}
      </button>
      </>
      }
    </div>
  );
}