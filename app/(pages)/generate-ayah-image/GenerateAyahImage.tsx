"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/general/LanguageContext";
import { usePalette } from "@/context/general/PaletteContext";
import { useTheme } from "@/context/general/ThemeContext";
import { useTranslation } from "@/hooks/general/useTranslation";
import { useGenerateAyahImage } from "@/hooks/generateAyahImage";
import SearchableDropdown from "./components/SearchableDropdown";
import ImagePaletteSelector from "./components/ImagePaletteSelector";
import AyahImagePreview from "./components/AyahImagePreview";
import { surahNames } from "@/constants/quranData";
import { toArabicNumber } from "@/utils/helpers";

export default function GenerateAyahImage() {
  const { language } = useLanguage();
  const { hue } = usePalette();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const previewRef = useRef<HTMLDivElement>(null);
  const exportPreviewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const {
    selectedSurah,
    selectedAyah,
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
    error,
    selectedSurahLabel,
    selectedAyahLabel,
    surahDropdownItems,
    ayahDropdownItems,
    selectSurah,
    selectAyah,
    setSurahQuery,
    setAyahQuery,
    setShowSurahDropdown,
    setShowAyahDropdown,
    setImageTheme,
    selectPalettePreset,
    setShowPageNumber,
    setCustomPaletteHue,
    setFontReadyForExport,
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

      const dataUrl = await toPng(exportPreviewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor,
      });

      const link = document.createElement("a");
      const filenameSurah = `${language === "ar" ? "سورة " + surahNames[selectedSurah - 1]?.ar : "Surah " + surahNames[selectedSurah - 1]?.en}`;
      const filenameAyah = language === "ar" ? "آية " + toArabicNumber(selectedAyah) : "Ayah " + selectedAyah;
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
          <aside className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4 sm:p-5 space-y-4 xl:sticky xl:top-24">
            <SearchableDropdown
              language={language}
              label={t("generateAyahImage.surahLabel")}
              searchPlaceholder={t("generateAyahImage.surahSearchPlaceholder")}
              selectedLabel={selectedSurahLabel}
              searchValue={surahQuery}
              onSearchChange={setSurahQuery}
              isOpen={showSurahDropdown}
              setIsOpen={(value) => {
                setShowSurahDropdown(value);
                if (value) setShowAyahDropdown(false);
              }}
              items={surahDropdownItems}
              onSelect={selectSurah}
              emptyLabel={t("generateAyahImage.noSurahFound")}
            />

            <SearchableDropdown
              language={language}
              label={t("generateAyahImage.ayahLabel")}
              searchPlaceholder={t("generateAyahImage.ayahSearchPlaceholder")}
              selectedLabel={selectedAyahLabel}
              searchValue={ayahQuery}
              onSearchChange={setAyahQuery}
              isOpen={showAyahDropdown}
              setIsOpen={(value) => {
                setShowAyahDropdown(value);
                if (value) setShowSurahDropdown(false);
              }}
              items={ayahDropdownItems}
              onSelect={selectAyah}
              emptyLabel={t("generateAyahImage.noAyahFound")}
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
              disabled={!canExport || isExporting || isLoadingAyah}
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

          <section className="space-y-4">
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
            />
          </section>
        </div>

        <div
          className="pointer-events-none fixed -left-[99999px] top-0 w-[1080px]"
          aria-hidden
        >
          <AyahImagePreview
            language={language}
            ayahData={ayahData}
            paletteMode={paletteMode}
            paletteHue={paletteHue}
            imageTheme={imageTheme}
            showPageNumber={showPageNumber}
            isLoading={isLoadingAyah}
            previewRef={exportPreviewRef}
            onFontReadyChange={setFontReadyForExport}
            renderMode="export"
          />
        </div>
      </div>
    </div>
  );
}
