import { describe, expect, it } from "vitest";
import {
  calculateDistanceToKaaba,
  calculateMagneticDeclination,
  calculateQiblaBearing,
  deviceHeadingToScreenHeading,
  getArrowAlignmentError,
  isMagneticModelDateValid,
  isValidCoordinates,
  KAABA,
  magneticHeadingToTrueHeading,
  normalizeDegrees,
  normalizeSignedDegrees,
  shortestAngleDelta,
} from "@/lib/qibla";

const LOCATIONS = {
  cairo: { latitude: 30.0444, longitude: 31.2357 },
  london: { latitude: 51.5074, longitude: -0.1278 },
  newYork: { latitude: 40.7128, longitude: -74.006 },
  jakarta: { latitude: -6.2088, longitude: 106.8456 },
  sydney: { latitude: -33.8688, longitude: 151.2093 },
} as const;

const MODEL_DATE = new Date(Date.UTC(2026, 5, 1));

describe("qibla bearing", () => {
  it("matches known great-circle bearings", () => {
    expect(calculateQiblaBearing(LOCATIONS.cairo)).toBeCloseTo(136.14, 1);
    expect(calculateQiblaBearing(LOCATIONS.london)).toBeCloseTo(118.99, 1);
    expect(calculateQiblaBearing(LOCATIONS.newYork)).toBeCloseTo(58.48, 1);
    expect(calculateQiblaBearing(LOCATIONS.jakarta)).toBeCloseTo(295.15, 1);
    expect(calculateQiblaBearing(LOCATIONS.sydney)).toBeCloseTo(277.5, 1);
  });

  it("is exactly zero at the Kaaba", () => {
    expect(calculateQiblaBearing(KAABA)).toBeCloseTo(0, 6);
  });

  it("always returns a heading in [0, 360)", () => {
    for (const location of Object.values(LOCATIONS)) {
      const bearing = calculateQiblaBearing(location);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    }
  });
});

describe("distance to the Kaaba", () => {
  it("matches known Haversine distances", () => {
    expect(calculateDistanceToKaaba(LOCATIONS.cairo)).toBeCloseTo(1287.2, 0);
    expect(calculateDistanceToKaaba(LOCATIONS.london)).toBeCloseTo(4793.8, 0);
    expect(calculateDistanceToKaaba(LOCATIONS.newYork)).toBeCloseTo(10306.3, 0);
    expect(calculateDistanceToKaaba(LOCATIONS.jakarta)).toBeCloseTo(7920.1, 0);
    expect(calculateDistanceToKaaba(LOCATIONS.sydney)).toBeCloseTo(13236.3, 0);
  });

  it("is zero at the Kaaba", () => {
    expect(calculateDistanceToKaaba(KAABA)).toBeCloseTo(0, 6);
  });
});

describe("angle helpers", () => {
  it("normalises angles into [0, 360)", () => {
    expect(normalizeDegrees(0)).toBe(0);
    expect(normalizeDegrees(360)).toBe(0);
    expect(normalizeDegrees(-90)).toBe(270);
    expect(normalizeDegrees(450)).toBe(90);
    expect(normalizeDegrees(-720)).toBe(0);
    expect(normalizeDegrees(Number.NaN)).toBeNaN();
  });

  it("normalises signed deltas around zero", () => {
    expect(normalizeSignedDegrees(190)).toBe(-170);
    expect(normalizeSignedDegrees(-190)).toBe(170);
    expect(normalizeSignedDegrees(180)).toBe(180);
  });

  it("takes the shortest turn across north", () => {
    expect(shortestAngleDelta(350, 10)).toBe(20);
    expect(shortestAngleDelta(10, 350)).toBe(-20);
    expect(shortestAngleDelta(0, 180)).toBe(180);
  });

  it("measures the arrow distance to the 12 o'clock marker", () => {
    expect(getArrowAlignmentError(0)).toBe(0);
    expect(getArrowAlignmentError(5)).toBe(5);
    expect(getArrowAlignmentError(-5)).toBe(5);
    expect(getArrowAlignmentError(355)).toBe(5);
    expect(getArrowAlignmentError(359)).toBe(1);
    expect(getArrowAlignmentError(180)).toBe(180);
    expect(getArrowAlignmentError(184)).toBe(176);
  });

  it("applies declination and screen rotation exactly once", () => {
    expect(magneticHeadingToTrueHeading(0, 4.5)).toBeCloseTo(4.5, 6);
    expect(magneticHeadingToTrueHeading(359, 4.5)).toBeCloseTo(3.5, 6);
    expect(deviceHeadingToScreenHeading(270, 90)).toBe(0);
    expect(deviceHeadingToScreenHeading(0, 270)).toBe(270);
  });

  it("validates coordinates", () => {
    expect(isValidCoordinates(LOCATIONS.cairo)).toBe(true);
    expect(isValidCoordinates({ latitude: 91, longitude: 0 })).toBe(false);
    expect(isValidCoordinates({ latitude: 0, longitude: 181 })).toBe(false);
    expect(isValidCoordinates({ latitude: Number.NaN, longitude: 0 })).toBe(false);
    expect(() => calculateQiblaBearing({ latitude: 91, longitude: 0 })).toThrow(
      RangeError,
    );
  });
});

describe("magnetic declination (WMM2025)", () => {
  it("matches WMM reference values", () => {
    expect(calculateMagneticDeclination(LOCATIONS.cairo, MODEL_DATE)).toBeCloseTo(
      4.76,
      1,
    );
    expect(calculateMagneticDeclination(LOCATIONS.london, MODEL_DATE)).toBeCloseTo(
      1.15,
      1,
    );
    expect(calculateMagneticDeclination(LOCATIONS.newYork, MODEL_DATE)).toBeCloseTo(
      -12.48,
      1,
    );
    expect(calculateMagneticDeclination(LOCATIONS.jakarta, MODEL_DATE)).toBeCloseTo(
      0.64,
      1,
    );
    expect(calculateMagneticDeclination(LOCATIONS.sydney, MODEL_DATE)).toBeCloseTo(
      12.82,
      1,
    );
    expect(calculateMagneticDeclination(KAABA, MODEL_DATE)).toBeCloseTo(3.51, 1);
  });

  it("tracks the model validity window", () => {
    expect(isMagneticModelDateValid(new Date(Date.UTC(2025, 0, 1)))).toBe(true);
    expect(isMagneticModelDateValid(MODEL_DATE)).toBe(true);
    expect(isMagneticModelDateValid(new Date(Date.UTC(2031, 0, 1)))).toBe(false);
  });
});
