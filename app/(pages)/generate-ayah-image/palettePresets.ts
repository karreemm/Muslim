export type AyahImagePaletteMode = "custom" | FixedAyahPaletteId;

export type FixedAyahPaletteId =
  | "traditionalGreen"
  | "desertEarth"
  | "celestialBlue"
  | "nightModeReader"
  | "softContemplation"
  | "parchmentInk"
  | "marrakechTile"
  | "persianLapis"
  | "ivoryMosque"
  | "anatolianCeramic"
  | "alhambra";

export interface FixedAyahPalette {
  id: FixedAyahPaletteId;
  label: string;
  labelAr: string;
  backgroundHex: string;
  decorationHex: string;
}

export const FIXED_AYAH_PALETTES: FixedAyahPalette[] = [
  {
    id: "traditionalGreen",
    label: "Traditional Green",
    labelAr: "الأخضر التقليدي",
    backgroundHex: "#F7FFF0",
    decorationHex: "#0A5C00",
  },
  {
    id: "desertEarth",
    label: "Desert Earth",
    labelAr: "أرض الصحراء",
    backgroundHex: "#FDF6E0",
    decorationHex: "#7A2E0E",
  },
  {
    id: "celestialBlue",
    label: "Celestial Blue",
    labelAr: "الأزرق السماوي",
    backgroundHex: "#F2F8FF",
    decorationHex: "#003370",
  },
  {
    id: "nightModeReader",
    label: "Night Mode Reader",
    labelAr: "وضع القراءة الليلي",
    backgroundHex: "#02111F",
    decorationHex: "#D4A847",
  },
  {
    id: "softContemplation",
    label: "Soft Contemplation",
    labelAr: "تأمل هادئ",
    backgroundHex: "#FEFAF0",
    decorationHex: "#7A4F1A",
  },

  {
    id: "parchmentInk",
    label: "Parchment & Ink",
    labelAr: "الرق والحبر",
    backgroundHex: "#F5EDDA",
    decorationHex: "#1C1208",
  },
  {
    id: "marrakechTile",
    label: "Marrakech Tile",
    labelAr: "بلاط مراكش",
    backgroundHex: "#0D2B25",
    decorationHex: "#E8C96A",
  },
  {
    id: "persianLapis",
    label: "Persian Lapis",
    labelAr: "اللازورد الفارسي",
    backgroundHex: "#0B0F3B",
    decorationHex: "#F0C060",
  },
  {
    id: "ivoryMosque",
    label: "Ivory Mosque",
    labelAr: "المسجد العاجي",
    backgroundHex: "#FAFAF5",
    decorationHex: "#2A1A0A",
  },
  {
    id: "anatolianCeramic",
    label: "Anatolian Ceramic",
    labelAr: "الخزف الأناضولي",
    backgroundHex: "#EEF6F4",
    decorationHex: "#0F4A3C",
  },
  {
    id: "alhambra",
    label: "Alhambra",
    labelAr: "الحمراء",
    backgroundHex: "#1A0A00",
    decorationHex: "#C8955A",
  },
];

export const DEFAULT_CUSTOM_HUE = 174;

export function hexToHslTriplet(hex: string): string {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return `${hue} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}
