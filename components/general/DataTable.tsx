"use client";

import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { Trash2, Inbox } from "lucide-react";
import { useTranslation } from "@/hooks/general/useTranslation";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";

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
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const actionsHeaderLabel = t("common.actions");

  const displayData = [...data].reverse();

  if (isLoading) {
    return <Loading />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-10 w-10" />}
        title={emptyTitle || t("common.noResults")}
        description={emptyDescription}
        className={`transition-all duration-500 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      />
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
      <div className="surface-card relative shadow-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight }}>
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
                            <IconButton
                              key={actionIdx}
                              label={action.label}
                              variant={action.variant || "ghost"}
                              size="sm"
                              onClick={() => action.onClick(item)}
                              className="hover:scale-110"
                            >
                              {action.icon}
                            </IconButton>
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
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(true)}
              className="group border border-destructive/20 bg-destructive/10 px-6 py-3 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
              {clearAllAction.label}
            </Button>
          </div>

          {isDeleteModalOpen && (
            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              title={clearAllAction.confirmationTitle || t("common.confirmDeletion")}
              description={
                clearAllAction.confirmationDescription ||
                t("common.deleteAllItemsConfirm")
              }
              confirmText={clearAllAction.confirmText || t("common.delete")}
              cancelText={clearAllAction.cancelText || t("common.cancel")}
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
