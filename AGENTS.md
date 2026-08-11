<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Excel Printing Ajman

This file governs how any agent (human or AI) works in this repository. It
is the source of truth for architecture, conventions, and the rules that
must never be broken. If a task seems to require breaking one of the rules
in section 2, stop and ask rather than working around it.

## 1. What this system is

A commercial e-commerce + print-product configurator + design-approval +
production-management platform for Excel Printing, a printing/branding
business in Ajman, UAE. The primary user journey is:

```
Homepage → Choose Product → Configure → See Price → Choose Design Method
  → Upload / Request Design / AI Design → Add to Cart → Checkout
  → Artwork Review → Proof → Approval → Production → Delivery
```

Four surfaces share one codebase:

- **Main site** — storefront (`app/(marketing)`, `app/product`, `app/configure`, `app/cart`, `app/checkout`)
- **Customer account** — `app/account`, `app/orders`, `app/design`, `app/proofs`
- **Admin** — `app/admin` (orders, products, pricing, quotes, payments, SEO, reports)
- **Designer area** — the design queue and proofing tools inside `app/admin`, scoped to the `DESIGNER` role via RBAC

## 2. Rules that must never be broken

1. **Never trust totals from the frontend.** Every price the customer pays
   is recalculated server-side at checkout from `lib/pricing/engine.ts`
   plus current `pricing_rules` rows. A client-supplied total/unit price is
   never written to `orders`/`order_items`.
2. **Never expose API secrets.** `STRIPE_SECRET_KEY`, `TURNSTILE_SECRET_KEY`,
   `FAL_KEY`, Cloudflare API tokens, and admin secrets are read only in
   server code (route handlers, server components, Workers) — never in a
   `NEXT_PUBLIC_*` variable, client component, or response body.
3. **Never overwrite artwork versions.** `artwork_versions` rows are
   append-only. A revision (customer upload, designer edit, AI draft,
   print-ready file) always inserts a new row with an incremented
   `version_number`; `artworks.current_version_id` is updated to point at
   it. No `UPDATE`/`DELETE` on `artwork_versions`.
4. **Never modify an approved proof.** `proof_approvals` rows are
   immutable once written. If artwork changes after approval, set
   `invalidated_at` on the old approval and create a new proof/approval
   cycle — never mutate the approved file or the approval row itself.
5. **Never mark a Stripe payment paid based only on a browser redirect.**
   `orders.payment_status` only ever transitions from a verified webhook
   handler (`app/api/webhooks/stripe`) that checks the Stripe signature and
   reads `payment_events`. The client-side success page reflects
   optimistic UI state, not the source of truth.
6. **Never hardcode product prices or configuration into the frontend.**
   The configurator renders `products` / `product_options` /
   `product_option_values` / `quantity_tiers` / `pricing_rules` — a new
   product or a new price never requires a code deploy.
7. **Never break an existing D1 migration.** Migrations in `db/migrations`
   are append-only history. To change the schema, add a new migration file
   (`npm run db:generate` after editing `db/schema/*.ts`) — never hand-edit
   or delete a committed migration.
8. **Every significant schema change requires a migration.** No manual
   `ALTER TABLE` against a deployed database outside the migration
   pipeline.
9. **Every order status change must be logged.** Any write to
   `orders.status` is paired, in the same logical operation, with an
   `order_status_history` insert (`old_status`, `new_status`, `actor_type`,
   `actor_id`). Use `lib/orders/state-machine.ts` to validate the
   transition before writing either row.
10. **AI-generated artwork is never automatically print-ready.** Output
    from `lib/fal` always lands as an `ai_generations` row and an
    `artwork_versions` row with `source = 'AI_GENERATION'` and a non-final
    `status`. It must pass through designer review before a proof is sent
    to the customer — see the artwork state machine below.

## 3. Architecture

**Stack:** Next.js (App Router, TypeScript, strict mode) on Cloudflare
Workers via `@opennextjs/cloudflare`, Cloudflare D1 (SQLite, via Drizzle
ORM) for relational data, Cloudflare R2 for all file storage, Cloudflare
Queues for async work, Cloudflare Turnstile for bot mitigation, Stripe for
payments, fal.ai for AI design drafts, Tailwind CSS v4 + hand-rolled
shadcn/ui-pattern primitives in `components/ui`.

```
app/            Route segments (App Router). Route groups: (marketing), (auth).
                Server components by default; "use client" only where interaction requires it.
components/     UI, grouped by domain (marketing, products, configurator, artwork,
                proofing, checkout, customer, admin) + components/ui primitives.
lib/            Framework-agnostic domain/service code — auth, db, stripe, fal, r2,
                pricing, orders, seo, validation, security, notifications, config.
workers/        Cloudflare Queue consumer entry points (payments, ai-design,
                notifications, artwork-processing, order-processing).
db/schema/      Drizzle schema — the single source of truth for the D1 schema.
db/migrations/  Generated, committed SQL migrations (npm run db:generate). Never hand-edit.
db/seed/        Local development seed data. Placeholder pricing only — see AGENTS.md §2.
tests/          Vitest unit/integration tests.
```

**Money:** every amount is an integer in fils (AED cents) — `*_cents`
columns and fields throughout. Never use floating point for money.

**IDs:** `crypto.randomUUID()` text primary keys. Human-facing identifiers
(`order_number`, `quote_number`) are separate columns, not the primary key.

