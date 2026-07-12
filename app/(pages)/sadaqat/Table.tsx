"use client";

import React, { useState, useEffect } from "react";
import { useSadaqaGarya } from "../../../context/features/SadaqatContext";
import { ExternalLink, Lock, Trash2, Users } from "lucide-react";
import DataTable from "@/components/general/DataTable";
import ShareModal from "../../../components/modals/ShareModal";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import Loading from "@/components/general/Loading";
import { useLanguage } from "../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import HasUpdatesCard from "@/components/general/HasUpdatesCard";

export default function DeceasedPersonsTable() {
  const {
    deceasedPersons,
    removeDeceasedPerson,
    isLoading,
    canDeleteDeceased,
    hasDatabaseError,
  } = useSadaqaGarya();
  const [shareableUrls, setShareableUrls] = useState<Record<string, string>>(
    {},
  );
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
      if (typeof window !== "undefined") {
        urls[person.slug] =
          `${window.location.origin}/sadaqa-garya/${person.slug}`;
      } else {
        urls[person.slug] =
          `https://muslim-one.vercel.app/sadaqa-garya/${person.slug}`;
      }
    });
    setShareableUrls(urls);
  }, [deceasedPersons]);

  const handleNavigation = (slug: string) => {
    router.push(`/sadaqa-garya/${slug}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      let deleteToken = "";
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("sadaqaDeleteTokens");
          const parsed = raw ? JSON.parse(raw) : {};
          const tokens =
            parsed && typeof parsed === "object"
              ? (parsed as Record<string, string>)
              : {};
          deleteToken = tokens[deleteTarget.slug] || "";
        } catch {
          deleteToken = "";
        }
      }

      const response = await fetch(
        `/api/sadaqa-garya/${encodeURIComponent(deleteTarget.slug)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: deleteToken
            ? { "x-sadaqa-delete-token": deleteToken }
            : undefined,
        },
      );

      if (!response.ok) {
        let message = language === "ar" ? "فشل الحذف" : "Failed to delete";
        try {
          const payload = await response.json();
          if (payload?.error) {
            message =
              response.status === 401
                ? language === "ar"
                  ? "يمكن حذف الصفحات التي أنشأتها فقط ومن نفس المتصفح."
                  : "You can only delete pages you created from this browser."
                : payload.error;
          }
        } catch {}
        setDeleteError(message);
        return;
      }

      removeDeceasedPerson(deleteTarget.id);

      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("sadaqaDeleteTokens");
          const parsed = raw ? JSON.parse(raw) : {};
          const tokens =
            parsed && typeof parsed === "object"
              ? (parsed as Record<string, string>)
              : {};
          delete tokens[deleteTarget.slug];
          localStorage.setItem("sadaqaDeleteTokens", JSON.stringify(tokens));
        } catch {
        }
      }

      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting:", error);
      setDeleteError(
        language === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error occurred",
      );
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
        shareableUrls[item.slug] ? (
          <ShareModal url={shareableUrls[item.slug]} />
        ) : null,
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
            title={
              language === "ar"
                ? "لا يمكنك حذف هذه الصفحة لأنها ليست من إنشائك"
                : "You cannot delete this page because you are not the creator"
            }
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
        title={t("sadaqa.update.title")}
        message={t("sadaqa.update.message")}
        backToHomeLabel={t("sadaqa.update.backToHome")}
        onBackToHome={() => router.push("/")}
      />
    );
  }

  return (
    <div className="mt-8 w-[90%] max-w-7xl mx-auto min-h-screen px-4 md:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("sadaqa.table.title")}
        </h1>
      </div>

      <DataTable
        columns={columns}
        data={deceasedPersons}
        keyExtractor={(item) => item.id}
        actions={actions}
        emptyTitle={t("sadaqa.table.noSadaqat")}
        maxHeight="50vh"
        containerClassName="mt-8"
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title={language === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
        description={
          deleteError ||
          (deleteTarget
            ? language === "ar"
              ? `هل أنت متأكد من حذف صفحة ${deleteTarget.name}؟`
              : `Are you sure you want to delete ${deleteTarget.name}'s page?`
            : "")
        }
        confirmText={language === "ar" ? "حذف" : "Delete"}
        cancelText={language === "ar" ? "إلغاء" : "Cancel"}
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
    </div>
  );
}
