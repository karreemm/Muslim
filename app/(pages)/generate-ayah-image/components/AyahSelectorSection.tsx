"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faScissors,
} from "@fortawesome/free-solid-svg-icons";
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
  beforeLabel: string;
  afterLabel: string;
  lineLimitLabel: string;
  showAyahNumberLabel: string;
  specificPartLabel: string;
  submitLabel: string;
  submittingLabel: string;
  selectedBeforeAyahs: number;
  selectedAfterAyahs: number;
  currentLineCount: number;
  maxLines: number;
  showAyahNumberToggle: boolean;
  showAyahNumber: boolean;
  specificPartEnabled: boolean;
  canIncreaseBefore: boolean;
  canIncreaseAfter: boolean;
  canDecreaseBefore: boolean;
  canDecreaseAfter: boolean;
  isApplyingSelection: boolean;
  hasPendingChanges: boolean;
  onIncrementBefore: () => void;
  onDecrementBefore: () => void;
  onIncrementAfter: () => void;
  onDecrementAfter: () => void;
  onShowAyahNumberChange: (value: boolean) => void;
  onSpecificPartChange: (value: boolean) => void;
  onSubmit: () => void;
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
  beforeLabel,
  afterLabel,
  lineLimitLabel,
  showAyahNumberLabel,
  specificPartLabel,
  submitLabel,
  submittingLabel,
  selectedBeforeAyahs,
  selectedAfterAyahs,
  currentLineCount,
  maxLines,
  showAyahNumberToggle,
  showAyahNumber,
  specificPartEnabled,
  canIncreaseBefore,
  canIncreaseAfter,
  canDecreaseBefore,
  canDecreaseAfter,
  isApplyingSelection,
  hasPendingChanges,
  onIncrementBefore,
  onDecrementBefore,
  onIncrementAfter,
  onDecrementAfter,
  onShowAyahNumberChange,
  onSpecificPartChange,
  onSubmit,
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
    return [...PREDEFINED_AYAHS]
      .sort(
        (a, b) => a.surahNumber - b.surahNumber || a.ayahNumber - b.ayahNumber,
      )
      .map(({ surahNumber, ayahNumber }) => {
        const surah = surahNames.find((item) => item.number === surahNumber);
        const key = itemKey(surahNumber, ayahNumber);

        return {
          key,
          surahNumber,
          ayahNumber,
          isActive:
            selectedSurah === surahNumber && selectedAyah === ayahNumber,
          surahName: isArabic
            ? surah?.ar || `سورة ${surahNumber}`
            : surah?.en || `Surah ${surahNumber}`,
          ayahLabel: isArabic ? `الآية ${ayahNumber}` : `Ayah ${ayahNumber}`,
          snippet: snippets[key] || "",
        };
      });
  }, [isArabic, selectedAyah, selectedSurah, snippets]);

  return (
    <div className={`bg-card/70 rounded-2xl border border-border/50 ${isCollapsed ? "px-4 sm:px-5 py-2" : "p-4 sm:p-5"}`}>
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className={`w-full flex items-center justify-between text-base font-bold text-foreground ${isCollapsed ? "mb-0" : "mb-3"}`}
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

            <div
              className={`max-h-64 overflow-y-auto scrollbar-hover-hidden ${isArabic ? "pl-2" : "pr-2"} space-y-2`}
            >
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

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border/50 bg-background/40 p-2">
                  <p className="text-[11px] text-muted-foreground mb-2">
                    {beforeLabel}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={onDecrementBefore}
                      disabled={!canDecreaseBefore || isApplyingSelection}
                      className="h-8 w-8 rounded-lg border border-border/60 text-sm disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold tabular-nums">
                      {selectedBeforeAyahs}
                    </span>
                    <button
                      type="button"
                      onClick={onIncrementBefore}
                      disabled={!canIncreaseBefore || isApplyingSelection}
                      className="h-8 w-8 rounded-lg border border-border/60 text-sm disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-background/40 p-2">
                  <p className="text-[11px] text-muted-foreground mb-2">
                    {afterLabel}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={onDecrementAfter}
                      disabled={!canDecreaseAfter || isApplyingSelection}
                      className="h-8 w-8 rounded-lg border border-border/60 text-sm disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold tabular-nums">
                      {selectedAfterAyahs}
                    </span>
                    <button
                      type="button"
                      onClick={onIncrementAfter}
                      disabled={!canIncreaseAfter || isApplyingSelection}
                      className="h-8 w-8 rounded-lg border border-border/60 text-sm disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {lineLimitLabel}:{" "}
                <span className="font-semibold tabular-nums">
                  <span className={`${currentLineCount > 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {currentLineCount}
                  </span>
                  / 
                  <span className="text-muted-foreground">
                    {maxLines}
                  </span>
                </span>
              </p>

              {showAyahNumberToggle && (
                <label className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-2">
                  <span className="text-xs text-foreground">
                    {showAyahNumberLabel}
                  </span>
                  <input
                    type="checkbox"
                    checked={showAyahNumber}
                    onChange={(event) =>
                      onShowAyahNumberChange(event.target.checked)
                    }
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              )}

              <label className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-2">
                <span className="inline-flex items-center gap-2 text-xs text-foreground">
                  <FontAwesomeIcon icon={faScissors} className="text-[11px]" />
                  {specificPartLabel}
                </span>
                <input
                  type="checkbox"
                  checked={specificPartEnabled}
                  onChange={(event) =>
                    onSpecificPartChange(event.target.checked)
                  }
                  className="h-4 w-4 accent-primary"
                />
              </label>

              <button
                type="button"
                onClick={onSubmit}
                disabled={!hasPendingChanges || isApplyingSelection}
                className="w-full py-1 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplyingSelection ? submittingLabel : submitLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
