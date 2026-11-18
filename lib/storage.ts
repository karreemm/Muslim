/**
 * Centralized, SSR-safe browser storage helpers.
 *
 * Keys intentionally keep their existing names. Changing them would silently
 * drop users' saved data, so any namespace/version migration must be explicit.
 */

const isBrowser = () => typeof window !== "undefined";

export const STORAGE_KEYS = {
  theme: "theme",
  palette: "palette",
  paletteHue: "paletteHue",
  language: "language",
  favoriteSurahs: "favoriteSurahs",
  favoriteHadiths: "favoriteHadiths",
  favoriteAzkar: "favoriteAzkar",
  savedAyahs: "savedAyahs",
  favoriteRadioStations: "favoriteRadioStations",
  audioPlaybackRate: "audioPlaybackRate",
  audioSkipMode: "audioSkipMode",
  audioRepeatSettings: "audioRepeatSettings",
  preferredReciter: "preferredReciter",
  tasbeehCount: "tasbeeh_count",
  tasbeehGoal: "tasbeeh_goal",
  tasbeehInputValue: "tasbeeh_input_value",
  azkarDailyCounts: "azkar_daily_counts",
  selectedGovernorate: "selectedGovernorate",
  sadaqaDeleteTokens: "sadaqaDeleteTokens",
  postSalahResetMarker: "postSalahResetPrayer",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function readString(key: string, fallback = ""): string {
  if (!isBrowser()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeString(key: string, value: string): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, quota). Ignore silently.
  }
}

export function readNumber(key: string, fallback: number): number {
  const raw = readString(key, "");
  if (!raw) return fallback;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function writeNumber(key: string, value: number): void {
  writeString(key, String(value));
}

export function readJSON<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => value is T,
): T {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;

    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota). Ignore silently.
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore unavailable storage.
  }
}

export function hasStorage(key: string): boolean {
  return readString(key, "") !== "";
}

/**
 * Subscribe to changes made by other tabs. Returns an unsubscribe function.
 * Useful for keeping favorites/settings in sync across tabs.
 */
export function onStorageChange(
  key: string,
  handler: (value: string | null) => void,
): () => void {
  if (!isBrowser()) return () => {};

  const listener = (event: StorageEvent) => {
    if (event.key === key) handler(event.newValue);
  };

  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}
