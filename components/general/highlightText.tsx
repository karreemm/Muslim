import React, { ReactNode } from "react";
import { removeDiacritics } from "../../utils/helpers";

export interface HighlightTextProps {
  text: string;
  keyword: string;
  isDarkMode: boolean;
}

export const highlightText = ({
  text,
  keyword,
  isDarkMode,
}: HighlightTextProps): ReactNode => {
  if (!keyword || !text) {
    return <>{text}</>;
  }

  const normalizedKeyword = removeDiacritics(keyword.trim());
  const searchWords = normalizedKeyword.split(/\s+/);

  const highlightMap: boolean[] = new Array(text.length).fill(false);

  searchWords.forEach((searchWord) => {
    let i = 0;
    while (i < text.length) {
      while (i < text.length && removeDiacritics(text[i]) === "") {
        i++;
      }

      if (i >= text.length) break;

      let textPos = i;
      let wordPos = 0;
      let matchStart = i;

      while (wordPos < searchWord.length && textPos < text.length) {
        const normalizedChar = removeDiacritics(text[textPos]);

        if (normalizedChar === "") {
          textPos++;
          continue;
        }

        if (
          normalizedChar.toLowerCase() === searchWord[wordPos].toLowerCase()
        ) {
          wordPos++;
          textPos++;
        } else {
          break;
        }
      }

      if (wordPos === searchWord.length) {
        while (
          textPos < text.length &&
          removeDiacritics(text[textPos]) === ""
        ) {
          textPos++;
        }

        for (let j = matchStart; j < textPos; j++) {
          highlightMap[j] = true;
        }
        i = textPos;
      } else {
        i++;
      }
    }
  });

  const parts: ReactNode[] = [];
  let currentSegment = "";
  let isHighlighted = false;
  let segmentKey = 0;

  for (let i = 0; i < text.length; i++) {
    if (highlightMap[i] !== isHighlighted) {
      if (currentSegment) {
        if (isHighlighted) {
          parts.push(
            <span
              key={`highlight-${segmentKey++}`}
              className={`${isDarkMode ? "text-teal-300" : "text-teal-600"}`}
              style={{ fontWeight: "700" }}
            >
              {currentSegment}
            </span>,
          );
        } else {
          parts.push(
            <span key={`text-${segmentKey++}`}>{currentSegment}</span>,
          );
        }
        currentSegment = "";
      }
      isHighlighted = highlightMap[i];
    }
    currentSegment += text[i];
  }

  if (currentSegment) {
    if (isHighlighted) {
      parts.push(
        <span
          key={`highlight-${segmentKey++}`}
          className={`px-1.5 py-0.5 rounded mx-0.5 ${
            isDarkMode ? "text-teal-300" : "text-teal-600"
          }`}
          style={{ fontWeight: "700" }}
        >
          {currentSegment}
        </span>,
      );
    } else {
      parts.push(<span key={`text-${segmentKey++}`}>{currentSegment}</span>);
    }
  }

  return <>{parts}</>;
};
