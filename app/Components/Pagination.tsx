"use client";

import { useState } from "react";
import { useLanguage } from "../Context/LanguageContext";
import TranslationPair from "../Lib/Types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toArabicNumber } from "../Lib/Helpers";
import useMediaQuery from "../Lib/CustomHooks";

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, onPageChange }) => {
  const { language } = useLanguage();
  const isMdOrLarger = useMediaQuery('(min-width: 768px)'); // Check if the screen is md or larger

  const Next: TranslationPair = {
    ar: "التالي",
    en: "Next"
  };

  const Previous: TranslationPair = {
    ar: "السابق",
    en: "Previous"
  };

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const generatePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMdOrLarger) {
        pages.push(1, 2);

        if (currentPage > 3) {
          pages.push("...");
        }

        if (currentPage > 2 && currentPage < totalPages - 1) {
          pages.push(currentPage);
        }

        if (currentPage < totalPages - 2) {
          pages.push("...");
        }

        pages.push(totalPages - 1, totalPages);
      } else {
        pages.push(1);

        if (currentPage > 2) {
          pages.push("...");
        }

        if (currentPage < totalPages - 1) {
          pages.push("...");
        }

        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mx-auto mt-12 px-0 text-teal-600 dark:text-white md:px-8">
      <div className="flex items-center justify-between" aria-label="Pagination">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="hover:opacity-80 md:text-xl font-semibold flex items-center gap-x-2"
        >
          <FontAwesomeIcon className="hidden md:inline-block" icon={language === "en" ? faArrowLeft : faArrowRight} />
          {Previous[language]}
        </button>
        <ul className="flex items-center gap-1">
          {generatePages().map((item, idx) => (
            <li key={idx} className="text-sm">
              {item === "..." ? (
                <div>{item}</div>
              ) : (
                <button
                  onClick={() => handlePageClick(Number(item))}
                  aria-current={currentPage === item ? "page" : undefined}
                  className={`px-3 py-1 rounded-lg font-semibold duration-150 hover:opacity-90 ${
                    currentPage === item ? "bg-teal-600 W-[49px] h-[28px] flex justify-center items-center text-white font-semibold" : ""
                  }`}
                >
                  {typeof item === "number" && language === "ar" ? toArabicNumber(item) : item}
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="hover:opacity-80 md:text-xl font-semibold flex items-center gap-x-2"
        >
          {Next[language]}
          <FontAwesomeIcon className="hidden md:inline-block" icon={language === "en" ? faArrowRight : faArrowLeft} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;