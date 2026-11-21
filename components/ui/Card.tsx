import { cn } from "./cn";

export type CardProps = React.ComponentProps<"div"> & {
  interactive?: boolean;
};

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/70 backdrop-blur-sm",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10",
        className,
      )}
      {...props}
    />
  );
}
