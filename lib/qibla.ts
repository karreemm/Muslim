/**
 * Qibla and geomagnetic math.
 *
 * This module is intentionally browser-free so it can run during server
 * rendering and in unit tests. It owns:
 * - the great-circle bearing to the Kaaba (true north);
 * - the Haversine distance to the Kaaba;
 * - angle normalisation helpers;
 * - magnetic declination from the World Magnetic Model 2025 (WMM2025).
 */

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/** The Kaaba, Masjid al-Haram, Makkah. */
export const KAABA = {
  latitude: 21.4225,
  longitude: 39.8262,
} as const;

/** IUGG mean Earth radius in kilometres, used by the Haversine formula. */
export const EARTH_RADIUS_KM = 6371.0088;

const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_TO_DEGREES = 180 / Math.PI;

export function toRadians(degrees: number): number {
  return degrees * DEGREES_TO_RADIANS;
}

export function toDegrees(radians: number): number {
  return radians * RADIANS_TO_DEGREES;
}

/** Normalises any finite angle to the range [0, 360). */
export function normalizeDegrees(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;

  const normalized = value % 360;
  if (normalized === 0) return 0;
  return normalized < 0 ? normalized + 360 : normalized;
}

/** Normalises any finite angle to (-180, 180]; useful for shortest turns. */
export function normalizeSignedDegrees(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;

  const normalized = normalizeDegrees(value);
  return normalized > 180 ? normalized - 360 : normalized;
}

/** Signed shortest rotation from one heading to another, in degrees. */
export function shortestAngleDelta(from: number, to: number): number {
  return normalizeSignedDegrees(to - from);
}

/**
 * Unsigned distance between the Qibla arrow and the fixed 12 o'clock marker.
 *
 * The arrow angle is already screen-relative, so 0 means "aligned with the
 * marker". This is not a north reference: the dial's 0° tick rotates with the
 * compass and must never be used here.
 */
export function getArrowAlignmentError(arrowAngle: number): number {
  return Math.abs(normalizeSignedDegrees(arrowAngle));
}

export function isValidCoordinates({ latitude, longitude }: Coordinates): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function assertValidCoordinates(coordinates: Coordinates): void {
  if (!isValidCoordinates(coordinates)) {
    throw new RangeError(
      "Coordinates must be finite: latitude in [-90, 90] and longitude in [-180, 180].",
    );
  }
}

/**
 * Initial great-circle bearing from `from` to the Kaaba, measured clockwise
 * from true north. Always returns a value in [0, 360).
 */
export function calculateQiblaBearing(from: Coordinates): number {
  assertValidCoordinates(from);

  const phi1 = toRadians(from.latitude);
  const phi2 = toRadians(KAABA.latitude);
  const deltaLambda = toRadians(KAABA.longitude - from.longitude);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

/**
 * Haversine distance between two coordinates in kilometres.
 */
export function calculateDistanceBetween(from: Coordinates, to: Coordinates): number {
  assertValidCoordinates(from);
  assertValidCoordinates(to);

  const phi1 = toRadians(from.latitude);
  const phi2 = toRadians(to.latitude);
  const deltaPhi = toRadians(to.latitude - from.latitude);
  const deltaLambda = toRadians(to.longitude - from.longitude);

  const sinHalfDeltaPhi = Math.sin(deltaPhi / 2);
  const sinHalfDeltaLambda = Math.sin(deltaLambda / 2);
  const a =
    sinHalfDeltaPhi * sinHalfDeltaPhi +
    Math.cos(phi1) * Math.cos(phi2) * sinHalfDeltaLambda * sinHalfDeltaLambda;
  const clamped = Math.min(1, Math.max(0, a));

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(clamped), Math.sqrt(1 - clamped));
}

/**
 * Haversine distance from `from` to the Kaaba in kilometres.
 */
export function calculateDistanceToKaaba(from: Coordinates): number {
  return calculateDistanceBetween(from, KAABA);
}

/**
 * Converts a magnetic heading to a true-north heading.
 *
 * Declination is positive east of true north. This is the single conversion
 * point used by the compass hook: apply it once, after smoothing, and never to
 * a reading that is already true north.
 */
export function magneticHeadingToTrueHeading(
  magneticHeading: number,
  declinationEastDegrees: number,
): number {
  return normalizeDegrees(magneticHeading + declinationEastDegrees);
}

