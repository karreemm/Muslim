"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  calculateDistanceToKaaba,
  calculateMagneticDeclination,
  calculateQiblaBearing,
  deviceHeadingToScreenHeading,
  isMagneticModelDateValid,
  isValidCoordinates,
  magneticHeadingToTrueHeading,
  normalizeDegrees,
  shortestAngleDelta,
  type Coordinates,
} from "@/lib/qibla";

export type LocationSource = "gps" | "manual";

export type LocationStatus =
  "idle" | "requesting" | "available" | "denied" | "unavailable" | "timeout" | "error";

export type LocationErrorCode =
  | "permission-denied"
  | "position-unavailable"
  | "timeout"
  | "unsupported"
  | "insecure-context"
  | "invalid-coordinates"
  | "unknown";

export type CompassStatus =
  | "idle"
  | "unsupported"
  | "permission-required"
  | "requesting"
  | "active"
  | "unreliable"
  | "denied"
  | "error";

export type CompassErrorCode =
  | "unsupported"
  | "permission-denied"
  | "permission-request-failed"
  | "insecure-context"
  | "no-readings"
  | "relative-only"
  | "stale"
  | "location-required"
  | "unknown";

export type CompassSource = "ios-compass" | "absolute-sensor" | "none";

export type QiblaLocation = Coordinates & {
  accuracy: number | null;
  source: LocationSource;
};

/**
 * Session-level location cache. It survives client-side locale navigation
 * (which remounts the page) without persisting precise coordinates to disk.
 */
let cachedLocation: QiblaLocation | null = null;
const locationListeners = new Set<() => void>();

function subscribeToLocation(listener: () => void): () => void {
  locationListeners.add(listener);
  return () => {
    locationListeners.delete(listener);
  };
}

function getLocationSnapshot(): QiblaLocation | null {
  return cachedLocation;
}

function getServerLocationSnapshot(): QiblaLocation | null {
  return null;
}

function setCachedLocation(next: QiblaLocation | null): void {
  cachedLocation = next;
  for (const listener of locationListeners) listener();
}

/** Clears the session location cache, e.g. when the user wants to start over. */
export function clearQiblaSessionLocation(): void {
  setCachedLocation(null);
}

export interface UseQiblaReturn {
  location: QiblaLocation | null;
  locationStatus: LocationStatus;
  locationError: LocationErrorCode | null;
  requestLocation: () => void;
  setManualLocation: (latitude: number, longitude: number) => boolean;

  qiblaBearing: number | null;
  distanceToKaabaKm: number | null;
  declination: number | null;
  declinationModelValid: boolean | null;

  compassSupported: boolean | null;
  requiresCompassPermission: boolean;
  compassStatus: CompassStatus;
  compassError: CompassErrorCode | null;
  compassSource: CompassSource;
  heading: number | null;
  compassAccuracyDegrees: number | null;
  needsCalibration: boolean;
  isCompassLive: boolean;
  startCompass: () => Promise<void>;
  stopCompass: () => void;
}

type CompassOrientationEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
};

type MagneticReading = {
  heading: number;
  source: Exclude<CompassSource, "none">;
  accuracyDegrees: number | null;
};

type DeviceOrientationPermissionConstructor = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 30000,
};

const SENSOR_DETECTION_TIMEOUT_MS = 4000;
const SENSOR_STALE_AFTER_MS = 4000;
const SENSOR_WATCHDOG_INTERVAL_MS = 2000;
const PUBLISH_INTERVAL_MS = 33;
const SMOOTHING_TIME_CONSTANT_MS = 120;
const MAX_SMOOTHING_BLEND = 0.85;
const CALIBRATION_ACCURACY_THRESHOLD_DEGREES = 20;

const subscribeToCompassSupport = () => () => {};

function deviceOrientationSupported(): boolean {
  return typeof DeviceOrientationEvent !== "undefined";
}

function getOrientationPermissionRequester():
  (() => Promise<"granted" | "denied">) | null {
  if (!deviceOrientationSupported()) return null;

  const constructor = DeviceOrientationEvent as unknown as
    DeviceOrientationPermissionConstructor | undefined;
  if (typeof constructor?.requestPermission !== "function") return null;

  return constructor.requestPermission.bind(constructor);
}

