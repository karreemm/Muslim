"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import TranslationPair from "../../../../Types";
import { useLanguage } from "../../../../Context/LanguageContext";
import Navbar from "@/app/Components/general/Navbar";
import GetJuzAyahs from "../../Service/GetJuz";
import {
  toArabicNumber,
  showPopover,
  hidePopover,
} from "../../../../Utils/Helpers";
import { RenderJuzText } from "./RenderQuranText";
import Footer from "@/app/Components/general/Footer";
import {
  useQuranNavigation,
  useQuranDisplay,
} from "../../../../Hooks/ReadQuran";

export default function JuzPage() {
  const { language } = useLanguage();
  const navigation = useQuranNavigation("juz");
  const display = useQuranDisplay();
  const [JuzData, setJuzData] = useState<any>(null);

  useEffect(() => {
    if (navigation.number) {
      const fetchJuzData = async () => {
        try {
          const data = await GetJuzAyahs(navigation.number!);
          setJuzData(data);
        } catch (error) {
          console.error("Error fetching Juz:", error);
        }
      };
      fetchJuzData();
    }
  }, [navigation.number]);

  const Surahs: TranslationPair = {
    en: "Surahs",
    ar: "سور",
  };

  const Size: TranslationPair = {
    en: "Font Size",
    ar: "حجم الخط",
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col items-center p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="relative mt-20 w-[95%] flex flex-col items-center">
          <div>
            {navigation.hasNext && (
              <>
                <button
                  onClick={() => navigation.handleNavigation("next")}
                  className="absolute top-0 right-0 text-2xl text-teal-600 dark:text-white"
                  onMouseEnter={() => showPopover("popover-next")}
                  onMouseLeave={() => hidePopover("popover-next")}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>

                <div
                  data-popover
                  id="popover-next"
                  role="tooltip"
                  className="absolute top-10 right-0 z-10 invisible inline-block w-32 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                >
                  <div className="flex justify-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {(navigation.navigationData.next as any)?.name?.[
                        language
                      ] || ""}
                    </h3>
                  </div>
                </div>
              </>
            )}
            {navigation.hasPrev && (
              <>
                <button
                  onClick={() => navigation.handleNavigation("prev")}
                  className="absolute top-0 left-0 text-2xl text-teal-600 dark:text-white"
                  onMouseEnter={() => showPopover("popover-prev")}
                  onMouseLeave={() => hidePopover("popover-prev")}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <div
                  data-popover
                  id="popover-prev"
                  role="tooltip"
                  className="absolute top-10 left-0 z-10 invisible inline-block w-32 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                >
                  <div className="flex justify-center px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {(navigation.navigationData.prev as any)?.name?.[
                        language
                      ] || ""}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-5">
            <h1 className="md:text-5xl text-3xl font-bold text-teal-600 dark:text-white">
              {(navigation.navigationData.current as any)?.name?.[language] ||
                ""}
            </h1>
            <p className="md:text-2xl text-xl flex items-center">
              {Surahs[language]}:{" "}
              {language === "ar"
                ? toArabicNumber(
                    (navigation.navigationData.current as any)?.surahs
                  )
                : (navigation.navigationData.current as any)?.surahs}
            </p>
          </div>

          <div dir="rtl" className="w-full md:w-[80%] py-4 px-2 overflow-auto">
            {RenderJuzText(JuzData, display.fontSize, display.lineHeight)}
          </div>

          <div
            dir={language === "ar" ? "rtl" : "ltr"}
            className="mt-5 flex gap-5"
          >
            <button
              onClick={display.increaseFontSize}
              className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-600 text-white font-bold"
            >
              <FontAwesomeIcon icon={faPlus} />
              {Size[language]}
            </button>
            <button
              onClick={display.decreaseFontSize}
              className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-600 text-white font-bold"
            >
              <FontAwesomeIcon icon={faMinus} />
              {Size[language]}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
