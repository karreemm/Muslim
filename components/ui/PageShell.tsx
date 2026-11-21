import { cn } from "./cn";

export type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  decorations?: React.ReactNode;
};

export function PageShell({
  children,
  className,
  containerClassName,
  decorations,
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
          "relative z-10 mx-auto w-[92%] max-w-7xl pt-10",
          containerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
