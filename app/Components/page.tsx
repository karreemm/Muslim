"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Pagination from "./Pagination";
import { useState } from "react";
import DisplayHadiths from "../ReadHadith/Book/[id]/DisplayHadiths";
import DisplayHadith from "../ReadHadith/Book/[id]/DisplayHadith";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(`Current Page: ${page}`);
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col items-center  bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="mt-20 w-full">
          <DisplayHadiths startingNumber={1} bookId="bukhari" />
        </div>
        <div className="mt-20 w-full">
          <DisplayHadith bookId="bukhari" hadithNumber={10} />
        </div>
      </div>
    </>
  );
}
