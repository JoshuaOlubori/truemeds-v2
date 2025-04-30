import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
    AI_MODEL: z.enum(["grok", "gemini"]).default("grok"),
    GEMINI_API_KEY: z.string().optional(),
  },

  experimental__runtimeEnv: process.env,
});
