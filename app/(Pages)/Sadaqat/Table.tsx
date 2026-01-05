"use client";

import React, { useEffect, useState } from "react";
import { useSadaqaGarya } from "../../../context/SadaqatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import ShareModal from "../../../components/modals/ShareModal";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useLanguage } from "../../../context/LanguageContext";
import { safeEncode } from "../../../utils/encoding";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function DeceasedPersonsTable() {
  const {
    deceasedPersons,
    removeDeceasedPerson,
    clearAllDeceasedPersons,
    getDeceasedPerson,
  } = useSadaqaGarya();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareableUrls, setShareableUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    setIsEmpty(deceasedPersons.length === 0);
  }, [deceasedPersons]);

  const shortenURL = async (url: string) => {
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${url}`
      );
      const shortUrl = await response.text();
      console.log("Short URL:", shortUrl);
      return shortUrl;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getShareableUrl = async (slug: string) => {
    const person = getDeceasedPerson(slug);
    if (person) {
      const encodedData = safeEncode(person);
      const shortenedUrl = await shortenURL(
        `https://muslim-one.vercel.app/sadaqa-garya/${slug}?data=${encodedData}`
      );
      return shortenedUrl || "";
    }
    return `https://muslim-one.vercel.app/sadaqa-garya/${slug}`;
  };

  const handleNavigation = (slug: string) => {
    const person = getDeceasedPerson(slug);
    if (person) {
      const encodedData = safeEncode(person);
      router.push(`/sadaqa-garya/${slug}?data=${encodedData}`);
    } else {
      router.push(`/sadaqa-garya/${slug}`);
    }
  };

  useEffect(() => {
    const fetchShareableUrls = async () => {
      const urls: { [key: string]: string } = {};
      for (const person of deceasedPersons) {
        const url = await getShareableUrl(person.slug);
        urls[person.slug] = url;
      }
      setShareableUrls(urls);
    };

    if (!isEmpty) {
      fetchShareableUrls();
    }
  }, [deceasedPersons]);

  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="mt-24 w-[90%] min-h-screen mx-auto px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-5">
        {t("sadaqa.table.title")}
      </h1>
      {isEmpty && (
        <h1 className="text-2xl md:text-3xl font-bold text-center mt-20">
          {t("sadaqa.table.noSadaqat")}
        </h1>
      )}
      {!isEmpty && (
        <>
          <div className="mt-10 shadow-xs border border-teal-600 dark:border-white rounded-lg overflow-x-auto overflow-y-auto max-h-[50vh]">
            <table className="w-full table-auto text-sm">
              <thead className="bg-teal-600 text-white font-medium border-b sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-6">{t("common.name")}</th>
                  <th className="py-3 px-6">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white divide-y divide-teal-600 dark:divide-white">
                {deceasedPersons.map((person, idx) => (
                  <tr key={idx} className="">
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
                      {shareableUrls[person.slug] && (
                        <ShareModal url={shareableUrls[person.slug]} />
                      )}
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
            className="mt-10 bg-teal-600 text-white px-4 py-2 rounded-sm mb-4 flex gap-2 hover:opacity-90"
            onClick={clearAllDeceasedPersons}
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-lg mt-0.5" />
            {t("sadaqa.table.clearAll")}
          </button>
        </>
      )}
    </div>
  );
}
