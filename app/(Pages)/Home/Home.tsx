"use client";

import ImgLight from "../../../assets/general/bg2.webp";
import ImgDark from "../../../assets/general/bg8.webp";
import install from "../../../assets/general/Installation.webp";
import { useLanguage } from "../../../context/LanguageContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";

export default function Header() {
  const { language } = useLanguage();
  const { t } = useTranslation();


  return (
    <>
      <div className="w-full flex justify-center">
        <div className="mt-32 md:mt-0 min-h-screen w-[90%] flex flex-col gap-10">
          <div className="w-full md:min-h-screen flex flex-col items-center gap-14 md:flex md:flex-row md:justify-between md:p-4 bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white">
            <div className="md:w-1/2 flex flex-col gap-5">
              <h1 className="text-2xl md:text-4xl font-bold">
                {t("home.welcome")}
              </h1>
              <h1 className="md:text-2xl text-lg">{t("home.description")}</h1>
              <ul
                className={`flex flex-col list-disc list-outside text-lg md:text-2xl gap-5 mt-5 md:mt-10 relative ${
                  language === "en" ? "pl-5" : "pr-5"
                }`}
              >
                <li>
                  <Link
                    href="/read-quran"
                    className={`before:absolute ${
                      language === "en" ? "before:left-0" : "before:right-0"
                    } before:text-lg before:font-bold before:top-0 before:mt-1 hover:opacity-70`}
                  >
                    {t("home.item1")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/listen-quran"
                    className={`before:absolute ${
                      language === "en" ? "before:left-0" : "before:right-0"
                    } before:text-lg before:font-bold before:top-0 before:mt-1 hover:opacity-70`}
                  >
                    {t("home.item2")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/read-hadith"
                    className={`before:absolute ${
                      language === "en" ? "before:left-0" : "before:right-0"
                    } before:text-lg before:font-bold before:top-0 before:mt-1 hover:opacity-70`}
                  >
                    {t("home.item3")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/azkar"
                    className={`before:absolute ${
                      language === "en" ? "before:left-0" : "before:right-0"
                    } before:text-lg before:font-bold before:top-0 before:mt-1 hover:opacity-70`}
                  >
                    {t("home.item4")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <img
                src={ImgDark.src}
                alt=""
                className="hidden dark:block w-full md:w-3/4 rounded-lg"
              />
              <img
                src={ImgLight.src}
                alt=""
                className="block dark:hidden w-full md:w-3/4 rounded-lg"
              />
            </div>
          </div>

          <div className="md:hidden w-full flex flex-col gap-10 md:flex-row md:justify-between md:items-center mt-10">
            <div className="w-full md:w-[70%] flex flex-col">
              <h1 className="text-2xl md:text-4xl font-bold">
                {t("home.install")}
              </h1>

              <ul
                className={`flex flex-col list-disc list-outside text-lg md:text-2xl gap-5 mt-5 md:mt-10 relative ${
                  language === "en" ? "pl-5" : "pr-5"
                }`}
              >
                <li
                  className={`before:absolute ${
                    language === "en" ? "before:left-0" : "before:right-0"
                  } before:text-lg before:font-bold before:top-0 before:mt-1`}
                >
                  {t("home.step1")}
                </li>

                <li
                  className={`before:absolute ${
                    language === "en" ? "before:left-0" : "before:right-0"
                  } before:text-lg before:font-bold before:top-0 before:mt-8`}
                >
                  {t("home.step2")}
                </li>

                <li
                  className={`before:absolute ${
                    language === "en" ? "before:left-0" : "before:right-0"
                  } before:text-lg before:font-bold before:top-0 before:mt-16`}
                >
                  {t("home.step3")}
                </li>
              </ul>
            </div>

            <div className="w-full md:w-[30%] flex justify-center">
              <img
                src={install.src}
                alt="Installation"
                className="w-[80%] rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
