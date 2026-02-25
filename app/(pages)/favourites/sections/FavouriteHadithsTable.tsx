"use client";

import React, { useEffect, useState } from "react";
import { useFavoriteHadiths } from "../../../../context/FavoriteHadithsContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faLocationArrow,
  faHeartCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import { hadithBooks } from "../../../../constants/hadithData";
import { ClipLoader } from "react-spinners";
import ShareModal from "../../../../components/modals/ShareModal";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function HadithTable() {
  const { favoriteHadiths, removeFavoriteHadith } = useFavoriteHadiths();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

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
    const chapterId = hadith.chapterId;

    if (chapterId) {
      router.push(
        `/read-hadith/book/${hadith.bookId}/chapter/${chapterId}?hadith=${hadithNumber}`
      );
    } else {
      router.push(`/read-hadith/book/${hadith.bookId}?hadith=${hadithNumber}`);
    }
  };

  return (
    <div className="mt-20 max-w-(--breakpoint-xl) min-h-screen mx-auto px-4 md:px-8">
      {isEmpty && (
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">
          {t("favourites.hadith.noFavourites")}
        </h1>
      )}
      {!isEmpty && (
        <>
          <div className="mt-10 shadow-xs border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[50vh] ">
            <table className="w-full table-auto text-sm">
              <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-6">{t("favourites.hadith.hadithNo")}</th>
                  <th className="py-3 px-6">{t("common.book")}</th>
                  <th className="hidden md:table-cell py-3 px-6">
                    {t("common.text")}
                  </th>
                  <th className="py-3 px-6">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
                {[...favoriteHadiths].reverse().map((item, idx) => {
                  const book = hadithBooks.find((b) => b.id === item.bookId);
                  return (
                    <tr key={idx} className="">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm md:text-base">
                        <div className="flex flex-col items-center gap-1">
                          {idx === 0 && (
                            <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-sans w-fit">
                              {t("common.latest")}
                            </span>
                          )}
                          <span>
                            {language === "ar" ? item.numberAr : item.numberEn}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {language === "ar" ? book?.name_ar : book?.name_en}
                      </td>
                      <td
                        dir="rtl"
                        className="fontAmiri px-6 py-4 hidden md:table-cell leading-8"
                      >
                        {item.text}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-3 text-lg">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:opacity-80"
                          onClick={() => handleGoToHadith(item)}
                        >
                          <FontAwesomeIcon icon={faLocationArrow} />
                        </button>
                        <ShareModal
                          url={
                            item.chapterId
                              ? `https://muslim-one.vercel.app/read-hadith/book/${book?.id}/chapter/${item.chapterId}?hadith=${item.numberEn}`
                              : `https://muslim-one.vercel.app/read-hadith/book/${book?.id}?hadith=${item.numberEn}`
                          }
                        />
                        <button
                          className="text-red-600 dark:text-red-500 hover:opacity-80"
                          onClick={() =>
                            removeFavoriteHadith(item.numberEn, item.bookId)
                          }
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
            className="mt-10 bg-teal-600 text-white px-4 py-2 rounded-sm mb-4 flex gap-2 hover:opacity-90"
            onClick={() =>
              favoriteHadiths.forEach((surah) =>
                removeFavoriteHadith(surah.numberEn, surah.bookId)
              )
            }
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
            {t("favourites.hadith.clearAllHadith")}
          </button>
        </>
      )}
    </div>
  );
}
