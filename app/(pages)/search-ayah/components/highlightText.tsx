import React, { type ReactNode } from "react";

import type { MatchInterval } from "../types";

export interface HighlightTextProps {
  text: string;
  keyword?: string;
  matchIntervals?: MatchInterval[];
  isDarkMode?: boolean;
}

export function highlightText({
  text,
  matchIntervals = [],
}: HighlightTextProps): ReactNode {
  if (!text) return null;

  if (!matchIntervals || matchIntervals.length === 0) {
    return <>{text}</>;
  }

  const nodes: ReactNode[] = [];
  let currentIndex = 0;

  for (let i = 0; i < matchIntervals.length; i++) {
    const { start, end } = matchIntervals[i];

    if (start > currentIndex && start <= text.length) {
      nodes.push(
        <React.Fragment key={`text-${currentIndex}`}>
          {text.slice(currentIndex, start)}
        </React.Fragment>
      );
    }

    if (start < text.length) {
      const validEnd = Math.min(end + 1, text.length);
      nodes.push(
        <mark key={`mark-${start}`} className="bg-transparent text-primary font-bold not-italic">
          {text.slice(start, validEnd)}
        </mark>
      );
      currentIndex = validEnd;
    }
  }

  if (currentIndex < text.length) {
    nodes.push(
      <React.Fragment key={`text-${currentIndex}`}>
        {text.slice(currentIndex)}
      </React.Fragment>
    );
  }

  return <>{nodes}</>;
}

export default highlightText;