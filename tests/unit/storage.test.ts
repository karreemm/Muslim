import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEYS,
  hasStorage,
  readJSON,
  readNumber,
  readString,
  removeStorage,
  writeJSON,
  writeNumber,
  writeString,
} from "@/lib/storage";

beforeEach(() => {
  window.localStorage.clear();
});

describe("string storage", () => {
  it("round-trips strings", () => {
    writeString(STORAGE_KEYS.theme, "dark");
    expect(readString(STORAGE_KEYS.theme)).toBe("dark");
    expect(hasStorage(STORAGE_KEYS.theme)).toBe(true);
  });

  it("returns the fallback when missing", () => {
    expect(readString(STORAGE_KEYS.theme, "light")).toBe("light");
    expect(hasStorage(STORAGE_KEYS.theme)).toBe(false);
  });
});

describe("number storage", () => {
  it("round-trips numbers", () => {
    writeNumber(STORAGE_KEYS.paletteHue, 210);
    expect(readNumber(STORAGE_KEYS.paletteHue, 38)).toBe(210);
  });

  it("falls back for invalid values", () => {
    writeString(STORAGE_KEYS.paletteHue, "not-a-number");
    expect(readNumber(STORAGE_KEYS.paletteHue, 38)).toBe(38);
  });
});

describe("JSON storage", () => {
  it("round-trips JSON", () => {
    const value = [{ id: 1, name: "Ayah" }];
    writeJSON(STORAGE_KEYS.savedAyahs, value);
    expect(readJSON(STORAGE_KEYS.savedAyahs, [])).toEqual(value);
  });

  it("falls back for malformed JSON", () => {
    window.localStorage.setItem(STORAGE_KEYS.savedAyahs, "{not-json");
    expect(readJSON(STORAGE_KEYS.savedAyahs, [])).toEqual([]);
  });

  it("honors a validator", () => {
    window.localStorage.setItem(STORAGE_KEYS.savedAyahs, JSON.stringify(["x"]));
    const result = readJSON<string[]>(
      STORAGE_KEYS.savedAyahs,
      [],
      (value): value is string[] =>
        Array.isArray(value) && value.every((item) => typeof item === "number"),
    );

    expect(result).toEqual([]);
  });
});

describe("removeStorage", () => {
  it("removes a key", () => {
    writeString(STORAGE_KEYS.language, "en");
    removeStorage(STORAGE_KEYS.language);
    expect(readString(STORAGE_KEYS.language)).toBe("");
  });
});
