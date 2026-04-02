"use client";

import { useState } from "react";
import { useLanguage } from "../../context/general/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { toArabicNumber } from "../../utils/helpers";
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
  const isArabic = language === "ar";

  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const currentPage = externalCurrentPage ?? internalCurrentPage;

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (externalCurrentPage === undefined) {
      setInternalCurrentPage(page);
    }
    onPageChange(page);
  };

  const generateDesktopPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    if (!pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  const formatNumber = (num: number) => (isArabic ? toArabicNumber(num) : num);

  return (
    <div className="mx-auto mt-10 flex items-center justify-center gap-2 px-4">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="group flex h-11 w-11 sm:h-11 sm:w-auto sm:px-4 items-center justify-center gap-2 rounded-xl font-semibold text-sm
          transition-all duration-300 ease-out
          bg-card text-foreground border border-border/50
          hover:bg-secondary hover:border-primary/30 hover:shadow-md hover:shadow-primary/10
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
          active:scale-95 shrink-0"
        aria-label={t("common.previous")}
      >
        <FontAwesomeIcon
          icon={isArabic ? faChevronRight : faChevronLeft}
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
        />
        <span className="hidden sm:inline dynamic-font">
          {t("common.previous")}
        </span>
      </button>

      <div className="flex items-center gap-1.5 sm:hidden">
        <div
          className="flex h-11 min-w-[4.5rem] px-3 items-center justify-center rounded-xl font-bold text-sm
          bg-primary text-primary-foreground shadow-lg shadow-primary/30 mx-1"
        >
          <span className="dynamic-font">
            {isArabic
              ? `${formatNumber(currentPage)} / ${formatNumber(totalPages)}`
              : `${currentPage} / ${totalPages}`}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5">
        {generateDesktopPages().map((item, idx) => (
          <div key={idx}>
            {item === "..." ? (
              <span className="px-2 text-muted-foreground text-lg font-bold">
                •••
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(Number(item))}
                aria-current={currentPage === item ? "page" : undefined}
                className={`
                  flex h-11 w-11 items-center justify-center rounded-xl
                  font-bold text-sm transition-all duration-300 ease-out
                  ${
                    currentPage === item
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                      : "bg-card text-foreground border border-border/50 hover:border-primary/30 hover:bg-secondary/50 hover:shadow-md active:scale-95"
                  }
                `}
              >
                {formatNumber(Number(item))}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group flex h-11 w-11 sm:h-11 sm:w-auto sm:px-4 items-center justify-center gap-2 rounded-xl font-semibold text-sm
          transition-all duration-300 ease-out
          bg-card text-foreground border border-border/50
          hover:bg-secondary hover:border-primary/30 hover:shadow-md hover:shadow-primary/10
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
          active:scale-95 shrink-0"
        aria-label={t("common.next")}
      >
        <span className="hidden sm:inline dynamic-font">
          {t("common.next")}
        </span>
        <FontAwesomeIcon
          icon={isArabic ? faChevronLeft : faChevronRight}
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
};

export default Pagination;
