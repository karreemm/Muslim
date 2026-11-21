import { NextResponse } from "next/server";
import {
  createSadaqaRecord,
  readSadaqaRecords,
} from "@/lib/sadaqaGarya/sadaqaGaryaStore";
import { getClientIp, isRateLimited } from "@/lib/apiSecurity";
import { logger } from "@/lib/logger";
import {
  buildDeleteTokenCookieValue,
  deleteTokenCookieName,
  readDeleteTokenMapFromRequest,
} from "@/lib/sadaqaGarya/sadaqaDeleteCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const tokens = readDeleteTokenMapFromRequest(req);
    const ownedSlugs = Object.keys(tokens);
    const ownedSet = new Set(ownedSlugs);

    // Only return memorials owned by this browser. Public memorial pages are
    // still available through `/api/sadaqa-garya/[slug]`.
    const allRecords = await readSadaqaRecords();
    const deceased = allRecords.filter((record) => ownedSet.has(record.slug));

    return NextResponse.json(
      { deceased, ownedSlugs },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logger.error("GET /api/sadaqa-garya failed:", error);
    return NextResponse.json(
      { error: "Failed to load records" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = isRateLimited(`sadaqa:create:${ip}`, 8, 60_000);
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

  try {
    const body = await req.json();
    const result = await createSadaqaRecord({
      nameEn: body?.nameEn,
      nameAr: body?.nameAr,
      messageEn: body?.messageEn,
      messageAr: body?.messageAr,
      slug: body?.slug,
    });

    const tokens = readDeleteTokenMapFromRequest(req);
    tokens[result.deceased.slug] = result.deleteToken;

    const response = NextResponse.json(
      { deceased: result.deceased, deleteToken: result.deleteToken },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
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
  } catch (error) {
    logger.error("POST /api/sadaqa-garya failed:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
