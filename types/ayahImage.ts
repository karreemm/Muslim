import type { QuranVerse } from "@/hooks/readQuran";

export interface DropdownItem {
  value: number;
  label: string;
  meta?: string;
}

export interface AyahImageData {
  surahNumber: number;
  ayahNumber: number;
  rangeStartAyah: number;
  rangeEndAyah: number;
  pageNumber: number;
  lineNumber: number;
  lineCount: number;
  surahNameAr: string;
  surahNameEn: string;
  targetVerse: QuranVerse;
  targetVerses: QuranVerse[];
  displayVerses: QuranVerse[];
  isSingleAyahSelection: boolean;
  showAyahNumber: boolean;
  specificPartEnabled: boolean;
  specificPartStartWordIndex: number | null;
  specificPartEndWordIndex: number | null;
  totalSelectableWords: number;
}
