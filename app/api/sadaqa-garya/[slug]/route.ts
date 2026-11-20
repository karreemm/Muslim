import { NextResponse } from "next/server";
import {
  deleteSadaqaRecordBySlug,
  getSadaqaRecordBySlug,
} from "@/lib/sadaqaGarya/sadaqaGaryaStore";
import { getClientIp, isRateLimited } from "@/lib/apiSecurity";
import { logger } from "@/lib/logger";
import {
  buildDeleteTokenCookieValue,
  deleteTokenCookieName,
  getDeleteTokenFromRequest,
  readDeleteTokenMapFromRequest,
} from "@/lib/sadaqaGarya/sadaqaDeleteCookie";

export const runtime = "nodejs";

function safeDecodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw || "").trim();
  } catch {
    return "";
  }
}

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await context.params;
  const slug = safeDecodeSlug(rawSlug);

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const deceased = await getSadaqaRecordBySlug(slug);

    if (!deceased) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { deceased },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logger.error("GET /api/sadaqa-garya/[slug] failed:", error);
    return NextResponse.json(
      { error: "Failed to load record" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const ip = getClientIp(req);
  const limit = isRateLimited(`sadaqa:delete:${ip}`, 10, 60_000);
  if (limit.limited) {
    return NextResponse.json(
      { error: "Too many requests. Try again soon." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSec),
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      },
    );
  }

  const { slug: rawSlug } = await context.params;
  const slug = safeDecodeSlug(rawSlug);

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const headerDeleteToken = req.headers.get("x-sadaqa-delete-token")?.trim() || "";
  const cookieDeleteToken = getDeleteTokenFromRequest(req, slug);
  const deleteToken = headerDeleteToken || cookieDeleteToken;
  if (!deleteToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let deleted: Awaited<ReturnType<typeof deleteSadaqaRecordBySlug>>;
  try {
    deleted = await deleteSadaqaRecordBySlug(slug, deleteToken);
  } catch (error) {
    logger.error("DELETE /api/sadaqa-garya/[slug] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (deleted === "not_found") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (deleted === "unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokens = readDeleteTokenMapFromRequest(req);
  delete tokens[slug];

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set({
    name: deleteTokenCookieName(),
    value: buildDeleteTokenCookieValue(tokens),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
