"use client";

import { useState, useEffect } from "react";
import { DEFAULT_BREAKPOINTS } from "@/constants/quranFontSize";

interface DisplaySettings {
  fontSize: number;
  lineHeight: number;
}

export const useQuranDisplay = () => {
  const getResponsiveSettings = (width: number): DisplaySettings => {
    const config = DEFAULT_BREAKPOINTS.find(
      (bp) => width >= bp.minWidth && (!bp.maxWidth || width <= bp.maxWidth)
    );
    
    return {
      fontSize: config?.baseFontSize || 32,
      lineHeight: config?.baseLineHeight || 1.8,
    };
  };

  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  
  const responsiveSettings = getResponsiveSettings(screenWidth);
  
  const [fontSize, setFontSize] = useState<number>(responsiveSettings.fontSize);
  const [lineHeight, setLineHeight] = useState<number>(responsiveSettings.lineHeight);
  const [manualAdjustment, setManualAdjustment] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const newSettings = getResponsiveSettings(screenWidth);
    setFontSize(newSettings.fontSize + manualAdjustment);
    setLineHeight(newSettings.lineHeight + (manualAdjustment * 0.02));
  }, [screenWidth, manualAdjustment]);

  const handleFontSizeChange = (increase: boolean) => {
    const adjustment = increase ? 2 : -2;
    setManualAdjustment((prev) => prev + adjustment);
    setFontSize((prevSize) => prevSize + adjustment);
    setLineHeight((prevLineHeight) => prevLineHeight + (increase ? 0.05 : -0.05));
  };

  const increaseFontSize = () => handleFontSizeChange(true);
  const decreaseFontSize = () => handleFontSizeChange(false);

  const resetToDefault = () => {
    setManualAdjustment(0);
    const settings = getResponsiveSettings(screenWidth);
    setFontSize(settings.fontSize);
    setLineHeight(settings.lineHeight);
  };

  const setCustomSettings = (settings: Partial<DisplaySettings>) => {
    if (settings.fontSize !== undefined) {
      const baseSettings = getResponsiveSettings(screenWidth);
      setManualAdjustment(settings.fontSize - baseSettings.fontSize);
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