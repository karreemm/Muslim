import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GeometricPattern } from "@/utils/decorations";
import { secondaryTools } from "./homeData";
import type { TranslateFn } from "./types";

type ToolsSectionProps = {
  t: TranslateFn;
};

export default function ToolsSection({ t }: ToolsSectionProps) {
  return (
    <section className="relative rounded-[2rem] border border-border bg-gradient-to-b from-card/80 to-card/40 p-6 sm:p-8 backdrop-blur-md">
      <GeometricPattern className="text-primary/5 w-40 h-40 top-0 right-0 opacity-50" />

      <div className="mb-6 flex flex-col gap-2 relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {t("home.tools.heading")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 relative z-10">
        {secondaryTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-4 rounded-xl border border-border bg-background/70 p-4 transition-all duration-300 hover:bg-background hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-secondary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <FontAwesomeIcon icon={tool.icon} className="text-base" />
            </div>
            <div>
              <h3 className="mb-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {t(`home.${tool.title}`)}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(`home.${tool.desc}`)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
