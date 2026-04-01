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
import { useLanguage } from "../../context/LanguageContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";
import LanguageDropdown from "./LanguageDropdown";
import ThemeDropdown from "./ThemeDropdown";
import QuranDropdown from "./QuranDropdown";

const mainNavLinks = (t: (key: string) => string) => [
  { href: "/", label: t("navbar.home"), icon: faHouse, exactMatch: true },
  { href: "/read-hadith", label: t("navbar.hadith"), icon: faBookOpen },
  { href: "/azkar", label: t("navbar.azkar"), icon: faBookOpen },
  { href: "/tasbeeh", label: t("navbar.tasbeeh"), icon: faListOl },
  { href: "/prayer-times", label: t("navbar.prayerTimes"), icon: faClock },
  { href: "/sadaqa-garya", label: t("navbar.sadaqaGarya"), icon: faSeedling },
];

const quranLinks = (t: (key: string) => string) => [
  { href: "/read-quran", label: t("navbar.readQuran"), icon: faBookOpen },
  { href: "/listen-quran", label: t("navbar.listenQuran"), icon: faHeadphones },
  { href: "/search-ayah", label: t("navbar.searchAyah"), icon: faSearch },
];

const utilityLinks = (t: (key: string) => string) => [
  { href: "/saved-ayahs", label: t("navbar.savedAyahs"), icon: faBookmark },
  { href: "/favourites", label: t("navbar.favourites"), icon: faHeart },
  { href: "/sadaqat", label: t("navbar.yourSadaqat"), icon: faSeedling },
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
    ["/read-quran", "/listen-quran", "/search-ayah"].some((p) =>
      pathname.startsWith(p),
    );

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

  const mainLinks = mainNavLinks(t);
  const quranRoutes = quranLinks(t);
  const utilityRoutes = utilityLinks(t);

  return (
    <div className="w-full flex justify-center">
      <div
        className={`w-full z-50 fixed top-0 left-0 right-0 px-4 py-3
          bg-background/90 text-foreground backdrop-blur-md
          shadow-lg border-b border-border/40
          transition-transform duration-300 ease-in-out
          ${isNavVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/10" />

        <div className="relative z-10 flex w-full max-w-[1500px] mx-auto items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl text-foreground"
          >
            <FontAwesomeIcon icon={faMosque} className={`text-primary`} />
            <span className="text-2xl font-semibold tracking-wide text-primary">
              {t("navbar.title")}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-3 text-lg font-semibold">
            <Link
              href="/"
              className={`hidden xl:inline-flex items-center rounded-xl border px-3 py-2 no-underline transition-all duration-200 ${
                isActive("/", true)
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-transparent text-foreground/90 hover:border-border/60 hover:bg-secondary/70 hover:text-primary"
              }`}
            >
              {t("navbar.home")}
            </Link>

            <QuranDropdown
              label={t("navbar.quran")}
              language={language}
              pathname={pathname}
              routes={quranRoutes}
              isActive={isActive}
              isQuranActive={isQuranActive()}
            />

            {mainLinks
              .filter((l) => l.href !== "/")
              .map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center rounded-xl border px-3 py-2 no-underline transition-all duration-200 ${
                    isActive(href)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-transparent text-foreground/90 hover:border-border/60 hover:bg-secondary/70 hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-2 relative">
            <ThemeDropdown />
            <LanguageDropdown />

            <div className="hidden lg:block h-6 border-l border-border/60 mx-1" />

            {utilityRoutes.map(({ href, icon }) => (
              <Link
                key={href}
                href={href}
                className={`hidden lg:flex items-center justify-center w-10 h-10 rounded-xl border
                  transition-all duration-200 ${
                    isActive(href)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-transparent text-foreground/90 hover:border-border/60 hover:bg-secondary/70 hover:text-primary"
                  }`}
              >
                <FontAwesomeIcon icon={icon} size="lg" />
              </Link>
            ))}

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl border border-border/40 bg-card/80 text-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary lg:hidden ${
                isMobileMenuOpen ? "rotate-90" : "rotate-0"
              }`}
              aria-label="Toggle Mobile Menu"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faX : faBars}
                size="lg"
              />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className={`absolute top-full left-0 w-full px-5 py-2
              border-b border-border/40 bg-background/95 text-foreground backdrop-blur-md
              shadow-lg lg:hidden ${language === "ar" ? "text-right" : "text-left"}`}
          >
            {[mainLinks[0], ...quranRoutes, ...mainLinks.slice(1)].map(
              ({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2 text-lg transition-colors
                  ${
                    isActive(href, href === "/")
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/90 hover:bg-secondary hover:text-primary"
                  }`}
                >
                  <FontAwesomeIcon icon={icon} />
                  {label}
                </Link>
              ),
            )}

            <hr className="border border-border/70 w-full my-3" />

            {utilityRoutes.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2 text-lg transition-colors
                  ${
                    isActive(href)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/90 hover:bg-secondary hover:text-primary"
                  }`}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="h-[64px] w-full" aria-hidden />
    </div>
  );
}
