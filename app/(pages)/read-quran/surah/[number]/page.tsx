"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/general/Navbar";
import GetSurah from "../../service/GetSurah";
import { showPopover, hidePopover } from "@/utils/helpers";
import Footer from "@/components/general/Footer";
import {
  useQuranNavigation,
  useQuranDisplay,
  useFullscreen,
} from "@/hooks/readQuran";
import QuranMultiPageRenderer from "../../components/QuranMultiPageRenderer";
import ReadingProgressBar from "@/components/general/ReadingProgressBar";

interface SurahData {
  number: number;
  en: string;
  ar: string;
  arTashkeel: string;
  ayahs: number;
  startPage: number;
  endPage: number;
}

export default function SurahPage() {
  const { language } = useLanguage();
  const navigation = useQuranNavigation("surah");
  const display = useQuranDisplay();
  const [surahVerses, setSurahVerses] = useState<any>(null);
  const quranContentRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(quranContentRef);

  const [loadedPages, setLoadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const handleLoadedPagesChange = useCallback(
    (loaded: number, total: number) => {
      setLoadedPages(loaded);
      setTotalPages(total);
    },
    [],
  );

  const currentSurah = navigation.navigationData.current as
    | SurahData
    | undefined;
  const nextSurah = navigation.navigationData.next as SurahData | undefined;
  const prevSurah = navigation.navigationData.prev as SurahData | undefined;

  useEffect(() => {
    if (navigation.number) {
      const fetchSurahData = async () => {
        try {
          const data = await GetSurah(navigation.number!);
          setSurahVerses(data);
        } catch (error) {
          console.error("Error fetching Surah:", error);
        }
      };
      fetchSurahData();
    }
  }, [navigation.number]);

  return (
    <>
      <Navbar />
      <ReadingProgressBar
        totalPages={totalPages || undefined}
        loadedPages={loadedPages || undefined}
      />
      <div className="w-full min-h-screen flex flex-col items-center md:p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="relative mt-20 w-[90%] max-w-[1500px] mx-auto flex flex-col items-center">
          <div>
            {navigation.hasNext && nextSurah && (
              <>
                <button
                  onClick={() => navigation.handleNavigation("next")}
                  className="absolute top-0 right-0 text-2xl text-teal-600 dark:text-white hover:cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out"
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
                      {nextSurah[language as keyof SurahData]?.toString()}
                    </h3>
                  </div>
                </div>
              </>
            )}
            {navigation.hasPrev && prevSurah && (
              <>
                <button
                  onClick={() => navigation.handleNavigation("prev")}
                  className="absolute top-0 left-0 text-2xl text-teal-600 dark:text-white hover:cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out"
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
                      {prevSurah[language as keyof SurahData]?.toString()}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            ref={quranContentRef}
            className={`w-full mt-6 flex flex-col items-center transition-all duration-300 ${
              isFullscreen
                ? "flex flex-col items-center justify-center p-5 w-full h-full bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-teal-500 fixed top-0 left-0 z-50 overflow-y-auto"
                : ""
            }`}
          >
            <div
              className={`w-full md:w-[90%] lg:w-[800px] py-4 px-2 overflow-hidden ${
                isFullscreen
                  ? "h-full flex flex-col items-center justify-center"
                  : ""
              }`}
            >
              <QuranMultiPageRenderer
                verses={surahVerses}
                fontSize={display.fontSize}
                lineHeight={display.lineHeight}
                surahHeader={
                  currentSurah
                    ? {
                        surahNumber: currentSurah.number,
                        firstAyah: 1,
                        lastAyah: currentSurah.ayahs,
                      }
                    : undefined
                }
                onLoadedPagesChange={handleLoadedPagesChange}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
