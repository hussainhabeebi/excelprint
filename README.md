# Excel Printing Ajman

A full-stack e-commerce, print-product configurator, design-approval, and
production-management platform for Excel Printing (Ajman, UAE), built on
Next.js + Cloudflare Workers/D1/R2/Queues, Stripe, and fal.ai.

See [`AGENTS.md`](./AGENTS.md) for the full architecture reference, state
machines, pricing rules, and the non-negotiable rules every change must
follow.

## Status

**Phase 1 (Foundation) is complete.** Cloudflare/Next.js project scaffold,
full D1 schema + initial migration, the dynamic pricing engine, the order
state machine, scrypt-based session auth (customer + staff) with
role-based access control, and base layouts (marketing site, admin shell,
customer account shell, homepage) are in place. Phases 2–12 (catalog,
configurator UI wired to real data, cart/checkout, R2 artwork uploads,
fal.ai design generation, proofing UI, Stripe checkout, admin operations,
SEO landing pages, full test coverage) are not yet built — see the phase
list in `AGENTS.md` §9.

## Architecture

```
app/            Route segments (App Router)
  (marketing)/  Storefront: homepage, category/product browsing
  (auth)/       Customer login / register
  product/      Product detail + configurator (Phase 2/3)
  configure/    Standalone configurator flow (Phase 3)
  cart/         Shopping cart (Phase 4)
  checkout/     Checkout + Stripe (Phase 4/8)
  design/       Artwork upload / design request / AI generation (Phase 5/6)
  proofs/       Proof review + approval (Phase 7)
  orders/       Customer order tracking (Phase 10)
  account/      Customer dashboard (auth-gated)
  admin/        Staff dashboard, RBAC-gated per section (Phase 9)
  api/          Route handlers: auth, webhooks (Stripe, fal.ai)

components/     UI split by domain: ui (primitives), marketing, products,
                configurator, artwork, proofing, checkout, customer, admin

lib/            Domain services — auth, db, stripe, fal, r2, pricing,
                orders, seo, validation, security, notifications, config

workers/        Cloudflare Queue consumers: payments, ai-design,
                notifications, artwork-processing, order-processing

db/schema/      Drizzle ORM schema (source of truth for the D1 schema)
db/migrations/  Generated SQL migrations — committed, append-only
db/seed/        Local dev seed data (placeholder pricing/products)

tests/          Vitest unit/integration tests
```

Full entity list, state machines, and pricing formula: see `AGENTS.md`.

## Local development

Prerequisites: Node 20+, npm, a Cloudflare account (for D1/R2/Queues —
optional for pure UI work against seed data).

```bash
npm install
cp .env.example .env.local   # fill in what you have; see below
npm run dev                  # http://localhost:3000
```

Most of the app runs fine under plain `next dev`. Anything touching D1
(auth, cart, orders — i.e. most server code) needs a local D1 database
reachable through Wrangler's dev bindings:

```bash
# One-time: create the local D1 database Wrangler will use for `wrangler dev`
npx wrangler d1 create excelprint-db   # copy the returned database_id into wrangler.jsonc

npm run db:generate           # regenerate migrations after editing db/schema/*.ts
npm run db:migrate:local      # apply all migrations to the local D1 sqlite file
npm run db:seed:local         # load development seed data (placeholder products/pricing)

npm run cf:dev                # run through Wrangler with real D1/R2/Queues bindings
```

Run before every commit:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Cloudflare setup

1. `npx wrangler login`
2. Create resources per environment (dev is created above; repeat for preview/production with the `-preview`/`-production` names already referenced in `wrangler.jsonc`):
   ```bash
   npx wrangler d1 create excelprint-db-preview
   npx wrangler d1 create excelprint-db-production
   npx wrangler r2 bucket create excelprint-artwork
   npx wrangler r2 bucket create excelprint-artwork-preview
   npx wrangler r2 bucket create excelprint-artwork-production
   npx wrangler queues create excelprint-ai-design
   npx wrangler queues create excelprint-notifications
   npx wrangler queues create excelprint-artwork-processing
   npx wrangler queues create excelprint-order-processing
   ```
3. Paste the returned `database_id` values into `wrangler.jsonc` (root, `env.preview`, `env.production`).
4. Set secrets per environment: `npx wrangler secret put STRIPE_SECRET_KEY --env preview` (repeat for `TURNSTILE_SECRET_KEY`, `FAL_KEY`, `STRIPE_WEBHOOK_SECRET`).
5. Deploy: `npm run deploy:preview` / `npm run deploy:production` (builds via `@opennextjs/cloudflare`, then `wrangler deploy`).

## Stripe setup

1. Create a Stripe account/product in test mode.
2. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local` (and as Worker secrets for deployed environments).
3. Forward webhooks locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`, copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Order `payment_status` is only ever updated from the verified webhook handler — see `AGENTS.md` rule 5.

## fal.ai setup

1. Get an API key from fal.ai.
2. Set `FAL_KEY` as a server-only value (never `NEXT_PUBLIC_*`) — Phase 6 wires this into `lib/fal` and the `ai-design` Queue consumer.

## Deployment via GitHub + Cloudflare

Push to a branch → open a PR → CI (`.github/workflows/ci.yml`) runs lint,
typecheck, tests, and a production build. Merges to `main` are deployed
manually via `npm run deploy:production` (or wire a GitHub Actions deploy
job once the Cloudflare API token is added as a repo secret) — broken
branches are never auto-deployed.

## Environment variables

See [`.env.example`](./.env.example) for the full list: app URL, Cloudflare
account/API token/D1 database id, Turnstile keys, Stripe keys, fal.ai key,
and the `NEXT_PUBLIC_EXCEL_PRINTING_*` business-identity placeholders
(phone/address/hours/WhatsApp/VAT — intentionally blank until Excel
Printing supplies real values; see `AGENTS.md` §6).

## Known limitations (Phase 1)

- Product/category browsing, the configurator UI, cart, checkout, R2
  uploads, fal.ai generation, proofing UI, Stripe checkout, admin CRUD
  screens, and SEO landing pages are not yet implemented — only their
  routes/folders and, where applicable, backing schema exist.
- Cloudflare Turnstile is stubbed to auto-pass outside production
  (`lib/security/turnstile.ts`) until the widget is wired into forms.
- Email/SMS/WhatsApp notification delivery is schema-only
  (`notifications` table + `lib/notifications` interface); no channel is
  wired to a real provider yet.
- The admin dashboard and RBAC nav render live section access but all
  metrics are placeholders pending Phase 9.

## Next recommended phase

Phase 2 (Catalog): admin product/category CRUD, public category and
product listing pages backed by real D1 queries, and replacing the
homepage's placeholder product list with the seeded `products` table.
