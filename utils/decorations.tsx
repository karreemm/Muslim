type PatternVariant = "home" | "footer";

type GeometricPatternProps = {
  className?: string;
  variant?: PatternVariant;
};

type CircleDecorationProps = {
  className?: string;
};

const homePath = (
  <>
    <path d="M100 10 L120 80 L190 100 L120 120 L100 190 L80 120 L10 100 L80 80 Z" />
    <circle
      cx="100"
      cy="100"
      r="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M100 40 L130 70 L160 100 L130 130 L100 160 L70 130 L40 100 L70 70 Z"
      fill="none"
      opacity="0.5"
    />
  </>
);

const footerPath = (
  <>
    <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" />
    <circle
      cx="50"
      cy="50"
      r="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
  </>
);

export function GeometricPattern({
  className = "",
  variant = "home",
}: GeometricPatternProps) {
  const isFooter = variant === "footer";

  return (
    <svg
      viewBox={isFooter ? "0 0 100 100" : "0 0 200 200"}
      className={`absolute pointer-events-none ${isFooter ? "opacity-[0.03]" : ""} ${className}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isFooter ? footerPath : homePath}
    </svg>
  );
}

export function CircleDecoration({ className = "" }: CircleDecorationProps) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  );
}
