"use client";

import React, { useEffect, useState } from "react";
import { useFavoriteSurahs } from "../Context/FavoriteSurahsContext";
import TranslationPair from "../Lib/Types";
import { useLanguage } from "../Context/LanguageContext";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLocationArrow, faHeartCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from 'react-spinners';
import ShareModal from "../Components/ShareModal";

export default function AyahsTable() {
  const { favoriteSurahs, removeFavoriteSurah } = useFavoriteSurahs();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const router = useRouter();

  const Surah: TranslationPair = {
    en: "Surah",
    ar: "سورة"
  };

  const Reciter: TranslationPair = {
    en: "Reciter",
    ar: "القارئ"
  };

  const Actions: TranslationPair = {
    en: "Actions",
    ar: "الإجراءات"
  };

  const ClearAll: TranslationPair = {
    en: "Clear All Favorite Surahs",
    ar: "مسح جميع السور المفضلة"
  };

  const NoFavoriteSurahs: TranslationPair = {
    en: "You have no favorite Surahs",
    ar: "ليس لديك سور مفضلة"
  };

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
    console.log(favoriteSurahs);
  }, []);

  useEffect(() => {
    if (favoriteSurahs.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [favoriteSurahs]);

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  const handleGoToSurah = (surah: any) => {
    const surahNumber = surah.number;
    router.push(`/ListenQuran/Reciter/${surah.reciterId}?surah=${surahNumber}`);
  };

  return (
    <div className="mt-20 max-w-screen-xl min-h-screen mx-auto px-4 md:px-8">
      {isEmpty && <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">{NoFavoriteSurahs[language]}</h1>}
      {!isEmpty && 
      <>
      <div className="mt-10 shadow-sm border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[50vh]">
        <table className="w-full table-auto text-sm">
          <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6">{Surah[language]}</th>
              <th className="py-3 px-6">{Reciter[language]}</th>
              <th className="py-3 px-6">{Actions[language]}</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
            {favoriteSurahs.map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap text-center">{language === "ar" ? item.nameAr : item.nameEn}</td>
                <td className="px-2 md:px-6 py-4 whitespace-nowrap text-center">{language === "ar" ? item.reciterNameAr : item.reciterNameEn}</td>
                <td className="px-2 md:px-6 py-4 flex items-center justify-center gap-3 text-lg">
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:opacity-80"
                    onClick={() => handleGoToSurah(item)}
                  >
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </button>
                  <ShareModal url={`https://muslim-one.vercel.app/ListenQuran/Reciter/${item.reciterId}?surah=${item.number}`} />
                  <button
                    className="text-red-600 dark:text-red-500 hover:opacity-80"
                    onClick={() => removeFavoriteSurah(item.number, item.reciterId)}
                  >
                    <FontAwesomeIcon icon={faHeartCircleMinus} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mt-10 bg-teal-600 text-white px-4 py-2 rounded mb-4 flex gap-2 hover:opacity-90"
        onClick={() => favoriteSurahs.forEach(surah => removeFavoriteSurah(surah.number, surah.reciterId))}
      >
        <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
        {ClearAll[language]}
      </button>
      </>
      }
    </div>
  );
}