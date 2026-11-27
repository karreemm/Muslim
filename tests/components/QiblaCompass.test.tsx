import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import QiblaCompass from "@/components/qibla/QiblaCompass";
import LanguageContextProvider from "@/context/general/LanguageContext";
import { clearQiblaSessionLocation } from "@/hooks/useQibla";
import {
  calculateMagneticDeclination,
  calculateQiblaBearing,
  normalizeDegrees,
} from "@/lib/qibla";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/qibla",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/hooks/readQuran/useQuranPageFont", () => ({
  useQuranPageFont: () => ({
    fontReady: false,
    fontLoadTried: true,
    pageFontName: null,
    isSpecialPage: false,
  }),
}));

function renderCompass() {
  return render(
    <LanguageContextProvider initialLocale="en">
      <QiblaCompass />
    </LanguageContextProvider>,
  );
}

async function chooseCairo() {
  await userEvent.click(screen.getByRole("button", { name: "Choose a governorate" }));
  await userEvent.click(screen.getByRole("option", { name: "Cairo" }));
}

function alignedCompassAlpha() {
  const cairo = { latitude: 30.0444, longitude: 31.2357 };
  const bearing = calculateQiblaBearing(cairo);
  const declination = calculateMagneticDeclination(cairo);
  return normalizeDegrees(360 - (bearing - declination));
}

