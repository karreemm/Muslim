"use client";

import React, { useState } from "react";
import { useFavoriteAzkar } from "../../../../context/favourites/FavoriteAzkarContext";
import { useLanguage } from "../../../../context/general/LanguageContext";
import { useRouter } from "next/navigation";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import DataTable from "@/components/general/DataTable";
import { AzkarCategories } from "../../../../constants/azkarData";
import { toArabicNumber } from "../../../../utils/helpers";
import { useTranslation } from "@/hooks/general/useTranslation";
import ShareModal from "@/components/modals/ShareModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

export default function FavouriteAzkarTable() {
  const { favoriteAzkar, removeFavoriteAzkar } = useFavoriteAzkar();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const handleNavigate = (zekr: any) => {
    const zekrr = AzkarCategories.find((b) => b.ar === zekr.category);
    router.push(`/azkar/category/${zekrr?.id}?zekr=${zekr.number}`);
  };

  const getCategoryName = (categoryAr: string) => {
    const cat = AzkarCategories.find((b) => b.ar === categoryAr);
    return language === "ar" ? cat?.ar : cat?.en;
  };

  const getShareUrl = (zekr: any) => {
    const category = AzkarCategories.find((b) => b.ar === zekr.category);
    if (!category) return "";

    if (typeof window !== "undefined") {
      return `${window.location.origin}/azkar/category/${category.id}?zekr=${zekr.number}`;
    }

    return `https://muslim-one.vercel.app/azkar/category/${category.id}?zekr=${zekr.number}`;
  };

  const columns = [
    {
      key: "number",
      title: t("favourites.azkar.zekrNo"),
      align: "center" as const,
      width: "100px",
      render: (item: any, idx: number) => (
        <div className="flex flex-col items-center gap-1">
          {idx === 0 && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="mt-0.5">
                {t("common.latest")}
              </span>
            </span>
          )}
          <span className="font-mono font-medium text-foreground">
            {language === "en" ? item.number : toArabicNumber(item.number)}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      title: t("common.category"),
      align: "center" as const,
      render: (item: any) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/50 text-foreground text-sm font-medium border border-border">
          {getCategoryName(item.category)}
        </span>
      ),
    },
    {
      key: "content",
      title: t("common.text"),
      align: "left" as const,
      hiddenOnMobile: true,
      render: (item: any) => (
        <div
          dir="rtl"
          className="max-w-md truncate text-muted-foreground leading-relaxed"
        >
          {item.content}
        </div>
      ),
    },
  ];

  const actions = [
    {
      icon: <ExternalLink className="w-4 h-4" />,
      label: t("common.goTo"),
      variant: "primary" as const,
      onClick: handleNavigate,
    },
    {
      icon: <Share2 className="w-4 h-4" />,
      label: t("common.share"),
      variant: "ghost" as const,
      onClick: () => {},
      customRender: (item: any) => {
        const url = getShareUrl(item);
        return url ? <ShareModal url={url} /> : null;
      },
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: t("common.remove"),
      variant: "destructive" as const,
      onClick: (item: any) => setDeleteTarget(item),
    },
  ];

  return (
    <div className="px-4 md:px-8">
      <DataTable
        columns={columns}
        data={favoriteAzkar}
        keyExtractor={(item) => `${item.category}-${item.number}`}
        actions={actions}
        emptyTitle={t("favourites.azkar.noFavourites")}
        clearAllAction={
          favoriteAzkar.length > 0
            ? {
                label: t("favourites.azkar.clearAllAzkar"),
                onClick: () => {
                  favoriteAzkar.forEach((zekr) =>
                    removeFavoriteAzkar(zekr.number || 0, zekr.category),
                  );
                },
                confirmationTitle:
                  language === "ar" ? "تأكيد الحذف" : "Confirm Deletion",
                confirmationDescription:
                  language === "ar"
                    ? "هل أنت متأكد من حذف كل الأذكار المفضلة؟"
                    : "Are you sure you want to clear all favourite azkar?",
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={language === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
        description={
          language === "ar"
            ? "هل أنت متأكد من حذف هذا الذكر من المفضلة؟"
            : "Are you sure you want to remove this zikr from favourites?"
        }
        confirmText={language === "ar" ? "حذف" : "Delete"}
        cancelText={language === "ar" ? "إلغاء" : "Cancel"}
        onConfirm={() => {
          if (deleteTarget) {
            removeFavoriteAzkar(deleteTarget.number, deleteTarget.category);
          }
          setDeleteTarget(null);
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
