"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMosque,
  faBookmark,
  faHeart,
  faBars,
  faX,
  faBookOpen,
  faHeadphones,
  faHouse,
  faListOl,
  faClock,
  faSeedling,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../context/general/LanguageContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";
import LanguageDropdown from "./LanguageDropdown";
import ThemeDropdown from "./ThemeDropdown";
import NavDropdown from "./NavDropdown";

const quranLinks = (t: (key: string) => string) => [
  { href: "/read-quran", label: t("navbar.readQuran"), icon: faBookOpen },
  { href: "/listen-quran", label: t("navbar.listenQuran"), icon: faHeadphones },
  { href: "/search-ayah", label: t("navbar.searchAyah"), icon: faSearch },
];

const toolsLinks = (t: (key: string) => string) => [
  { href: "/tasbeeh", label: t("navbar.tasbeeh"), icon: faListOl },
  { href: "/prayer-times", label: t("navbar.prayerTimes"), icon: faClock },
  { href: "/sadaqa-garya", label: t("navbar.sadaqaGarya"), icon: faSeedling },
];

const utilityLinks = (t: (key: string) => string) => [
  { href: "/saved-ayahs", label: t("navbar.savedAyahs"), icon: faBookmark },
  { href: "/favourites", label: t("navbar.favourites"), icon: faHeart },
  { href: "/sadaqat", label: t("navbar.yourSadaqat"), icon: faSeedling },
];

const mobileNavLinks = (t: (key: string) => string) => [
  { href: "/", label: t("navbar.home"), icon: faHouse, exactMatch: true },
  ...quranLinks(t),
  { href: "/read-hadith", label: t("navbar.hadith"), icon: faBookOpen },
  { href: "/azkar", label: t("navbar.azkar"), icon: faBookOpen },
  ...toolsLinks(t),
];

export default function Navbar() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path);

  const isQuranActive = () =>
    quranLinks(t).some((route) => pathname.startsWith(route.href));

  const isToolsActive = () =>
    toolsLinks(t).some((route) => pathname.startsWith(route.href));

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY.current || currentY < 10) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const quranRoutes = quranLinks(t);
  const toolsRoutes = toolsLinks(t);
  const utilityRoutes = utilityLinks(t);
  const mobileRoutes = mobileNavLinks(t);

  return (
    <div className="w-full flex justify-center">
      <nav
        className={`w-full z-50 fixed top-0 left-0 right-0 px-4 py-3
          bg-background/80 text-foreground backdrop-blur-xl
          shadow-lg shadow-primary/5 border-b border-border/40
          transition-transform duration-300 ease-out
          ${isNavVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="relative z-10 flex w-full max-w-7xl mx-auto items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <FontAwesomeIcon icon={faMosque} className="text-xl" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              {t("navbar.title")}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <NavDropdown
              label={t("navbar.quran")}
              routes={quranRoutes}
              isActive={isActive}
              isGroupActive={isQuranActive()}
              icon={faBookOpen}
            />

            <Link
              href="/read-hadith"
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive("/read-hadith")
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-transparent text-foreground/80 hover:border-border/60 hover:bg-secondary/50 hover:text-primary"
              }`}
            >
              <span className="">{t("navbar.hadith")}</span>
            </Link>

            <Link
              href="/azkar"
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive("/azkar")
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-transparent text-foreground/80 hover:border-border/60 hover:bg-secondary/50 hover:text-primary"
              }`}
            >
              <span className="">{t("navbar.azkar")}</span>
            </Link>

            <NavDropdown
              label={t("navbar.tools")}
              routes={toolsRoutes}
              isActive={isActive}
              isGroupActive={isToolsActive()}
              icon={faListOl}
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeDropdown />
            <LanguageDropdown />

            <div className="hidden lg:block h-5 w-px bg-border/60 mx-1" />

            {utilityRoutes.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`hidden lg:flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
                  isActive(href)
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-transparent text-foreground/70 hover:border-border/60 hover:bg-secondary/50 hover:text-primary"
                }`}
                aria-label={label}
              >
                <FontAwesomeIcon icon={icon} className="text-base" />
              </Link>
            ))}

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`flex lg:hidden items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-card/80 text-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary hover:bg-primary/5 ${
                isMobileMenuOpen
                  ? "rotate-90 bg-primary/10 text-primary border-primary/30"
                  : ""
              }`}
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faX : faBars}
                className="text-lg"
              />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className={`absolute top-full left-0 w-full px-4 py-4
              border-b border-border/50 bg-background/95 text-foreground backdrop-blur-xl
              shadow-xl lg:hidden animate-in slide-in-from-top-2 duration-200
              ${language === "ar" ? "text-right" : "text-left"}`}
          >
            <div className="max-w-7xl mx-auto space-y-1">
              {mobileRoutes.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2 text-base font-medium transition-all duration-200
                  ${
                    isActive(href)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-foreground/80 hover:bg-secondary/50 hover:text-primary"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive(href) ? "bg-primary/20" : "bg-secondary/50"}`}
                  >
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                  </div>
                  <span className="">{label}</span>
                </Link>
              ))}

              <div className="h-px bg-border/50 my-1" />

              {utilityRoutes.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2 text-base font-medium transition-all duration-200
                    ${
                      isActive(href)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground/80 hover:bg-secondary/50 hover:text-primary"
                    }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive(href) ? "bg-primary/20" : "bg-secondary/50"}`}
                  >
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                  </div>
                  <span className="">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="h-[64px] w-full" aria-hidden="true" />
    </div>
  );
}
