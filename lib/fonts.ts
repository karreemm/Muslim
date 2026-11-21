import { Amiri_Quran, Kufam } from "next/font/google";

export const kufam = Kufam({
  subsets: ["arabic", "latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-kufam",
  preload: true,
  adjustFontFallback: true,
});

export const amiriQuran = Amiri_Quran({
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
  variable: "--font-amiri-quran",
  preload: false,
  adjustFontFallback: true,
});
