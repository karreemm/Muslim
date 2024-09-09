"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/Context/LanguageContext";
import Nvbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import { AzkarCategories } from "@/app/Lib/Constants";
import TranslationPair from "@/app/Lib/Types";
import Pagination from "../../../Components/Pagination";
import { toArabicNumber } from "@/app/Lib/Helpers";
import DisplayZekr from "./DisplayZekr";
import DisplayAzkar from "./DisplayAzkar";
import { ClipLoader } from "react-spinners";

export default function CategoryPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryNameEn, setCategoryNameEn] = useState<string>("");
  const [categoryNameAr, setCategoryNameAr] = useState<string>("");
  const [zekrNumberEn, setZekrNumberEn] = useState<number | null>(null);
  const [zekrNumberAr, setZekrNumberAr] = useState<number | string | null>(null);
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
      setTotalPages(Math.ceil(total / 5)); // Assuming 5 items per page
    } else {
      setCategoryId("morning_azkar");
    }

    if (zekrNumber) {
      setZekrNumberEn(parseInt(zekrNumber, 10));
      setZekrNumberAr(toArabicNumber(parseInt(zekrNumber, 10)));
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (categoryId) {
      const zekr = AzkarCategories.find((b) => b.id === categoryId);
      if (zekr) {
        setCategoryNameEn(zekr.en);
        setCategoryNameAr(zekr.ar);
      } else {
        console.log("error");
      }
    }
  }, [categoryId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setZekrNumberEn(null);
    setZekrNumberAr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log(`Current Page: ${page}`);
  };

  const Category: TranslationPair = {
    ar: "فئة",
    en: "Category",
  };

  return (
    <>
      <Nvbar />
      <div className="w-full min-h-screen flex flex-col gap-5 p-5 bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="w-full flex justify-center">
          <h1 className="mt-24 text-4xl font-bold flex gap-1 text-center">
            {Category[language]} {language === "en" ? categoryNameEn : categoryNameAr}
          </h1>
        </div>
        <div className="mt-10 w-full bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
            </div>
          ) : zekrNumberEn !== null ? (
            <DisplayZekr zekrNumber={zekrNumberEn} categoryId={categoryNameAr} />
          ) : (
            <DisplayAzkar startingNumber={(currentPage - 1) * 5 + 1} categoryId={categoryNameAr} />
          )}
        </div>
        <div className="w-full">
          <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
        <div className="h-10"></div>
      </div>
      <Footer />
    </>
  );
}