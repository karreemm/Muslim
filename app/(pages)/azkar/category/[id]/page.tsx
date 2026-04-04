"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/general/LanguageContext";
import { AzkarCategories } from "@/constants/azkarData";
import Pagination from "@/components/general/Pagination";
import { toArabicNumber } from "@/utils/helpers";
import DisplayZekr from "../../components/DisplayZekr";
import DisplayAzkar from "../../components/DisplayAzkar";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrayingHands, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function CategoryPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isArabic = language === "ar";

  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryNameEn, setCategoryNameEn] = useState<string>("");
  const [categoryNameAr, setCategoryNameAr] = useState<string>("");
  const [zekrNumberEn, setZekrNumberEn] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const parts = pathname.split("/");
    const id = parts[parts.length - 1];
    const zekrNumber = searchParams.get("zekr");

    if (id) {
      setCategoryId(id);
      const total = AzkarCategories.find((b) => b.id === id)?.number || 0;
      setTotalPages(Math.ceil(total / 5));
    } else {
      setCategoryId("morning_azkar");
    }

    if (zekrNumber) {
      setZekrNumberEn(parseInt(zekrNumber, 10));
    } else {
      setZekrNumberEn(null);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (categoryId) {
      const zekr = AzkarCategories.find((b) => b.id === categoryId);
      if (zekr) {
        setCategoryNameEn(zekr.en);
        setCategoryNameAr(zekr.ar);
      }
    }
  }, [categoryId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setZekrNumberEn(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-[92%] max-w-[1500px] mx-auto pt-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground ">
            {isArabic ? categoryNameAr : categoryNameEn}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-4">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="text-4xl text-primary animate-spin"
                />
                <p className="text-muted-foreground">{t("common.loading")}</p>
              </div>
            </div>
          ) : zekrNumberEn !== null ? (
            <DisplayZekr
              zekrNumber={zekrNumberEn}
              categoryId={categoryNameAr}
            />
          ) : (
            <DisplayAzkar
              startingNumber={(currentPage - 1) * 5 + 1}
              categoryId={categoryNameAr}
            />
          )}
        </div>

        {totalPages > 1 && zekrNumberEn === null && (
          <div className="mt-12">
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>

      <div className="h-10" />
    </div>
  );
}
