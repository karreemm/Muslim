"use client";

import ImgLight from "../../../assets/general/bgLight.webp";
import ImgDark from "../../../assets/general/bgDark.webp";
import install from "../../../assets/general/Installation.webp";
import { useLanguage } from "../../../context/LanguageContext";
import Link from "next/link";
import { useTranslation } from "@/hooks/general/useTranslation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHeadphones,
  faSearch,
  faClock,
  faBook,
  faHeart,
  faListOl,
  faSeedling,
  faBookmark,
  faHandHoldingHeart,
  faArrowRight,
  faArrowLeft,
  faMobileScreen,
  faShieldHeart,
} from "@fortawesome/free-solid-svg-icons";

const featuredFeatures = [
  {
    href: "/read-quran",
    icon: faBookOpen,
    title: "features.readQuran.title",
    desc: "features.readQuran.desc",
  },
  {
    href: "/listen-quran",
    icon: faHeadphones,
    title: "features.listenQuran.title",
    desc: "features.listenQuran.desc",
  },
  {
    href: "/search-ayah",
    icon: faSearch,
    title: "features.searchAyah.title",
    desc: "features.searchAyah.desc",
  },
  {
    href: "/prayer-times",
    icon: faClock,
    title: "features.prayerTimes.title",
    desc: "features.prayerTimes.desc",
  },
  {
    href: "/azkar",
    icon: faBook,
    title: "features.azkar.title",
    desc: "features.azkar.desc",
  },
  {
    href: "/read-hadith",
    icon: faHeart,
    title: "features.hadith.title",
    desc: "features.hadith.desc",
  },
];

const secondaryTools = [
  {
    href: "/tasbeeh",
    icon: faListOl,
    title: "tools.tasbeeh.title",
    desc: "tools.tasbeeh.desc",
  },
  {
    href: "/sadaqa-garya",
    icon: faSeedling,
    title: "tools.sadaqaGarya.title",
    desc: "tools.sadaqaGarya.desc",
  },
  {
    href: "/favourites",
    icon: faBookmark,
    title: "tools.favourites.title",
    desc: "tools.favourites.desc",
  },
  {
    href: "/sadaqat",
    icon: faHandHoldingHeart,
    title: "tools.sadaqat.title",
    desc: "tools.sadaqat.desc",
  },
];

export default function Header() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isEnglish = language === "en";
  const arrowIcon = isEnglish ? faArrowRight : faArrowLeft;

  return (
    <div className="w-full flex justify-center pb-14">
      <div className="mt-16 w-[92%] max-w-[1500px] flex flex-col gap-10">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 lg:p-10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
                <FontAwesomeIcon
                  icon={faShieldHeart}
                  className="text-primary"
                />
                <span>{t("home.hero.badge")}</span>
              </div>

              <h1 className="text-3xl font-bold leading-tight text-foreground lg:text-5xl">
                {t("home.hero.title")}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                {t("home.hero.description")}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/read-quran"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <span>{t("home.hero.primaryCta")}</span>
                  <FontAwesomeIcon icon={arrowIcon} />
                </Link>
                <Link
                  href="/listen-quran"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
                >
                  <span>{t("home.hero.secondaryCta")}</span>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={ImgDark.src}
                alt={t("home.hero.imageAlt")}
                className="hidden w-full max-w-xl rounded-2xl border border-border shadow-xl dark:block"
              />
              <img
                src={ImgLight.src}
                alt={t("home.hero.imageAlt")}
                className="block w-full max-w-xl rounded-2xl border border-border shadow-xl dark:hidden"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/60 p-5 lg:p-7">
          <div className="mb-6 flex flex-col gap-2 lg:mb-7">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              {t("home.features.heading")}
            </h2>
            <p className="text-sm text-muted-foreground lg:text-base">
              {t("home.features.subheading")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredFeatures.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-2xl border border-border bg-background/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t(`home.${feature.title}`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`home.${feature.desc}`)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/50 p-5 lg:p-7">
          <div className="mb-6 flex flex-col gap-2 lg:mb-7">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
              {t("home.tools.heading")}
            </h2>
            <p className="text-sm text-muted-foreground lg:text-base">
              {t("home.tools.subheading")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {secondaryTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-border bg-background/65 p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <FontAwesomeIcon icon={tool.icon} />
                </div>
                <h3 className="mb-1 text-base font-semibold text-foreground">
                  {t(`home.${tool.title}`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`home.${tool.desc}`)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="inline-block md:hidden rounded-3xl border border-border bg-card/70 p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
                <FontAwesomeIcon
                  icon={faMobileScreen}
                  className="text-primary"
                />
                <span>{t("home.installFlow.badge")}</span>
              </div>

              <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                {t("home.installFlow.heading")}
              </h2>
              <p className="text-sm text-muted-foreground lg:text-base">
                {t("home.installFlow.subheading")}
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-border bg-background/80 p-4"
                  >
                    <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {step}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {t(`home.installFlow.step${step}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={install.src}
                alt={t("home.installFlow.imageAlt")}
                className="w-full max-w-sm rounded-2xl border border-border bg-background/70 p-2 shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-primary/10 p-6 text-center lg:p-9">
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
            {t("home.cta.heading")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            {t("home.cta.description")}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/read-quran"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <span>{t("home.cta.primary")}</span>
              <FontAwesomeIcon icon={arrowIcon} />
            </Link>
            <Link
              href="/search-ayah"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              <span>{t("home.cta.secondary")}</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
