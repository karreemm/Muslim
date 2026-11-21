"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/general/useTranslation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  isProcessing = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      onClose={isProcessing ? () => {} : onClose}
      title={title}
      size="sm"
      showCloseButton={!isProcessing}
      closeLabel={t("common.close")}
    >
      <div className="mt-4 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <p className="pt-2 text-sm text-muted-foreground">{t("common.cannotUndo")}</p>
      </div>

      <p className="mt-4 rounded-xl border border-border bg-muted/50 p-4 text-sm leading-relaxed text-foreground/80">
        {description}
      </p>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
          {cancelText}
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isProcessing}
          className="min-w-[100px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>...</span>
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              {confirmText}
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
}
