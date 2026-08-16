import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** The single entry point for R2 access — never instantiate the binding inline elsewhere. */
export function getArtworkBucket(): R2Bucket {
  const { env } = getCloudflareContext();
  return env.ARTWORK_BUCKET;
}
