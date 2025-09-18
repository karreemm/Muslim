"use client";

import { useState } from "react";

interface DisplaySettings {
  fontSize: number;
  lineHeight: number;
}

export const useQuranDisplay = (
  initialFontSize: number = 18,
  initialLineHeight: number = 2.5
) => {
  const [fontSize, setFontSize] = useState<number>(initialFontSize);
  const [lineHeight, setLineHeight] = useState<number>(initialLineHeight);

  const handleFontSizeChange = (increase: boolean) => {
    setFontSize((prevSize) => (increase ? prevSize + 2 : prevSize - 2));
    setLineHeight((prevLineHeight) =>
      increase ? prevLineHeight + 0.2 : prevLineHeight - 0.2
    );
  };

  const increaseFontSize = () => handleFontSizeChange(true);
  const decreaseFontSize = () => handleFontSizeChange(false);

  const resetToDefault = () => {
    setFontSize(initialFontSize);
    setLineHeight(initialLineHeight);
  };

  const setCustomSettings = (settings: Partial<DisplaySettings>) => {
    if (settings.fontSize !== undefined) {
      setFontSize(settings.fontSize);
    }
    if (settings.lineHeight !== undefined) {
      setLineHeight(settings.lineHeight);
    }
  };

  return {
    fontSize,
    lineHeight,
    handleFontSizeChange,
    increaseFontSize,
    decreaseFontSize,
    resetToDefault,
    setCustomSettings,
    displaySettings: {
      fontSize,
      lineHeight,
    },
  };
};
