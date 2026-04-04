type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "unknown";
}

export function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number,
): { limited: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      limited: false,
      remaining: Math.max(maxRequests - 1, 0),
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }

  current.count += 1;
  rateLimitStore.set(key, current);

  const limited = current.count > maxRequests;
  const remaining = Math.max(maxRequests - current.count, 0);
  const retryAfterSec = Math.max(Math.ceil((current.resetAt - now) / 1000), 1);

  return { limited, remaining, retryAfterSec };
}
