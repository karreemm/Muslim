"use client";

import { useState } from "react";
import ButtonGroup from "./components/ButtonGroup";
import FavouriteSurahsTable from "./sections/FavouriteSurahsTable";
import FavouriteHadithsTable from "./sections/FavouriteHadithsTable";
import FavouriteAzkarTable from "./sections/FavouriteAzkarTable";
import { useLanguage } from "@/context/general/LanguageContext";

export default function ParentComponent() {
  const [selectedButton, setSelectedButton] = useState<string>("Surahs");
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="w-full max-w-7xl mx-auto pt-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === "en" ? "Your Favourites" : "قائمتك المفضلة"}
          </h1>
        </div>
        
        <ButtonGroup onSelectionChange={setSelectedButton} />
        
        <div className="transition-opacity duration-300">
          {selectedButton === "Surahs" && <FavouriteSurahsTable />}
          {selectedButton === "Hadiths" && <FavouriteHadithsTable />}
          {selectedButton === "Azkar" && <FavouriteAzkarTable />}
        </div>
      </div>
    </div>
  );
}