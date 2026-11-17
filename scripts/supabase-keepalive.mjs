#!/usr/bin/env node

/**
 * Supabase keep-alive ping.
 *
 * Supabase free projects pause after 7 days without activity. This script runs a
 * tiny read-only query against the Sadaqa table so the project stays active.
 *
 * Usage:
 *   node scripts/supabase-keepalive.mjs
 *   npm run keepalive
 *
 * Required environment variables:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 *   SUPABASE_SADAQA_TABLE (defaults to sadaqa_garya_records)
 *
 * Exit codes:
 *   0  ping succeeded
 *   1  configuration error or all attempts failed
 */

const DEFAULT_TABLE = "sadaqa_garya_records";
const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 15_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readConfig() {
  const rawUrl = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const table = (process.env.SUPABASE_SADAQA_TABLE || DEFAULT_TABLE).trim();

  const missing = [];
  if (!rawUrl) missing.push("SUPABASE_URL");
  if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!table) missing.push("SUPABASE_SADAQA_TABLE");

  if (missing.length > 0) {
    throw new Error(`Missing environment variable(s): ${missing.join(", ")}`);
  }

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("SUPABASE_URL is not a valid URL");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("SUPABASE_URL must use http or https");
  }

  return {
    baseUrl: rawUrl.replace(/\/+$/, ""),
    key,
    table,
  };
}

async function pingOnce({ baseUrl, key, table }) {
  const endpoint = `${baseUrl}/rest/v1/${encodeURIComponent(table)}?select=id&limit=1`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    // Do not print the response body: it may contain project details.
    throw new Error(`Supabase responded with HTTP ${response.status}`);
  }

  const rows = await response.json().catch(() => []);
  const count = Array.isArray(rows) ? rows.length : 0;
  return { status: response.status, count };
}

async function main() {
  const config = readConfig();
  console.log(
    `[keepalive] Pinging Supabase table "${config.table}" (max ${MAX_ATTEMPTS} attempts)...`,
  );

  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await pingOnce(config);
      console.log(
        `[keepalive] OK — HTTP ${result.status}, rows returned: ${result.count}`,
      );
      return;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[keepalive] Attempt ${attempt}/${MAX_ATTEMPTS} failed: ${message}`);

      if (attempt < MAX_ATTEMPTS) {
        const delay = attempt * 2_000;
        console.log(`[keepalive] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`All ${MAX_ATTEMPTS} attempts failed. Last error: ${message}`);
}

main().catch((error) => {
  console.error(
    `[keepalive] FAILED: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
