"use client";

import React, { useEffect, useState } from "react";
import { useFavoriteAzkar } from "../../../../context/FavoriteAzkarContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { useRouter } from "next/navigation";
import { toArabicNumber } from "../../../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faLocationArrow,
  faHeartCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import { AzkarCategories } from "../../../../constants/azkarData";
import { ClipLoader } from "react-spinners";
import ShareModal from "../../../../components/modals/ShareModal";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function HadithTable() {
  const { favoriteAzkar, removeFavoriteAzkar } = useFavoriteAzkar();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

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
    const zekrr = AzkarCategories.find((b) => b.ar === zekr.category);
    router.push(`/azkar/category/${zekrr?.id}?zekr=${zekrNumber}`);
  };

  return (
    <div className="mt-20 max-w-(--breakpoint-xl) min-h-screen mx-auto px-4 md:px-8">
      {isEmpty && (
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">
          {t("favourites.azkar.noFavourites")}
        </h1>
      )}
      {!isEmpty && (
        <>
          <div className="mt-10 shadow-xs border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[50vh]">
            <table className="w-full table-auto text-sm">
              <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-6">{t("favourites.azkar.zekrNo")}</th>
                  <th className="py-3 px-6">{t("common.category")}</th>
                  <th className="hidden md:table-cell py-3 px-6">
                    {t("common.text")}
                  </th>
                  <th className="py-3 px-6">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
                {[...favoriteAzkar].reverse().map((item, idx) => {
                  const zekr = AzkarCategories.find(
                    (b) => b.ar === item.category
                  );
                  return (
                    <tr key={idx} className="">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center gap-1">
                          {idx === 0 && (
                            <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-sans w-fit">
                              {t("common.latest")}
                            </span>
                          )}
                          <span>
                            {language === "en"
                              ? item.number
                              : toArabicNumber(item.number)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {language === "ar" ? zekr?.ar : zekr?.en}
                      </td>
                      <td
                        dir="rtl"
                        className="fontAmiri px-6 py-4 hidden md:table-cell leading-8"
                      >
                        {item.content}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-3 text-lg">
                        <button
                          className="text-blue-600 dark:text-blue-500 hover:opacity-80"
                          onClick={() => handleGoToZekr(item)}
                        >
                          <FontAwesomeIcon icon={faLocationArrow} />
                        </button>
                        <ShareModal
                          url={`https://muslim-one.vercel.app/azkar/category/${zekr?.id}?zekr=${item.number}`}
                        />
                        <button
                          className="text-red-600 dark:text-red-500 hover:opacity-80"
                          onClick={() =>
                            removeFavoriteAzkar(
                              item?.number ?? 0,
                              item.category
                            )
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
              favoriteAzkar.forEach((zekr) =>
                removeFavoriteAzkar(zekr?.number ?? 0, zekr.category)
              )
            }
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
            {t("favourites.azkar.clearAllAzkar")}
          </button>
        </>
      )}
    </div>
  );
}
