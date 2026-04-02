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
    <div className="relative min-w-52">
      <select
        value={selectedGovernorate.en}
        onChange={handleChange}
        className="h-12 w-full appearance-none rounded-xl border border-border bg-background/90 px-4 text-base md:text-lg text-foreground shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring hover:border-primary/60"
        dir={language === "ar" ? "rtl" : "ltr"}
        aria-label={language === "ar" ? "اختر المحافظة" : "Select governorate"}
      >
        {egyptianGovernorates.map((gov) => (
          <option key={gov.en} value={gov.en}>
            {gov[language]}
          </option>
        ))}
      </select>

      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground ${
          language === "ar" ? "left-3" : "right-3"
        }`}
      >
        ▾
      </span>
    </div>
  );
};

export default GovernorateSelector;