beforeEach(() => {
  clearQiblaSessionLocation();
  Object.defineProperty(navigator, "permissions", {
    configurable: true,
    value: {
      query: vi.fn().mockResolvedValue({ state: "prompt" }),
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("QiblaCompass", () => {
  it("shows the verse and a Qibla calculation from a governorate", async () => {
    renderCompass();

    expect(screen.getByRole("heading", { name: "Qibla Direction" })).toBeInTheDocument();
    expect(
      screen.getByText("Find the Qibla direction from your location"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Latitude")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Longitude")).not.toBeInTheDocument();

    await chooseCairo();

    expect(await screen.findByText("136.1°")).toBeInTheDocument();
    expect(screen.getByText(/1,287/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cairo" })).toBeInTheDocument();
    expect(screen.getByText(/Calculated from true north/)).toBeInTheDocument();

    for (const angle of [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]) {
      expect(screen.getByText(`${angle}°`)).toBeInTheDocument();
    }
    expect(screen.queryByText("10°")).not.toBeInTheDocument();
  });

  it("reads an absolute sensor heading and exposes a live compass", async () => {
    vi.stubGlobal("DeviceOrientationEvent", class extends Event {});

    renderCompass();
    await chooseCairo();

    await userEvent.click(screen.getByRole("button", { name: "Live compass" }));

    await act(async () => {
      const event = new Event("deviceorientation");
      Object.defineProperties(event, {
        absolute: { value: true },
        alpha: { value: 180 },
        beta: { value: 0 },
        gamma: { value: 0 },
      });
      window.dispatchEvent(event);
    });

    expect(
      await screen.findByText(
        "Hold your phone flat, then turn slowly until the Qibla arrow points at the marker at the top of the compass.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Live compass\. Qibla bearing 136 degrees/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Qibla direction found")).not.toBeInTheDocument();
  });

  it("keeps the aligned state until the live arrow leaves the marker", async () => {
    vi.stubGlobal("DeviceOrientationEvent", class extends Event {});

    renderCompass();
    await chooseCairo();

    await userEvent.click(screen.getByRole("button", { name: "Live compass" }));

    const alignedAlpha = alignedCompassAlpha();

    await act(async () => {
      const event = new Event("deviceorientation");
      Object.defineProperties(event, {
        absolute: { value: true },
        alpha: { value: alignedAlpha },
        beta: { value: 0 },
        gamma: { value: 0 },
      });
      window.dispatchEvent(event);
    });

    expect(
      await screen.findByText("Qibla direction found", undefined, {
        timeout: 4000,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("You are now facing the Qibla")).toBeInTheDocument();

    // The confirmation is a state, not a timed message.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 3200));
    });
    expect(screen.getByText("Qibla direction found")).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60));
      const event = new Event("deviceorientation");
      Object.defineProperties(event, {
        absolute: { value: true },
        alpha: { value: normalizeDegrees(alignedAlpha + 90) },
        beta: { value: 0 },
        gamma: { value: 0 },
      });
      window.dispatchEvent(event);
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    await waitFor(
      () => expect(screen.queryByText("Qibla direction found")).not.toBeInTheDocument(),
      { timeout: 3000 },
    );
    expect(screen.getByText(/Hold your phone flat/)).toBeVisible();
  }, 15000);

  it("handles a denied iOS compass permission without a live compass", async () => {
    const requestPermission = vi.fn().mockResolvedValue("denied");
    vi.stubGlobal(
      "DeviceOrientationEvent",
      Object.assign(class extends Event {}, { requestPermission }),
    );

    renderCompass();
    await chooseCairo();

    await userEvent.click(screen.getByRole("button", { name: "Live compass" }));

    expect(
      await screen.findByText(
        "Calculated from true north. Compass permission was denied.",
      ),
    ).toBeInTheDocument();
    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Hold your phone flat/)).not.toBeInTheDocument();
  });

  it("does not show live guidance on a device without a compass", async () => {
    renderCompass();
    await chooseCairo();

    await waitFor(() =>
      expect(screen.queryByText(/Hold your phone flat/)).not.toBeInTheDocument(),
    );
    expect(screen.getByText(/Calculated from true north/)).toBeInTheDocument();
  });

  it("locates automatically when geolocation permission is already granted", async () => {
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: {
        query: vi.fn().mockResolvedValue({ state: "granted" }),
      },
    });
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success: PositionCallback) =>
          success({
            coords: {
              latitude: 30.0444,
              longitude: 31.2357,
              accuracy: 12,
            },
            timestamp: Date.now(),
          } as GeolocationPosition),
        ),
      },
    });

    renderCompass();

    expect(await screen.findByText("136.1°")).toBeInTheDocument();
    expect(screen.getByText("Cairo")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Choose a governorate" }),
    ).not.toBeInTheDocument();
  });

  it("shows the loading state and hides the governorate picker until GPS succeeds", async () => {
    let onSuccess: PositionCallback | null = null;
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success: PositionCallback) => {
          onSuccess = success;
        }),
      },
    });

    renderCompass();
    await userEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(await screen.findByText("Updating location…")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Choose a governorate" }),
    ).not.toBeInTheDocument();

    await act(async () => {
      onSuccess?.({
        coords: {
          latitude: 30.0444,
          longitude: 31.2357,
          accuracy: 12,
        },
        timestamp: Date.now(),
      } as GeolocationPosition);
    });

    expect(await screen.findByText("136.1°")).toBeInTheDocument();
    expect(screen.getByText("Cairo")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Choose a governorate" }),
    ).not.toBeInTheDocument();
  });

  it("shows the governorate picker again when GPS fails", async () => {
    let onError: PositionErrorCallback | null = null;
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn(
          (_success: PositionCallback, error: PositionErrorCallback) => {
            onError = error;
          },
        ),
      },
    });

    renderCompass();
    await userEvent.click(screen.getByRole("button", { name: "Use my location" }));

    expect(await screen.findByText("Updating location…")).toBeInTheDocument();

    await act(async () => {
      onError?.({ code: 1 } as GeolocationPositionError);
    });

    expect(
      await screen.findByText(
        "Location access was not allowed. Choose a governorate from the list.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Choose a governorate" }),
    ).toBeInTheDocument();
  });

  it("keeps the chosen location across a locale remount without requesting GPS again", async () => {
    const getCurrentPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition },
    });

    const firstRender = renderCompass();
    await chooseCairo();
    expect(screen.getByRole("button", { name: "Cairo" })).toBeInTheDocument();

    firstRender.unmount();

    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: {
        query: vi.fn().mockResolvedValue({ state: "granted" }),
      },
    });
    renderCompass();

    expect(await screen.findByText("136.1°")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cairo" })).toBeInTheDocument();
    expect(getCurrentPosition).not.toHaveBeenCalled();
  });
});
