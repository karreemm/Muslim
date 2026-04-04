"use client";

import React, { useEffect, useState } from "react";
import { useFavoriteSurahs } from "../../../../context/favourites/FavoriteSurahsContext";
import { useLanguage } from "../../../../context/general/LanguageContext";
import { useRouter } from "next/navigation";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import DataTable from "@/components/general/DataTable";
import ShareModal from "../../../../components/modals/ShareModal";
import { useTranslation } from "@/hooks/general/useTranslation";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

export default function FavouriteSurahsTable() {
  const { favoriteSurahs, removeFavoriteSurah } = useFavoriteSurahs();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();
  const [shareUrls, setShareUrls] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  useEffect(() => {
    const urls: Record<string, string> = {};
    favoriteSurahs.forEach((surah) => {
      urls[surah.number] =
        `https://muslim-one.vercel.app/listen-quran/reciter/${surah.reciterId}?surah=${surah.number}`;
    });
    setShareUrls(urls);
  }, [favoriteSurahs]);

  const handleNavigate = (surah: any) => {
    router.push(
      `/listen-quran/reciter/${surah.reciterId}?surah=${surah.number}`,
    );
  };

  const columns = [
    {
      key: "name",
      title: t("common.surah"),
      align: "center" as const,
      render: (item: any) => (
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-foreground">
            {language === "ar" ? item.nameAr : item.nameEn}
          </span>
        </div>
      ),
    },
    {
      key: "reciter",
      title: t("common.reciter"),
      align: "center" as const,
      render: (item: any) => (
        <span className="text-muted-foreground">
          {language === "ar" ? item.reciterNameAr : item.reciterNameEn}
        </span>
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
      customRender: (item: any) =>
        shareUrls[item.number] ? (
          <ShareModal url={shareUrls[item.number]} />
        ) : null,
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
        data={favoriteSurahs}
        keyExtractor={(item) => `${item.number}-${item.reciterId}`}
        actions={actions}
        emptyTitle={t("favourites.surah.noFavourites")}
        clearAllAction={
          favoriteSurahs.length > 0
            ? {
                label: t("favourites.surah.clearAllSurahs"),
                onClick: () => {
                  favoriteSurahs.forEach((surah) =>
                    removeFavoriteSurah(surah.number, surah.reciterId),
                  );
                },
                confirmationTitle:
                  language === "ar" ? "تأكيد الحذف" : "Confirm Deletion",
                confirmationDescription:
                  language === "ar"
                    ? "هل أنت متأكد من حذف كل السور المفضلة؟"
                    : "Are you sure you want to clear all favourite surahs?",
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={language === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
        description={
          language === "ar"
            ? "هل أنت متأكد من حذف هذه السورة من المفضلة؟"
            : "Are you sure you want to remove this surah from favourites?"
        }
        confirmText={language === "ar" ? "حذف" : "Delete"}
        cancelText={language === "ar" ? "إلغاء" : "Cancel"}
        onConfirm={() => {
          if (deleteTarget) {
            removeFavoriteSurah(deleteTarget.number, deleteTarget.reciterId);
          }
          setDeleteTarget(null);
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
