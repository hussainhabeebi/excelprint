// Merges our wrangler.jsonc bindings (from the generated `Env` interface in
// worker-configuration.d.ts — run `npm run cf:typegen` after editing
// wrangler.jsonc) into @opennextjs/cloudflare's `CloudflareEnv`, so
// `getCloudflareContext().env` is typed throughout the app.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- intentional declaration merging, not an empty type
  interface CloudflareEnv extends Env {}
}

export {};
