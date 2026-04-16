import type { QuranVerse } from "@/hooks/readQuran";

export interface DropdownItem {
  value: number;
  label: string;
  meta?: string;
}

export interface AyahImageData {
  surahNumber: number;
  ayahNumber: number;
  pageNumber: number;
  lineNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  targetVerse: QuranVerse;
}
