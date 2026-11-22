// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  getLocaleFromPathname,
  localizePath,
  resolveLocale,
  stripLocaleFromPathname,
  swapLocaleInPathname,
  translate,
} from "@/lib/i18n";

describe("resolveLocale", () => {
  it("prefers the saved cookie", () => {
    expect(
      resolveLocale({
        cookieLocale: "ar",
        acceptLanguage: "en-US,en;q=0.9",
      }),
    ).toBe("ar");
  });

  it("falls back to Accept-Language quality ordering", () => {
    expect(
      resolveLocale({
        acceptLanguage: "fr-FR,en;q=0.8,ar;q=0.6",
      }),
    ).toBe("en");

    expect(
      resolveLocale({
        acceptLanguage: "en;q=0.4,ar;q=0.9",
      }),
    ).toBe("ar");
  });

  it("falls back to Arabic when nothing matches", () => {
    expect(resolveLocale({ acceptLanguage: "de-DE,fr;q=0.5" })).toBe("ar");
    expect(resolveLocale({})).toBe("ar");
  });

  it("ignores invalid cookie values", () => {
    expect(resolveLocale({ cookieLocale: "fr", acceptLanguage: "en" })).toBe("en");
  });
});

describe("locale paths", () => {
  it("strips locale prefixes", () => {
    expect(stripLocaleFromPathname("/en/read-quran")).toBe("/read-quran");
    expect(stripLocaleFromPathname("/ar")).toBe("/");
    expect(stripLocaleFromPathname("/ar/")).toBe("/");
    expect(stripLocaleFromPathname("/read-quran")).toBe("/read-quran");
  });

  it("detects the locale in a pathname", () => {
    expect(getLocaleFromPathname("/en/read-quran")).toBe("en");
    expect(getLocaleFromPathname("/ar")).toBe("ar");
    expect(getLocaleFromPathname("/read-quran")).toBe("ar");
  });

  it("localizes internal paths and preserves query/hash", () => {
    expect(localizePath("en", "/")).toBe("/en");
    expect(localizePath("ar", "/read-quran")).toBe("/ar/read-quran");
    expect(localizePath("en", "/ar/read-quran")).toBe("/en/read-quran");
    expect(localizePath("ar", "/azkar?zekr=2#dua")).toBe("/ar/azkar?zekr=2#dua");
  });

  it("leaves external and non-path links untouched", () => {
    expect(localizePath("en", "https://example.com")).toBe("https://example.com");
    expect(localizePath("en", "mailto:test@example.com")).toBe("mailto:test@example.com");
    expect(localizePath("en", "#section")).toBe("#section");
  });

  it("swaps the locale of the current path", () => {
    expect(swapLocaleInPathname("/ar/read-quran/surah/1", "en")).toBe(
      "/en/read-quran/surah/1",
    );
    expect(swapLocaleInPathname("/ar", "en")).toBe("/en");
  });
});

describe("translate", () => {
  it("returns language-specific content", () => {
    expect(translate("en", "seo.readQuran.title")).toBe("Read Quran");
    expect(translate("ar", "seo.readQuran.title")).toBe("قراءة القرآن");
  });

  it("interpolates params", () => {
    expect(translate("en", "seo.surah.title", { name: "Al-Fatiha" })).toBe(
      "Surah Al-Fatiha",
    );
    expect(translate("ar", "seo.juz.title", { number: 1 })).toBe("الجزء ١");
  });

  it("localizes numeric params for Arabic", () => {
    expect(translate("ar", "readQuran.ayahWithNumber", { number: 12 })).toBe("الآية ١٢");
    expect(translate("en", "readQuran.ayahWithNumber", { number: 12 })).toBe("Ayah 12");
    expect(translate("ar", "searchAyah.showingPage", { current: 2, total: 9 })).toBe(
      "عرض صفحة ٢ من ٩",
    );
  });

  it("keeps string params unchanged (status codes)", () => {
    expect(translate("ar", "common.searchFailed", { status: "404" })).toContain("404");
  });
});
