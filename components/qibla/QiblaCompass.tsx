"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Compass as CompassIcon, Loader2, LocateFixed, MapPin } from "lucide-react";
import GovernorateSelector from "@/app/[locale]/(pages)/prayer-times/components/GovernorateSelector";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageQuote } from "@/components/ui/PageQuote";
import { PageShell } from "@/components/ui/PageShell";
import { cn } from "@/components/ui/cn";
import { egyptianGovernorates } from "@/constants/egyptianGovernorates";
import { ROUTE_QUOTES } from "@/constants/routeQuotes";
import { useTranslation } from "@/hooks/general/useTranslation";
import {
  type CompassErrorCode,
  type LocationErrorCode,
  useQibla,
} from "@/hooks/useQibla";
import {
  calculateDistanceBetween,
  getArrowAlignmentError,
  normalizeDegrees,
  toRadians,
} from "@/lib/qibla";

const COMPASS_TICKS = Array.from({ length: 36 }, (_, index) => index * 10);
const COMPASS_NUMBERS = Array.from({ length: 12 }, (_, index) => index * 30);

/**
 * Degree labels share one radial band. The baseline is placed from the ink
 * ascent so the glyph box stays centered at the same radius for every label,
 * including the flipped ones. The band sits 1.25 units inward from the
 * ring/ticks midpoint, so the ring side keeps a wider gap while the gap to the
 * tick caps stays unchanged (the tick starts move inward by the same amount).
 */
const COMPASS_LABEL_FONT_SIZE = 9;
const COMPASS_LABEL_INK_ASCENT = 7;
const COMPASS_LABEL_RING_GAP_OFFSET = 1.25;
const COMPASS_LABEL_INK_CENTER_RADIUS = 143.05 - COMPASS_LABEL_RING_GAP_OFFSET;
const COMPASS_TICK_START_Y = 24.5 + COMPASS_LABEL_RING_GAP_OFFSET;
const COMPASS_LABEL_BASELINE_Y =
  160 - COMPASS_LABEL_INK_CENTER_RADIUS + COMPASS_LABEL_INK_ASCENT / 2;
const COMPASS_LABEL_FLIP_PIVOT_Y = 160 - COMPASS_LABEL_INK_CENTER_RADIUS;

/**
 * Live-compass alignment. The arrow angle is screen-relative, so alignment
 * means the arrow points at the fixed 12 o'clock marker, never at the dial's
 * rotating 0° tick (which marks north, not the Qibla). Once aligned, the state
 * stays until the user turns away.
 */
const ALIGNMENT_ENTER_DEGREES = 5;
const ALIGNMENT_EXIT_DEGREES = 7;
const ALIGNMENT_HOLD_MS = 200;

const LOCATION_ERROR_KEYS: Record<LocationErrorCode, string> = {
  "permission-denied": "qibla.locationDenied",
  "position-unavailable": "qibla.locationUnavailable",
  timeout: "qibla.locationTimeout",
  unsupported: "qibla.locationUnavailable",
  "insecure-context": "qibla.locationInsecure",
  "invalid-coordinates": "qibla.locationInvalid",
  unknown: "qibla.locationUnavailable",
};

const COMPASS_ERROR_KEYS: Record<CompassErrorCode, string> = {
  unsupported: "qibla.calculatedCompassUnavailable",
  "permission-denied": "qibla.compassDenied",
  "permission-request-failed": "qibla.compassUnavailable",
  "insecure-context": "qibla.compassInsecure",
  "no-readings": "qibla.calculatedCompassUnavailable",
  "relative-only": "qibla.calculatedCompassUnavailable",
  stale: "qibla.compassStale",
  "location-required": "qibla.locationRequired",
  unknown: "qibla.compassUnavailable",
};

