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
    <div className="flex justify-around bg-background text-foreground dark:bg-background dark:text-foreground">
      <button
        value="Surahs"
        onClick={handleClick}
        className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
          selectedButton === "Surahs"
            ? "bg-primary text-primary-foreground"
            : "text-foreground dark:text-foreground border-2 border-border dark:border-border"
        } hover:opacity-80`}
      >
        {t("common.surahs")}
      </button>

      <button
        value="Hadiths"
        onClick={handleClick}
        className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
          selectedButton === "Hadiths"
            ? "bg-primary text-primary-foreground"
            : "text-foreground dark:text-foreground border-2 border-border dark:border-border"
        } hover:opacity-80`}
      >
        {t("common.hadiths")}
      </button>

      <button
        value="Azkar"
        onClick={handleClick}
        className={`w-24 md:w-48 py-2 rounded-lg flex justify-center ${
          selectedButton === "Azkar"
            ? "bg-primary text-primary-foreground"
            : "text-foreground dark:text-foreground border-2 border-border dark:border-border"
        } hover:opacity-80`}
      >
        {t("common.azkar")}
      </button>
    </div>
  );
}