/**
 * Converts a device-top heading to the heading of the top edge of the screen.
 * Values such as 0/90/180/270 come from the Screen Orientation API.
 */
export function deviceHeadingToScreenHeading(
  deviceHeading: number,
  screenOrientationAngle: number,
): number {
  return normalizeDegrees(deviceHeading + screenOrientationAngle);
}

/* ── World Magnetic Model 2025 ───────────────────────────────────────────── */

const WMM_N_MAX = 12;
const WMM_EPOCH = 2025;
export const MAGNETIC_MODEL_VALID_UNTIL = 2030;

const WGS84_SEMI_MAJOR_KM = 6378.137;
const WGS84_SEMI_MINOR_KM = 6356.7523142;
const WGS84_ECCENTRICITY_SQUARED =
  1 -
  (WGS84_SEMI_MINOR_KM * WGS84_SEMI_MINOR_KM) /
    (WGS84_SEMI_MAJOR_KM * WGS84_SEMI_MAJOR_KM);
const WMM_REFERENCE_RADIUS_KM = 6371.2;

/* Schmidt quasi-normalised Gauss coefficients, nT (WMM2025). */
const WMM_G = [
  0, -29351.8, -1410.8, -2556.6, 2951.1, 1649.3, 1361, -2404.1, 1243.8, 453.6, 895, 799.5,
  55.7, -281.1, 12.1, -233.2, 368.9, 187.2, -138.7, -142, 20.9, 64.4, 63.8, 76.9, -115.7,
  -40.9, 14.9, -60.7, 79.5, -77, -8.8, 59.3, 15.8, 2.5, -11.1, 14.2, 23.2, 10.8, -17.5, 2,
  -21.7, 16.9, 15, -16.8, 0.9, 4.6, 7.8, 3, -0.2, -2.5, -13.1, 2.4, 8.6, -8.7, -12.9,
  -1.3, -6.4, 0.2, 2, -1, -0.6, -0.9, 1.5, 0.9, -2.7, -3.9, 2.9, -1.5, -2.5, 2.4, -0.6,
  -0.1, -0.6, -0.1, 1.1, -1, -0.2, 2.6, -2, -0.2, 0.3, 1.2, -1.3, 0.6, 0.6, 0.5, -0.1,
  -0.4, -0.2, -1.3, -0.7,
] as const;

const WMM_H = [
  0, 0, 4545.4, 0, -3133.6, -815.1, 0, -56.6, 237.5, -549.5, 0, 278.6, -133.9, 212,
  -375.6, 0, 45.4, 220.2, -122.9, 43, 106.1, 0, -18.4, 16.8, 48.8, -59.8, 10.9, 72.7, 0,
  -48.9, -14.4, -1, 23.4, -7.4, -25.1, -2.3, 0, 7.1, -12.6, 11.4, -9.7, 12.7, 0.7, -5.2,
  3.9, 0, -24.8, 12.2, 8.3, -3.3, -5.2, 7.2, -0.6, 0.8, 10, 0, 3.3, 0, 2.4, 5.3, -9.1,
  0.4, -4.2, -3.8, 0.9, -9.1, 0, 0, 2.9, -0.6, 0.2, 0.5, -0.3, -1.2, -1.7, -2.9, -1.8,
  -2.3, 0, -1.3, 0.7, 1, -1.4, 0, 0.6, -0.1, 0.8, 0.1, -1, 0.1, 0.2,
] as const;

const WMM_SECULAR_VARIATION_G = [
  0, 12, 9.7, -11.6, -5.2, -8, -1.3, -4.2, 0.4, -15.6, -1.6, -2.4, -6, 5.6, -7, 0.6, 1.4,
  0, 0.6, 2.2, 0.9, -0.2, -0.4, 0.9, 1.2, -0.9, 0.3, 0.9, 0, -0.1, -0.1, 0.5, -0.1, -0.8,
  -0.8, 0.8, -0.1, 0.2, 0, 0.5, -0.1, 0.3, 0.2, 0, 0.2, 0, -0.1, 0.1, 0.3, -0.3, 0, 0.3,
  -0.1, 0.1, -0.1, 0.1, 0, 0.1, 0.1, 0, -0.3, 0, -0.1, -0.1, 0, 0, 0, 0, 0, 0, 0, -0.1, 0,
  0, -0.1, -0.1, -0.1, -0.1, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0, -0.1, 0, -0.1,
] as const;

