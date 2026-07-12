import Link from "next/link";
import { GeometricPattern } from "@/utils/decorations";
import type { ArrowIcon, TranslateFn } from "../types";

type CtaSectionProps = {
  t: TranslateFn;
  arrowIcon: ArrowIcon;
};

export default function CtaSection({ t }: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 p-8 sm:p-10 text-center backdrop-blur-md">
      <GeometricPattern className="text-primary/10 w-96 h-96 -top-20 -left-20 rotate-45" />
      <GeometricPattern className="text-accent/10 w-64 h-64 -bottom-10 -right-10 -rotate-12" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          {t("home.cta.heading")}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
          {t("home.cta.description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/read-quran"
            className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <span>{t("home.cta.primary")}</span>
          </Link>
          <Link
            href="/search-ayah"
            className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-background/90 px-6 py-3.5 text-sm font-bold text-foreground transition-all duration-300 hover:bg-background hover:shadow-lg backdrop-blur-sm w-full sm:w-auto justify-center"
          >
            <span>{t("home.cta.secondary")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
