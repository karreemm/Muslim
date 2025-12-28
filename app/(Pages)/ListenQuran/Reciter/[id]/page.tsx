"use client";

import { useLanguage } from "@/app/Context/LanguageContext";
import Navbar from "@/app/Components/general/Navbar";
import Footer from "@/app/Components/general/Footer";
import Sidebar from "../../Components/Sidebar";
import SurahPlayer from "./SurahPlayer";
import TranslationPair from "@/app/Types";
import { useReciterSurahSelection } from "@/app/Hooks/ListenQuran";

export default function ReciterPage() {
  const { language } = useLanguage();

  const {
    reciterId,
    selectedSurah,
    selectedSurahNameEn,
    selectedSurahNameAr,
    reciterNameEn,
    reciterNameAr,
    handleSurahChange,
  } = useReciterSurahSelection();

  const Reciter: TranslationPair = {
    ar: "فضيلة الشيخ",
    en: "His Eminence Sheikh",
  };

  return (
    <>
      <Navbar />
      <Sidebar
        onSurahSelect={handleSurahChange}
        selectedSurah={selectedSurah}
      />
      <div
        className={`w-full min-h-screen flex flex-col items-center justify-center gap-5 p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white ${language === "en" ? " md:ml-0" : "md:mr-0"
          }`}
      >
        <div
          className={`mt-14 text-center flex flex-col gap-2 items-center ${language === "en" ? "ml-10 md:ml-0" : "mr-10 md:mr-0"
            } `}
        >
          <h1 className="text-xl md:text-2xl ">{Reciter[language]}</h1>
          <h2 className="text-2xl md:text-4xl">
            {language === "ar" ? reciterNameAr : reciterNameEn}
          </h2>
        </div>
        <div
          className={`mt-5 flex items-center gap-2 ${language === "en" ? "ml-10 md:ml-0" : "mr-10 md:mr-0"
            } `}
        >
          <h3 className="text-2xl md:text-4xl">
            {language === "ar" ? "سورة" : "Surah"}
          </h3>
          <h3 className="text-2xl md:text-4xl">
            {language === "ar" ? selectedSurahNameAr : selectedSurahNameEn}
          </h3>
        </div>
        <div
          className={`md:mt-5 scale-75 md:scale-100 w-full ${language === "en" ? "ml-10 md:ml-0" : "mr-10 md:mr-0"
            } `}
        >
          {reciterId && selectedSurah !== null && (
            <SurahPlayer
              surahNumber={selectedSurah}
              reciterId={reciterId}
              onSurahChange={handleSurahChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
