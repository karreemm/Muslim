import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

export type LocalDeleteTokens = Record<string, string>;

function isTokenMap(value: unknown): value is LocalDeleteTokens {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.values(value).every((token) => typeof token === "string");
}

export function readLocalDeleteTokens(): LocalDeleteTokens {
  return readJSON<LocalDeleteTokens>(STORAGE_KEYS.sadaqaDeleteTokens, {}, isTokenMap);
}

export function writeLocalDeleteTokens(tokens: LocalDeleteTokens): void {
  writeJSON(STORAGE_KEYS.sadaqaDeleteTokens, tokens);
}
