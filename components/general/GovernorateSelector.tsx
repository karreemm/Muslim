"use client";

import React from "react";
import { egyptianGovernorates } from "@/constants/egyptianGovernorates";

interface GovernorateSelectorProps {
  selectedGovernorate: { en: string; ar: string };
  onGovernorateChange: (governorate: { en: string; ar: string }) => void;
  language: "en" | "ar";
}

const GovernorateSelector: React.FC<GovernorateSelectorProps> = ({
  selectedGovernorate,
  onGovernorateChange,
  language,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = egyptianGovernorates.find(
      (gov) => gov.en === e.target.value,
    );
    if (selected) {
      onGovernorateChange(selected);
    }
  };

  return (
    <select
      value={selectedGovernorate.en}
      onChange={handleChange}
      className="px-4 py-2 text-lg md:text-xl rounded-lg bg-card border-2 border-primary text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all hover:border-ring"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {egyptianGovernorates.map((gov) => (
        <option key={gov.en} value={gov.en}>
          {gov[language]}
        </option>
      ))}
    </select>
  );
};

export default GovernorateSelector;
