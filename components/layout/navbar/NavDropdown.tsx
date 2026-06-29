"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../context/general/LanguageContext";
import type { IconDefinition as IconType } from "@fortawesome/fontawesome-svg-core";

type Route = {
  href: string;
  label: string;
  icon: IconType;
};

type Props = {
  label: string;
  routes: Route[];
  isActive: (path: string, exact?: boolean) => boolean;
  isGroupActive: boolean;
  icon: IconDefinition;
};

export default function NavDropdown({
  label,
  routes,
  isActive,
  isGroupActive,
  icon,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 120);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [routes]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={() => window.innerWidth >= 1024 && setIsOpen(true)}
        className={`group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
          isGroupActive
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-transparent text-foreground/80 hover:border-border/60 hover:bg-secondary/50 hover:text-primary"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="">{label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[60] mt-2 w-56 overflow-hidden rounded-2xl border border-border/50 bg-popover/95 text-popover-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-200 ${
            isArabic ? "left-0 text-right" : "right-0 text-left"
          }`}
          role="menu"
        >
          <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2.5 bg-muted/30">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground ">
              {label}
            </span>
          </div>

          <div className="py-1">
            {routes.map(({ href, label: routeLabel, icon: routeIcon }) => (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                  isActive(href)
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-popover-foreground hover:bg-secondary/50 hover:text-primary"
                }
                ${isArabic ? "hover:pr-5" : "hover:pl-5"}
                `}
                role="menuitem"
              >
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                    isActive(href)
                      ? "bg-primary/20"
                      : "bg-secondary/50 group-hover:bg-primary/10"
                  }`}
                >
                  <FontAwesomeIcon icon={routeIcon} className="text-xs" />
                </div>
                <span className="">{routeLabel}</span>
                {isActive(href) && (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs text-primary ml-auto rotate-${isArabic ? "90" : "-90"}`}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
