/** Event used to show the themed app cover before a client navigation. */
export const APP_LOADING_EVENT = "app:loading";

export function showAppLoader(): void {
  if (typeof document === "undefined") return;
  document.dispatchEvent(new Event(APP_LOADING_EVENT));
}
