"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
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
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuranDropdownOpen, setIsQuranDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const quranDropdownRef = useRef<HTMLDivElement>(null);
  const quranButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const isQuranActive = () =>
    pathname.startsWith("/read-quran") || pathname.startsWith("/listen-quran");

  const handleLanguageChange = (lang: string) => {
    if (lang !== language) {
      toggleLanguage();
    }
    setIsDropdownOpen(false);
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full z-50 fixed px-4 py-3 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white shadow-md">
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
              className={`hidden xl:inline-block no-underline transition-all duration-300 ${isActive("/")
                ? "text-amber-600 dark:text-amber-400 underline underline-offset-8"
                : "hover:underline hover:underline-offset-8"
                }`}
              href="/"
            >
              {t("navbar.home")}
            </Link>

            <div className="relative">
              <button
                ref={quranButtonRef}
                onClick={() => setIsQuranDropdownOpen(!isQuranDropdownOpen)}
                className={`flex items-center justify-center transition-all duration-300 ${isQuranActive()
                  ? "text-amber-600 dark:text-amber-400 underline underline-offset-8"
                  : "hover:underline hover:underline-offset-8"
                  }`}
              >
                {t("navbar.quran")}
              </button>
              {isQuranDropdownOpen && (
                <div
                  ref={quranDropdownRef}
                  className={`absolute ${language === "ar"
                    ? "left-0 text-right w-36"
                    : "right-0 text-left w-36"
                    } mt-2 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white border-teal-600 dark:border-teal-500 rounded-sm shadow-lg`}
                >
                  <Link
                    href="/read-quran"
                    className={`text-lg block w-full px-4 py-2 hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/read-quran")
                      ? "text-amber-600 dark:text-amber-400 font-bold"
                      : ""
                      }`}
                  >
                    {t("navbar.readQuran")}
                  </Link>
                  <Link
                    href="/listen-quran"
                    className={`block w-full text-lg px-4 py-2 hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/listen-quran")
                      ? "text-amber-600 dark:text-amber-400 font-bold"
                      : ""
                      }`}
                  >
                    {t("navbar.listenQuran")}
                  </Link>
                </div>
              )}
            </div>

            <Link
              className={`no-underline transition-all duration-300 ${isActive("/read-hadith")
                ? "text-amber-600 dark:text-amber-400 underline underline-offset-8"
                : "hover:underline hover:underline-offset-8"
                }`}
              href="/read-hadith"
            >
              {t("navbar.hadith")}
            </Link>

            <Link
              className={`no-underline transition-all duration-300 ${isActive("/azkar")
                ? "text-amber-600 dark:text-amber-400 underline underline-offset-8"
                : "hover:underline hover:underline-offset-8"
                }`}
              href="/azkar"
            >
              {t("navbar.azkar")}
            </Link>

            <Link
              className={`no-underline transition-all duration-300 ${isActive("/tasbeeh")
                ? "text-amber-600 dark:text-amber-400 underline underline-offset-8"
                : "hover:underline hover:underline-offset-8"
                }`}
              href="/tasbeeh"
            >
              {t("navbar.tasbeeh")}
            </Link>

            <Link
              className={`no-underline transition-all duration-300 ${isActive("/prayer-times")
                ? "text-amber-600 dark:text-amber-400 underline underline-offset-8"
                : "hover:underline hover:underline-offset-8"
                }`}
              href="/prayer-times"
            >
              {t("navbar.prayerTimes")}
            </Link>

            <Link
              className={`no-underline transition-all duration-300 ${isActive("/sadaqa-garya")
                ? "text-amber-600 dark:text-amber-400 underline underline-offset-8"
                : "hover:underline hover:underline-offset-8"
                }`}
              href="/sadaqa-garya"
            >
              {t("navbar.sadaqaGarya")}
            </Link>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme ? (
                <FontAwesomeIcon icon={faSun} size="lg" />
              ) : (
                <FontAwesomeIcon icon={faMoon} size="lg" />
              )}
            </button>
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 transition-colors duration-200"
                aria-label="Change Language"
              >
                <FontAwesomeIcon icon={faEarthAfrica} size="lg" />
              </button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className={`absolute ${language === "ar" ? "left-0" : "right-0"
                    } mt-2 w-32 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white border-teal-600 dark:border-teal-500 rounded-sm shadow-lg`}
                >
                  <button
                    onClick={() => handleLanguageChange("ar")}
                    className={`block w-full px-4 py-2 text-left ${language === "ar" ? "bg-[#f5ead5] dark:bg-slate-800" : ""
                      }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`block w-full px-4 py-2 text-left ${language === "en" ? "bg-[#f5ead5] dark:bg-slate-800" : ""
                      }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <div className="hidden lg:block h-6 border-1 border-gray-600 dark:border-gray-500"></div>

            <Link
              href="/saved-ayahs"
              className={`hidden lg:flex items-center justify-center w-10 h-10 transition-colors duration-200 ${isActive("/saved-ayahs") ? "text-amber-600 dark:text-amber-400" : ""
                }`}
            >
              <FontAwesomeIcon icon={faBookmark} size="lg" />
            </Link>

            <Link
              href="/favourites"
              className={`hidden lg:flex items-center justify-center w-10 h-10 transition-colors duration-200 ${isActive("/favourites") ? "text-amber-600 dark:text-amber-400" : ""
                }`}
            >
              <FontAwesomeIcon icon={faHeart} size="lg" />
            </Link>

            <Link
              href="/sadaqat"
              className={`hidden lg:flex items-center justify-center w-10 h-10 transition-colors duration-200 ${isActive("/sadaqat") ? "text-amber-600 dark:text-amber-400" : ""
                }`}
            >
              <FontAwesomeIcon icon={faSeedling} size="lg" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex items-center justify-center w-10 h-10 transition-transform duration-700 lg:hidden ${isMobileMenuOpen ? "rotate-90" : "rotate-0"
                }`}
              aria-label="Toggle Mobile Menu"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faX : faBars} size="lg" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className={`absolute top-16 px-5 py-2 border-b border-black dark:border-white left-0 w-full bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white shadow-md lg:hidden ${language === "ar" ? `text-right` : `text-left`
              }`}
          >
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faHouse} className="" />
              {t("navbar.home")}
            </Link>

            <Link
              href="/read-quran"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/read-quran")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faBookOpen} className="" />
              {t("navbar.readQuran")}
            </Link>

            <Link
              href="/listen-quran"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/listen-quran")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faHeadphones} className="" />
              {t("navbar.listenQuran")}
            </Link>

            <Link
              href="/read-hadith"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/read-hadith")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faBookOpen} className="" />
              {t("navbar.hadith")}
            </Link>

            <Link
              href="/azkar"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/azkar")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faBookOpen} className="" />
              {t("navbar.azkar")}
            </Link>

            <Link
              href="/tasbeeh"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/tasbeeh")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faListOl} className="" />
              {t("navbar.tasbeeh")}
            </Link>

            <Link
              href="/prayer-times"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/prayer-times")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faClock} className="" />
              {t("navbar.prayerTimes")}
            </Link>

            <Link
              href="/sadaqa-garya"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/sadaqa-garya")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faSeedling} className="" />
              {t("navbar.sadaqaGarya")}
            </Link>

            <hr className="border border-gray-500 dark:border-gray-400 w-full my-4" />

            <Link
              href="/saved-ayahs"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/saved-ayahs")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faBookmark} className="" />
              {t("navbar.savedAyahs")}
            </Link>

            <Link
              href="/favourites"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/favourites")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faHeart} className="" />
              {t("navbar.favourites")}
            </Link>

            <Link
              href="/sadaqat"
              className={`flex items-center gap-3 px-4 py-2 text-lg hover:bg-[#f5ead5] dark:hover:bg-slate-800 ${isActive("/sadaqat")
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : ""
                }`}
            >
              <FontAwesomeIcon icon={faSeedling} className="" />
              {t("navbar.yourSadaqat")}
            </Link>
          </div>
        )}
      </div>
    </div>

  );
}
