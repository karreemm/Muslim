import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LANGUAGE_COOKIE,
  defaultLocale,
  isLocale,
  resolveLocale,
  type Locale,
} from "@/lib/i18n";

function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const pathLocale = localeFromPath(pathname);

  if (pathLocale) {
    // Expose the resolved locale to special pages such as `global-not-found`,
    // which render outside the localized root layout.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", pathLocale);

    // Keep the saved language in sync with the URL so `/` can redirect
    // without guessing on the next visit.
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    if (request.cookies.get(LANGUAGE_COOKIE)?.value !== pathLocale) {
      response.cookies.set(LANGUAGE_COOKIE, pathLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const locale =
    resolveLocale({
      cookieLocale: request.cookies.get(LANGUAGE_COOKIE)?.value,
      acceptLanguage: request.headers.get("accept-language"),
    }) || defaultLocale;

  // Drop an unsupported two-letter locale segment (e.g. `/fr/read-quran`)
  // and re-home the path under a supported locale.
  const firstSegment = pathname.split("/")[1];
  const pathWithoutUnsupportedLocale = /^[a-z]{2}$/i.test(firstSegment)
    ? pathname.slice(3) || "/"
    : pathname;

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}${
    pathWithoutUnsupportedLocale === "/" ? "" : pathWithoutUnsupportedLocale
  }`;
  redirectUrl.search = search;

  const response = NextResponse.redirect(redirectUrl, 307);
  response.cookies.set(LANGUAGE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Run on page routes only. API routes, Next internals, metadata files,
     * and public assets keep their own paths.
     */
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|css|js|mjs|map|json|txt|xml|webmanifest)$).*)",
  ],
};
