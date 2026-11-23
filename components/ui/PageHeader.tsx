import { cn } from "./cn";

export type PageHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Optional Quran quote rendered under the subtitle. */
  quote?: React.ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  icon,
  align = "center",
  className,
  quote,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-10",
        align === "center" ? "text-center" : "text-start",
        className,
      )}
    >
      {icon ? (
        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary",
            align === "center" && "mx-auto",
          )}
        >
          {icon}
        </div>
      ) : null}
      <h1 className="type-page">{title}</h1>
      {subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground md:text-base">{subtitle}</p>
      ) : null}
      {quote}
    </header>
  );
}
