"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMosque,
  faSun,
  faMoon,
  faEarthAfrica,
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
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";

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
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuranDropdownOpen, setIsQuranDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const quranDropdownRef = useRef<HTMLDivElement>(null);
  const quranButtonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path);

  const isQuranActive = () =>
    ["/read-quran", "/listen-quran", "/search-ayah"].some((p) =>
      pathname.startsWith(p),
    );

  useEffect(() => {
    setIsQuranDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY.current || currentY < 10) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
        setIsQuranDropdownOpen(false);
        setIsDropdownOpen(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        quranDropdownRef.current &&
        quranButtonRef.current &&
        !quranDropdownRef.current.contains(event.target as Node) &&
        !quranButtonRef.current.contains(event.target as Node)
      ) {
        setIsQuranDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    if (lang !== language) toggleLanguage();
    setIsDropdownOpen(false);
  };

  const mainLinks = mainNavLinks(t);
  const quranRoutes = quranLinks(t);
  const utilityRoutes = utilityLinks(t);

  return (
    <div className="w-full flex justify-center">
      <div
        className={`w-full z-50 fixed top-0 left-0 right-0 px-4 py-3
          bg-background text-primary dark:bg-background dark:text-foreground
          shadow-md border-b border-border/20 dark:border-border/10
          transition-transform duration-300 ease-in-out
          ${isNavVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex w-full max-w-[1500px] mx-auto items-center justify-between">
          <Link href="/" className="flex gap-2 text-xl">
            <FontAwesomeIcon
              icon={faMosque}
              className={language === "ar" ? "mt-2" : "mt-1"}
            />
            <span className="text-2xl font-semibold">{t("navbar.title")}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-14 text-xl font-semibold">
            <Link
              href="/"
              className={`hidden xl:inline-block no-underline transition-all duration-300 ${
                isActive("/", true)
                  ? "text-accent underline underline-offset-8"
                  : "hover:underline hover:underline-offset-8"
              }`}
            >
              {t("navbar.home")}
            </Link>

            <div className="relative">
              <button
                ref={quranButtonRef}
                onClick={() => setIsQuranDropdownOpen((v) => !v)}
                className={`flex items-center gap-1 transition-all duration-300 ${
                  isQuranActive()
                    ? "text-accent underline underline-offset-8"
                    : "hover:underline hover:underline-offset-8"
                }`}
              >
                {t("navbar.quran")}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-sm transition-transform duration-200 ${
                    isQuranDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isQuranDropdownOpen && (
                <div
                  ref={quranDropdownRef}
                  className={`absolute ${
                    language === "ar"
                      ? "left-0 text-right"
                      : "right-0 text-left"
                  } mt-2 w-40 bg-background text-primary dark:bg-background
                    dark:text-foreground rounded-sm shadow-lg border border-border/10
                    dark:border-border/10`}
                >
                  {quranRoutes.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`text-lg block w-full px-4 py-2 hover:bg-secondary
                        ${isActive(href) ? "text-accent font-bold" : ""}`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {mainLinks
              .filter((l) => l.href !== "/")
              .map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`no-underline transition-all duration-300 ${
                    isActive(href)
                      ? "text-accent underline underline-offset-8"
                      : "hover:underline hover:underline-offset-8"
                  }`}
                >
                  {label}
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 duration-500 hover:scale-125 transition-all ease-in-out"
              aria-label="Toggle Theme"
            >
              <FontAwesomeIcon icon={theme ? faSun : faMoon} size="lg" />
            </button>

            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex items-center justify-center w-10 h-10 duration-500 hover:scale-125 transition-all ease-in-out"
                aria-label="Change Language"
              >
                <FontAwesomeIcon icon={faEarthAfrica} size="lg" />
              </button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className={`absolute ${
                    language === "ar" ? "left-0" : "right-0"
                  } mt-2 w-32 bg-background text-primary dark:bg-background
                    dark:text-foreground rounded-sm shadow-lg border border-border/10
                    dark:border-border/10`}
                >
                  {["ar", "en"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`block w-full px-4 py-2 text-left ${
                        language === lang ? "bg-secondary" : ""
                      }`}
                    >
                      {lang === "ar" ? "العربية" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:block h-6 border-l border-border" />

            {utilityRoutes.map(({ href, icon }) => (
              <Link
                key={href}
                href={href}
                className={`hidden lg:flex items-center justify-center w-10 h-10
                  duration-500 hover:scale-125 transition-all ease-in-out ${
                    isActive(href) ? "text-accent" : ""
                  }`}
              >
                <FontAwesomeIcon icon={icon} size="lg" />
              </Link>
            ))}

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`flex items-center justify-center w-10 h-10 transition-transform duration-300 lg:hidden ${
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
              border-b border-border/20 dark:border-border/10
              bg-background text-primary dark:bg-background dark:text-foreground
              shadow-md lg:hidden ${language === "ar" ? "text-right" : "text-left"}`}
          >
            {[mainLinks[0], ...quranRoutes, ...mainLinks.slice(1)].map(
              ({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2 text-lg
                  hover:bg-secondary ${
                    isActive(href, href === "/") ? "text-accent font-bold" : ""
                  }`}
                >
                  <FontAwesomeIcon icon={icon} />
                  {label}
                </Link>
              ),
            )}

            <hr className="border border-border w-full my-3" />

            {utilityRoutes.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 text-lg
                  hover:bg-secondary ${
                    isActive(href) ? "text-accent font-bold" : ""
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
