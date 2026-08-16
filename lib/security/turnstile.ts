import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Whether this request is running against the production Cloudflare
 * environment. Deliberately NOT process.env.NODE_ENV — Next.js bakes
 * NODE_ENV=production into every built artifact (including `wrangler dev`
 * and preview deploys), so that check is always true outside raw
 * `next dev` and silently defeats the local/preview bypass below. APP_ENV
 * is our own wrangler.jsonc var and reflects the actual target environment.
 */
function isProductionEnv(): boolean {
  try {
    return getCloudflareContext().env.APP_ENV === "production";
  } catch {
    return false; // no Cloudflare context (e.g. plain `next dev`) — never production
  }
}

/**
 * Server-side Cloudflare Turnstile verification. The secret key must never
 * be exposed to the client — only NEXT_PUBLIC_TURNSTILE_SITE_KEY is public.
 * Wired into registration, login, quote requests, and any other public
 * form (spec section 25).
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    if (!isProductionEnv()) return true; // local/preview dev without Turnstile configured
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(VERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
