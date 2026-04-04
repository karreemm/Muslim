import crypto from "crypto";
import { DeceasedPerson } from "@/app/(pages)/sadaqa-garya/types";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE =
  process.env.SUPABASE_SADAQA_TABLE || "sadaqa_garya_records";

interface CreateDeceasedInput {
  nameEn: string;
  nameAr: string;
  messageEn?: string;
  messageAr?: string;
  slug?: string;
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function buildSlug(base: string): string {
  return base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface SupabaseRecord {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  message_en: string;
  message_ar: string;
  created_at: string;
  delete_token_hash?: string | null;
}

export interface CreateSadaqaRecordResult {
  deceased: DeceasedPerson;
  deleteToken: string;
}

export type DeleteSadaqaRecordResult = "deleted" | "unauthorized" | "not_found";

function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
}

function mapSupabaseToApp(record: SupabaseRecord): DeceasedPerson {
  return {
    id: record.id,
    slug: record.slug,
    nameEn: record.name_en,
    nameAr: record.name_ar,
    messageEn: record.message_en,
    messageAr: record.message_ar,
    createdAt: record.created_at,
  };
}

function mapAppToSupabase(
  record: DeceasedPerson,
  deleteTokenHash: string,
): SupabaseRecord {
  return {
    id: record.id,
    slug: record.slug,
    name_en: record.nameEn,
    name_ar: record.nameAr,
    message_en: record.messageEn,
    message_ar: record.messageAr,
    created_at: record.createdAt,
    delete_token_hash: deleteTokenHash,
  };
}

function generateDeleteToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

function hashDeleteToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function supabaseHeaders(prefer?: string): HeadersInit {
  const headers: HeadersInit = {
    apikey: SUPABASE_SERVICE_ROLE_KEY || "",
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY || ""}`,
    "Content-Type": "application/json",
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  return headers;
}

async function supabaseRequest(
  endpoint: string,
  options: RequestInit,
): Promise<Response> {
  assertSupabaseConfig();

  return fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}${endpoint}`, options);
}

async function supabaseSlugExists(slug: string): Promise<boolean> {
  const response = await supabaseRequest(
    `?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
    {
      method: "GET",
      headers: supabaseHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed checking existing slug in Supabase");
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  return rows.length > 0;
}

async function readSadaqaRecordsFromSupabase(): Promise<DeceasedPerson[]> {
  const response = await supabaseRequest("?select=*", {
    method: "GET",
    headers: supabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load Sadaqa records from Supabase");
  }

  const rows = (await response.json()) as SupabaseRecord[];
  return rows.map(mapSupabaseToApp);
}

async function getSadaqaRecordBySlugFromSupabase(
  slug: string,
): Promise<DeceasedPerson | null> {
  const response = await supabaseRequest(
    `?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    {
      method: "GET",
      headers: supabaseHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Sadaqa record from Supabase");
  }

  const rows = (await response.json()) as SupabaseRecord[];
  if (rows.length === 0) {
    return null;
  }

  return mapSupabaseToApp(rows[0]);
}

async function createSadaqaRecordInSupabase(
  input: CreateDeceasedInput,
): Promise<CreateSadaqaRecordResult> {
  const nameEn = normalizeText(input.nameEn);
  const nameAr = normalizeText(input.nameAr);
  const messageEn = normalizeText(input.messageEn);
  const messageAr = normalizeText(input.messageAr);

  if (!nameEn || !nameAr) {
    throw new Error("nameEn and nameAr are required");
  }

  const requestedSlug = buildSlug(normalizeText(input.slug));
  const baseSlug = requestedSlug || buildSlug(nameEn) || "sadaqa";

  let slug = baseSlug;
  let counter = 1;
  // Keep app-level uniqueness behavior aligned across providers.
  while (await supabaseSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const createdAt = new Date().toISOString();
  const deceased: DeceasedPerson = {
    id: slug,
    nameEn,
    nameAr,
    messageEn,
    messageAr,
    slug,
    createdAt,
  };

  const deleteToken = generateDeleteToken();
  const deleteTokenHash = hashDeleteToken(deleteToken);

  const response = await supabaseRequest("", {
    method: "POST",
    headers: supabaseHeaders("return=representation"),
    body: JSON.stringify(mapAppToSupabase(deceased, deleteTokenHash)),
  });

  if (!response.ok) {
    throw new Error("Failed to create Sadaqa record in Supabase");
  }

  const rows = (await response.json()) as SupabaseRecord[];
  if (rows.length === 0) {
    return { deceased, deleteToken };
  }

  return {
    deceased: mapSupabaseToApp(rows[0]),
    deleteToken,
  };
}

async function deleteSadaqaRecordBySlugFromSupabase(
  slug: string,
  deleteToken: string,
): Promise<DeleteSadaqaRecordResult> {
  const normalizedSlug = normalizeText(slug);
  if (!normalizedSlug) {
    return "not_found";
  }

  const lookupResponse = await supabaseRequest(
    `?slug=eq.${encodeURIComponent(normalizedSlug)}&select=id,delete_token_hash&limit=1`,
    {
      method: "GET",
      headers: supabaseHeaders(),
      cache: "no-store",
    },
  );

  if (!lookupResponse.ok) {
    throw new Error("Failed to fetch Sadaqa record from Supabase");
  }

  const existingRows = (await lookupResponse.json()) as Array<{
    id: string;
    delete_token_hash?: string | null;
  }>;

  if (existingRows.length === 0) {
    return "not_found";
  }

  const storedHash = existingRows[0].delete_token_hash || "";
  // Legacy rows without token hash stay removable.
  if (storedHash && storedHash !== hashDeleteToken(deleteToken)) {
    return "unauthorized";
  }

  const response = await supabaseRequest(
    `?slug=eq.${encodeURIComponent(normalizedSlug)}&select=id`,
    {
      method: "DELETE",
      headers: supabaseHeaders("return=representation"),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete Sadaqa record from Supabase");
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  return rows.length > 0 ? "deleted" : "not_found";
}

export async function readSadaqaRecords(): Promise<DeceasedPerson[]> {
  return readSadaqaRecordsFromSupabase();
}

export async function getSadaqaRecordBySlug(
  slug: string,
): Promise<DeceasedPerson | null> {
  return getSadaqaRecordBySlugFromSupabase(slug);
}

export async function createSadaqaRecord(
  input: CreateDeceasedInput,
): Promise<CreateSadaqaRecordResult> {
  return createSadaqaRecordInSupabase(input);
}

export async function deleteSadaqaRecordBySlug(
  slug: string,
  deleteToken: string,
): Promise<DeleteSadaqaRecordResult> {
  return deleteSadaqaRecordBySlugFromSupabase(slug, deleteToken);
}
