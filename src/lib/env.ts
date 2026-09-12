import { z } from "zod";

/**
 * Typed environment. Parsed at module load so a missing variable fails
 * immediately instead of surfacing later inside a Supabase call.
 *
 * NEXT_PUBLIC_* values are referenced explicitly so Next.js can include
 * them correctly in both server and browser bundles.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string("NEXT_PUBLIC_SUPABASE_URL is required")
    .min(1, "NEXT_PUBLIC_SUPABASE_URL is required")
    .refine((v) => v.startsWith("http://") || v.startsWith("https://"), {
      message: "NEXT_PUBLIC_SUPABASE_URL must be an http(s) URL",
    }),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string("NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

  NEXT_PUBLIC_SITE_URL: z
    .string("NEXT_PUBLIC_SITE_URL is required")
    .min(1, "NEXT_PUBLIC_SITE_URL is required"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function parseEnv(
  source: Record<string, string | undefined>,
): AppEnv {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}

export const env: AppEnv = parseEnv({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
