import type { RequestHandler } from "msw";

/**
 * Shared MSW handlers.
 *
 * Add handlers here when a test needs to fake an external API. Keep them
 * deterministic and free of real network calls.
 */
export const handlers: RequestHandler[] = [];