function formatNumber(
  value: number,
  language: "en" | "ar",
  maximumFractionDigits = 1,
): string {
  return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function QiblaCompass() {
  const { t, language } = useTranslation();
  const {
    location,
    locationStatus,
    locationError,
    requestLocation,
    setManualLocation,
    qiblaBearing,
    distanceToKaabaKm,
    compassSupported,
    requiresCompassPermission,
    compassStatus,
    compassError,
    heading,
    needsCalibration,
    isCompassLive,
    startCompass,
  } = useQibla();

  const [manualGovernorate, setManualGovernorate] = useState<{
    en: string;
    ar: string;
  } | null>(null);
  const manualSelectionRef = useRef(false);

  const [isQiblaAligned, setIsQiblaAligned] = useState(false);
  const alignedRef = useRef(false);
  const alignHoldTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      typeof navigator.permissions?.query !== "function"
    ) {
      return;
    }

    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (
          !cancelled &&
          status.state === "granted" &&
          !manualSelectionRef.current &&
          !location
        ) {
          requestLocation();
        }
      })
      .catch(() => {
        // Permission state is unavailable; the explicit action still works.
      });

    return () => {
      cancelled = true;
    };
  }, [location, requestLocation]);

  const currentLocationLabel = t("qibla.currentLocation");
  const chooseGovernorateLabel = t("qibla.chooseGovernorate");

  const nearestGovernorate = useMemo(() => {
    if (!location) return null;

    let nearest: (typeof egyptianGovernorates)[number] | null = null;
    let nearestDistanceKm = Number.POSITIVE_INFINITY;

    for (const governorate of egyptianGovernorates) {
      const distanceKm = calculateDistanceBetween(location, {
        latitude: governorate.latitude,
        longitude: governorate.longitude,
      });

      if (distanceKm < nearestDistanceKm) {
        nearestDistanceKm = distanceKm;
        nearest = governorate;
      }
    }

    return nearestDistanceKm <= 75 ? nearest : null;
  }, [location]);

  const currentLocationName = nearestGovernorate
    ? nearestGovernorate[language]
    : currentLocationLabel;

  const selectedGovernorate = manualGovernorate ??
    nearestGovernorate ?? {
      en: chooseGovernorateLabel,
      ar: chooseGovernorateLabel,
    };

  const hasLocation = location !== null;
  const displayHeading = isCompassLive && heading !== null ? heading : 0;
  const roseAngle = normalizeDegrees(-displayHeading);
  const arrowAngle =
    qiblaBearing === null ? 0 : normalizeDegrees(qiblaBearing - displayHeading);
  const arrowRadians = toRadians(arrowAngle);
  const kaabaX = 160 + 90 * Math.sin(arrowRadians);
  const kaabaY = 160 - 90 * Math.cos(arrowRadians);

  const arrowAlignmentError =
    isCompassLive && qiblaBearing !== null ? getArrowAlignmentError(arrowAngle) : null;

  useEffect(() => {
    const clearHoldTimer = () => {
      if (alignHoldTimeoutRef.current !== null) {
        clearTimeout(alignHoldTimeoutRef.current);
        alignHoldTimeoutRef.current = null;
      }
    };

    if (arrowAlignmentError === null) {
      clearHoldTimer();
      alignedRef.current = false;
      setIsQiblaAligned(false);
      return;
    }

    if (alignedRef.current) {
      // Small hysteresis keeps the marker steady while the sensor jitters;
      // otherwise the aligned state persists until the user turns away.
      if (arrowAlignmentError > ALIGNMENT_EXIT_DEGREES) {
        alignedRef.current = false;
        setIsQiblaAligned(false);
      }
      return;
    }

    if (arrowAlignmentError > ALIGNMENT_ENTER_DEGREES) {
      clearHoldTimer();
      return;
    }

    if (alignHoldTimeoutRef.current !== null) return;

    alignHoldTimeoutRef.current = setTimeout(() => {
      alignHoldTimeoutRef.current = null;
      alignedRef.current = true;
      setIsQiblaAligned(true);
    }, ALIGNMENT_HOLD_MS);
  }, [arrowAlignmentError]);

  useEffect(() => {
    return () => {
      if (alignHoldTimeoutRef.current !== null) {
        clearTimeout(alignHoldTimeoutRef.current);
      }
    };
  }, []);

  const bearingText = useMemo(
    () => (qiblaBearing === null ? null : `${formatNumber(qiblaBearing, language, 1)}°`),
    [language, qiblaBearing],
  );

  const distanceInfo = useMemo(() => {
    if (distanceToKaabaKm === null) return null;

    if (distanceToKaabaKm < 1) {
      return {
        value: formatNumber(distanceToKaabaKm * 1000, language, 0),
        unitKey: "qibla.m",
      };
    }

    return {
      value: formatNumber(distanceToKaabaKm, language, distanceToKaabaKm < 100 ? 1 : 0),
      unitKey: "qibla.km",
    };
  }, [distanceToKaabaKm, language]);

  const locationRequesting = locationStatus === "requesting";
  const locationActionVisible =
    !hasLocation &&
    locationError !== "insecure-context" &&
    locationError !== "unsupported";
  const compassRequesting = compassStatus === "requesting";
  const compassActionVisible =
    hasLocation &&
    compassSupported === true &&
    compassStatus !== "active" &&
    compassStatus !== "denied" &&
    compassStatus !== "unsupported" &&
    compassError !== "insecure-context";

  const compassActionLabel =
    compassStatus === "requesting"
      ? t("qibla.startingCompass")
      : compassStatus === "unreliable" || compassStatus === "error"
        ? t("qibla.retryCompass")
        : requiresCompassPermission
          ? t("qibla.allowCompass")
          : t("qibla.enableCompass");

  const compassHintKey = compassError
    ? COMPASS_ERROR_KEYS[compassError]
    : "qibla.calculatedHint";

  const compassAriaLabel =
    qiblaBearing === null
      ? t("qibla.locationRequired")
      : isCompassLive
        ? t("qibla.ariaLive", { bearing: Math.round(qiblaBearing) })
        : t("qibla.ariaCalculated", { bearing: Math.round(qiblaBearing) });

  const handleGovernorateChange = (governorate: { en: string; ar: string }) => {
    const selected = egyptianGovernorates.find((item) => item.en === governorate.en);
    if (!selected) return;

    if (!setManualLocation(selected.latitude, selected.longitude)) return;

    manualSelectionRef.current = true;
    setManualGovernorate({ en: selected.en, ar: selected.ar });
  };

  const handleRequestLocation = () => {
    manualSelectionRef.current = false;
    requestLocation();
  };

  return (
    <PageShell
      width="content"
      decorations={
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      }
    >
      <PageHeader
        title={t("qibla.title")}
        subtitle={t("qibla.subtitle")}
        quote={<PageQuote quote={ROUTE_QUOTES.qibla} />}
      />

      <div className="mx-auto w-full max-w-2xl">
        <Card className="card-pad">
          <div className="flex flex-col items-center">
            {locationRequesting ? (
              <div className="mb-5 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground">
                <span>{t("qibla.locating")}</span>
                <Loader2
                  className="h-4 w-4 motion-safe:animate-spin"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <>
                <div className="mb-3 flex w-full items-center gap-3">
                  <div
                    className="flex min-w-0 items-center gap-2"
                    role="group"
                    aria-label={t("qibla.location")}
                  >
                    <MapPin
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {location?.source === "gps" ? (
                      <span className="truncate text-sm font-semibold text-foreground">
                        {currentLocationName}
                      </span>
                    ) : (
                      <GovernorateSelector
                        selectedGovernorate={selectedGovernorate}
                        onGovernorateChange={handleGovernorateChange}
                        language={language}
                      />
                    )}
                  </div>
                </div>

                {locationError ? (
                  <p
                    role="alert"
                    className="mb-3 max-w-md text-center text-sm text-destructive"
                  >
                    {t(LOCATION_ERROR_KEYS[locationError])}
                  </p>
                ) : null}

                {isCompassLive ? (
                  <div className="relative mb-5 w-full max-w-md">
                    <p
                      aria-hidden={isQiblaAligned || undefined}
                      className={cn(
                        "text-center text-sm text-muted-foreground",
                        isQiblaAligned && "invisible",
                      )}
                    >
                      {t("qibla.liveHint")}
                    </p>
                    {isQiblaAligned ? (
                      <div
                        role="status"
                        aria-live="polite"
                        className="absolute inset-0 flex flex-col items-center justify-center text-center"
                      >
                        <p className="text-sm font-semibold text-primary">
                          {t("qibla.alignedTitle")}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("qibla.alignedSubtitle")}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : hasLocation ? (
                  <div className="mb-5 flex w-full flex-col items-center gap-3">
                    <p className="max-w-md text-center text-sm text-muted-foreground">
                      {t(compassHintKey)}
                    </p>
                    {compassActionVisible ? (
                      <Button
                        variant="secondary"
                        onClick={startCompass}
                        disabled={compassRequesting}
                        size="lg"
                        className="w-full border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 sm:w-auto sm:min-w-52"
                      >
                        {compassRequesting ? (
                          <Loader2
                            className="h-4 w-4 motion-safe:animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <CompassIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span>{compassActionLabel}</span>
                      </Button>
                    ) : null}
                  </div>
                ) : locationActionVisible ? (
                  <div className="mb-5 flex w-full justify-center">
                    <Button
                      variant="secondary"
                      onClick={handleRequestLocation}
                      size="lg"
                      className="w-full border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 sm:w-auto sm:min-w-52"
                    >
                      <LocateFixed className="h-4 w-4" aria-hidden="true" />
                      <span>{t("qibla.useMyLocation")}</span>
                    </Button>
                  </div>
                ) : null}
              </>
            )}

            <div className="relative mx-auto w-full max-w-[27rem]">
              <div
                className="pointer-events-none absolute inset-10 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
              />
              {isCompassLive ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full"
                >
                  <span
                    className={cn(
                      "block h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent",
                      isQiblaAligned ? "border-t-primary" : "border-t-primary/45",
                    )}
                  />
                </div>
              ) : null}
              <svg
                viewBox="0 0 320 320"
                className="relative h-auto w-full"
                role="img"
                aria-label={compassAriaLabel}
              >
                <circle
                  cx="160"
                  cy="160"
                  r="154"
                  fill="currentColor"
                  className="text-card"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="154"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  className="text-primary"
                />

                <g transform={`rotate(${roseAngle} 160 160)`} className="text-foreground">
                  {COMPASS_TICKS.map((angle) => {
                    const primary = angle % 180 === 0;
                    const secondary = angle % 90 === 0;
                    const labelled = angle % 30 === 0;

                    return (
                      <line
                        key={angle}
                        x1="160"
                        y1={COMPASS_TICK_START_Y}
                        x2="160"
                        y2={primary ? 34.4 : secondary ? 32.5 : labelled ? 30 : 27.5}
                        transform={`rotate(${angle} 160 160)`}
                        stroke="currentColor"
                        strokeWidth={
                          primary ? 2.2 : secondary ? 1.7 : labelled ? 1.2 : 0.7
                        }
                        strokeOpacity={
                          primary ? 0.95 : secondary ? 0.75 : labelled ? 0.55 : 0.42
                        }
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>

                {COMPASS_NUMBERS.map((angle) => {
                  const primary = angle % 180 === 0;
                  const secondary = angle % 90 === 0;
                  const screenAngle = normalizeDegrees(angle + roseAngle);
                  const flipped = screenAngle > 90 && screenAngle < 270;

                  return (
                    <g key={angle} transform={`rotate(${screenAngle} 160 160)`}>
                      <text
                        x="160"
                        y={COMPASS_LABEL_BASELINE_Y}
                        dx="0.196em"
                        transform={
                          flipped
                            ? `rotate(180 160 ${COMPASS_LABEL_FLIP_PIVOT_Y})`
                            : undefined
                        }
                        textAnchor="middle"
                        fill="currentColor"
                        fillOpacity={primary ? 1 : secondary ? 0.82 : 0.62}
                        className={cn(
                          "text-foreground",
                          secondary ? "font-semibold" : "font-medium",
                        )}
                        fontSize={COMPASS_LABEL_FONT_SIZE}
                      >
                        {angle}°
                      </text>
                    </g>
                  );
                })}

                <circle
                  cx="160"
                  cy="160"
                  r="124"
                  fill="currentColor"
                  className="text-secondary/40"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="124"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.7"
                  className="text-border"
                />

                {qiblaBearing !== null ? (
                  <>
                    <g
                      transform={`rotate(${arrowAngle} 160 160)`}
                      className="text-primary"
                    >
                      <line
                        x1="160"
                        y1="150"
                        x2="160"
                        y2="98"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </g>

                    <circle
                      cx="160"
                      cy="160"
                      r="6"
                      fill="currentColor"
                      className="text-primary"
                    />

                    <g transform={`translate(${kaabaX - 20} ${kaabaY - 20})`}>
                      <circle
                        cx="20"
                        cy="20"
                        r="26"
                        fill="currentColor"
                        className="text-primary/10"
                        aria-hidden="true"
                      />
                      <image
                        href="/qibla/kaaba.png"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden="true"
                      />
                    </g>
                  </>
                ) : null}
              </svg>
            </div>

            <div className="mt-5 flex w-full items-center justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <p className="type-meta">{t("qibla.bearing")}</p>
                <p
                  dir="ltr"
                  className="mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl"
                >
                  {bearingText ?? "—"}
                </p>
              </div>

              <div className="h-10 w-px bg-border/60" aria-hidden="true" />

              <div className="text-center">
                <p className="type-meta">{t("qibla.distance")}</p>
                <p
                  dir="ltr"
                  className="mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl"
                >
                  {distanceInfo ? (
                    <>
                      {distanceInfo.value}{" "}
                      <span className="text-sm font-medium text-muted-foreground">
                        {t(distanceInfo.unitKey)}
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>

            {isCompassLive && needsCalibration ? (
              <p className="mt-3 max-w-md text-center text-xs text-muted-foreground">
                {t("qibla.calibrationHint")}
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default QiblaCompass;
