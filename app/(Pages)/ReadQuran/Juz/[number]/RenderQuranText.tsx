"use client";

import { useState, useEffect } from "react";
import { toArabicNumber } from "../../../../Utils/Helpers";
import TranslationPair from "../../../../Types";
import { useLanguage } from "../../../../Context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { surahNames } from "../../../../Contants/QuranData";
import { ClipLoader } from "react-spinners";
import { useAyahInteraction, useScrollToAyah } from "../../../../Hooks/ReadQuran";

export const RenderJuzText = (
  juzData: any,
  fontSize: number,
  lineHeight: number
) => {
  const { language } = useLanguage();
  const ayahInteraction = useAyahInteraction();
  const scrollToAyah = useScrollToAyah(juzData?.length);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAyahClick = (ayah: any) => {
    // Find surah information for this ayah
    const surah = surahNames.find((s) => s.number === ayah.surah.number);
    if (surah) {
      ayahInteraction.handleAyahClick(ayah, surah.ar, surah.en, ayah.surah.number);
    }
  };

  useEffect(() => {
    if (juzData) {
      setLoading(false);
    }
  }, [juzData]);

  const Message: TranslationPair = {
    en: "save this ayah?",
    ar: " حفظ هذه الآية؟",
  };

  const Yes: TranslationPair = {
    en: "Yes",
    ar: "نعم",
  };

  const No: TranslationPair = {
    en: "No",
    ar: "لا",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
      </div>
    );
  }

  if (!juzData || !juzData.length) return null;

  const ayahs = juzData;
  const surahNumber = ayahs[0]?.surah.number;
  const firstAyahText = ayahs[0]?.text;

  const displayBasmala =
    surahNumber !== 9 &&
    firstAyahText?.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ");

  if (displayBasmala) {
    ayahs[0].text = firstAyahText
      .replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "")
      .trim();
  }

  return (
    <div dir="rtl" className="fontAmiri flex flex-col items-center">
      <div className="basmala text-xl md:text-3xl text-center my-4">
        {surahNumber === 9 ? (
          <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
        ) : (
          <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}
      </div>

      <div
        id="scrollable-div"
        ref={scrollToAyah.containerRef}
        className="shadow-md bg-white text-black rounded-lg px-4 py-2 mt-5 md:mt-10 ayah-container max-w-[1200px] max-h-[300px] overflow-y-auto flex flex-wrap"
      >
        {ayahs.map((ayah: any) => (
          <div
            key={ayah.number}
            ref={scrollToAyah.setAyahRef(ayah.numberInSurah)}
            className={`flex flex-col relative items-start ${
              ayah.text.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")
                ? "w-full"
                : ""
            }  ${
              scrollToAyah.highlightedAyahNumber === ayah.numberInSurah
                ? "bg-yellow-200 dark:bg-teal-800 rounded-lg"
                : ""
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
            onClick={() => handleAyahClick(ayah)}
            id={`ayah-${ayah.numberInSurah}`}
          >
            {ayah.text.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ") ? (
              <>
                <div className="w-full text-center my-4 md:my-8">
                  <p className="w-full ayah block text-2xl md:text-4xl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱللرَّحِيمِ
                  </p>
                </div>
                <p className="ayah cursor-pointer w-full">
                  {ayah.text
                    .replace("بِسْمِ ٱللَّهِ ٱللرَّحْمَٰنِ ٱللرَّحِيمِ", "")
                    .trim()}
                  <span className="separator mx-1">
                    <span className="icon">
                      ۝
                      <span className="number">
                        {toArabicNumber(ayah.numberInSurah)}
                      </span>
                    </span>
                  </span>
                </p>
              </>
            ) : (
              <p className="ayah w-full cursor-pointer">
                {ayah.text}
                <span className="separator mx-1">
                  <span className="icon">
                    ۝
                    <span className="number">
                      {toArabicNumber(ayah.numberInSurah)}
                    </span>
                  </span>
                </span>
              </p>
            )}

            {/* Popover */}
            {ayahInteraction.showPopover.isOpen &&
              ayahInteraction.showPopover.ayahNumber === ayah.numberInSurah && (
                <div
                  dir={language === "ar" ? "rtl" : "ltr"}
                  ref={ayahInteraction.popoverRef}
                  className="dynamic-font z-40 absolute bg-white w-64 p-2 flex flex-col rounded-sm shadow-lg top-0"
                  style={{ [language === "ar" ? "left" : "right"]: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close icon */}
                  <button
                    className="absolute top-2"
                    style={{ [language === "ar" ? "left" : "right"]: "1rem" }}
                    onClick={ayahInteraction.handleClosePopover}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                  <p className="ml-5">{Message[language]}</p>
                  <div className="flex gap-3 items-center w-full justify-center">
                    <button
                      className="bg-green-500 hover:opacity-80 text-white w-[40%] rounded-lg text-sm py-1"
                      onClick={() => ayahInteraction.handleSaveAyah(ayah)}
                    >
                      {Yes[language]}
                    </button>
                    <button
                      className="bg-red-500 hover:opacity-80 text-white w-[40%] rounded-lg text-sm py-1"
                      onClick={ayahInteraction.handleClosePopover}
                    >
                      {No[language]}
                    </button>
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};