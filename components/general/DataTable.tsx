"use client";

import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import Loading from "./Loading";
import { Trash2, Inbox } from "lucide-react";
import { useLanguage } from "@/context/general/LanguageContext";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

interface Column<T> {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  hiddenOnMobile?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
}

interface Action<T> {
  icon: React.ReactNode;
  label: string;
  onClick: (item: T) => void;
  variant?: "primary" | "destructive" | "ghost";
  href?: (item: T) => string;
  customRender?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  keyExtractor: (item: T, index: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  clearAllAction?: {
    label: string;
    onClick: () => void;
    confirmationTitle?: string;
    confirmationDescription?: string;
    confirmText?: string;
    cancelText?: string;
  };
  isLoading?: boolean;
  showLatestBadge?: boolean;
  maxHeight?: string;
  containerClassName?: string;
}

export default function DataTable<T>({
  columns,
  data,
  actions,
  keyExtractor,
  emptyTitle,
  emptyDescription,
  clearAllAction,
  isLoading = false,
  showLatestBadge = true,
  maxHeight = "50vh",
  containerClassName = "",
}: DataTableProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const actionsHeaderLabel =
    mounted && language === "ar" ? "الإجراءات" : "Actions";

  const displayData = [...data].reverse();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`
          flex flex-col items-center justify-center py-20 px-4 text-center
          transition-all duration-500
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Inbox className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {emptyTitle || "No items found"}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`
        space-y-6
        transition-all duration-500
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${containerClassName}
      `}
    >
      <div className="relative rounded-2xl border border-border/70 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className={`overflow-x-auto overflow-y-auto max-h-[${maxHeight}]`}>
          <table className="w-full text-sm">
            <thead className="bg-primary text-primary-foreground sticky top-0 z-20">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`
                      py-4 px-6 font-semibold text-xs uppercase tracking-wider
                      ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}
                      ${col.hiddenOnMobile ? "hidden md:table-cell" : ""}
                    `}
                    style={{ width: col.width }}
                  >
                    {col.title}
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th
                    className="py-4 px-6 font-semibold text-xs uppercase tracking-wider text-center"
                    suppressHydrationWarning
                  >
                    {actionsHeaderLabel}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {displayData.map((item, idx) => (
                <tr
                  key={keyExtractor(item, idx)}
                  className="group bg-card hover:bg-primary/5 transition-colors duration-200"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-6 py-4 whitespace-nowrap
                        ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}
                        ${col.hiddenOnMobile ? "hidden md:table-cell" : ""}
                      `}
                    >
                      {col.render ? (
                        col.render(item, idx)
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {showLatestBadge && idx === 0 && (
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                              Latest
                            </span>
                          )}
                          <span className="text-foreground">
                            {(item as any)[col.key]}
                          </span>
                        </div>
                      )}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        {actions.map((action, actionIdx) =>
                          action.customRender ? (
                            <React.Fragment key={actionIdx}>
                              {action.customRender(item)}
                            </React.Fragment>
                          ) : (
                            <button
                              key={actionIdx}
                              onClick={() => action.onClick(item)}
                              className={`
                                transition-all duration-200
                                ${
                                  action.variant === "destructive"
                                    ? "text-destructive hover:bg-destructive/10 hover:scale-110"
                                    : action.variant === "primary"
                                      ? "text-primary hover:bg-primary/10 hover:scale-110"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-110"
                                }
                              `}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          ),
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
      </div>

      {clearAllAction && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 font-medium"
            >
              <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
              {clearAllAction.label}
            </button>
          </div>

          {isDeleteModalOpen && (
            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              title={
                clearAllAction.confirmationTitle ||
                (language === "ar" ? "تأكيد الحذف" : "Confirm Deletion")
              }
              description={
                clearAllAction.confirmationDescription ||
                (language === "ar"
                  ? "هل أنت متأكد من حذف جميع العناصر؟"
                  : "Are you sure you want to delete all items?")
              }
              confirmText={
                clearAllAction.confirmText ||
                (language === "ar" ? "حذف" : "Delete")
              }
              cancelText={
                clearAllAction.cancelText ||
                (language === "ar" ? "إلغاء" : "Cancel")
              }
              onConfirm={() => {
                clearAllAction.onClick();
                setIsDeleteModalOpen(false);
              }}
              onClose={() => setIsDeleteModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
