"use client";

import { useState } from "react";
import ButtonGroup from "./components/ButtonGroup";
import FavouriteSurahsTable from "./sections/FavouriteSurahsTable";
import FavouriteHadithsTable from "./sections/FavouriteHadithsTable";
import FavouriteAzkarTable from "./sections/FavouriteAzkarTable";
import Navbar from "../../../components/general/Navbar";
import Footer from "../../../components/general/Footer";

export default function ParentComponent() {
  const [selectedButton, setSelectedButton] = useState<string>("Surahs");

  const handleSelectionChange = (selected: string) => {
    setSelectedButton(selected);
  };

  return (
    <>
      <Navbar />
      <div className="w-full max-w-[1500px] mx-auto min-h-screen flex justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="w-full mt-32">
          <ButtonGroup onSelectionChange={handleSelectionChange} />
          {selectedButton === "Surahs" && <FavouriteSurahsTable />}
          {selectedButton === "Hadiths" && <FavouriteHadithsTable />}
          {selectedButton === "Azkar" && <FavouriteAzkarTable />}
        </div>
      </div>
      <Footer />
    </>
  );
}
