// @vitest-environment node

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type JsonObject = Record<string, unknown>;

function flatten(value: JsonObject, prefix = ""): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (child && typeof child === "object" && !Array.isArray(child)) {
      return flatten(child as JsonObject, nextKey);
    }

    return [nextKey];
  });
}

function readLocale(language: "en" | "ar", file: string): JsonObject {
  const fullPath = path.join(process.cwd(), "locales", language, file);
  return JSON.parse(fs.readFileSync(fullPath, "utf8")) as JsonObject;
}

describe("locale parity", () => {
  const englishDir = path.join(process.cwd(), "locales", "en");
  const files = fs.readdirSync(englishDir).filter((file) => file.endsWith(".json"));

  for (const file of files) {
    it(`${file} has the same keys in English and Arabic`, () => {
      const enKeys = flatten(readLocale("en", file));
      const arKeys = flatten(readLocale("ar", file));

      expect(enKeys.filter((key) => !arKeys.includes(key))).toEqual([]);
      expect(arKeys.filter((key) => !enKeys.includes(key))).toEqual([]);
    });
  }
});
