import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMosque,
} from "@fortawesome/free-solid-svg-icons";
import { GeometricPattern } from "@/utils/decorations";
import type { ArrowIcon, TranslateFn } from "../types";
import { useLanguage } from "@/context/general/LanguageContext";

type HeroSectionProps = {
  t: TranslateFn;
  arrowIcon: ArrowIcon;
};

export default function HeroSection({ t }: HeroSectionProps) {

  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/80 backdrop-blur-md shadow-2xl shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />

      <GeometricPattern className="text-primary/5 w-64 h-64 -top-20 -right-20 rotate-12" />
      <GeometricPattern className="text-accent/5 w-48 h-48 -bottom-10 -left-10 -rotate-12" />
      <GeometricPattern className="text-primary/5 w-32 h-32 top-20 right-20 rotate-45 opacity-50" />

      <div className="relative flex flex-col items-center justify-center text-center px-6 py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="md:hidden mt-1 text-primary text-3xl font-bold">
            {language === "en" ? "Muslim" : "مسلم"}
          </span>
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-lg shadow-primary/10">
            <FontAwesomeIcon icon={faMosque} className="text-3xl sm:text-4xl" />
          </div>
        </div>

        <h1
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-[1.15] text-foreground tracking-tight max-w-4xl"
          style={{ textWrap: "balance" }}
        >
          {t("home.hero.title")}
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground font-light max-w-2xl leading-relaxed px-4">
          {t("home.hero.description")}
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Link
            href="/read-quran"
            className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center"
          >
            <span>{t("home.hero.primaryCta")}</span>
          </Link>
          <Link
            href="/listen-quran"
            className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-background/80 px-7 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-secondary/50 hover:border-primary/30 backdrop-blur-sm w-full sm:w-auto justify-center"
          >
            <span>{t("home.hero.secondaryCta")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