function getScreenOrientationAngle(): number {
  if (typeof window === "undefined") return 0;

  const screenAngle = window.screen?.orientation?.angle;
  if (typeof screenAngle === "number" && Number.isFinite(screenAngle)) {
    return normalizeDegrees(screenAngle);
  }

  const legacyAngle = window.orientation;
  if (typeof legacyAngle === "number" && Number.isFinite(legacyAngle)) {
    return normalizeDegrees(legacyAngle);
  }

  return 0;
}

/**
 * Reads a magnetic heading only. Declination is applied exactly once, later,
 * after smoothing. A relative `alpha` (event.absolute === false) is never
 * treated as an absolute compass heading.
 */
function readMagneticHeading(
  event: CompassOrientationEvent,
  absoluteEvent: boolean,
): MagneticReading | null {
  const iosHeading = event.webkitCompassHeading;
  if (
    typeof iosHeading === "number" &&
    Number.isFinite(iosHeading) &&
    iosHeading >= 0 &&
    iosHeading <= 360
  ) {
    const rawAccuracy = event.webkitCompassAccuracy;
    const accuracyDegrees =
      typeof rawAccuracy === "number" && Number.isFinite(rawAccuracy) && rawAccuracy >= 0
        ? rawAccuracy
        : null;

    return {
      heading: normalizeDegrees(iosHeading),
      source: "ios-compass",
      accuracyDegrees,
    };
  }

  const isAbsolute = absoluteEvent ? event.absolute !== false : event.absolute === true;
  if (!isAbsolute) return null;

  const alpha = event.alpha;
  if (typeof alpha !== "number" || !Number.isFinite(alpha)) return null;

  // W3C alpha grows counter-clockwise; compass headings grow clockwise.
  return {
    heading: normalizeDegrees(360 - alpha),
    source: "absolute-sensor",
    accuracyDegrees: null,
  };
}

function mapGeolocationError(code: number): {
  status: LocationStatus;
  error: LocationErrorCode;
} {
  if (code === 1) {
    return { status: "denied", error: "permission-denied" };
  }
  if (code === 2) {
    return { status: "unavailable", error: "position-unavailable" };
  }
  if (code === 3) {
    return { status: "timeout", error: "timeout" };
  }
  return { status: "error", error: "unknown" };
}

