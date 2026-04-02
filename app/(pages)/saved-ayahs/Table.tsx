"use client";

import React, { useEffect, useState } from "react";
import { useSavedAyahs } from "../../../context/features/SavedAyahsContext";
import { useLanguage } from "../../../context/general/LanguageContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import ShareModal from "../../../components/modals/ShareModal";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function AyahsTable() {
  const { savedAyahs, clearSavedAyahs, removeAyah } = useSavedAyahs();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

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
        <ClipLoader color={"hsl(var(--primary))"} loading={loading} size={50} />
      </div>
    );
  }

  const handleGoToAyah = (ayah: any) => {
    const surahNumber = ayah.SurahNumber;
    const ayahNumber = ayah.ayahNumberEn;
    router.push(`/read-quran/surah/${surahNumber}?ayah=${ayahNumber}`);
  };

  return (
    <div className="mt-10 max-w-7xl min-h-screen mx-auto px-4 md:px-8">
      {isEmpty && (
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">
          {t("savedAyahs.noSavedAyahs")}
        </h1>
      )}
      {!isEmpty && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">
            {t("savedAyahs.title")}
          </h1>
          <div className="mt-10 shadow-xs border border-border dark:border-border rounded-lg overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table className="w-full table-auto text-sm">
              <thead className="bg-primary text-primary-foreground font-medium border-b sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-6">{t("common.surahWithNoAll")}</th>
                  <th className="py-3 px-6">{t("savedAyahs.ayahNumber")}</th>
                  <th className="py-3 px-6 hidden md:table-cell">
                    {t("common.ayahs")}
                  </th>
                  <th className="py-3 px-6">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="text-foreground divide-y divide-border">
                {[...savedAyahs].reverse().map((item, idx) => (
                  <tr key={idx} className="">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        {idx === 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-sans w-fit">
                            {t("common.latest")}
                          </span>
                        )}
                        <span>
                          {language === "ar"
                            ? item.surahNameAr
                            : item.surahNameEn}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {language === "ar"
                        ? item.ayahNumberAr
                        : item.ayahNumberEn}
                    </td>
                    <td
                      dir="rtl"
                      className="px-6 py-4 whitespace-normal leading-8 hidden md:table-cell"
                    >
                      {item.text}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center gap-3 text-lg">
                      <button
                        className="text-primary hover:opacity-80"
                        onClick={() => handleGoToAyah(item)}
                      >
                        <FontAwesomeIcon icon={faLocationArrow} />
                      </button>
                      <ShareModal
                        url={`https://muslim-one.vercel.app/read-quran/surah/${item.SurahNumber}?ayah=${item.ayahNumberEn}`}
                      />
                      <button
                        className="text-destructive hover:opacity-80"
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
            className="mt-10 bg-primary  text-primary-foreground px-4 py-2 rounded-sm mb-4 flex gap-2 hover:opacity-90"
            onClick={clearSavedAyahs}
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
            {t("savedAyahs.clearAll")}
          </button>
        </>
      )}
    </div>
  );
}
