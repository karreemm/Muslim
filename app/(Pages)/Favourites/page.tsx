"use client";

import { useState } from "react";
import ButtonGroup from "./components/ButtonGroup";
import FavouriteSurahsTable from "./sections/FavouriteSurahs/Table";
import FavouriteHadithsTable from "./sections/FavouriteHadiths/Table";
import FavouriteAzkarTable from "./sections/FavouriteAzkar/Table";
import Navbar from "../../Components/general/Navbar";
import Footer from "../../Components/general/Footer";

export default function ParentComponent() {
  const [selectedButton, setSelectedButton] = useState<string>("Surahs");

  const handleSelectionChange = (selected: string) => {
    setSelectedButton(selected);
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white min-h-screen">
        <div className="w-[90%] mt-32">
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
