"use client";

import { useLanguage } from "@/context/general/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as loved,
  faShareNodes,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import ShareModal from "@/components/modals/ShareModal";
import useMediaQuery from "@/hooks/general/useMediaQuery";
import { useAzkarCategory } from "@/hooks/azkar/useAzkarCategory";
import { useAzkarData } from "@/hooks/azkar/useAzkarData";
import { useFavoriteZekrActions } from "@/hooks/azkar/useFavoriteZekrActions";
import { AzkarCategories } from "@/constants/azkarData";
import { AzkarCardSkeleton } from "./AzkarCardSkeleton";
import { toArabicNumber } from "@/utils/helpers";

interface AzkarPageProps {
  startingNumber: number;
  categoryId: string;
}

export default function DisplayAzkar({
  startingNumber,
  categoryId,
}: AzkarPageProps) {
  const { language } = useLanguage();
  const isMdOrLarger = useMediaQuery("(min-width: 768px)");
  const isArabic = language === "ar";

  useAzkarCategory(categoryId);
  const { azkarItems, loading } = useAzkarData(categoryId, startingNumber);
  const { handleLoveClick, isFavorite } = useFavoriteZekrActions(categoryId);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {[...Array(3)].map((_, i) => (
          <AzkarCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {azkarItems &&
        azkarItems.map((azkar, index) => {
          const zekr = AzkarCategories.find((b) => b.ar === azkar.category);
          const fav = isFavorite(azkar.number!);

          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 
                transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 
                hover:border-primary/30 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                    <FontAwesomeIcon icon={faHashtag} className="text-xs" />
                    <span>
                      {isArabic
                        ? `${toArabicNumber(azkar.number!)}`
                        : `${azkar.number}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShareModal
                      size="xl"
                      url={`https://muslim-one.vercel.app/azkar/category/${zekr?.id}?zekr=${azkar.number}`}
                    />

                    <button
                      onClick={() => handleLoveClick(azkar)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                        fav
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={fav ? loved : notLoved}
                        className="text-lg"
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p
                    dir="rtl"
                    className="text-xl leading-loose text-foreground text-center  font-medium"
                  >
                    {azkar.content}
                  </p>

                  {azkar.description && (
                    <p className="text-center text-muted-foreground text-sm md:text-base leading-relaxed pt-4 border-t border-border/30">
                      {azkar.description}
                    </p>
                  )}
                </div>

                {azkar.count && parseInt(azkar.count) > 1 && (
                  <div className="mt-5 flex justify-center">
                    <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold">
                      <span>{isArabic ? "التكرار:" : "Repeat:"}</span>
                      <span>
                        {isArabic ? toArabicNumber(parseInt(azkar.count)) : azkar.count}
                      </span>
                      <span>{isArabic ? "مرات" : "times"}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
