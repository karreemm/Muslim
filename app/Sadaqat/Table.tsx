"use client";

import React, { useEffect, useState } from "react";
import { useSadaqaGarya } from "../Context/SadaqatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import ShareModal from "../Components/ShareModal";
import { useRouter } from "next/navigation";
import { ClipLoader } from 'react-spinners';
import { useLanguage } from "../Context/LanguageContext";
import TranslationPair from "../Lib/Types";
import { safeEncode } from "../Lib/Encoding";

export default function DeceasedPersonsTable() {

  const { deceasedPersons, removeDeceasedPerson, clearAllDeceasedPersons, getDeceasedPerson } = useSadaqaGarya();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const router = useRouter();

  const Name: TranslationPair = {
    en: "Name",
    ar: "الاسم"
  };

  const Actions: TranslationPair = {
    en: "Actions",
    ar: "الإجراءات"
  };

  const ClearAll: TranslationPair = {
    en: "Clear All Sadaqat",
    ar: "مسح جميع الصدقات"
  };

  const NoSadaqat: TranslationPair = {
    en: "You have no Sadaqat yet",
    ar: "ليس لديك صدقات بعد"
  };

  const Title: TranslationPair = {
    en: "Your Sadaqat",
    ar: "صدقاتك"
  }

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    setIsEmpty(deceasedPersons.length === 0);
  }, [deceasedPersons]);

  const getShareableUrl = (slug: string) => {
    const person = getDeceasedPerson(slug);
    if (person) {
      const encodedData = safeEncode(person);
      return `${process.env.NEXT_PUBLIC_BASE_URL || 'https://muslim-one.vercel.app'}/SadaqaGarya/${slug}?data=${encodedData}`;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL || 'https://muslim-one.vercel.app'}/SadaqaGarya/${slug}`;
  };

  const handleNavigation = (slug: string) => {
    const person = getDeceasedPerson(slug);
    if (person) {
      const encodedData = safeEncode(person);
      router.push(`/SadaqaGarya/${slug}?data=${encodedData}`);
    } else {
      router.push(`/SadaqaGarya/${slug}`);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="mt-24 w-[90%] min-h-screen mx-auto px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">{Title[language]}</h1>
      {isEmpty && <h1 className="text-2xl md:text-3xl font-bold text-center mt-20">{NoSadaqat[language]}</h1>}
      {!isEmpty && 
      <>
        <div className="mt-10 shadow-sm border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[50vh]">
          <table className="w-full table-auto text-sm">
            <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6">{Name[language]}</th>
                <th className="py-3 px-6">{Actions[language]}</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
              {deceasedPersons.map((person, idx) => (
                <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-center">
                    {language === "ar" ? person.nameAr : person.nameEn}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center gap-3 text-lg">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:opacity-80"
                      onClick={() => handleNavigation(person.slug)}
                    >
                      <FontAwesomeIcon icon={faLocationArrow} />
                    </button>
                    <ShareModal url={getShareableUrl(person.slug)} />
                    <button
                      className="text-red-600 dark:text-red-500 hover:opacity-80"
                      onClick={() => removeDeceasedPerson(person.id)}
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
          className="mt-10 bg-teal-600 text-white px-4 py-2 rounded mb-4 flex gap-2 hover:opacity-90"
          onClick={clearAllDeceasedPersons}
        >
          <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
          {ClearAll[language]}
        </button>
      </>
      }
    </div>
  );
}