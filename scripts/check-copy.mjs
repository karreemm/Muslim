#!/usr/bin/env node

/**
 * Locale copy guard.
 *
 * Checks whitespace, placeholder integrity, en/ar placeholder parity, raw
 * digits, and leftover plural keys. Run with `npm run check:copy`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localesRoot = path.join(root, "locales");
const locales = ["en", "ar"];

const DIGIT_ALLOWLIST = new Set(["common.notFoundCode"]);

function collectFlat(dir, base, out = {}) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFlat(full, base ? `${base}.${entry.name}` : entry.name, out);
    } else if (entry.name.endsWith(".json")) {
      const namespace = `${base ? `${base}.` : ""}${entry.name.replace(/\.json$/, "")}`;
      const json = JSON.parse(fs.readFileSync(full, "utf8"));
      flatten(json, namespace, out);
    }
  }
  return out;
}

function flatten(value, prefix, out) {
  for (const [key, child] of Object.entries(value)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object") flatten(child, full, out);
    else if (typeof child === "string") out[full] = child;
  }
}

function placeholders(value) {
  return [...value.matchAll(/\{\{([^}]+)\}\}/g)].map((match) => match[1]).sort();
}

const data = Object.fromEntries(
  locales.map((locale) => [locale, collectFlat(path.join(localesRoot, locale), "")]),
);

const violations = [];

for (const locale of locales) {
  for (const [key, value] of Object.entries(data[locale])) {
    if (value !== value.trim()) {
      violations.push(`${locale}: leading/trailing whitespace in ${key}`);
    }

    const opens = (value.match(/\{\{/g) || []).length;
    const closes = (value.match(/\}\}/g) || []).length;
    if (opens !== closes) {
      violations.push(`${locale}: unmatched placeholder braces in ${key}`);
    }

    if (/\d/.test(value) && !DIGIT_ALLOWLIST.has(key)) {
      violations.push(`${locale}: raw digit in ${key} (use {{param}})`);
    }

    if (key.endsWith("_plural")) {
      violations.push(`${locale}: unused plural key ${key}`);
    }
  }
}

const allKeys = new Set([...Object.keys(data.en || {}), ...Object.keys(data.ar || {})]);

for (const key of allKeys) {
  const en = data.en?.[key];
  const ar = data.ar?.[key];
  if (en === undefined || ar === undefined) {
    violations.push(`missing translation: ${key} (${en === undefined ? "en" : "ar"})`);
    continue;
  }
  const enParams = placeholders(en).join(",");
  const arParams = placeholders(ar).join(",");
  if (enParams !== arParams) {
    violations.push(`placeholder mismatch in ${key}: en[${enParams}] ar[${arParams}]`);
  }
}

if (violations.length === 0) {
  console.log(`Copy consistency: OK (${allKeys.size} keys)`);
  process.exit(0);
}

console.error(`Copy consistency: ${violations.length} violation(s)\n`);
for (const violation of violations) console.error(`- ${violation}`);
console.error("\nFix the locale files or extend scripts/check-copy.mjs.");
process.exit(1);
