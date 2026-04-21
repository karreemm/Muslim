"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { surahNames } from "@/constants/quranData";
import type { QuranVerse } from "@/hooks/readQuran";
import GetSurah from "@/app/(pages)/read-quran/service/GetSurah";
import SearchableDropdown from "./SearchableDropdown";
import { PREDEFINED_AYAHS } from "../predefinedAyahs";
import type { DropdownItem } from "../types";

interface AyahSelectorSectionProps {
  language: string;
  title: string;
  presetsTitle: string;
  manualTitle: string;
  separatorLabel: string;
  surahLabel: string;
  ayahLabel: string;
  surahSearchPlaceholder: string;
  ayahSearchPlaceholder: string;
  noSurahFound: string;
  noAyahFound: string;
  ayahLoadingLabel: string;
  selectedSurah: number;
  selectedAyah: number;
  selectedSurahLabel: string;
  selectedAyahLabel: string;
  surahQuery: string;
  ayahQuery: string;
  showSurahDropdown: boolean;
  showAyahDropdown: boolean;
  surahDropdownItems: DropdownItem[];
  ayahDropdownItems: DropdownItem[];
  onSelectSurah: (surah: number) => void;
  onSelectAyah: (ayah: number) => void;
  onSelectPresetAyah: (surah: number, ayah: number) => void;
  onSurahQueryChange: (value: string) => void;
  onAyahQueryChange: (value: string) => void;
  onShowSurahDropdownChange: (value: boolean) => void;
  onShowAyahDropdownChange: (value: boolean) => void;
}

const verseSnippetCache: Record<string, string> = {};
const surahVersesCache: Record<number, QuranVerse[]> = {};

function itemKey(surahNumber: number, ayahNumber: number) {
  return `${surahNumber}:${ayahNumber}`;
}

function normalizeAyahText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function toAyahSnippet(verse: QuranVerse | undefined) {
  if (!verse) return "";

  const words = verse.words.filter((word) => word.char_type_name !== "end");
  return normalizeAyahText(words.map((word) => word.text_uthmani).join(" "));
}

