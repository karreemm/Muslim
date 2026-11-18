import { cn } from "./cn";

type IconButtonVariant = "ghost" | "primary" | "destructive";
type IconButtonSize = "sm" | "md";

export type IconButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> & {
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  primary: "text-primary hover:bg-primary/10 hover:text-primary",
  destructive: "text-destructive hover:bg-destructive/10 hover:text-destructive",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
};

export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
