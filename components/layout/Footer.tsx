"use client";

import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosque, faCode } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import React from "react";

export default function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <div className="z-50 w-full flex flex-col gap-5 px-10 pt-10 md:pt-4 pb-2 border-t border-border bg-background text-primary dark:bg-background dark:text-foreground shadow-md">
        <div className="w-full max-w-[1500px] mx-auto">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon
                  icon={faMosque}
                  className="text-4xl dark:text-foreground"
                />
                <span
                  className={`text-4xl font-semibold dark:text-foreground text-center`}
                >
                  {t("footer.title")}
                </span>
              </div>

              <div className="w-full md:w-[60%] flex justify-center">
                <p
                  className={`w-full  text-2xl flex flex-col dark:text-foreground items-center gap-2 text-center `}
                >
                  {t("footer.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-3 mt-10 flex flex-col gap-2 items-center md:flex md:flex-row md:justify-between md:items-start  dark:text-foreground">
            <p className="md:text-xl">{t("footer.copyright")}</p>
            <div className="flex items-center gap-5">
              <a
                className="group md:text-xl flex gap-2 items-center hover:opacity-80"
                href="https://kareem-abdelnabi.vercel.app/"
              >
                <FontAwesomeIcon icon={faCode} className="" />
                <span
                  className={`group-hover:underline ${
                    language === "ar"
                      ? "underline-offset-14"
                      : "underline-offset-8"
                  }`}
                >
                  {t("footer.madeWith")}
                </span>
              </a>

              <div className="flex gap-3">
                <a
                  className="md:text-2xl hover:opacity-80"
                  href="https://github.com/karreemm"
                  aria-label="Github Profile"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>

                <a
                  className="md:text-2xl hover:opacity-80"
                  href="www.linkedin.com/in/k-abdelnabii"
                  aria-label="Linkedin Profile"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
