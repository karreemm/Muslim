"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseAyahPopoverOptions {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const useAyahPopover = ({
  isOpen,
  onClose,
  onSave,
}: UseAyahPopoverOptions) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showTafseerModal, setShowTafseerModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[role="dialog"]')) return;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !showTafseerModal &&
        !showTranslationModal
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, showTafseerModal, showTranslationModal]);

  useEffect(() => {
    if (!isOpen) {
      setIsSaved(false);
      setShowTafseerModal(false);
      setShowTranslationModal(false);
    }
  }, [isOpen]);

  const handleSaveClick = useCallback(() => {
    onSave();
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  }, [onSave, onClose]);

  return {
    popoverRef,
    isSaved,
    showTafseerModal,
    setShowTafseerModal,
    showTranslationModal,
    setShowTranslationModal,
    handleSaveClick,
  };
};
