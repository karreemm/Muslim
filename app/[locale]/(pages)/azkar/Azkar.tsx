"use client";

import { useEffect, useState } from "react";
import Link from "@/components/i18n/LocalizedLink";
import { useLanguage } from "@/context/general/LanguageContext";
import { AzkarCategories } from "@/constants/azkarData";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useZekrCounter } from "@/context/features/ZekrCounterContext";
import { fetchAzkarCategoryCount } from "@/lib/services/azkar/GetAzkar";
import { toArabicNumber } from "@/utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faPrayingHands,
  faBed,
  faStarAndCrescent,
  faBookOpen,
  faAlarmClock,
  faBookQuran,
  faScroll,
  faArrowRight,
  faArrowLeft,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CategoryCardSkeleton } from "./components/CategoryCardSkeleton";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";

const categoryIcons: Record<string, IconDefinition> = {
  morning_azkar: faSun,
  evening_azkar: faMoon,
  post_salah_azkar: faPrayingHands,
  tasbeeh: faStarAndCrescent,
  sleep_azkar: faBed,
  wake_up_azkar: faAlarmClock,
  quranic_duas: faBookQuran,
  prophets_duas: faScroll,
  default: faBookOpen,
};

export default function AzkarCategoriesPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isArabic = language === "ar";
  const { getCategoryCompletedCount } = useZekrCounter();

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setCountsLoading(true);
      try {
        const entries = await Promise.all(
          AzkarCategories.map(async (item) => {
            const count = await fetchAzkarCategoryCount(item.ar);
            return [item.id, count] as const;
          }),
        );
        if (!cancelled) {
          setCategoryCounts(Object.fromEntries(entries));
        }
      } finally {
        if (!cancelled) setCountsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const getCategoryIcon = (categoryId: string) => {
    return categoryIcons[categoryId] || categoryIcons.default;
  };

  const display = (value: number) => (isArabic ? toArabicNumber(value) : `${value}`);

  return (
    <PageShell>
      <PageHeader title={t("azkar.title")} className="mb-12" />

      {countsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AzkarCategories.map((item) => (
            <CategoryCardSkeleton key={item.id} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AzkarCategories.map((item) => {
            const icon = getCategoryIcon(item.id);
            const completedCount = getCategoryCompletedCount(item.ar);
            const totalCount = categoryCounts[item.id] || item.number;
            const isCategoryDone = totalCount > 0 && completedCount >= totalCount;

            return (
              <Link
                key={item.id}
                href={`/azkar/category/${item.id}`}
                className={`group relative overflow-hidden rounded-2xl border bg-card/70 p-5
                    transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10
                    backdrop-blur-sm ${
                      isCategoryDone
                        ? "border-primary/40"
                        : "border-border hover:border-primary/30"
                    }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-xl transition-all duration-300 shadow-lg ${
                      isCategoryDone
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
                    }`}
                  >
                    <FontAwesomeIcon icon={icon} className="text-2xl" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors ">
                      {isArabic ? item.ar : item.en}
                    </h3>
                    <p className="text-sm mt-1 tabular-nums">
                      <span
                        className={
                          isCategoryDone
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        {display(completedCount)}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        / {display(totalCount)} {t("azkar.completed")}
                      </span>
                      {isCategoryDone && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="mx-2 text-primary"
                        />
                      )}
                    </p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FontAwesomeIcon
                        icon={isArabic ? faArrowLeft : faArrowRight}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
