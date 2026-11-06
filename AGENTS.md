# HireATech

Local-technician booking platform (Birtamod, Jhapa, Nepal). Next.js 16 App Router + TypeScript + Tailwind + PostgreSQL.

**`spec.md` is the source of truth.** It defines stack (§3), folder structure (§4), security checklist (§10), and build order (§14). When spec and code disagree, the spec wins. Once `CLAUDE.md` exists (§4 plans it: §0 rules + §10 checklist), read it too.

## Build status

- Done: Step 1 (scaffold), Step 2 (database), Step 3 (layout and public pages — owner re-check pending; see `plan.md` Status).
- Next: Step 4 — Authentication.
- Work in small steps per §14 / §0: finish and verify one step before the next; never generate the whole app. The owner is a student new to Next.js/TypeScript/SQL/auth — explain new concepts in plain English and end each step with a "Check yourself" block (exact commands, expected result).

## Hard rules (from spec §0, §10 — violating these fails the project)

- **Raw SQL only.** No ORM/query builder (Prisma, Drizzle, Sequelize, Knex, TypeORM, Kysely…). Every query is parameterized (`$1, $2…`) via `pg`. All SQL lives in `src/lib/queries/`.
- **No new libraries** beyond spec §3 without asking first (no UI kits, icon packages, Redux/Zustand, no auth libraries).
- **No demo/fake data.** Seed only categories + search aliases (§12); test accounts are registered through the app. Never invent stats, testimonials, phone numbers, or 24/7 promises.
- **DB/auth code starts with `import "server-only"`** (build fails if browser code pulls it in). `server-only`, `pg`, `bcryptjs`, `zod` are already installed.
- State changes go through Server Actions (`"use server"`), never through route handlers (the only two: read-only `/api/health` and `/api/search/suggest`).
- Pending bookings are never labelled "confirmed" in UI copy.

## Commands

- `npm run dev` → http://localhost:3000
- `npm run lint` (this scaffold's lint script is plain `eslint` — run it after changes)
- Future (§12, not implemented yet): `npm run db:schema`, `db:seed`, `db:reset`, `create-admin`.

## Environment

- `.env.local` (git-ignored, never commit) holds `DATABASE_URL`, `DATABASE_ADMIN_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — see `.env.example` for placeholders. Don't create `.env.local` for the user; the real values are theirs.

## Toolchain quirks

- **This Next.js is newer than typical training data.** Read the guide in `node_modules/next/dist/docs/` for unfamiliar APIs. `cacheComponents` + `partialPrefetching` are enabled in `next.config.ts`; don't remove them without asking.
- The block below is auto-added by `next dev` and must not be deleted.
- npm ≥11 blocks dependency install scripts unless allow-listed. This repo's `package.json` has an `allowScripts` field (`esbuild`, needed by `tsx`). If a new install warns "install scripts not yet covered by allowScripts", approve via `npm install-scripts approve <pkg>` so it lands in `package.json` (works for teammates too), not a personal `.npmrc`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
