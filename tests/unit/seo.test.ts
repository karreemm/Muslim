// @vitest-environment node

import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import manifest from "@/app/manifest";
import { SITE_URL, createMetadata, localizedUrl } from "@/lib/seo";

describe("createMetadata", () => {
  it("creates English canonical, social, and hreflang metadata", () => {
    const metadata = createMetadata({
      locale: "en",
      title: "Read Quran",
      description: "Read the Quran",
      path: "/read-quran",
    });

    expect(metadata.title).toEqual({ absolute: "Read Quran | Muslim" });
    expect(metadata.description).toBe("Read the Quran");
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/en/read-quran`);
    expect(metadata.alternates?.languages).toEqual({
      ar: `${SITE_URL}/ar/read-quran`,
      en: `${SITE_URL}/en/read-quran`,
    });
    expect(metadata.openGraph?.title).toBe("Read Quran | Muslim");
    expect(metadata.openGraph?.locale).toBe("en_US");
    expect(metadata.twitter).toBeDefined();
  });

  it("creates Arabic canonical and social metadata", () => {
    const metadata = createMetadata({
      locale: "ar",
      title: "قراءة القرآن",
      description: "اقرأ القرآن الكريم",
      path: "/read-quran",
    });

    expect(metadata.title).toEqual({ absolute: "قراءة القرآن | مسلم" });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ar/read-quran`);
    expect(metadata.openGraph?.title).toBe("قراءة القرآن | مسلم");
    expect(metadata.openGraph?.locale).toBe("ar_AR");
  });

  it("marks private pages as noindex", () => {
    const metadata = createMetadata({
      locale: "en",
      title: "Saved Ayahs",
      path: "/saved-ayahs",
      noIndex: true,
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("only adds app-level defaults to the root metadata", () => {
    const root = createMetadata({ locale: "en", root: true });
    const child = createMetadata({ locale: "en", title: "Read Quran" });

    expect(root.title).toEqual({
      default: "Muslim — Quran, Hadith, Azkar & Prayer Times",
      template: "%s | Muslim",
    });
    expect(root.metadataBase?.toString()).toBe(`${SITE_URL}/`);
    expect(root.icons).toMatchObject({
      apple: expect.arrayContaining([
        expect.objectContaining({ url: "/icons/apple-touch-icon.png" }),
      ]),
    });
    expect(child.metadataBase).toBeUndefined();
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it("contains all core routes in both locales", () => {
    for (const locale of ["ar", "en"]) {
      for (const route of [
        "/",
        "/read-quran",
        "/read-hadith",
        "/listen-quran",
        "/radios",
        "/azkar",
        "/prayer-times",
        "/search-ayah",
      ]) {
        expect(urls).toContain(localizedUrl(locale as "ar" | "en", route));
      }
    }
  });

  it("contains dynamic content routes in both locales", () => {
    for (const locale of ["ar", "en"] as const) {
      expect(urls).toContain(localizedUrl(locale, "/read-quran/surah/1"));
      expect(urls).toContain(localizedUrl(locale, "/read-quran/surah/114"));
      expect(urls).toContain(localizedUrl(locale, "/read-quran/juz/1"));
      expect(urls).toContain(localizedUrl(locale, "/read-quran/juz/30"));
      expect(urls).toContain(localizedUrl(locale, "/read-hadith/book/sahih-bukhari"));
      expect(urls).toContain(localizedUrl(locale, "/listen-quran/reciter/ar.alafasy"));
      expect(urls).toContain(localizedUrl(locale, "/azkar/category/morning_azkar"));
    }
  });

  it("declares hreflang alternates for every entry", () => {
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual(
        expect.objectContaining({
          ar: expect.stringContaining("/ar"),
          en: expect.stringContaining("/en"),
        }),
      );
    }
  });

  it("does not expose private pages", () => {
    for (const locale of ["ar", "en"]) {
      expect(urls).not.toContain(localizedUrl(locale as "ar" | "en", "/saved-ayahs"));
      expect(urls).not.toContain(localizedUrl(locale as "ar" | "en", "/favourites"));
      expect(urls).not.toContain(localizedUrl(locale as "ar" | "en", "/sadaqat"));
    }
  });
});

describe("robots", () => {
  it("points to the sitemap and blocks private/API routes in every locale", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(rules[0].disallow).toEqual(
      expect.arrayContaining(["/api/", "/*/sadaqat", "/*/saved-ayahs", "/*/favourites"]),
    );
  });
});

describe("manifest", () => {
  it("describes an installable app", () => {
    const result = manifest();

    expect(result.name).toContain("Muslim");
    expect(result.short_name).toBe("Muslim");
    expect(result.start_url).toBe("/");
    expect(result.display).toBe("standalone");
    expect(result.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: "192x192" }),
        expect.objectContaining({ sizes: "512x512", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
      ]),
    );
  });
});
