type LogLevel = "debug" | "info" | "warn" | "error";

const isDevelopment = process.env.NODE_ENV !== "production";

function write(level: LogLevel, ...args: unknown[]): void {
  if (level === "debug" && !isDevelopment) return;

  const method = level === "debug" ? "log" : level;
  console[method](...args);
}

/**
 * Small logging facade so app code does not call `console` directly.
 * `next.config.mjs` strips console output from production builds.
 */
export const logger = {
  debug: (...args: unknown[]) => write("debug", ...args),
  info: (...args: unknown[]) => write("info", ...args),
  warn: (...args: unknown[]) => write("warn", ...args),
  error: (...args: unknown[]) => write("error", ...args),
};
