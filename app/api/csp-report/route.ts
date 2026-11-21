import { NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/apiSecurity";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;
const ALLOWED_CONTENT_TYPES = /application\/(csp-report|reports\+json|json)/i;

type UnknownRecord = Record<string, unknown>;

function asString(value: unknown, maxLength = 300): string | undefined {
  return typeof value === "string" ? value.slice(0, maxLength) : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeClassicReport(report: UnknownRecord) {
  return {
    documentUri: asString(report["document-uri"]),
    violatedDirective: asString(report["violated-directive"]),
    effectiveDirective: asString(report["effective-directive"]),
    blockedUri: asString(report["blocked-uri"]),
    sourceFile: asString(report["source-file"]),
    lineNumber: asNumber(report["line-number"]),
    sample: asString(report["script-sample"], 160),
  };
}

function normalizeReportingApiReport(report: UnknownRecord) {
  const body =
    report.body && typeof report.body === "object"
      ? (report.body as UnknownRecord)
      : report;

  return {
    documentUri: asString(body.documentURL ?? body["document-uri"]),
    violatedDirective: asString(body.violatedDirective ?? body["violated-directive"]),
    effectiveDirective: asString(body.effectiveDirective ?? body["effective-directive"]),
    blockedUri: asString(body.blockedURL ?? body["blocked-uri"]),
    sourceFile: asString(body.sourceFile ?? body["source-file"]),
    lineNumber: asNumber(body.lineNumber ?? body["line-number"]),
    sample: asString(body.sample ?? body["script-sample"], 160),
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = isRateLimited(`csp-report:${ip}`, 120, 60_000);

  // Silently drop excess reports instead of letting them fill logs.
  if (limit.limited) {
    return new NextResponse(null, { status: 204 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!ALLOWED_CONTENT_TYPES.test(contentType)) {
    return new NextResponse(null, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  try {
    const payload = JSON.parse(text) as UnknownRecord;

    if (payload["csp-report"] && typeof payload["csp-report"] === "object") {
      logger.warn(
        "CSP violation",
        normalizeClassicReport(payload["csp-report"] as UnknownRecord),
      );
    } else if (Array.isArray(payload)) {
      const reports = payload
        .filter(
          (report): report is UnknownRecord =>
            Boolean(report) && typeof report === "object",
        )
        .map(normalizeReportingApiReport);
      if (reports.length) logger.warn("CSP violation", reports);
    } else if (Array.isArray(payload.reports)) {
      const reports = payload.reports
        .filter(
          (report): report is UnknownRecord =>
            Boolean(report) && typeof report === "object",
        )
        .map(normalizeReportingApiReport);
      if (reports.length) logger.warn("CSP violation", reports);
    } else {
      logger.warn("CSP report with an unknown shape");
    }
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
}
