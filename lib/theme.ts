/** Cookie names shared by the server layout and the client theme providers. */
export const THEME_COOKIE = "theme";
export const PALETTE_COOKIE = "palette";
export const PALETTE_HUE_COOKIE = "paletteHue";

export type ThemeMode = "light" | "dark";

/** Persist a client preference so the next HTML response can render it. */
export function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
