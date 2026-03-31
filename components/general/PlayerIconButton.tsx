import React from "react";

interface PlayerIconButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className: string;
  tooltip: string;
  children: React.ReactNode;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  tooltipClassName?: string;
  ariaLabel?: string;
}

const PlayerIconButton: React.FC<PlayerIconButtonProps> = ({
  onClick,
  disabled,
  className,
  tooltip,
  children,
  buttonRef,
  tooltipClassName,
  ariaLabel,
}) => {
  return (
    <div className="relative group">
      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel ?? tooltip}
        className={className}
      >
        {children}
      </button>
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[300] hidden md:block ${tooltipClassName ?? ""}`}
      >
        {tooltip}
      </div>
    </div>
  );
};

export default PlayerIconButton;