export default function AyahSelectorSection({
  language,
  title,
  presetsTitle,
  manualTitle,
  separatorLabel,
  surahLabel,
  ayahLabel,
  surahSearchPlaceholder,
  ayahSearchPlaceholder,
  noSurahFound,
  noAyahFound,
  ayahLoadingLabel,
  selectedSurah,
  selectedAyah,
  selectedSurahLabel,
  selectedAyahLabel,
  surahQuery,
  ayahQuery,
  showSurahDropdown,
  showAyahDropdown,
  surahDropdownItems,
  ayahDropdownItems,
  onSelectSurah,
  onSelectAyah,
  onSelectPresetAyah,
  onSurahQueryChange,
  onAyahQueryChange,
  onShowSurahDropdownChange,
  onShowAyahDropdownChange,
}: AyahSelectorSectionProps) {
  const isArabic = language === "ar";

  const defaultCollapsed =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches;

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [snippets, setSnippets] = useState<Record<string, string>>({});
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSnippets() {
      setIsLoadingSnippets(true);

      const uniqueSurahs = Array.from(
        new Set(PREDEFINED_AYAHS.map((item) => item.surahNumber)),
      );

      const missingSurahs = uniqueSurahs.filter(
        (surahNumber) => !surahVersesCache[surahNumber],
      );

      if (missingSurahs.length > 0) {
        const loaded = await Promise.all(
          missingSurahs.map(async (surahNumber) => {
            const verses = (await GetSurah(
              String(surahNumber),
            )) as QuranVerse[];
            return { surahNumber, verses };
          }),
        );

        loaded.forEach(({ surahNumber, verses }) => {
          surahVersesCache[surahNumber] = verses;
        });
      }

      PREDEFINED_AYAHS.forEach(({ surahNumber, ayahNumber }) => {
        const key = itemKey(surahNumber, ayahNumber);
        if (verseSnippetCache[key]) return;

        const verses = surahVersesCache[surahNumber] ?? [];
        const verse = verses.find((entry) => {
          const [, ayahPart] = entry.verse_key.split(":");
          return Number(ayahPart) === ayahNumber;
        });

        verseSnippetCache[key] = toAyahSnippet(verse);
      });

      if (!active) return;

      const nextSnippets: Record<string, string> = {};
      PREDEFINED_AYAHS.forEach(({ surahNumber, ayahNumber }) => {
        const key = itemKey(surahNumber, ayahNumber);
        nextSnippets[key] = verseSnippetCache[key] || "";
      });

      setSnippets(nextSnippets);
      setIsLoadingSnippets(false);
    }

    loadSnippets().catch(() => {
      if (!active) return;
      setIsLoadingSnippets(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(() => {
    return PREDEFINED_AYAHS.sort((a, b) => a.surahNumber - b.surahNumber || a.ayahNumber - b.ayahNumber).map(({ surahNumber, ayahNumber }) => {
      const surah = surahNames.find((item) => item.number === surahNumber);
      const key = itemKey(surahNumber, ayahNumber);

      return {
        key,
        surahNumber,
        ayahNumber,
        isActive: selectedSurah === surahNumber && selectedAyah === ayahNumber,
        surahName: isArabic
          ? surah?.ar || `سورة ${surahNumber}`
          : surah?.en || `Surah ${surahNumber}`,
        ayahLabel: isArabic ? `الآية ${ayahNumber}` : `Ayah ${ayahNumber}`,
        snippet: snippets[key] || "",
      };
    });
  }, [isArabic, selectedAyah, selectedSurah, snippets]);

  return (
    <div className="bg-card/70 rounded-2xl border border-border/50 p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="w-full flex items-center justify-between text-base font-bold text-foreground mb-3"
        aria-expanded={!isCollapsed}
      >
        <span>{title}</span>
        <FontAwesomeIcon
          icon={isCollapsed ? faChevronDown : faChevronUp}
          className="text-xs text-muted-foreground"
        />
      </button>

      {!isCollapsed && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">{presetsTitle}</p>

            <div className={`max-h-64 overflow-y-auto scrollbar-hover-hidden ${language === "ar" ? "pl-2" : "pr-2"} space-y-2`}>
              {cards.map((card) => (
                <button
                  key={card.key}
                  type="button"
                  onClick={() =>
                    onSelectPresetAyah(card.surahNumber, card.ayahNumber)
                  }
                  className={`w-full rounded-xl border p-3 text-start transition-all duration-200 ${
                    card.isActive
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/40 bg-background/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {card.surahName}
                    </p>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {card.ayahLabel}
                    </p>
                  </div>

                  <p
                    className="text-xs text-muted-foreground mt-1 truncate"
                    dir="rtl"
                    title={card.snippet}
                  >
                    {isLoadingSnippets
                      ? ayahLoadingLabel
                      : card.snippet || ayahLoadingLabel}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.35em] text-muted-foreground mt-6 mb-2">
            <div className="h-px flex-1 bg-border/60" />
            <span>{separatorLabel}</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">{manualTitle}</p>

            <div className="space-y-3">
              <SearchableDropdown
                language={language}
                label={surahLabel}
                searchPlaceholder={surahSearchPlaceholder}
                selectedLabel={selectedSurahLabel}
                searchValue={surahQuery}
                onSearchChange={onSurahQueryChange}
                isOpen={showSurahDropdown}
                setIsOpen={(value) => {
                  onShowSurahDropdownChange(value);
                  if (value) onShowAyahDropdownChange(false);
                }}
                items={surahDropdownItems}
                onSelect={onSelectSurah}
                emptyLabel={noSurahFound}
              />

              <SearchableDropdown
                language={language}
                label={ayahLabel}
                searchPlaceholder={ayahSearchPlaceholder}
                selectedLabel={selectedAyahLabel}
                searchValue={ayahQuery}
                onSearchChange={onAyahQueryChange}
                isOpen={showAyahDropdown}
                setIsOpen={(value) => {
                  onShowAyahDropdownChange(value);
                  if (value) onShowSurahDropdownChange(false);
                }}
                items={ayahDropdownItems}
                onSelect={onSelectAyah}
                emptyLabel={noAyahFound}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
