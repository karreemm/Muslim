"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowRight,
  faArrowLeft,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import TranslationPair from "../../../../Types";
import { useLanguage } from "../../../../Context/LanguageContext";
import Navbar from "@/app/Components/general/Navbar";
import GetSurah from "../../Service/GetSurah";
import {
  toArabicNumber,
  showPopover,
  hidePopover,
} from "../../../../Utils/Helpers";
import { RenderQuranText } from "./RenderQuranText";
import Footer from "@/app/Components/general/Footer";
import ShareModal from "@/app/Components/modals/ShareModal";
import {
  useQuranNavigation,
  useQuranDisplay,
  useFullscreen,
} from "../../../../Hooks/ReadQuran";

export default function SurahPage() {
  const { language } = useLanguage();
  const navigation = useQuranNavigation("surah");
  const display = useQuranDisplay();
  const [surahData, setSurahData] = useState<any>(null);
  const quranContentRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(quranContentRef);

  const SurahNameAr = (navigation.navigationData.current as any)?.ar;
  const SurahNameEn = (navigation.navigationData.current as any)?.en;

  useEffect(() => {
    if (navigation.number) {
      const fetchSurahData = async () => {
        try {
          const data = await GetSurah(navigation.number!);
          setSurahData(data);
        } catch (error) {
          console.error("Error fetching Surah:", error);
        }
      };
      fetchSurahData();
    }
  }, [navigation.number]);

  const Ayat: TranslationPair = {
    en: "Ayahs",
    ar: "آيات",
  };

  const Size: TranslationPair = {
    en: "Font Size",
    ar: "حجم الخط",
  };

  const Surah: TranslationPair = {
    en: "Surah",
    ar: "سورة",
  };

  const FullscreenText: TranslationPair = {
    en: "Fullscreen",
    ar: "شاشة كاملة",
  };

  const ExitFullscreenText: TranslationPair = {
    en: "Exit",
    ar: "خروج",
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col items-center p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="relative mt-20 w-[90%] flex flex-col items-center">
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
                      {navigation.navigationData.next?.[
                        language as keyof typeof navigation.navigationData.next
                      ]?.toString()}
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
                      {navigation.navigationData.prev?.[
                        language as keyof typeof navigation.navigationData.prev
                      ]?.toString()}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            ref={quranContentRef}
            className={`w-full flex flex-col items-center transition-all duration-300 ${isFullscreen ? 'flex flex-col items-center justify-center p-5 w-full h-full bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-teal-500 fixed top-0 left-0 z-50 overflow-y-auto' : ''}`}
          >
            <div className="flex flex-col items-center gap-5">
              <h1 className="md:text-5xl text-3xl font-bold text-teal-600 dark:text-teal-500">
                {Surah[language]}{" "}
                {navigation.navigationData.current?.[
                  language as keyof typeof navigation.navigationData.current
                ]?.toString()}
              </h1>
              <p className="md:text-2xl text-xl flex items-center dark:text-white">
                {Ayat[language]}:{" "}
                {language === "ar"
                  ? toArabicNumber(surahData?.ayahs.length)
                  : surahData?.ayahs.length}
              </p>
            </div>

            <div className={`w-full md:w-[80%] py-4 px-2 overflow-auto ${isFullscreen ? 'h-full flex flex-col items-center justify-center' : ''}`}>
              {RenderQuranText(
                surahData,
                display.fontSize,
                display.lineHeight,
                SurahNameAr,
                SurahNameEn,
                navigation.currentNumber,
                isFullscreen
              )}
            </div>

            <div
              dir={language === "ar" ? "rtl" : "ltr"}
              className="mt-5 flex items-center gap-5"
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

              <ShareModal
                size="2xl"
                url={`https://muslim-one.vercel.app/ReadQuran/Surah/${navigation.currentNumber}`}
              />

              <button
                onClick={toggleFullscreen}
                className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-600 text-white font-bold"
                title={isFullscreen ? ExitFullscreenText[language] : FullscreenText[language]}
              >
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                {isFullscreen ? ExitFullscreenText[language] : FullscreenText[language]}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
