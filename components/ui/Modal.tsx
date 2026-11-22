"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "./cn";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: keyof typeof sizeClasses;
  panelClassName?: string;
  closeLabel?: string;
  showCloseButton?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  panelClassName,
  closeLabel = "Close",
  showCloseButton = true,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={cn(
            "relative max-h-[90vh] w-full overflow-y-auto surface-panel p-6 text-foreground shadow-2xl",
            sizeClasses[size],
            panelClassName,
          )}
        >
          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}

          {title ? (
            <DialogTitle className="pe-10 text-lg font-semibold text-foreground">
              {title}
            </DialogTitle>
          ) : null}

          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}

          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
