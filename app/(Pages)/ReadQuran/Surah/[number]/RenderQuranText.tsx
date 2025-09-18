"use client";

import { toArabicNumber } from "../../../../Utils/Helpers";
import TranslationPair from "../../../../Types";
import { useLanguage } from "../../../../Context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAyahInteraction, useScrollToAyah } from "../../../../Hooks/ReadQuran";

export const RenderQuranText = (
  surahData: any,
  fontSize: number,
  lineHeight: number,
  SNameAr: string | undefined,
  SNameEn: string | undefined,
  SNumber: number | string
) => {
  const { language } = useLanguage();
  const ayahInteraction = useAyahInteraction();
  const scrollToAyah = useScrollToAyah(surahData?.ayahs?.length);

  const handleAyahClick = (ayah: any) => {
    ayahInteraction.handleAyahClick(ayah, SNameAr, SNameEn, SNumber);
  };

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

  if (!surahData || !surahData.ayahs.length) return null;

  const ayahs = [...surahData.ayahs];

  if (
    surahData.number !== 9 &&
    ayahs[0].text.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")
  ) {
    ayahs[0].text = ayahs[0].text
      .replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/, "")
      .trim();
  }

  return (
    <div dir="rtl" className="fontAmiri flex flex-col items-center">
      <div
        dir="rtl"
        className="fontAmiri basmala text-xl md:text-3xl text-center my-4"
      >
        {surahData.number === 9 ? (
          <p>أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ</p>
        ) : (
          <p>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}
      </div>
      <div
        id="scrollable-div"
        ref={scrollToAyah.containerRef}
        className=" bg-white text-black shadow-md rounded-lg px-4 py-2 mt-5 md:mt-10 ayah-container max-w-[1200px] max-h-[300px] overflow-y-auto flex flex-wrap"
      >
        {ayahs.map((ayah) => (
          <div
            key={ayah.number}
            ref={scrollToAyah.setAyahRef(ayah.numberInSurah)}
            className={`fontAmiri flex items-center relative ${
              scrollToAyah.highlightedAyahNumber === ayah.numberInSurah
                ? "bg-yellow-200 rounded-lg"
                : ""
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}` }}
            onClick={() => handleAyahClick(ayah)}
            id={`ayah-${ayah.numberInSurah}`}
          >
            <p
              dir="rtl"
              className="ayah cursor-pointer"
              id={`ayah-${ayah.numberInSurah}`}
            >
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

            {/* Popover */}
            {ayahInteraction.showPopover.isOpen &&
              ayahInteraction.showPopover.ayahNumber === ayah.numberInSurah && (
                <div
                  dir={language === "ar" ? "rtl" : "ltr"}
                  ref={ayahInteraction.popoverRef}
                  className="dynamic-font z-40 absolute bg-white  w-64 p-2 flex flex-col rounded-sm shadow-lg top-0"
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