import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import type { TranslateFn } from "./types";

type InstallFlowSectionProps = {
  t: TranslateFn;
};

export default function InstallFlowSection({ t }: InstallFlowSectionProps) {
  return (
    <section className="inline-block md:hidden rounded-[2rem] border border-border bg-card/70 p-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

      <div className="relative flex flex-col gap-5">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm">
          <FontAwesomeIcon icon={faMobileScreen} className="text-primary" />
          <span>{t("home.installFlow.badge")}</span>
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {t("home.installFlow.heading")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("home.installFlow.subheading")}
        </p>

        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="relative rounded-xl border border-border bg-background/90 p-4 shadow-sm"
            >
              <div className="absolute -top-2 -left-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                  {step}
                </div>
              </div>
              <p className="text-sm text-foreground mt-2 font-medium">
                {t(`home.installFlow.step${step}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