const WMM_SECULAR_VARIATION_H = [
  0, 0, -21.5, 0, -27.7, -12.1, 0, 4, -0.3, -4.1, 0, -1.1, 4.1, 1.6, -4.4, 0, -0.5, 2.2,
  0.4, 1.7, 1.9, 0, 0.3, -1.6, -0.4, 0.9, 0.7, 0.9, 0, 0.6, 0.5, -0.8, 0, -1, 0.6, -0.2,
  0, -0.2, 0.5, -0.4, 0.4, -0.5, -0.6, 0.3, 0.2, 0, -0.3, 0.3, -0.3, 0.3, 0.2, -0.1, -0.2,
  0.4, 0.1, 0, 0, 0, -0.2, 0.1, -0.1, 0.1, 0, -0.1, 0.2, 0, 0, 0, 0.1, 0, 0.1, 0, 0, 0.1,
  0, 0, 0, 0, 0, 0, 0, -0.1, 0.1, 0, 0, 0, 0, 0, 0, 0, -0.1,
] as const;

function decimalYear(date: Date): number {
  const year = date.getUTCFullYear();
  if (!Number.isFinite(year)) return Number.NaN;

  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return year + (date.getTime() - start) / (end - start);
}

/** True while the embedded WMM2025 model is inside its official validity. */
export function isMagneticModelDateValid(date: Date): boolean {
  const year = decimalYear(date);
  return year >= WMM_EPOCH && year <= MAGNETIC_MODEL_VALID_UNTIL;
}

/**
 * Magnetic declination in degrees, positive east of true north, from WMM2025.
 *
 * The model is evaluated at sea level. Maritime/aviation altitude changes the
 * result only slightly at the scales relevant to a phone compass.
 */
