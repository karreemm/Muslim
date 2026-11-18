import { z } from "zod";

const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  SUPABASE_SADAQA_TABLE: z
    .string()
    .optional()
    .transform((value) => value?.trim() || "sadaqa_garya_records"),
});

const hadithEnvSchema = z.object({
  HADITH_API_KEY: z
    .string()
    .min(1, "HADITH_API_KEY is not configured. Add it to .env.local."),
  HADITH_API_BASE_URL: z
    .string()
    .optional()
    .transform((value) => value?.trim() || "https://hadithapi.com/api")
    .pipe(z.string().url("HADITH_API_BASE_URL must be a valid URL")),
});

export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;
export type HadithEnv = z.infer<typeof hadithEnvSchema>;

export function getSupabaseEnv(): SupabaseEnv {
  return supabaseEnvSchema.parse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SADAQA_TABLE: process.env.SUPABASE_SADAQA_TABLE,
  });
}

export function getHadithEnv(): HadithEnv {
  return hadithEnvSchema.parse({
    HADITH_API_KEY: process.env.HADITH_API_KEY || process.env.NEXT_PUBLIC_HADITH_API_KEY,
    HADITH_API_BASE_URL:
      process.env.HADITH_API_BASE_URL ||
      process.env.NEXT_PUBLIC_HADITH_API_BASE_URL ||
      "https://hadithapi.com/api",
  });
}
