import { NextResponse } from "next/server";
import {
  deleteSadaqaRecordBySlug,
  getSadaqaRecordBySlug,
} from "@/lib/sadaqaGarya/sadaqaGaryaStore";
import { getClientIp, isRateLimited } from "@/lib/apiSecurity";
import {
  buildDeleteTokenCookieValue,
  deleteTokenCookieName,
  getDeleteTokenFromRequest,
  readDeleteTokenMapFromRequest,
} from "@/lib/sadaqaGarya/sadaqaDeleteCookie";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await context.params;
  const slug = decodeURIComponent(rawSlug || "").trim();

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const deceased = await getSadaqaRecordBySlug(slug);

  if (!deceased) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ deceased }, { status: 200 });
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
  const slug = decodeURIComponent(rawSlug || "").trim();

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const headerDeleteToken =
    req.headers.get("x-sadaqa-delete-token")?.trim() || "";
  const cookieDeleteToken = getDeleteTokenFromRequest(req, slug);
  const deleteToken = headerDeleteToken || cookieDeleteToken;
  if (!deleteToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await deleteSadaqaRecordBySlug(slug, deleteToken);

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