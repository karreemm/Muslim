"use client";

import React, { useState, useEffect } from "react";
import { useSadaqaGarya } from "../../../../context/features/SadaqatContext";
import { ExternalLink, Lock, Trash2, Users } from "lucide-react";
import DataTable from "@/components/general/DataTable";
import ShareModal from "../../../../components/modals/ShareModal";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Loading from "@/components/general/Loading";
import { useLanguage } from "../../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { localizePath } from "@/lib/i18n";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import HasUpdatesCard from "@/components/general/HasUpdatesCard";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  readLocalDeleteTokens,
  writeLocalDeleteTokens,
} from "@/lib/sadaqaGarya/localDeleteTokens";

export default function DeceasedPersonsTable() {
  const {
    deceasedPersons,
    removeDeceasedPerson,
    isLoading,
    canDeleteDeceased,
    hasDatabaseError,
    retryLoading,
  } = useSadaqaGarya();
  const [shareableUrls, setShareableUrls] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    slug: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const urls: Record<string, string> = {};
    deceasedPersons.forEach((person) => {
      const path = localizePath(language, `/sadaqa-garya/${person.slug}`);
      urls[person.slug] =
        typeof window !== "undefined"
          ? `${window.location.origin}${path}`
          : `https://muslim-one.vercel.app${path}`;
    });
    setShareableUrls(urls);
  }, [deceasedPersons, language]);

  const handleNavigation = (slug: string) => {
    router.push(localizePath(language, `/sadaqa-garya/${slug}`));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      const deleteToken = readLocalDeleteTokens()[deleteTarget.slug] || "";

      const response = await fetch(
        `/api/sadaqa-garya/${encodeURIComponent(deleteTarget.slug)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: deleteToken ? { "x-sadaqa-delete-token": deleteToken } : undefined,
        },
      );

      if (!response.ok) {
        let message = t("sadaqa.table.failedDelete");
        try {
          const payload = await response.json();
          if (payload?.error) {
            message = response.status === 401 ? t("sadaqa.table.onlyOwn") : payload.error;
          }
        } catch {}
        setDeleteError(message);
        return;
      }

      removeDeceasedPerson(deleteTarget.id);

      const tokens = readLocalDeleteTokens();
      delete tokens[deleteTarget.slug];
      writeLocalDeleteTokens(tokens);

      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting:", error);
      setDeleteError(t("sadaqa.table.unexpectedError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (person: any) => {
    setDeleteError("");
    setDeleteTarget({
      id: person.id,
      slug: person.slug,
      name: language === "ar" ? person.nameAr : person.nameEn,
    });
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      key: "name",
      title: t("common.name"),
      align: "center" as const,
      render: (item: any, idx: number) => (
        <div className="flex flex-col items-center gap-1">
          {idx === 0 && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="mt-0.5">{t("common.latest")}</span>
            </span>
          )}
          <span className="font-semibold text-lg text-foreground">
            {language === "ar" ? item.nameAr : item.nameEn}
          </span>
        </div>
      ),
    },
  ];

  const actions = [
    {
      icon: <ExternalLink className="w-4 h-4" />,
      label: t("common.view"),
      variant: "primary" as const,
      onClick: (item: any) => handleNavigation(item.slug),
    },
    {
      icon: <div className="w-4 h-4" />,
      label: t("common.share"),
      variant: "ghost" as const,
      onClick: () => {},
      customRender: (item: any) =>
        shareableUrls[item.slug] ? <ShareModal url={shareableUrls[item.slug]} /> : null,
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: t("common.delete"),
      variant: "destructive" as const,
      onClick: openDeleteModal,
      customRender: (item: any) =>
        canDeleteDeceased(item.slug) ? (
          <button
            onClick={() => openDeleteModal(item)}
            className="transition-all duration-200 text-destructive hover:bg-destructive/10 hover:scale-110"
            title={t("common.delete")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            disabled
            className="text-muted-foreground/50 cursor-not-allowed"
            title={t("sadaqa.table.cannotDelete")}
          >
            <Lock className="w-4 h-4" />
          </button>
        ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (hasDatabaseError) {
    return (
      <HasUpdatesCard
        mounted={mounted}
        title={t("sadaqa.errors.loadTitle")}
        message={t("sadaqa.errors.loadMessage")}
        backToHomeLabel={t("common.backHome")}
        onBackToHome={() => router.push(localizePath(language, "/"))}
        retryLabel={t("common.tryAgain")}
        onRetry={retryLoading}
      />
    );
  }

  return (
    <PageShell>
      <PageHeader
        title={t("sadaqa.table.title")}
        subtitle={t("sadaqa.table.subtitle")}
      />

      <DataTable
        columns={columns}
        data={deceasedPersons}
        keyExtractor={(item) => item.id}
        actions={actions}
        emptyTitle={t("sadaqa.table.noSadaqat")}
        maxHeight="50vh"
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title={t("common.confirmDeletion")}
        description={
          deleteError ||
          (deleteTarget
            ? t("sadaqa.table.confirmDeletePage", { name: deleteTarget.name })
            : "")
        }
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isProcessing={isDeleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
      />
    </PageShell>
  );
}
