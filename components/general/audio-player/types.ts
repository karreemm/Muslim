export type RepeatRangeMode = "this" | "custom";

export type RepeatsPerAyah = 1 | 3 | 5 | 10 | typeof Infinity;

export type OnRangeComplete = "stop" | "loop";

export interface RepeatConfig {
  startAyah: number;
  endAyah: number;
  repeatsPerAyah: RepeatsPerAyah;
  onRangeComplete: OnRangeComplete;
}

export interface RepeatPlaybackState {
  isRepeatModeActive: boolean;
  config: RepeatConfig | null;
  currentRepeatCount: number;
}

export interface HifzRequest {
  startAyah: number;
  mode: RepeatRangeMode;
  openEndPicker: boolean;
}

export const REPEAT_REPEATS_OPTIONS: RepeatsPerAyah[] = [1, 3, 5, 10, Infinity];

export type PlaybackSpeed = 1 | 0.75 | 0.5;

export const PLAYBACK_SPEED_OPTIONS: PlaybackSpeed[] = [1, 0.75, 0.5];

export const PLAYBACK_RATE_STORAGE_KEY = "audioPlaybackRate";

export const REPEAT_STORAGE_KEY = "audioRepeatSettings";

export interface PersistedRepeatSettings {
  repeatsPerAyah: RepeatsPerAyah;
  onRangeComplete: OnRangeComplete;
}

export const defaultRepeatSettings: PersistedRepeatSettings = {
  repeatsPerAyah: 3,
  onRangeComplete: "stop",
};

export function loadRepeatSettings(): PersistedRepeatSettings {
  if (typeof window === "undefined") return defaultRepeatSettings;
  try {
    const raw = localStorage.getItem(REPEAT_STORAGE_KEY);
    if (!raw) return defaultRepeatSettings;
    const parsed = JSON.parse(raw) as Partial<{
      repeatsPerAyah?: number;
      onRangeComplete?: OnRangeComplete;
    }>;
    const stored = parsed.repeatsPerAyah;
    const repeatsPerAyah: RepeatsPerAyah =
      stored === -1
        ? Infinity
        : typeof stored === "number" &&
            REPEAT_REPEATS_OPTIONS.includes(stored as RepeatsPerAyah)
          ? (stored as RepeatsPerAyah)
          : defaultRepeatSettings.repeatsPerAyah;
    const onRangeComplete: OnRangeComplete =
      parsed.onRangeComplete === "loop" || parsed.onRangeComplete === "stop"
        ? parsed.onRangeComplete
        : defaultRepeatSettings.onRangeComplete;
    return { repeatsPerAyah, onRangeComplete };
  } catch {
    return defaultRepeatSettings;
  }
}

export function saveRepeatSettings(settings: PersistedRepeatSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      REPEAT_STORAGE_KEY,
      JSON.stringify({
        repeatsPerAyah:
          settings.repeatsPerAyah === Infinity ? -1 : settings.repeatsPerAyah,
        onRangeComplete: settings.onRangeComplete,
      }),
    );
  } catch {
  }
}
