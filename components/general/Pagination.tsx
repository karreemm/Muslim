"use client";

import { useState } from "react";
import { useLanguage } from "../../context/general/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toArabicNumber } from "../../utils/helpers";
import React from "react";
import { useTranslation } from "@/hooks/general/useTranslation";

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
  currentPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
  currentPage: externalCurrentPage,
}) => {
  const { language } = useLanguage() as { language: "ar" | "en" };
  const { t } = useTranslation();

  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  const currentPage =
    externalCurrentPage !== undefined
      ? externalCurrentPage
      : internalCurrentPage;

  const handlePageClick = (page: number) => {
    if (externalCurrentPage === undefined) {
      setInternalCurrentPage(page);
    }
    onPageChange(page);
  };

  const generatePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mx-auto mt-8 flex items-center justify-center gap-2 px-4">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 items-center gap-2 rounded-full px-4 font-medium
                 transition-all duration-200 ease-in-out
                 bg-card text-foreground hover:bg-secondary
                 disabled:opacity-50 disabled:cursor-not-allowed
                 border border-border
                 shadow-xs hover:shadow-md"
      >
        <FontAwesomeIcon
          icon={language === "en" ? faArrowLeft : faArrowRight}
          className="h-4 w-4"
        />
        <span className="hidden sm:inline">{t("common.previous")}</span>
      </button>

      <div className="flex items-center gap-2">
        {generatePages().map((item, idx) => (
          <div key={idx}>
            {item === "..." ? (
              <span className="px-2 text-muted-foreground">•••</span>
            ) : (
              <button
                onClick={() => handlePageClick(Number(item))}
                aria-current={currentPage === item ? "page" : undefined}
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full
                  font-medium transition-all duration-200 ease-in-out
                  ${
                    currentPage === item
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg hover:bg-primary"
                      : "bg-card text-foreground hover:bg-secondary border border-border shadow-xs hover:shadow-md"
                  }
                `}
              >
                {language === "ar" ? toArabicNumber(Number(item)) : item}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 items-center gap-2 rounded-full px-4 font-medium
                 transition-all duration-200 ease-in-out
                 bg-card text-foreground hover:bg-secondary
                 disabled:opacity-50 disabled:cursor-not-allowed
                 border border-border
                 shadow-xs hover:shadow-md"
      >
        <span className="hidden sm:inline">{t("common.next")}</span>
        <FontAwesomeIcon
          icon={language === "en" ? faArrowRight : faArrowLeft}
          className="h-4 w-4"
        />
      </button>
    </div>
  );
};

export default Pagination;
