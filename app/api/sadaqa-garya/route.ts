import { NextResponse } from "next/server";
import {
  createSadaqaRecord,
  readSadaqaRecords,
} from "@/lib/sadaqaGarya/sadaqaGaryaStore";
import { getClientIp, isRateLimited } from "@/lib/apiSecurity";
import {
  buildDeleteTokenCookieValue,
  deleteTokenCookieName,
  readDeleteTokenMapFromRequest,
} from "@/lib/sadaqaGarya/sadaqaDeleteCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const deceased = await readSadaqaRecords();
    const tokens = readDeleteTokenMapFromRequest(req);
    const ownedSlugs = Object.keys(tokens);
    return NextResponse.json({ deceased, ownedSlugs }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load records";
    return NextResponse.json({ error: message }, { status: 500 });
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
      { status: 201 },
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
    const message =
      error instanceof Error ? error.message : "Failed to create record";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
