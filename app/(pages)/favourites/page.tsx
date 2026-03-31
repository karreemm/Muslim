"use client";

import { useState } from "react";
import ButtonGroup from "./components/ButtonGroup";
import FavouriteSurahsTable from "./sections/FavouriteSurahsTable";
import FavouriteHadithsTable from "./sections/FavouriteHadithsTable";
import FavouriteAzkarTable from "./sections/FavouriteAzkarTable";

export default function ParentComponent() {
  const [selectedButton, setSelectedButton] = useState<string>("Surahs");

  const handleSelectionChange = (selected: string) => {
    setSelectedButton(selected);
  };

  return (
    <>
      <div className="w-full max-w-[1500px] mx-auto min-h-screen flex justify-center bg-background text-foreground dark:bg-background dark:text-foreground">
        <div className="w-full mt-10">
          <ButtonGroup onSelectionChange={handleSelectionChange} />
          {selectedButton === "Surahs" && <FavouriteSurahsTable />}
          {selectedButton === "Hadiths" && <FavouriteHadithsTable />}
          {selectedButton === "Azkar" && <FavouriteAzkarTable />}
        </div>
      </div>
    </>
  );
}
