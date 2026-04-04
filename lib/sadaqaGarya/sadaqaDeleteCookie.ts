const DELETE_COOKIE_NAME = "sadaqa_delete_tokens";

type DeleteTokenMap = Record<string, string>;

function parseCookieValue(
  cookieHeader: string,
  cookieName: string,
): string | undefined {
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!match) {
    return undefined;
  }

  const index = match.indexOf("=");
  if (index < 0) {
    return undefined;
  }

  const rawValue = match.slice(index + 1);
  if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
    return rawValue.slice(1, -1);
  }

  return rawValue;
}

function parseDeleteTokenMap(rawValue: string | undefined): DeleteTokenMap {
  if (!rawValue) {
    return {};
  }

  try {
    const decoded = decodeURIComponent(rawValue);
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed as DeleteTokenMap;
  } catch {
    return {};
  }
}

export function readDeleteTokenMapFromRequest(req: Request): DeleteTokenMap {
  const cookieHeader = req.headers.get("cookie") || "";
  const value = parseCookieValue(cookieHeader, DELETE_COOKIE_NAME);
  return parseDeleteTokenMap(value);
}

export function getDeleteTokenFromRequest(req: Request, slug: string): string {
  const tokens = readDeleteTokenMapFromRequest(req);
  return tokens[slug] || "";
}

export function buildDeleteTokenCookieValue(tokens: DeleteTokenMap): string {
  return encodeURIComponent(JSON.stringify(tokens));
}

export function deleteTokenCookieName(): string {
  return DELETE_COOKIE_NAME;
}
