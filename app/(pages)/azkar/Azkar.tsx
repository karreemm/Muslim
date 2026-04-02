"use client";

import Link from "next/link";
import { useLanguage } from "@/context/general/LanguageContext";
import { AzkarCategories } from "@/constants/azkarData";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSun, 
  faMoon, 
  faPrayingHands, 
  faBed, 
  faHeart, 
  faMosque,
  faStarAndCrescent,
  faHands,
  faDove,
  faBookOpen,
  faArrowRight,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CategoryCardSkeleton } from "./components/CategoryCardSkeleton";

const categoryIcons: Record<string, IconDefinition> = {
  morning_azkar: faSun,
  evening_azkar: faMoon,
  after_prayer_azkar: faPrayingHands,
  sleep_azkar: faBed,
  general_azkar: faHeart,
  ramadan_azkar: faStarAndCrescent,
  friday_azkar: faMosque,
  hajj_azkar: faHands,
  peace_azkar: faDove,
  default: faBookOpen
};

export default function AzkarCategoriesPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isArabic = language === "ar";

  const getCategoryIcon = (categoryId: string) => {
    return categoryIcons[categoryId] || categoryIcons.default;
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground dynamic-font mb-3">
            {t("azkar.title")}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AzkarCategories.map((item) => {
            const icon = getCategoryIcon(item.id);
            
            return (
              <Link
                key={item.id}
                href={`/azkar/category/${item.id}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 
                  transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 
                  hover:border-primary/30 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary 
                    transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 shadow-lg">
                    <FontAwesomeIcon icon={icon} className="text-2xl" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors dynamic-font">
                      {isArabic ? item.ar : item.en}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isArabic 
                        ? `${item.number} ذِكر`
                        : `${item.number} Azkar`
                      }
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
      </div>
      
      <div className="h-20" />
    </div>
  );
}