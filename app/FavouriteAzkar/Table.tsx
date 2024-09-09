"use client";

import React, { useEffect, useState } from "react";
import { useFavoriteAzkar } from "../Context/FavoriteAzkarContext";
import TranslationPair from "../Lib/Types";
import { useLanguage } from "../Context/LanguageContext";
import { useRouter } from 'next/navigation';
import { toArabicNumber } from "../Lib/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLocationArrow, faHeartCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { AzkarCategories } from "../Lib/Constants";
import { ClipLoader } from 'react-spinners';

export default function HadithTable() {

  const { favoriteAzkar, removeFavoriteAzkar } = useFavoriteAzkar();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const router = useRouter();

  const Zekr: TranslationPair = {
    en: "Zekr No.",
    ar: "رقم الذكر"
  };

  const Category: TranslationPair = {
    en: "Category",
    ar: "الفئة"
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
    en: "Clear All Favorite Azkar",
    ar: "مسح جميع الأذكار المفضلة"
  };

  const NoFavoriteAzkar: TranslationPair = {
    en: "You have no favorite Azkar",
    ar: "ليس لديك أذكار مفضلة"
  };

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
    console.log(favoriteAzkar);
  }, []);

  useEffect(() => {
    if (favoriteAzkar.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [favoriteAzkar]);

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  const handleGoToZekr = (zekr: any) => {
    const zekrNumber = zekr.number;
    const zekrr = AzkarCategories.find(b => b.ar === zekr.category);
    router.push(`/Azkar/Category/${zekrr?.id}?zekr=${zekrNumber}`);
  };

  return (
    <div className="mt-20 max-w-screen-xl min-h-screen mx-auto px-4 md:px-8">
      {isEmpty && <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">{NoFavoriteAzkar[language]}</h1>}
      {!isEmpty && 
      <>
      <div className="mt-10 shadow-sm border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[50vh]">
        <table className="w-full table-auto text-sm">
          <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6">{Zekr[language]}</th>
              <th className="py-3 px-6">{Category[language]}</th>
              <th className="hidden md:table-cell py-3 px-6">{Text[language]}</th>
              <th className="py-3 px-6">{Actions[language]}</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
            {favoriteAzkar.map((item, idx) => {
             const zekr = AzkarCategories.find(b => b.ar === item.category);
              return(
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-center">{language === "en" ? item.number : toArabicNumber(item.number)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{language === "ar" ? zekr?.ar : zekr?.en }</td>
                <td dir="rtl" className="px-6 py-4 hidden md:table-cell leading-8">{item.content}</td>
                <td className="px-6 py-4 flex items-center justify-center gap-3 text-lg">
                  <button
                    className="text-teal-600 dark:text-teal-500 hover:opacity-80"
                    onClick={() => handleGoToZekr(item)}
                  >
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </button>
                  <button
                    className="text-red-600 dark:text-red-500 hover:opacity-80"
                    onClick={() => removeFavoriteAzkar(item?.number ?? 0, item.category)}
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
        onClick={() => favoriteAzkar.forEach(zekr => removeFavoriteAzkar(zekr?.number ?? 0, zekr.category))}
      >
        <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
        {ClearAll[language]}
      </button>
      </>
      }
    </div>
  );
}