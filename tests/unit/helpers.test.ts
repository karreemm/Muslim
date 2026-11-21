import { describe, expect, it } from "vitest";
import {
  removeDiacritics,
  slugify,
  toArabicNumber,
  toEnglishNumber,
} from "@/utils/helpers";

describe("toArabicNumber", () => {
  it("converts Western digits to Arabic-Indic digits", () => {
    expect(toArabicNumber(123)).toBe("١٢٣");
    expect(toArabicNumber(0)).toBe("٠");
    expect(toArabicNumber(2026)).toBe("٢٠٢٦");
  });

  it("returns an empty string for undefined", () => {
    expect(toArabicNumber(undefined)).toBe("");
  });
});

describe("toEnglishNumber", () => {
  it("converts Arabic-Indic digits to Western digits", () => {
    expect(toEnglishNumber("١٢٣")).toBe("123");
    expect(toEnglishNumber("٠٩")).toBe("09");
  });

  it("converts Persian digits to Western digits", () => {
    expect(toEnglishNumber("۱۲۳")).toBe("123");
  });

  it("leaves Western digits untouched", () => {
    expect(toEnglishNumber("Surah 12")).toBe("Surah 12");
  });
});

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("trims leading and trailing separators", () => {
    expect(slugify("  --Sadaqa Jariyah--  ")).toBe("sadaqa-jariyah");
  });

  it("removes non-ASCII characters", () => {
    expect(slugify("أحمد Ahmed")).toBe("ahmed");
  });
});

describe("removeDiacritics", () => {
  it("removes Arabic diacritics", () => {
    expect(removeDiacritics("بِسْمِ اللَّهِ")).toBe("بسم الله");
    expect(removeDiacritics("مُحَمَّد")).toBe("محمد");
  });

  it("normalizes alef variants", () => {
    expect(removeDiacritics("آأإٱ")).toBe("اااا");
  });

  it("collapses repeated whitespace", () => {
    expect(removeDiacritics("a   b\n\tc")).toBe("a b c");
  });
});
