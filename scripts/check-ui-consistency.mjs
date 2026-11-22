#!/usr/bin/env node

/**
 * UI consistency guard.
 *
 * Fails when a page or component bypasses the shared page contract without an
 * explicit allowlist entry. Run with `npm run check:ui`; it is part of `check`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const allow = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/ui-allowlist.json"), "utf8"),
);

const SKIP = /node_modules|\.next|\.git/;
const SCAN_DIRS = ["app", "components"];
const EXT = /\.(tsx|ts)$/;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (SKIP.test(full)) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.test(entry.name)) out.push(full);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((dir) => {
  const full = path.join(root, dir);
  return fs.existsSync(full) ? walk(full) : [];
});

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");
const allowed = (group, file) => (allow[group] || []).includes(rel(file));

const rules = [
  {
    group: "h1",
    label: "<h1> outside PageHeader or an allowlisted hero",
    test: (text) => /<h1\b/.test(text),
  },
  {
    group: "container",
    label: "PageShell containerClassName override",
    test: (text) => /containerClassName=/.test(text),
  },
  {
    group: "cardSurfaces",
    label: "raw card surface instead of surface-card/panel",
    test: (text) => /rounded-2xl border border-border\b/.test(text),
  },
  {
    group: "hex",
    label: "hardcoded color value",
    test: (text) => /#[0-9a-fA-F]{3,8}\b/.test(text),
  },
  {
    group: "space",
    label: "raw space-y-8/10 instead of a stack role",
    test: (text) => /space-y-(?:8|10)\b/.test(text),
  },
  {
    group: "header-margin",
    label: "PageHeader margin override (mb-8/mb-12)",
    test: (text) => /<PageHeader[\s\S]{0,320}?className="[^"]*mb-(?:8|12)\b/.test(text),
  },
  {
    group: "header-size",
    label: "PageHeader size override (all page titles use type-page)",
    test: (text) => /<PageHeader[\s\S]{0,320}?\bsize=/.test(text),
  },
];

const violations = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const rule of rules) {
    if (!rule.test(text)) continue;
    if (rule.group !== "header-margin" && allowed(rule.group, file)) continue;
    violations.push({ file: rel(file), label: rule.label });
  }
}

if (violations.length === 0) {
  console.log(`UI consistency: OK (${files.length} files scanned)`);
  process.exit(0);
}

console.error(`UI consistency: ${violations.length} violation(s)\n`);
for (const violation of violations) {
  console.error(`- ${violation.label}: ${violation.file}`);
}
console.error("\nFix the file, or add a reasoned entry to scripts/ui-allowlist.json.");
process.exit(1);
