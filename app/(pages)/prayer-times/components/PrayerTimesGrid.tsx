"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCloudSun,
  faClock,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

const prayerIcons: Record<string, typeof faSun> = {
  Fajr: faSun,
  Sunrise: faCloudSun,
  Dhuhr: faSun,
  Asr: faSun,
  Maghrib: faMoon,
  Isha: faMoon,
};

interface PrayerTimesGridProps {
  language: "en" | "ar";
  title: string;
  prayerNames: string[];
  prayerKeys: readonly PrayerKey[];
  prayerTimes: Partial<Record<PrayerKey, string>>;
  nextPrayer: string | null;
}

type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export default function PrayerTimesGrid({
  language,
  title,
  prayerNames,
  prayerKeys,
  prayerTimes,
  nextPrayer,
}: PrayerTimesGridProps) {
  return (
    <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-5 shadow-xl lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold flex items-center gap-2">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prayerNames.map((prayer, index) => {
          const prayerKey = prayerKeys[index];
          const time = prayerTimes[prayerKey];
          const isNext = prayerKey === nextPrayer;
          const Icon = prayerIcons[prayerKey] || faClock;

          return (
            <div
              key={prayer}
              className={`group relative rounded-2xl border p-5 flex items-center gap-4 transition-all duration-300 ${
                isNext
                  ? "border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg shadow-primary/20 scale-[1.02]"
                  : "border-border bg-background/60 hover:border-primary/30 hover:bg-card hover:shadow-md"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${
                  isNext
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <FontAwesomeIcon icon={Icon} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-lg font-bold truncate ${
                    isNext ? "text-primary" : "text-foreground"
                  }`}
                >
                  {prayer}
                </p>
                <p
                  dir="ltr"
                  className={`text-xl tabular-nums ${
                    isNext
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  } ${language === "ar" ? "text-right" : "text-left"}`}
                >
                  {time}
                </p>
              </div>

              {isNext && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-[10px] text-primary-foreground font-bold">
                    <FontAwesomeIcon icon={faBell} className="text-[10px]" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