export function useQibla(): UseQiblaReturn {
  const location = useSyncExternalStore<QiblaLocation | null>(
    subscribeToLocation,
    getLocationSnapshot,
    getServerLocationSnapshot,
  );
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState<LocationErrorCode | null>(null);

  const [compassStatus, setCompassStatus] = useState<CompassStatus>("idle");
  const [compassError, setCompassError] = useState<CompassErrorCode | null>(null);
  const [compassSource, setCompassSource] = useState<CompassSource>("none");
  const [heading, setHeading] = useState<number | null>(null);
  const [compassAccuracyDegrees, setCompassAccuracyDegrees] = useState<number | null>(
    null,
  );
  const [needsCalibration, setNeedsCalibration] = useState(false);

  const [sensorEnabled, setSensorEnabled] = useState(false);
  const [sensorSession, setSensorSession] = useState(0);

  const mountedRef = useRef(true);
  const locationRequestIdRef = useRef(0);
  const locationRef = useRef<QiblaLocation | null>(location);
  const declinationRef = useRef(0);

  const smoothedMagneticHeadingRef = useRef<number | null>(null);
  const lastSampleAtRef = useRef(0);
  const lastSensorAtRef = useRef(0);
  const lastPublishAtRef = useRef(0);
  const lastPublishedHeadingRef = useRef<number | null>(null);
  const screenAngleRef = useRef(0);

  const compassStatusRef = useRef<CompassStatus>("idle");
  const compassErrorRef = useRef<CompassErrorCode | null>(null);
  const compassSourceRef = useRef<CompassSource>("none");
  const compassAccuracyRef = useRef<number | null>(null);

  // Reading support from an external store avoids a setState-in-effect pass and
  // keeps server and client snapshots explicit during hydration.
  const compassSupported = useSyncExternalStore<boolean | null>(
    subscribeToCompassSupport,
    deviceOrientationSupported,
    () => null,
  );
  const requiresCompassPermission =
    compassSupported === true && getOrientationPermissionRequester() !== null;

  const effectiveCompassStatus: CompassStatus =
    compassSupported === false
      ? "unsupported"
      : compassStatus === "idle" && requiresCompassPermission
        ? "permission-required"
        : compassStatus;
  const effectiveCompassError = compassSupported === false ? "unsupported" : compassError;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const updateCompassStatus = useCallback(
    (status: CompassStatus, error: CompassErrorCode | null = null) => {
      if (compassStatusRef.current !== status) {
        compassStatusRef.current = status;
        setCompassStatus(status);
      }
      if (compassErrorRef.current !== error) {
        compassErrorRef.current = error;
        setCompassError(error);
      }
    },
    [],
  );

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    if (window.isSecureContext === false) {
      setLocationStatus("error");
      setLocationError("insecure-context");
      return;
    }

    const geolocation = navigator.geolocation;
    if (!geolocation) {
      setLocationStatus("unavailable");
      setLocationError("unsupported");
      return;
    }

    const requestId = locationRequestIdRef.current + 1;
    locationRequestIdRef.current = requestId;
    setLocationStatus("requesting");
    setLocationError(null);

    try {
      geolocation.getCurrentPosition(
        (position) => {
          if (!mountedRef.current || requestId !== locationRequestIdRef.current) {
            return;
          }

          const nextLocation: QiblaLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy:
              Number.isFinite(position.coords.accuracy) && position.coords.accuracy >= 0
                ? position.coords.accuracy
                : null,
            source: "gps",
          };

          if (!isValidCoordinates(nextLocation)) {
            setLocationStatus("error");
            setLocationError("invalid-coordinates");
            return;
          }

          locationRef.current = nextLocation;
          setCachedLocation(nextLocation);
          setLocationStatus("available");
          setLocationError(null);
        },
        (error) => {
          if (!mountedRef.current || requestId !== locationRequestIdRef.current) {
            return;
          }

          const mapped = mapGeolocationError(error.code);
          setLocationStatus(mapped.status);
          setLocationError(mapped.error);
        },
        GEOLOCATION_OPTIONS,
      );
    } catch {
      setLocationStatus("error");
      setLocationError("unknown");
    }
  }, []);

  const setManualLocation = useCallback(
    (latitude: number, longitude: number): boolean => {
      if (!isValidCoordinates({ latitude, longitude })) {
        return false;
      }

      // A pending GPS callback must not overwrite a manual choice.
      locationRequestIdRef.current += 1;

      const nextLocation: QiblaLocation = {
        latitude,
        longitude,
        accuracy: null,
        source: "manual",
      };

      locationRef.current = nextLocation;
      setCachedLocation(nextLocation);
      setLocationStatus("available");
      setLocationError(null);
      return true;
    },
    [],
  );

  const declinationInfo = useMemo(() => {
    if (!location) return null;

    const now = new Date();
    return {
      degrees: calculateMagneticDeclination(location, now),
      modelValid: isMagneticModelDateValid(now),
    };
  }, [location]);

  const declination =
    declinationInfo && Number.isFinite(declinationInfo.degrees)
      ? declinationInfo.degrees
      : null;
  const declinationModelValid = declinationInfo?.modelValid ?? null;

  useEffect(() => {
    declinationRef.current = declination ?? 0;
  }, [declination]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    console.debug("[qibla] diagnostics", {
      locationStatus,
      locationError,
      locationSource: location?.source ?? null,
      locationAccuracy: location?.accuracy ?? null,
      compassStatus: effectiveCompassStatus,
      compassError: effectiveCompassError,
      compassSource,
      compassAccuracyDegrees,
      declination,
      declinationModelValid,
    });
  }, [
    compassAccuracyDegrees,
    compassSource,
    declination,
    declinationModelValid,
    effectiveCompassError,
    effectiveCompassStatus,
    location,
    locationError,
    locationStatus,
  ]);

  const qiblaBearing = useMemo(
    () => (location ? calculateQiblaBearing(location) : null),
    [location],
  );

  const distanceToKaabaKm = useMemo(
    () => (location ? calculateDistanceToKaaba(location) : null),
    [location],
  );

  const startCompass = useCallback(async () => {
    if (typeof window === "undefined") return;

    if (!locationRef.current) {
      updateCompassStatus("error", "location-required");
      return;
    }

    if (window.isSecureContext === false) {
      updateCompassStatus("error", "insecure-context");
      return;
    }

    const supported = deviceOrientationSupported();
    if (!supported) {
      updateCompassStatus("unsupported", "unsupported");
      return;
    }

    const permissionRequester = getOrientationPermissionRequester();
    // Stop any previous session before requesting permission or reattaching.
    setSensorEnabled(false);
    updateCompassStatus("requesting", null);

    setHeading(null);
    setCompassSource("none");
    compassSourceRef.current = "none";
    setCompassAccuracyDegrees(null);
    compassAccuracyRef.current = null;
    setNeedsCalibration(false);
    smoothedMagneticHeadingRef.current = null;
    lastSampleAtRef.current = 0;
    lastSensorAtRef.current = 0;
    lastPublishAtRef.current = 0;
    lastPublishedHeadingRef.current = null;
    screenAngleRef.current = getScreenOrientationAngle();

    if (permissionRequester) {
      try {
        const permission = await permissionRequester();
        if (permission !== "granted") {
          updateCompassStatus("denied", "permission-denied");
          return;
        }
      } catch {
        updateCompassStatus("error", "permission-request-failed");
        return;
      }
    }

    setSensorEnabled(true);
    setSensorSession((session) => session + 1);
  }, [updateCompassStatus]);

  const stopCompass = useCallback(() => {
    setSensorEnabled(false);
    setHeading(null);
    setCompassSource("none");
    compassSourceRef.current = "none";
    setCompassAccuracyDegrees(null);
    compassAccuracyRef.current = null;
    setNeedsCalibration(false);
    smoothedMagneticHeadingRef.current = null;
    lastPublishedHeadingRef.current = null;
    updateCompassStatus(
      compassSupported === false
        ? "unsupported"
        : requiresCompassPermission
          ? "permission-required"
          : "idle",
      null,
    );
  }, [compassSupported, requiresCompassPermission, updateCompassStatus]);

  useEffect(() => {
    if (!sensorEnabled || typeof window === "undefined") return;

    screenAngleRef.current = getScreenOrientationAngle();
    lastSensorAtRef.current = 0;
    lastSampleAtRef.current = 0;
    lastPublishAtRef.current = 0;
    lastPublishedHeadingRef.current = null;
    smoothedMagneticHeadingRef.current = null;

    let sawAnyOrientationEvent = false;

    const publishSmoothedHeading = () => {
      const smoothedMagneticHeading = smoothedMagneticHeadingRef.current;
      if (smoothedMagneticHeading == null) return;

      // Declination is applied here, once. Screen rotation is applied last so
      // the arrow refers to the top of the viewport, not the physical device.
      const trueScreenHeading = deviceHeadingToScreenHeading(
        magneticHeadingToTrueHeading(smoothedMagneticHeading, declinationRef.current),
        screenAngleRef.current,
      );
      const rounded = Math.round(trueScreenHeading * 10) / 10;

      if (lastPublishedHeadingRef.current !== rounded) {
        lastPublishedHeadingRef.current = rounded;
        setHeading(rounded);
      }
      updateCompassStatus("active", null);
    };

    const handleOrientation = (rawEvent: Event) => {
      sawAnyOrientationEvent = true;

      const event = rawEvent as CompassOrientationEvent;
      const absoluteEvent = rawEvent.type === "deviceorientationabsolute";
      const reading = readMagneticHeading(event, absoluteEvent);
      if (!reading) return;

      const now = window.performance.now();
      const deltaTime =
        lastSampleAtRef.current > 0 ? Math.min(now - lastSampleAtRef.current, 250) : 16;
      lastSampleAtRef.current = now;
      lastSensorAtRef.current = now;

      const previous = smoothedMagneticHeadingRef.current;
      let nextHeading: number;

      if (previous == null) {
        nextHeading = reading.heading;
      } else {
        const delta = shortestAngleDelta(previous, reading.heading);
        const baseBlend = 1 - Math.exp(-deltaTime / SMOOTHING_TIME_CONSTANT_MS);
        const turnBoost = Math.min(0.5, (Math.abs(delta) / 180) * 0.4);
        const blend = Math.min(MAX_SMOOTHING_BLEND, baseBlend + turnBoost);
        nextHeading = normalizeDegrees(previous + delta * blend);
      }

      smoothedMagneticHeadingRef.current = nextHeading;

      if (compassSourceRef.current !== reading.source) {
        compassSourceRef.current = reading.source;
        setCompassSource(reading.source);
      }

      if (compassAccuracyRef.current !== reading.accuracyDegrees) {
        compassAccuracyRef.current = reading.accuracyDegrees;
        setCompassAccuracyDegrees(reading.accuracyDegrees);
        setNeedsCalibration(
          reading.accuracyDegrees !== null &&
            reading.accuracyDegrees > CALIBRATION_ACCURACY_THRESHOLD_DEGREES,
        );
      }

      if (now - lastPublishAtRef.current >= PUBLISH_INTERVAL_MS) {
        lastPublishAtRef.current = now;
        publishSmoothedHeading();
      }
    };

    const handleScreenOrientation = () => {
      screenAngleRef.current = getScreenOrientationAngle();
      publishSmoothedHeading();
    };

    const detectionTimer = window.setTimeout(() => {
      if (lastSensorAtRef.current === 0) {
        updateCompassStatus(
          "unsupported",
          sawAnyOrientationEvent ? "relative-only" : "no-readings",
        );
      }
    }, SENSOR_DETECTION_TIMEOUT_MS);

    const watchdog = window.setInterval(() => {
      if (lastSensorAtRef.current === 0) return;

      if (window.performance.now() - lastSensorAtRef.current > SENSOR_STALE_AFTER_MS) {
        lastSensorAtRef.current = 0;
        lastSampleAtRef.current = 0;
        lastPublishedHeadingRef.current = null;
        smoothedMagneticHeadingRef.current = null;
        setHeading(null);
        updateCompassStatus("unreliable", "stale");
      }
    }, SENSOR_WATCHDOG_INTERVAL_MS);

    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation as EventListener,
      true,
    );
    window.addEventListener(
      "deviceorientation",
      handleOrientation as EventListener,
      true,
    );
    window.addEventListener("orientationchange", handleScreenOrientation);

    const screenOrientation = window.screen?.orientation;
    screenOrientation?.addEventListener?.("change", handleScreenOrientation);

    return () => {
      window.clearTimeout(detectionTimer);
      window.clearInterval(watchdog);
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation as EventListener,
        true,
      );
      window.removeEventListener(
        "deviceorientation",
        handleOrientation as EventListener,
        true,
      );
      window.removeEventListener("orientationchange", handleScreenOrientation);
      screenOrientation?.removeEventListener?.("change", handleScreenOrientation);
    };
  }, [sensorEnabled, sensorSession, updateCompassStatus]);

  const isCompassLive = effectiveCompassStatus === "active" && heading !== null;

  return {
    location,
    locationStatus,
    locationError,
    requestLocation,
    setManualLocation,
    qiblaBearing,
    distanceToKaabaKm,
    declination,
    declinationModelValid,
    compassSupported,
    requiresCompassPermission,
    compassStatus: effectiveCompassStatus,
    compassError: effectiveCompassError,
    compassSource,
    heading,
    compassAccuracyDegrees,
    needsCalibration,
    isCompassLive,
    startCompass,
    stopCompass,
  };
}
