"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
import { usePalette } from "@/context/general/PaletteContext";
import { useTheme } from "@/context/general/ThemeContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useGenerateAyahImage } from "@/hooks/generateAyahImage";
import ImagePaletteSelector from "./components/ImagePaletteSelector";
import AyahImagePreview from "./components/AyahImagePreview";
import AyahSelectorSection from "./components/AyahSelectorSection";
import { surahNames } from "@/constants/quranData";
import { toArabicNumber } from "@/utils/helpers";

export default function GenerateAyahImage() {
  const { language } = useLanguage();
  const { hue } = usePalette();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const previewRef = useRef<HTMLDivElement>(null);
  const exportPreviewRef = useRef<HTMLDivElement>(null);
  const headerReadyForExportRef = useRef(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [headerReadyForExport, setHeaderReadyForExport] = useState(false);

  useEffect(() => {
    headerReadyForExportRef.current = headerReadyForExport;
  }, [headerReadyForExport]);

  const {
    selectedSurah,
    selectedAyah,
    selectedBeforeAyahs,
    selectedAfterAyahs,
    currentLineCount,
    maxAyahImageLines,
    isSingleAyahSelection,
    showAyahNumberForSingle,
    specificPartEnabled,
    specificPartStartWordIndex,
    specificPartEndWordIndex,
    canIncreaseBefore,
    canIncreaseAfter,
    canDecreaseBefore,
    canDecreaseAfter,
    surahQuery,
    ayahQuery,
    showSurahDropdown,
    showAyahDropdown,
    paletteMode,
    paletteHue,
    imageTheme,
    isLoadingAyah,
    showPageNumber,
    ayahData,
    appliedAyahData,
    error,
    isApplyingAyahSelection,
    hasPendingAyahChanges,
    selectedSurahLabel,
    selectedAyahLabel,
    surahDropdownItems,
    ayahDropdownItems,
    selectSurah,
    selectAyah,
    selectPredefinedAyah,
    setSurahQuery,
    setAyahQuery,
    setShowSurahDropdown,
    setShowAyahDropdown,
    setImageTheme,
    selectPalettePreset,
    setShowPageNumber,
    setCustomPaletteHue,
    setFontReadyForExport,
    incrementBefore,
    decrementBefore,
    incrementAfter,
    decrementAfter,
    setShowAyahNumberForSingle,
    setSpecificPartEnabled,
    setSpecificPartStartWordIndex,
    setSpecificPartEndWordIndex,
    applyAyahSelection,
    canExport,
  } = useGenerateAyahImage(language, {
    customHue: hue,
    theme,
  });

  const handleExport = async () => {
    if (!exportPreviewRef.current || !canExport) return;

    setIsExporting(true);
    setExportError("");

    try {
      const computedStyle = window.getComputedStyle(exportPreviewRef.current);
      const backgroundColor = computedStyle.backgroundColor || "#ffffff";

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const waitStart = Date.now();
      while (
        !headerReadyForExportRef.current &&
        Date.now() - waitStart < 5500
      ) {
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }

      const dataUrl = await toPng(exportPreviewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor,
      });

      const link = document.createElement("a");
      const exportSurahNumber = appliedAyahData?.surahNumber ?? selectedSurah;
      const exportAyahNumber = appliedAyahData?.ayahNumber ?? selectedAyah;
      const filenameSurah = `${language === "ar" ? "سورة " + surahNames[exportSurahNumber - 1]?.ar : "Surah " + surahNames[exportSurahNumber - 1]?.en}`;
      const filenameAyah =
        language === "ar"
          ? "آية " + toArabicNumber(exportAyahNumber)
          : "Ayah " + exportAyahNumber;
      link.download = `${filenameSurah} - ${filenameAyah}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setExportError(
        err instanceof Error
          ? err.message
          : t("generateAyahImage.exportFailed"),
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="mb-8 w-full">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3 w-full">
            {t("generateAyahImage.title")}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-start">
          <aside className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4 sm:p-5 space-y-4 xl:sticky xl:top-24 order-last xl:order-first">
            <AyahSelectorSection
              language={language}
              title={t("generateAyahImage.ayahSectionTitle")}
              presetsTitle={t("generateAyahImage.ayahPredefinedTitle")}
              manualTitle={t("generateAyahImage.ayahManualTitle")}
              separatorLabel={t("generateAyahImage.ayahOr")}
              surahLabel={t("generateAyahImage.surahLabel")}
              ayahLabel={t("generateAyahImage.ayahLabel")}
              surahSearchPlaceholder={t(
                "generateAyahImage.surahSearchPlaceholder",
              )}
              ayahSearchPlaceholder={t(
                "generateAyahImage.ayahSearchPlaceholder",
              )}
              noSurahFound={t("generateAyahImage.noSurahFound")}
              noAyahFound={t("generateAyahImage.noAyahFound")}
              ayahLoadingLabel={t("generateAyahImage.ayahSnippetLoading")}
              selectedSurah={selectedSurah}
              selectedAyah={selectedAyah}
              beforeLabel={t("generateAyahImage.beforeAyahs")}
              afterLabel={t("generateAyahImage.afterAyahs")}
              lineLimitLabel={t("generateAyahImage.lineLimit")}
              showAyahNumberLabel={t("generateAyahImage.showAyahNumber")}
              specificPartLabel={t("generateAyahImage.specificPart")}
              submitLabel={t("generateAyahImage.submitAyahSelection")}
              submittingLabel={t("generateAyahImage.applyingAyahSelection")}
              selectedBeforeAyahs={selectedBeforeAyahs}
              selectedAfterAyahs={selectedAfterAyahs}
              currentLineCount={currentLineCount}
              maxLines={maxAyahImageLines}
              showAyahNumberToggle={isSingleAyahSelection}
              showAyahNumber={showAyahNumberForSingle}
              specificPartEnabled={specificPartEnabled}
              canIncreaseBefore={canIncreaseBefore}
              canIncreaseAfter={canIncreaseAfter}
              canDecreaseBefore={canDecreaseBefore}
              canDecreaseAfter={canDecreaseAfter}
              isApplyingSelection={isApplyingAyahSelection}
              hasPendingChanges={hasPendingAyahChanges}
              onIncrementBefore={incrementBefore}
              onDecrementBefore={decrementBefore}
              onIncrementAfter={incrementAfter}
              onDecrementAfter={decrementAfter}
              onShowAyahNumberChange={setShowAyahNumberForSingle}
              onSpecificPartChange={setSpecificPartEnabled}
              onSubmit={applyAyahSelection}
              selectedSurahLabel={selectedSurahLabel}
              selectedAyahLabel={selectedAyahLabel}
              surahQuery={surahQuery}
              ayahQuery={ayahQuery}
              showSurahDropdown={showSurahDropdown}
              showAyahDropdown={showAyahDropdown}
              surahDropdownItems={surahDropdownItems}
              ayahDropdownItems={ayahDropdownItems}
              onSelectSurah={selectSurah}
              onSelectAyah={selectAyah}
              onSelectPresetAyah={selectPredefinedAyah}
              onSurahQueryChange={setSurahQuery}
              onAyahQueryChange={setAyahQuery}
              onShowSurahDropdownChange={setShowSurahDropdown}
              onShowAyahDropdownChange={setShowAyahDropdown}
            />

            <ImagePaletteSelector
              language={language}
              title={t("generateAyahImage.paletteTitle")}
              presetsTitle={t("generateAyahImage.palettePredefined")}
              customTitle={t("generateAyahImage.paletteCustom")}
              themeTitle={t("generateAyahImage.paletteThemeMode")}
              separatorLabel={t("generateAyahImage.paletteOr")}
              pageNumberTitle={t("generateAyahImage.pageNumberTitle")}
              showLabel={t("generateAyahImage.show")}
              hideLabel={t("generateAyahImage.hide")}
              lightLabel={t("generateAyahImage.lightTheme")}
              darkLabel={t("generateAyahImage.darkTheme")}
              selectedMode={paletteMode}
              selectedHue={paletteHue}
              imageTheme={imageTheme}
              showPageNumber={showPageNumber}
              onThemeChange={setImageTheme}
              onShowPageNumberChange={setShowPageNumber}
              onSelectPreset={selectPalettePreset}
              onCustomHueChange={setCustomPaletteHue}
            />
            <button
              type="button"
              onClick={handleExport}
              disabled={
                !canExport ||
                isExporting ||
                isLoadingAyah ||
                isApplyingAyahSelection ||
                hasPendingAyahChanges
              }
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold
                shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isExporting ? (
                t("generateAyahImage.exporting")
              ) : (
                <span className="inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faDownload} />
                  {t("generateAyahImage.downloadPng")}
                </span>
              )}
            </button>

            {(error || exportError) && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error || exportError}
              </div>
            )}
          </aside>

          <section className="space-y-4 order-first xl:order-last">
            <AyahImagePreview
              language={language}
              ayahData={ayahData}
              paletteMode={paletteMode}
              paletteHue={paletteHue}
              imageTheme={imageTheme}
              showPageNumber={showPageNumber}
              isLoading={isLoadingAyah}
              previewRef={previewRef}
              onFontReadyChange={() => {}}
              onHeaderReadyChange={() => {}}
              specificPartEnabled={specificPartEnabled}
              specificPartStartWordIndex={specificPartStartWordIndex}
              specificPartEndWordIndex={specificPartEndWordIndex}
              onSpecificPartStartWordIndexChange={setSpecificPartStartWordIndex}
              onSpecificPartEndWordIndexChange={setSpecificPartEndWordIndex}
            />
          </section>
        </div>

        <div
          className="pointer-events-none fixed -left-[99999px] top-0 w-[1080px]"
          aria-hidden
        >
          <AyahImagePreview
            language={language}
            ayahData={appliedAyahData}
            paletteMode={paletteMode}
            paletteHue={paletteHue}
            imageTheme={imageTheme}
            showPageNumber={showPageNumber}
            isLoading={isLoadingAyah}
            previewRef={exportPreviewRef}
            onFontReadyChange={setFontReadyForExport}
            onHeaderReadyChange={setHeaderReadyForExport}
            renderMode="export"
          />
        </div>
      </div>
    </div>
  );
}
