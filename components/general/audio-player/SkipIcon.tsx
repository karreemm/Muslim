import React from "react";

interface SkipIconProps {
  direction: "forward" | "backward";
  className?: string;
}

const SkipIcon: React.FC<SkipIconProps> = ({ direction, className = "" }) => {
  const isForward = direction === "forward";

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isForward ? (
        <>
          <path
            d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3v5h-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 3v5h5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      <text
        x="12"
        y="13"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="8"
        fontWeight="700"
        fill="currentColor"
        fontFamily="inherit"
      >
        15
      </text>
    </svg>
  );
};

export default SkipIcon;