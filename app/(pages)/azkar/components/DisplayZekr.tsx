"use client";

import { useLanguage } from "@/context/general/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as notLoved } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as loved,
  faHashtag,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import ShareModal from "@/components/modals/ShareModal";
import { useSingleZekr } from "@/hooks/azkar/useSingleZekr";
import { useFavoriteZekrActions } from "@/hooks/azkar/useFavoriteZekrActions";
import Link from "next/link";
import { toArabicNumber } from "@/utils/helpers";

interface SingleZekrProps {
  zekrNumber: number;
  categoryId: string;
}

export default function DisplayZekr({
  zekrNumber,
  categoryId,
}: SingleZekrProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const { zekr, zekrData, loading } = useSingleZekr(categoryId, zekrNumber);
  const { useFavoriteStatus } = useFavoriteZekrActions(categoryId);
  const { isFav, toggle: handleLoveClick } = useFavoriteStatus(zekr);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!zekr) return null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/azkar/category/${zekrData?.id ?? categoryId}`}
        className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <FontAwesomeIcon
          icon={isArabic ? faArrowRight : faArrowLeft}
          className="text-sm transition-transform group-hover:-translate-x-1"
        />
        <span className="font-medium">
          {isArabic ? "العودة للقائمة" : "Back to List"}
        </span>
      </Link>

      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
              <FontAwesomeIcon icon={faHashtag} className="text-xs" />
              <span>
                {isArabic
                  ? `${toArabicNumber(zekr.number!)}`
                  : `${zekr.number}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ShareModal
                size="xl"
                url={`https://muslim-one.vercel.app/azkar/category/${zekrData?.id ?? categoryId}?zekr=${zekr.number}`}
              />

              <button
                onClick={handleLoveClick}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                  isFav
                    ? "bg-destructive/10 text-destructive"
                    : "bg-secondary/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                }`}
              >
                <FontAwesomeIcon
                  icon={isFav ? loved : notLoved}
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
              {zekr.content}
            </p>

            {zekr.description && (
              <p className="text-center text-muted-foreground text-sm md:text-base leading-relaxed pt-4 border-t border-border/30">
                {zekr.description}
              </p>
            )}

            {zekr.count && parseInt(zekr.count) > 1 && (
              <div className="mt-5 flex justify-center">
                <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold">
                  <span>{isArabic ? "التكرار:" : "Repeat:"}</span>
                  <span>
                    {isArabic ? toArabicNumber(parseInt(zekr.count)) : zekr.count}
                  </span>
                  <span>{isArabic ? "مرات" : "times"}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
