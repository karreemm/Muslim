import { cn } from "./cn";

export type ErrorStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function ErrorState({
  icon,
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-16 text-center",
        className,
      )}
      role="alert"
    >
      {icon ? (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          {icon}
        </div>
      ) : null}
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="max-w-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
