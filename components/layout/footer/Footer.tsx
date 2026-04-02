"use client";

import { useLanguage } from "../../../context/general/LanguageContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosque, faCode, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { CircleDecoration, GeometricPattern } from "@/utils/decorations";

export default function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isEnglish = language === "en";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full border-t border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <CircleDecoration className="top-0 left-1/4 w-96 h-96 bg-primary/5" />
        <CircleDecoration className="bottom-0 right-1/4 w-64 h-64 bg-accent/5" />
        <GeometricPattern
          variant="footer"
          className="text-primary w-64 h-64 -top-20 -left-20"
        />
        <GeometricPattern
          variant="footer"
          className="text-accent w-48 h-48 -bottom-10 -right-10 rotate-45"
        />
      </div>

      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-12 pb-6">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <FontAwesomeIcon icon={faMosque} className="text-3xl" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground  mb-4 tracking-tight">
            {t("footer.title")}
          </h2>

          <div className="relative max-w-2xl">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-8 ">
              {t("footer.description")}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground  order-2 md:order-1">
            {t("footer.copyright")}
          </p>

          <div className="flex items-center gap-2 order-1 md:order-2">
            <a
              href="https://kareem-abdelnabi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:bg-primary/5 hover:border-primary/30 hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faCode} className="text-primary" />
              <span
                className={` ${isEnglish ? "underline-offset-4" : "underline-offset-8"} group-hover:underline`}
              >
                {t("footer.madeWith")}
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3 order-3">
            <a
              href="https://github.com/karreemm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
              aria-label="GitHub Profile"
            >
              <FontAwesomeIcon icon={faGithub} className="text-lg" />
            </a>
            <a
              href="https://www.linkedin.com/in/k-abdelnabii"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
              aria-label="LinkedIn Profile"
            >
              <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
            </a>

            <button
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg hover:shadow-primary/25 ml-2"
              aria-label="Back to top"
            >
              <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
