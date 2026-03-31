"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuranAudio } from "@/context/QuranAudioContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import GetJuz from "../../service/GetJuz";
import { showPopover, hidePopover } from "@/utils/helpers";
import Footer from "@/components/layout/Footer";
import { useQuranNavigation, useContainerFontSize } from "@/hooks/readQuran";
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
  const { playSurah } = useQuranAudio();
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
      <div className="w-full min-h-screen flex flex-col items-center md:p-5 bg-background text-foreground dark:bg-background dark:text-foreground">
        <div className="relative mt-10 w-[90%] max-w-[1500px] mx-auto flex flex-col items-center">
          <div>
            {navigation.hasNext && nextJuz && (
              <>
                <button
                  onClick={() => navigation.handleNavigation("next")}
                  className="absolute top-0 right-0 text-2xl text-primary hover:cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out"
                  onMouseEnter={() => showPopover("popover-next")}
                  onMouseLeave={() => hidePopover("popover-next")}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>

                <div
                  data-popover
                  id="popover-next"
                  role="tooltip"
                  className="absolute top-10 right-0 z-10 invisible inline-block w-32 text-sm text-muted-foreground transition-opacity duration-300 bg-popover border border-border rounded-lg shadow-xs opacity-0"
                >
                  <div className="flex justify-center px-3 py-2 bg-secondary border-b border-border rounded-t-lg">
                    <h3 className="font-semibold text-popover-foreground">
                      {nextJuz.name[language as keyof typeof nextJuz.name]}
                    </h3>
                  </div>
                </div>
              </>
            )}

            {juzVerses && juzVerses.length > 0 && (
              <button
                onClick={() => {
                  const uniqueSurahs = Array.from(
                    new Set(
                      juzVerses.map((v: any) =>
                        parseInt(v.verse_key.split(":")[0]),
                      ),
                    ),
                  ) as number[];
                  playSurah(uniqueSurahs[0], undefined, uniqueSurahs);
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold shadow-md hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlay} />
                <span>{language === "ar" ? "استماع" : "Listen"}</span>
              </button>
            )}

            {navigation.hasPrev && prevJuz && (
              <>
                <button
                  onClick={() => navigation.handleNavigation("prev")}
                  className="absolute top-0 left-0 text-2xl text-primary hover:cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out"
                  onMouseEnter={() => showPopover("popover-prev")}
                  onMouseLeave={() => hidePopover("popover-prev")}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <div
                  data-popover
                  id="popover-prev"
                  role="tooltip"
                  className="absolute top-10 left-0 z-10 invisible inline-block w-32 text-sm text-muted-foreground transition-opacity duration-300 bg-popover border border-border rounded-lg shadow-xs opacity-0"
                >
                  <div className="flex justify-center px-3 py-2 bg-secondary border-b border-border rounded-t-lg">
                    <h3 className="font-semibold text-popover-foreground">
                      {prevJuz.name[language as keyof typeof prevJuz.name]}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            className={`w-full mt-14 flex flex-col items-center transition-all duration-300`}
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
