"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type QuranRoute = {
  href: string;
  label: string;
  icon: IconDefinition;
};

type Props = {
  label: string;
  language: string;
  pathname: string;
  routes: QuranRoute[];
  isActive: (path: string, exact?: boolean) => boolean;
  isQuranActive: boolean;
};

export default function QuranDropdown({
  label,
  language,
  pathname,
  routes,
  isActive,
  isQuranActive,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`group inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-base transition-all duration-200 ${
          isQuranActive
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-transparent text-foreground/90 hover:border-border/60 hover:bg-secondary/70 hover:text-primary"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>{label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[60] mt-2 w-52 overflow-hidden rounded-xl border border-border/50 bg-popover/95 text-popover-foreground shadow-2xl backdrop-blur-md ${
            language === "ar" ? "left-0 text-right" : "right-0 text-left"
          }`}
          role="menu"
        >
          <div className="border-b border-border/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </div>

          {routes.map(({ href, label: routeLabel, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive(href)
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-popover-foreground hover:bg-secondary"
              }`}
              role="menuitem"
            >
              <FontAwesomeIcon icon={icon} className="text-xs" />
              <span>{routeLabel}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
