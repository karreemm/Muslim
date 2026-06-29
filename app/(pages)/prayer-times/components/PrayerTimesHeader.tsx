"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import GovernorateSelector from "@/app/(pages)/prayer-times/components/GovernorateSelector";

interface Governorate {
  en: string;
  ar: string;
}

interface PrayerTimesHeaderProps {
  title: string;
  language: "en" | "ar";
  selectedGovernorate: Governorate;
  onGovernorateChange: (value: Governorate) => void;
  hijriDate: string;
  gregorianDate: string;
}

export default function PrayerTimesHeader({
  title,
  language,
  selectedGovernorate,
  onGovernorateChange,
  hijriDate,
  gregorianDate,
}: PrayerTimesHeaderProps) {
  return (
    <div className="relative z-[800] overflow-visible rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 shadow-xl lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-lg text-muted-foreground"
                />
                <GovernorateSelector
                  selectedGovernorate={selectedGovernorate}
                  onGovernorateChange={onGovernorateChange}
                  language={language}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-row md:flex md:flex-col gap-1`}
        >
          <div className="w-fit flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            {hijriDate}
          </div>
          <div className="w-fit flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            {gregorianDate}
          </div>
        </div>
      </div>
    </div>
  );
}
