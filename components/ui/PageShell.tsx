import { cn } from "./cn";

export type PageWidth = "wide" | "content" | "medium" | "narrow" | "full";

export type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  decorations?: React.ReactNode;
  /** Constrains the inner container. Defaults to `wide` (max-w-7xl). */
  width?: PageWidth;
  /** Removes the default top padding for full-bleed layouts. */
  flush?: boolean;
};

const widthClasses: Record<PageWidth, string> = {
  wide: "w-[92%] max-w-7xl",
  content: "w-[92%] max-w-4xl",
  medium: "w-[92%] max-w-5xl",
  narrow: "w-[92%] max-w-3xl",
  full: "w-full max-w-none",
};

export function PageShell({
  children,
  className,
  containerClassName,
  decorations,
  width = "wide",
  flush = false,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-background pb-20 text-foreground",
        className,
      )}
    >
      {decorations ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {decorations}
        </div>
      ) : null}
      <div
        className={cn(
          "relative z-10 mx-auto",
          widthClasses[width],
          !flush && "pt-10",
          containerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