export function calculateMagneticDeclination(
  coordinates: Coordinates,
  date: Date = new Date(),
): number {
  assertValidCoordinates(coordinates);

  const decimal = decimalYear(date);
  if (!Number.isFinite(decimal)) return Number.NaN;

  const deltaT = decimal - WMM_EPOCH;
  const g = WMM_G.map(
    (coefficient, index) => coefficient + WMM_SECULAR_VARIATION_G[index] * deltaT,
  );
  const h = WMM_H.map(
    (coefficient, index) => coefficient + WMM_SECULAR_VARIATION_H[index] * deltaT,
  );

  // The model has a singularity exactly at the geographic poles.
  const latitude = Math.max(-89.9999, Math.min(89.9999, coordinates.latitude));
  const longitude = coordinates.longitude;

  const phi = toRadians(latitude);
  const lambda = toRadians(longitude);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  // Geodetic -> geocentric spherical coordinates at sea level.
  const primeVerticalRadius =
    WGS84_SEMI_MAJOR_KM / Math.sqrt(1 - WGS84_ECCENTRICITY_SQUARED * sinPhi * sinPhi);
  const xp = primeVerticalRadius * cosPhi;
  const zp = primeVerticalRadius * (1 - WGS84_ECCENTRICITY_SQUARED) * sinPhi;
  const radius = Math.hypot(xp, zp);
  const geocentricLatitude = Math.asin(zp / radius);

  const radiusRatio = WMM_REFERENCE_RADIUS_KM / radius;
  const relativeRadiusPower = new Array<number>(WMM_N_MAX + 1).fill(0);
  relativeRadiusPower[0] = radiusRatio * radiusRatio;
  for (let n = 1; n <= WMM_N_MAX; n += 1) {
    relativeRadiusPower[n] = relativeRadiusPower[n - 1] * radiusRatio;
  }

  const cosMl = new Array<number>(WMM_N_MAX + 1).fill(0);
  const sinMl = new Array<number>(WMM_N_MAX + 1).fill(0);
  cosMl[0] = 1;
  sinMl[0] = 0;
  cosMl[1] = Math.cos(lambda);
  sinMl[1] = Math.sin(lambda);
  for (let m = 2; m <= WMM_N_MAX; m += 1) {
    cosMl[m] = cosMl[m - 1] * cosMl[1] - sinMl[m - 1] * sinMl[1];
    sinMl[m] = cosMl[m - 1] * sinMl[1] + sinMl[m - 1] * cosMl[1];
  }

  // Gauss-normalised associated Legendre functions and colatitude derivatives.
  const x = Math.sin(geocentricLatitude);
  const z = Math.cos(geocentricLatitude);
  const termCount = ((WMM_N_MAX + 1) * (WMM_N_MAX + 2)) / 2;
  const pcup = new Array<number>(termCount).fill(0);
  const dpcup = new Array<number>(termCount).fill(0);
  const schmidtQuasiNorm = new Array<number>(termCount).fill(0);

  pcup[0] = 1;
  dpcup[0] = 0;
  schmidtQuasiNorm[0] = 1;

  for (let n = 1; n <= WMM_N_MAX; n += 1) {
    for (let m = 0; m <= n; m += 1) {
      const index = (n * (n + 1)) / 2 + m;

      if (n === m) {
        const previous = ((n - 1) * n) / 2 + m - 1;
        pcup[index] = z * pcup[previous];
        dpcup[index] = z * dpcup[previous] + x * pcup[previous];
      } else if (n === 1 && m === 0) {
        const previous = ((n - 1) * n) / 2 + m;
        pcup[index] = x * pcup[previous];
        dpcup[index] = x * dpcup[previous] - z * pcup[previous];
      } else if (n > 1) {
        const previous = ((n - 2) * (n - 1)) / 2 + m;
        const current = ((n - 1) * n) / 2 + m;

        if (m > n - 2) {
          pcup[index] = x * pcup[current];
          dpcup[index] = x * dpcup[current] - z * pcup[current];
        } else {
          const k = ((n - 1) * (n - 1) - m * m) / ((2 * n - 1) * (2 * n - 3));
          pcup[index] = x * pcup[current] - k * pcup[previous];
          dpcup[index] = x * dpcup[current] - z * pcup[current] - k * dpcup[previous];
        }
      }
    }
  }

  for (let n = 1; n <= WMM_N_MAX; n += 1) {
    const first = (n * (n + 1)) / 2;
    const previous = ((n - 1) * n) / 2;
    schmidtQuasiNorm[first] = (schmidtQuasiNorm[previous] * (2 * n - 1)) / n;

    for (let m = 1; m <= n; m += 1) {
      const index = (n * (n + 1)) / 2 + m;
      const previousIndex = index - 1;
      schmidtQuasiNorm[index] =
        schmidtQuasiNorm[previousIndex] *
        Math.sqrt(((n - m + 1) * (m === 1 ? 2 : 1)) / (n + m));
    }
  }

  for (let n = 1; n <= WMM_N_MAX; n += 1) {
    for (let m = 0; m <= n; m += 1) {
      const index = (n * (n + 1)) / 2 + m;
      pcup[index] *= schmidtQuasiNorm[index];
      dpcup[index] *= -schmidtQuasiNorm[index];
    }
  }

  // Spherical harmonic sums: Bx north, By east, Bz down.
  let bx = 0;
  let by = 0;
  let bz = 0;

  for (let n = 1; n <= WMM_N_MAX; n += 1) {
    for (let m = 0; m <= n; m += 1) {
      const index = (n * (n + 1)) / 2 + m;
      const gCosHsin = g[index] * cosMl[m] + h[index] * sinMl[m];
      const gSinHcos = g[index] * sinMl[m] - h[index] * cosMl[m];

      bz -= relativeRadiusPower[n] * (n + 1) * gCosHsin * pcup[index];
      by += relativeRadiusPower[n] * m * gSinHcos * pcup[index];
      bx -= relativeRadiusPower[n] * gCosHsin * dpcup[index];
    }
  }

  const cosGeocentricLatitude = Math.cos(geocentricLatitude);
  if (Math.abs(cosGeocentricLatitude) > 1e-10) {
    by /= cosGeocentricLatitude;
  }

  // Rotate from geocentric spherical to geodetic coordinates.
  const psi = geocentricLatitude - phi;
  const geodeticBx = bx * Math.cos(psi) - bz * Math.sin(psi);
  const geodeticBy = by;

  return normalizeSignedDegrees(toDegrees(Math.atan2(geodeticBy, geodeticBx)));
}
