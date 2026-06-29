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
  faClock,
  faSeedling,
  faListOl,
  faSearch,
  faImage,
  faChevronDown,
  faRadio,
  faGears,
  faHandsPraying
} from "@fortawesome/free-solid-svg-icons";
import {faUssunnah} from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "../../../context/general/LanguageContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";
import LanguageDropdown from "./LanguageDropdown";
import ThemeDropdown from "./ThemeDropdown";
import PaletteDropdown from "./PaletteDropdown";
import NavDropdown from "./NavDropdown";

const readLinks = (t: (key: string) => string) => [
  { href: "/read-quran", label: t("navbar.readQuran"), icon: faBookOpen },
  { href: "/read-hadith", label: t("navbar.hadith"), icon: faUssunnah },
  { href: "/azkar", label: t("navbar.azkar"), icon: faHandsPraying },
];

const listenLinks = (t: (key: string) => string) => [
  { href: "/listen-quran", label: t("navbar.listenQuran"), icon: faBookOpen },
  { href: "/radios", label: t("navbar.radios"), icon: faRadio },
];

const toolsLinks = (t: (key: string) => string) => [
  { href: "/prayer-times", label: t("navbar.prayerTimes"), icon: faClock },
  { href: "/search-ayah", label: t("navbar.searchAyah"), icon: faSearch },
  { href: "/generate-ayah-image", label: t("navbar.generateAyahImage"), icon: faImage },
  { href: "/tasbeeh", label: t("navbar.tasbeeh"), icon: faListOl },
  { href: "/sadaqa-garya", label: t("navbar.sadaqaGarya"), icon: faSeedling },
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
  const navbarContainerRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({
    read: false,
    listen: false,
    tools: false,
  });
  const lastScrollY = useRef(0);

  const isActive = (path: string, exact = false) => {
    if (path === "/") {
      return pathname === "/";
    }
    return exact ? pathname === path : pathname.startsWith(path);
  };

  const isReadActive = () =>
    readLinks(t).some((route) => pathname.startsWith(route.href));

  const isListenActive = () =>
    listenLinks(t).some((route) => pathname.startsWith(route.href));

  const isToolsActive = () =>
    toolsLinks(t).some((route) => pathname.startsWith(route.href));

  useEffect(() => {
    setExpandedMobileSections({
      read: isReadActive(),
      listen: isListenActive(),
      tools: isToolsActive(),
    });
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarContainerRef.current &&
        !navbarContainerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

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

  const toggleSection = (section: string) => {
    setExpandedMobileSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const readRoutes = readLinks(t);
  const listenRoutes = listenLinks(t);
  const toolsRoutes = toolsLinks(t);
  const utilityRoutes = utilityLinks(t);

  const mobileLinkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-all duration-200 ${
      active
        ? "bg-primary/10 text-primary border border-primary/20"
        : "text-foreground/80 hover:bg-secondary/50 hover:text-primary border border-transparent"
    }`;

  const nestedLinkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-4 py-2 text-base font-medium transition-colors duration-200 ${
      active
        ? "text-primary"
        : "text-foreground/70 hover:text-primary"
    }`;

  const iconBoxClass = (active: boolean) =>
    `flex items-center justify-center w-8 h-8 rounded-lg ${
      active ? "bg-primary/20" : "bg-secondary/50"
    }`;

  const nestedIconBoxClass = "flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50";

  return (
    <div className="w-full flex justify-center" ref={navbarContainerRef}>
      <nav
        className={`w-full z-50 fixed top-0 left-0 right-0 px-4 py-3
          bg-background sm:bg-background/80 text-foreground sm:backdrop-blur-xl
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
            <span className="hidden md:inline-block text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              {t("navbar.title")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavDropdown
              label={t("navbar.read")}
              routes={readRoutes}
              isActive={isActive}
              isGroupActive={isReadActive()}
              icon={faBookOpen}
            />

            <NavDropdown
              label={t("navbar.listen")}
              routes={listenRoutes}
              isActive={isActive}
              isGroupActive={isListenActive()}
              icon={faHeadphones}
            />

            <NavDropdown
              label={t("navbar.tools")}
              routes={toolsRoutes}
              isActive={isActive}
              isGroupActive={isToolsActive()}
              icon={faGears}
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeDropdown />
            <PaletteDropdown />
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
              {/* Home */}
              <Link
                href="/"
                className={mobileLinkClass(isActive("/", true))}
              >
                <div className={iconBoxClass(isActive("/", true))}>
                  <FontAwesomeIcon icon={faHouse} className="text-sm" />
                </div>
                <span>{t("navbar.home")}</span>
              </Link>

              {/* Read Section */}
              <div className="pt-1">
                <button
                  onClick={() => toggleSection("read")}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold transition-all duration-200 ${
                    isReadActive()
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-foreground/90 hover:bg-secondary/50 hover:text-primary border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={iconBoxClass(isReadActive())}>
                      <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
                    </div>
                    <span>{t("navbar.read")}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-200 ${
                      expandedMobileSections.read ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedMobileSections.read ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-1 pl-4 border-l-2 border-primary/10 ml-6">
                    {readRoutes.map(({ href, label, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={nestedLinkClass(isActive(href))}
                      >
                        <div className={nestedIconBoxClass}>
                          <FontAwesomeIcon icon={icon} className="text-sm" />
                        </div>
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Listen Section */}
              <div className="pt-1">
                <button
                  onClick={() => toggleSection("listen")}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold transition-all duration-200 ${
                    isListenActive()
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-foreground/90 hover:bg-secondary/50 hover:text-primary border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={iconBoxClass(isListenActive())}>
                      <FontAwesomeIcon icon={faHeadphones} className="text-sm" />
                    </div>
                    <span>{t("navbar.listen")}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-200 ${
                      expandedMobileSections.listen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedMobileSections.listen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-1 pl-4 border-l-2 border-primary/10 ml-6">
                    {listenRoutes.map(({ href, label, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={nestedLinkClass(isActive(href))}
                      >
                        <div className={nestedIconBoxClass}>
                          <FontAwesomeIcon icon={icon} className="text-sm" />
                        </div>
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tools Section */}
              <div className="pt-1">
                <button
                  onClick={() => toggleSection("tools")}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold transition-all duration-200 ${
                    isToolsActive()
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-foreground/90 hover:bg-secondary/50 hover:text-primary border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={iconBoxClass(isToolsActive())}>
                      <FontAwesomeIcon icon={faGears} className="text-sm" />
                    </div>
                    <span>{t("navbar.tools")}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-xs transition-transform duration-200 ${
                      expandedMobileSections.tools ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedMobileSections.tools ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-1 pl-4 border-l-2 border-primary/10 ml-6">
                    {toolsRoutes.map(({ href, label, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={nestedLinkClass(isActive(href))}
                      >
                        <div className={nestedIconBoxClass}>
                          <FontAwesomeIcon icon={icon} className="text-sm" />
                        </div>
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border/50 my-2" />

              {utilityRoutes.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={mobileLinkClass(isActive(href))}
                >
                  <div className={iconBoxClass(isActive(href))}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                  </div>
                  <span>{label}</span>
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