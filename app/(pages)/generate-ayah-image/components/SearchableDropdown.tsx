"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import type { DropdownItem } from "../types";

interface SearchableDropdownProps {
  language: string;
  label: string;
  searchPlaceholder: string;
  selectedLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  items: DropdownItem[];
  onSelect: (value: number) => void;
  emptyLabel: string;
  disabled?: boolean;
}

export default function SearchableDropdown({
  language,
  label,
  searchPlaceholder,
  selectedLabel,
  searchValue,
  onSearchChange,
  isOpen,
  setIsOpen,
  items,
  onSelect,
  emptyLabel,
  disabled = false,
}: SearchableDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const isArabic = language === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current?.contains(target)) return;
      if (containerRef.current?.contains(target)) return;

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const dropdownContent = (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="rounded-2xl border border-border/60 bg-popover/95 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      <div className="p-3 border-b border-border/50 bg-muted/30">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 -translate-y-1/2 start-3 text-xs text-muted-foreground"
          />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-10 rounded-lg border border-border/50 bg-background/60 px-9 text-sm text-foreground outline-none focus:border-primary"
            dir={isArabic ? "rtl" : "ltr"}
          />
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto p-1">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onSelect(item.value);
                onSearchChange("");
                setIsOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2.5 text-start hover:bg-muted transition-colors flex items-start gap-2"
            >
              <span className="flex flex-col">
                <span className="text-sm text-foreground">{item.label}</span>
              </span>
            </button>
          ))
        ) : (
          <div className="px-3 py-4 text-sm text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full min-h-12 rounded-xl border border-border/60 bg-card/70 px-4 py-2 text-sm text-foreground
          flex items-center justify-between gap-3 transition-all duration-200
          hover:border-primary/40 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate text-start">{selectedLabel}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {mounted && isOpen && !disabled
        ? createPortal(dropdownContent, document.body)
        : null}
    </div>
  );
}