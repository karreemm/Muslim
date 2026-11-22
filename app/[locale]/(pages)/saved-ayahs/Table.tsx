"use client";

import React, { useState } from "react";
import { useSavedAyahs } from "../../../../context/features/SavedAyahsContext";
import { useLanguage } from "../../../../context/general/LanguageContext";
import { useRouter } from "next/navigation";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import DataTable from "@/components/general/DataTable";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { useTranslation } from "@/hooks/general/useTranslation";
import { localizePath } from "@/lib/i18n";
import ShareModal from "@/components/modals/ShareModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

export default function SavedAyahsTable() {
  const { savedAyahs, removeAyah, clearSavedAyahs } = useSavedAyahs();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const handleNavigate = (ayah: any) => {
    router.push(
      localizePath(
        language,
        `/read-quran/surah/${ayah.SurahNumber}?ayah=${ayah.ayahNumberEn}`,
      ),
    );
  };

  const getShareUrl = (ayah: any) => {
    const path = localizePath(
      language,
      `/read-quran/surah/${ayah.SurahNumber}?ayah=${ayah.ayahNumberEn}`,
    );

    if (typeof window !== "undefined") {
      return `${window.location.origin}${path}`;
    }
    return `https://muslim-one.vercel.app${path}`;
  };

  const columns = [
    {
      key: "surah",
      title: t("common.surahWithNoAll"),
      align: "center" as const,
      render: (item: any, idx: number) => (
        <div className="flex flex-col items-center gap-1">
          {idx === 0 && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="mt-0.5">{t("common.latest")}</span>
            </span>
          )}
          <span className="font-semibold text-foreground">
            {language === "ar" ? item.surahNameAr : item.surahNameEn}
          </span>
        </div>
      ),
    },
    {
      key: "ayahNumber",
      title: t("savedAyahs.ayahNumber"),
      align: "center" as const,
      render: (item: any) => (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 text-foreground font-mono font-medium border border-border">
          {language === "ar" ? item.ayahNumberAr : item.ayahNumberEn}
        </span>
      ),
    },
    {
      key: "text",
      title: t("common.ayahs"),
      align: "center" as const,
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
    <PageShell>
      <PageHeader title={t("savedAyahs.title")} />

      <DataTable
        columns={columns}
        data={savedAyahs}
        keyExtractor={(item) => `${item.SurahNumber}-${item.ayahNumberEn}`}
        actions={actions}
        emptyTitle={t("savedAyahs.noSavedAyahs")}
        clearAllAction={
          savedAyahs.length > 0
            ? {
                label: t("savedAyahs.clearAll"),
                onClick: clearSavedAyahs,
                confirmationTitle: t("common.confirmDeletion"),
                confirmationDescription: t("savedAyahs.clearAllConfirm"),
              }
            : undefined
        }
        maxHeight="60vh"
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={t("common.confirmDeletion")}
        description={t("savedAyahs.removeConfirm")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={() => {
          if (deleteTarget) {
            removeAyah(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </PageShell>
  );
}
