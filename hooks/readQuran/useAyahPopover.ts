"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseAyahPopoverOptions {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isAlreadySaved?: boolean;
}

export const useAyahPopover = ({
  isOpen,
  onClose,
  onSave,
  isAlreadySaved = false,
}: UseAyahPopoverOptions) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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
    if (isOpen) {
      setIsSaved(isAlreadySaved);
    } else {
      setIsSaved(false);
    }
  }, [isOpen, isAlreadySaved]);

  useEffect(
    () => () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    },
    [],
  );

  const handleSaveClick = useCallback(() => {
    onSave();
    setIsSaved(true);
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    // Keep the success state visible long enough to be noticed.
    closeTimer.current = setTimeout(() => {
      onClose();
    }, 2000);
  }, [onSave, onClose]);

  return {
    popoverRef,
    isSaved,
    handleSaveClick,
  };
};
