"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/general/Navbar";
import GetPage from "../../service/GetPage";
import {
    toArabicNumber,
    showPopover,
    hidePopover,
} from "@/utils/helpers";
import QuranPageRenderer from "../../components/QuranPageRenderer";
import Footer from "@/components/general/Footer";
import {
    useQuranNavigation,
    useQuranDisplay,
} from "@/hooks/readQuran";

export default function PageView() {
    const { language } = useLanguage();
    const navigation = useQuranNavigation("page");
    const display = useQuranDisplay();
    const [pageVerses, setPageVerses] = useState<any>(null);
    const quranContentRef = useRef<HTMLDivElement>(null);

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
            <Navbar />
            <div className="w-full min-h-screen flex flex-col items-center md:p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
                <div className="relative mt-20 w-[90%] max-w-[1500px] mx-auto flex flex-col items-center">
                    <div>
                        {navigation.hasNext && (
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
                            <h1 className="md:text-4xl text-2xl font-bold text-teal-600 dark:text-teal-500">
                                {language === "ar" ? "صفحة" : "Page"} {language === "ar" ? toArabicNumber(navigation.currentNumber) : navigation.currentNumber}
                            </h1>
                        </div>

                        <div
                            className={`w-full md:w-[90%] lg:w-[800px] py-4 px-2 overflow-hidden`}
                        >
                            <QuranPageRenderer
                                verses={pageVerses}
                                fontSize={display.fontSize}
                                lineHeight={display.lineHeight}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