**Status enums:** `lib/orders/constants.ts` is the single source of truth
for `OrderStatus`, `ArtworkStatus`, `PaymentStatus`, `QuoteStatus`,
`StaffRole`, etc. Drizzle schema columns use `text({ enum: [...] })`
against these same arrays. Never redefine a status list elsewhere, and
never compare against a raw string literal — import the constant.

### Order state machine

```
DRAFT → AWAITING_ARTWORK → DESIGN_REQUIRED → DESIGN_IN_PROGRESS
  → AWAITING_APPROVAL → (CHANGES_REQUESTED → DESIGN_IN_PROGRESS)* → APPROVED
  → AWAITING_PAYMENT → PAID → QUEUED_FOR_PRINT → PRINTING → FINISHING
  → QUALITY_CHECK → (READY_FOR_PICKUP | OUT_FOR_DELIVERY) → COMPLETED
```

`CANCELLED` is reachable from every state up to and including `PRINTING`
(not from `FINISHING` onward — production too far along to abandon
silently; use a refund/support flow instead). Transitions are enforced by
`lib/orders/state-machine.ts::assertValidOrderTransition` — call it before
every status write.

### Artwork state machine

```
ARTWORK_REQUIRED → ARTWORK_RECEIVED → DESIGN_IN_PROGRESS → PROOF_READY
  → (CHANGE_REQUESTED → REVISION_IN_PROGRESS → PROOF_READY)* → FINAL_PROOF_READY
  → APPROVED → PRINT_READY
```

Every transition through `PROOF_READY`/`FINAL_PROOF_READY` creates a
`proofs` row; every customer decision creates a `proof_comments` and/or
`proof_approvals` row. AI drafts (`ai_generations`) enter this flow only
after a human designer promotes one to an `artwork_versions` row — they
never skip straight to `PROOF_READY`.

### Payment state machine

```
UNPAID → PENDING → PAID → (PARTIALLY_REFUNDED | REFUNDED)
UNPAID/PENDING → FAILED
```

Driven exclusively by `app/api/webhooks/stripe` after signature
verification, reading/writing `payments` and `payment_events`
(`payment_events.provider_event_id` is unique — webhook handling must be
idempotent against Stripe retries).

## 4. Pricing rules

`lib/pricing/engine.ts::calculatePrice` is the only place price math
happens. Formula: `base (unit price × qty) + material + printing +
finishing + addons + design fee + urgency fee + delivery fee − discount +
VAT`. FIXED modifiers add a flat `amountCents`; PERCENT modifiers apply
against the base subtotal (unit price × qty), never against a running
total, so results are independent of modifier evaluation order — this is
covered by `tests/unit/pricing-engine.test.ts` and must stay true for any
change to the engine.

Every `order_items` row stores the full engine output in
`pricing_breakdown_snapshot` at the moment the order is placed. A later
change to `pricing_rules` must never alter the price of an existing order
— always read historical totals from the snapshot, never recompute them.

## 5. Security requirements

- All input crossing a trust boundary (API route body, form submission) is
  validated with a Zod schema from `lib/validation` before touching the
  database.
- Every `app/admin/**` route is gated by `getCurrentUser()` +
  `lib/auth/rbac.ts` (`requireStaffSection`/`requireStaffRole`), not by UI
  hiding alone.
- Passwords are hashed with scrypt (`lib/auth/password.ts`) — Workers has
  no native bcrypt; do not add a bcrypt dependency requiring native
  bindings.
- Sessions store only a SHA-256 hash of the token in D1
  (`lib/auth/session.ts`); the raw token lives solely in an httpOnly,
  secure, `SameSite=Lax` cookie.
- File uploads: validate MIME type, extension, and size before writing to
  R2; never trust a client-supplied content-type header alone.
- Cloudflare Turnstile (`lib/security/turnstile.ts`) guards every public
  form that doesn't require a login (register, login, quote request).
- Every significant admin/system mutation calls
  `lib/security/audit.ts::writeAuditLog` — price changes, order status
  changes, artwork uploads, proof approvals, payment status changes,
  refunds, role changes.

## 6. Business information

Never invent Excel Printing's phone number, address, hours, WhatsApp
number, Google Maps link, VAT number, official pricing, delivery charges,
or company history. These come from `lib/config/business.ts`, which reads
`NEXT_PUBLIC_EXCEL_PRINTING_*` environment variables and renders nothing
when a value is unset — UI must handle the empty case gracefully rather
than showing a placeholder that looks real.

## 7. Coding conventions

- Strict TypeScript, no `any`. Server components by default; add
  `"use client"` only where interaction/state requires it.
- Status/role values always come from `lib/orders/constants.ts` — never a
  string literal duplicated elsewhere.
- Keep components small and domain-scoped under the matching
  `components/<domain>` folder.
- Don't add abstractions, config flags, or backwards-compatibility shims
  for hypothetical future requirements — build what the current phase
  needs.

## 8. Testing expectations

Vitest for business logic: the pricing engine, order/artwork/payment state
transitions, discount handling, Stripe webhook signature verification,
proof approval invalidation, artwork versioning, and RBAC checks are the
minimum bar (spec §42). Run `npm run lint && npm run typecheck && npm test
&& npm run build` before considering any change complete.

## 9. Implementation phases

Built in the order defined in the original spec (§48): Foundation → Catalog
→ Configurator → Cart/Checkout → Artwork → AI Design → Proofing → Payments
→ Admin Ops → Customer Dashboard → SEO → Testing/Production readiness. See
README.md for current phase status. Do not jump ahead into a later phase's
scope inside a change targeting an earlier one.
