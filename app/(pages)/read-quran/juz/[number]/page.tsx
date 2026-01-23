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
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/general/Navbar";
import GetJuz from "../../service/GetJuz";
import { toArabicNumber, showPopover, hidePopover } from "@/utils/helpers";
import Footer from "@/components/general/Footer";
import ShareModal from "@/components/modals/ShareModal";
import {
  useQuranNavigation,
  useQuranDisplay,
  useFullscreen,
} from "@/hooks/readQuran";
import { useTranslation } from "@/hooks/general/useTranslation";
import QuranMultiPageRenderer from "../../components/QuranMultiPageRenderer";

interface JuzData {
  number: number;
  name: {
    en: string;
    ar: string;
  };
  surahs: number;
  startPage: number;
}

export default function JuzPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigation = useQuranNavigation("juz");
  const display = useQuranDisplay();
  const [juzVerses, setJuzVerses] = useState<any>(null);
  const quranContentRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(quranContentRef);

  const currentJuz = navigation.navigationData.current as JuzData | undefined;
  const nextJuz = navigation.navigationData.next as JuzData | undefined;
  const prevJuz = navigation.navigationData.prev as JuzData | undefined;

  useEffect(() => {
    if (navigation.number) {
      const fetchJuzData = async () => {
        try {
          const data = await GetJuz(navigation.number!);
          setJuzVerses(data);
        } catch (error) {
          console.error("Error fetching Juz:", error);
        }
      };
      fetchJuzData();
    }
  }, [navigation.number]);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col items-center p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="relative mt-20 w-[90%] max-w-[1500px] mx-auto flex flex-col items-center">
          <div>
            {navigation.hasNext && nextJuz && (
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
                      {nextJuz.name[language as keyof typeof nextJuz.name]}
                    </h3>
                  </div>
                </div>
              </>
            )}
            {navigation.hasPrev && prevJuz && (
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
                      {prevJuz.name[language as keyof typeof prevJuz.name]}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            ref={quranContentRef}
            className={`w-full flex flex-col items-center transition-all duration-300 ${
              isFullscreen
                ? "flex flex-col items-center justify-center p-5 w-full h-full bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-teal-500 fixed top-0 left-0 z-50 overflow-y-auto"
                : ""
            }`}
          >
            <div className="flex flex-col items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <h1 className="md:text-5xl text-3xl font-bold text-teal-600 dark:text-teal-500">
                  {currentJuz?.name[language as keyof typeof currentJuz.name]}
                </h1>
              </div>
              {currentJuz && (
                <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {language === "ar" ? (
                    <>السور: {toArabicNumber(currentJuz.surahs)}</>
                  ) : (
                    <>Surahs: {currentJuz.surahs}</>
                  )}
                </p>
              )}
            </div>

            <div
              className={`w-full md:w-[90%] lg:w-[800px] py-4 px-2 overflow-hidden ${
                isFullscreen
                  ? "h-full flex flex-col items-center justify-center"
                  : ""
              }`}
            >
              <QuranMultiPageRenderer
                verses={juzVerses}
                fontSize={display.fontSize}
                lineHeight={display.lineHeight}
              />
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
                {t("common.font")}
              </button>

              <button
                onClick={display.decreaseFontSize}
                className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-600 text-white font-bold"
              >
                <FontAwesomeIcon icon={faMinus} />
                {t("common.font")}
              </button>

              <button
                onClick={toggleFullscreen}
                className="hover:opacity-80 py-2 px-4 rounded-md flex items-center gap-2 bg-teal-600 text-white font-bold"
                title={t("common.screen")}
              >
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                {t("common.screen")}
              </button>

              <ShareModal
                size="2xl"
                url={`https://muslim-one.vercel.app/read-quran/juz/${navigation.currentNumber}`}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
