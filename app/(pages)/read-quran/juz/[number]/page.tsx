"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import GetJuz from "../../service/GetJuz";
import { showPopover, hidePopover } from "@/utils/helpers";
import Footer from "@/components/layout/Footer";
import {
  useQuranNavigation,
  useContainerFontSize,
} from "@/hooks/readQuran";
import JuzMultiPageRenderer from "../../components/JuzMultiPageRenderer";
import ReadingProgressBar from "@/components/layout/ReadingProgressBar";

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
  const navigation = useQuranNavigation("juz");
  const [juzVerses, setJuzVerses] = useState<any>(null);
  const quranContentRef = useRef<HTMLDivElement>(null);
  const { fontSize, lineHeight } = useContainerFontSize(quranContentRef);

  const [loadedPages, setLoadedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const handleLoadedPagesChange = useCallback(
    (loaded: number, total: number) => {
      setLoadedPages(loaded);
      setTotalPages(total);
    },
    [],
  );

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
      <ReadingProgressBar
        totalPages={totalPages || undefined}
        loadedPages={loadedPages || undefined}
      />
      <div className="w-full min-h-screen flex flex-col items-center md:p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="relative mt-10 w-[90%] max-w-[1500px] mx-auto flex flex-col items-center">
          <div>
            {navigation.hasNext && nextJuz && (
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
            className={`w-full mt-6 flex flex-col items-center transition-all duration-300`}
          >
            <div
              ref={quranContentRef}
              className={`w-full md:w-[90%] lg:w-[800px] py-4 px-2 overflow-hidden`}
            >
              <JuzMultiPageRenderer
                verses={juzVerses}
                fontSize={fontSize}
                lineHeight={lineHeight}
                onLoadedPagesChange={handleLoadedPagesChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
