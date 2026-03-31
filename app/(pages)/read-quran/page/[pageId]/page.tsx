"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import GetPage from "../../service/GetPage";
import { toArabicNumber, showPopover, hidePopover } from "@/utils/helpers";
import QuranPageRenderer from "../../components/QuranPageRenderer";
import Footer from "@/components/layout/Footer";
import { useQuranNavigation, useContainerFontSize } from "@/hooks/readQuran";

export default function PageView() {
  const { language } = useLanguage();
  const navigation = useQuranNavigation("page");
  const [pageVerses, setPageVerses] = useState<any>(null);
  const quranContentRef = useRef<HTMLDivElement>(null);
  const { fontSize, lineHeight } = useContainerFontSize(quranContentRef);

  useEffect(() => {
    if (navigation.number) {
      const fetchPageData = async () => {
        try {
          const data = await GetPage(navigation.number!);
          setPageVerses(data);
        } catch (error) {
          console.error("Error fetching Page:", error);
        }
      };
      fetchPageData();
    }
  }, [navigation.number]);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center md:p-5 bg-background text-foreground dark:bg-background dark:text-foreground">
        <div className="relative mt-10 w-[90%] max-w-[1500px] mx-auto flex flex-col items-center">
          <div>
            {navigation.hasNext && (
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
                      {language === "ar" ? "الصفحة التالية" : "Next Page"}
                    </h3>
                  </div>
                </div>
              </>
            )}
            {navigation.hasPrev && (
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
                      {language === "ar" ? "الصفحة السابقة" : "Prev Page"}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            ref={quranContentRef}
            className={`w-full mt-6 flex flex-col items-center transition-all duration-300`}
          >
            <div className="flex flex-col items-center gap-5 mb-5">
              <h1 className="md:text-4xl text-2xl font-bold text-primary">
                {language === "ar" ? "صفحة" : "Page"}{" "}
                {language === "ar"
                  ? toArabicNumber(navigation.currentNumber)
                  : navigation.currentNumber}
              </h1>
            </div>

            <div
              className={`w-full md:w-[90%] lg:w-[800px] py-4 px-2 overflow-hidden`}
            >
              <QuranPageRenderer
                verses={pageVerses}
                fontSize={fontSize}
                lineHeight={lineHeight}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
