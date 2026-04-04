"use client";

import React, { useState } from "react";
import { useFavoriteHadiths } from "../../../../context/favourites/FavoriteHadithsContext";
import { useLanguage } from "../../../../context/general/LanguageContext";
import { useRouter } from "next/navigation";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import DataTable from "@/components/general/DataTable";
import { hadithBooks } from "../../../../constants/hadithData";
import { useTranslation } from "@/hooks/general/useTranslation";
import ShareModal from "@/components/modals/ShareModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

export default function FavouriteHadithsTable() {
  const { favoriteHadiths, removeFavoriteHadith } = useFavoriteHadiths();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const handleNavigate = (hadith: any) => {
    const hadithNumber = hadith.numberEn;
    const chapterId = hadith.chapterId;

    if (chapterId) {
      router.push(
        `/read-hadith/book/${hadith.bookId}/chapter/${chapterId}?hadith=${hadithNumber}`,
      );
    } else {
      router.push(`/read-hadith/book/${hadith.bookId}?hadith=${hadithNumber}`);
    }
  };

  const getBookName = (bookId: string) => {
    const book = hadithBooks.find((b) => b.id === bookId);
    return language === "ar" ? book?.name_ar : book?.name_en;
  };

  const getShareUrl = (item: any) => {
    if (typeof window !== "undefined") {
      return item.chapterId
        ? `${window.location.origin}/read-hadith/book/${item.bookId}/chapter/${item.chapterId}?hadith=${item.numberEn}`
        : `${window.location.origin}/read-hadith/book/${item.bookId}?hadith=${item.numberEn}`;
    }

    return item.chapterId
      ? `https://muslim-one.vercel.app/read-hadith/book/${item.bookId}/chapter/${item.chapterId}?hadith=${item.numberEn}`
      : `https://muslim-one.vercel.app/read-hadith/book/${item.bookId}?hadith=${item.numberEn}`;
  };

  const columns = [
    {
      key: "number",
      title: t("favourites.hadith.hadithNo"),
      align: "center" as const,
      width: "120px",
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
            {language === "ar" ? item.numberAr : item.numberEn}
          </span>
        </div>
      ),
    },
    {
      key: "book",
      title: t("common.book"),
      align: "center" as const,
      render: (item: any) => (
        <span className="font-medium text-foreground">
          {getBookName(item.bookId)}
        </span>
      ),
    },
    {
      key: "text",
      title: t("common.text"),
      align: "left" as const,
      hiddenOnMobile: true,
      render: (item: any) => (
        <div
          dir="rtl"
          className="max-w-md truncate text-muted-foreground leading-relaxed"
        >
          {item.text}
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
      customRender: (item: any) => <ShareModal url={getShareUrl(item)} />,
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
        data={favoriteHadiths}
        keyExtractor={(item) => `${item.bookId}-${item.numberEn}`}
        actions={actions}
        emptyTitle={t("favourites.hadith.noFavourites")}
        clearAllAction={
          favoriteHadiths.length > 0
            ? {
                label: t("favourites.hadith.clearAllHadith"),
                onClick: () => {
                  favoriteHadiths.forEach((hadith) =>
                    removeFavoriteHadith(hadith.numberEn, hadith.bookId),
                  );
                },
                confirmationTitle:
                  language === "ar" ? "تأكيد الحذف" : "Confirm Deletion",
                confirmationDescription:
                  language === "ar"
                    ? "هل أنت متأكد من حذف كل الأحاديث المفضلة؟"
                    : "Are you sure you want to clear all favourite hadiths?",
              }
            : undefined
        }
        maxHeight="60vh"
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={language === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
        description={
          language === "ar"
            ? "هل أنت متأكد من حذف هذا الحديث من المفضلة؟"
            : "Are you sure you want to remove this hadith from favourites?"
        }
        confirmText={language === "ar" ? "حذف" : "Delete"}
        cancelText={language === "ar" ? "إلغاء" : "Cancel"}
        onConfirm={() => {
          if (deleteTarget) {
            removeFavoriteHadith(deleteTarget.numberEn, deleteTarget.bookId);
          }
          setDeleteTarget(null);
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
