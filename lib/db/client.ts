import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * The single entry point for D1 access. Route handlers and server
 * components must go through this — never instantiate drizzle(...) inline,
 * so every query benefits from the same schema types and (later) the same
 * query logging/tracing hook.
 */
export function getDb() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

export type Database = ReturnType<typeof getDb>;
