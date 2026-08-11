# Contributing

## Workflow

1. Branch from `main`.
2. Keep commits logically grouped (one concern per commit — e.g. "add D1 product schema" separate from "implement configurator UI").
3. Before opening a PR, run:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
   Fix any failures — do not open a PR with a broken build, failing lint, or failing tests.
4. If you changed `db/schema/*.ts`, run `npm run db:generate` and commit the generated migration in `db/migrations/`. Never hand-edit a committed migration.
5. Open a PR describing what changed and why.

## Rules

This repository has a set of non-negotiable rules in [`AGENTS.md`](./AGENTS.md) §2
(never trust frontend totals, never overwrite artwork versions, never mark
a payment paid from a browser redirect, etc.). Read them before making
changes to pricing, orders, artwork, proofs, or payments.

## Code style

- Strict TypeScript, no `any`.
- Server components by default; `"use client"` only where interaction requires it.
- No hardcoded prices, statuses, or business contact details — see `AGENTS.md` §6–7.
- Don't add abstractions or config beyond what the current task needs.
