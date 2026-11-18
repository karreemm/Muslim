// @vitest-environment node

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function flatten(value: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child)
      ? flatten(child as Record<string, unknown>, next)
      : [next];
  });
}

function loadLocale(language: "en" | "ar"): Set<string> {
  const directory = path.join(process.cwd(), "locales", language);
  const keys = new Set<string>();

  for (const file of fs.readdirSync(directory)) {
    if (!file.endsWith(".json")) continue;
    const namespace = file.replace(/\.json$/, "");
    const data = JSON.parse(
      fs.readFileSync(path.join(directory, file), "utf8"),
    ) as Record<string, unknown>;
    for (const key of flatten(data)) keys.add(`${namespace}.${key}`);
  }

  return keys;
}

const sourceFiles = [
  ...walk(path.join(process.cwd(), "app")),
  ...walk(path.join(process.cwd(), "components")),
  ...walk(path.join(process.cwd(), "hooks")),
].filter((file) => /\.(ts|tsx)$/.test(file));

const usedKeys = new Set<string>();

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  const patterns = [/\bt\(\s*"([^"]+)"/g, /translate\(\s*[^,]+,\s*"([^"]+)"/g];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(source))) {
      const key = match[1];
      if (key.includes(".")) usedKeys.add(key);
    }
  }
}

describe("translation keys", () => {
  const en = loadLocale("en");
  const ar = loadLocale("ar");

  it("every used key exists in English and Arabic", () => {
    const missing = [...usedKeys].flatMap((key) => {
      const missingIn: string[] = [];
      if (!en.has(key)) missingIn.push("en");
      if (!ar.has(key)) missingIn.push("ar");
      return missingIn.length ? [`${key} (${missingIn.join(", ")})`] : [];
    });

    expect(missing).toEqual([]);
  });
});
