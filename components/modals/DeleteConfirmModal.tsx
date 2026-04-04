"use client";

import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/general/LanguageContext";

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
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isClient]);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-300
        ${mounted ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isProcessing ? onClose : undefined}
      />

      <div
        className={`
          relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl
          transform transition-all duration-300
          ${mounted ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
      >
        {!isProcessing && (
          <button
            onClick={onClose}
            className={`absolute top-4 ${language === "ar" ? "left-4" : "right-4"} p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Icon */}
        <div className="mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "هذا العمل لا يمكن التراجع عنه"
                : "This action cannot be undone"}
            </p>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-foreground/80 bg-muted/50 p-4 rounded-lg border border-border">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            className="px-5 py-2.5 rounded-lg border border-border bg-background text-foreground font-medium hover:bg-muted transition-all duration-200 disabled:opacity-50"
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
