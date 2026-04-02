import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { featuredFeatures } from "./homeData";
import type { ArrowIcon, TranslateFn } from "./types";

type FeaturesSectionProps = {
  t: TranslateFn;
  arrowIcon: ArrowIcon;
  isEnglish: boolean;
};

export default function FeaturesSection({
  t,
  arrowIcon,
  isEnglish,
}: FeaturesSectionProps) {
  return (
    <section className="relative">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
            {t("home.features.heading")}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <p className="text-center text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          {t("home.features.subheading")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {featuredFeatures.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 backdrop-blur-sm"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />

            <div className="relative z-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/25">
                <FontAwesomeIcon icon={feature.icon} className="text-lg" />
              </div>

              <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {t(`home.${feature.title}`)}
              </h3>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`home.${feature.desc}`)}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0">
                <span>{isEnglish ? "Explore" : "استكشف"}</span>
                <FontAwesomeIcon icon={arrowIcon} className="text-xs" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
