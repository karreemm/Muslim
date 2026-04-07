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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
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
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsSaved(false);
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
    handleSaveClick,
  };
};