"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/general/useTranslation";

interface ButtonGroupProps {
  onSelectionChange: (selected: string) => void;
}

export default function ButtonGroup({ onSelectionChange }: ButtonGroupProps) {
  const { t } = useTranslation();
  const [selectedButton, setSelectedButton] = useState<string>("Surahs");

  const handleClick = (e: any) => {
    const value = e.target.value;
    setSelectedButton(value);
    onSelectionChange(value);
  };

  return (
    <div className="flex justify-around bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
      <button
        value="Surahs"
        onClick={handleClick}
        className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
          selectedButton === "Surahs"
            ? "text-black dark:text-white border-2 border-black dark:border-white"
            : "bg-teal-600 text-white"
        } hover:opacity-80`}
      >
        {t("common.surahs")}
      </button>

      <button
        value="Hadiths"
        onClick={handleClick}
        className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
          selectedButton === "Hadiths"
            ? "text-black dark:text-white border-2 border-black dark:border-white"
            : "bg-teal-600 text-white"
        } hover:opacity-80`}
      >
        {t("common.hadiths")}
      </button>

      <button
        value="Azkar"
        onClick={handleClick}
        className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
          selectedButton === "Azkar"
            ? "text-black dark:text-white border-2 border-black dark:border-white"
            : "bg-teal-600 text-white"
        } hover:opacity-80`}
      >
        {t("common.azkar")}
      </button>
    </div>
  );
}
