# hireatech — Build Plan

Plan file generated from `spec.md` §14. Tick a task only when it is actually verified; mark a step done only after the owner confirms the "Check yourself" block passed. This file is updated as work proceeds — never silently rewrite history.

> **Current step:** Step 2 — Database (code complete + verified except the "stop service" test — needs owner with admin rights; see Status)

---

## Step 0 — Tools

- [x] Node.js installed and version confirmed (`node -v` → v26.7.0)
- [x] npm installed and version confirmed (`npm -v` → 11.19.0)
- [ ] Git installed and version confirmed (`git --version`) — *not yet verified in a session*
- [ ] PostgreSQL installed and version confirmed (`psql --version`)
- [ ] Postgres service running locally

**Files involved:** none (tooling only)

**Check yourself:** `node -v`, `npm -v`, `git --version`, `psql --version` each print a version.

**Status:** partially done — node/npm verified; git/psql still to confirm at start of Step 2.

---

## Step 1 — Project scaffold

- [x] Next.js app scaffolded: TypeScript, Tailwind, ESLint, App Router, `src/` directory
- [x] Dependencies from spec §3 installed (`pg`, `bcryptjs`, `zod`, `server-only`; dev: `tsx`, `@types/pg`)
- [x] `.env.example` created with placeholders only (§3.2)
- [x] `.gitignore` covers `.env*` (incl. `.env.local`) — verified by reading the file
- [x] No pages, routing, components or DB code added; starter page untouched
- [x] `npm install-scripts approve esbuild` → `allowScripts` in `package.json` (npm ≥11 install-scripts policy)
- [x] `package.json` renamed `hireatech`
- [x] `git init` + first commit (directory is not yet a git repo)

**Files involved:** `package.json`, `.gitignore`, `.env.example`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `src/app/*` (starter), `AGENTS.md`, `CLAUDE.md`, `plan.md`

**Check yourself:** `npm run dev` → `http://localhost:3000` shows the starter page (verified: HTTP 200); `npm run lint` passes (verified: clean).

**Status:** done — owner confirmed.

---

## Step 2 — Database

- [x] Confirm `psql` available (18.6, `C:\Program Files\PostgreSQL\18\bin`, not on PATH); database `hireatech` already existed (confirmed via MCP), so no creation needed
- [x] Create limited user `hireatech_app` + rights (SELECT/INSERT/UPDATE/DELETE + seq USAGE; DROP refused — verified); done via `db/setup.sql` + one ALTER ROLE for its password
- [x] Write `db/schema.sql`: all tables, indexes, constraints, `pg_trgm` + `fuzzystrmatch` extensions (spec §7)
- [x] Write `db/seed.sql`: 6 service categories + 31 search aliases only (spec §12)
- [x] Write `scripts/run-sql.ts` (+ npm scripts `db:setup`, `db:schema`, `db:seed`, `db:reset`; `db:reset` refuses when `NODE_ENV=production`)
- [x] Write `src/lib/db.ts`: `pg` Pool + `query()` helper, `import "server-only"`
- [x] Write `src/app/api/health/route.ts` (read-only GET) — note: `export const dynamic` is INVALID with cacheComponents on
- [x] Create real `.env.local` (app password generated `xobX2…`; ADMIN_* are placeholders — set before Step 5)
- [x] Verify: all 11 tables exist; both extensions; 6 categories; 31 aliases; `hireatech_app` can SELECT but cannot DROP (server error, no leak)
- [x] `http://localhost:3000/api/health` → `200 {"db":"ok"}` (verified live)
- [ ] Stop the Postgres service and reload `/api/health` → clean `503 {"db":"down"}`, no stack trace — **owner runs this (needs Windows admin rights)**
- [x] Update `plan.md`, commit (0764daf) — verified end-to-end in later tests: insert/read/remove cycles, constraint enforcement, slot + review uniqueness all correct

**Files involved:** `db/schema.sql`, `db/seed.sql`, `scripts/run-sql.ts`, `src/lib/db.ts`, `src/app/api/health/route.ts`, `package.json`, `.env.local`, `plan.md`

**Check yourself:** in `psql`: `\dt` lists all tables; `SELECT slug FROM service_categories;` returns 6 rows; `SELECT count(*) FROM category_aliases;` > 0; `http://localhost:3000/api/health` → `{"db":"ok"}`; stop Postgres service → reload health URL → clean error, no stack trace.

**Status:** in progress (next up).

---

## Step 3 — Layout and public pages

- [ ] Tailwind design tokens from §11 (colors, spacing, radii) in theme config / global CSS
- [ ] Fonts via `next/font`: warm serif/slab display + readable sans-serif body (not Inter)
- [ ] Header, footer, mobile menu (components under `src/components/layout/`)
- [ ] Home `/` (hero search box, category grid, 3-step how-it-works, service-area note, FAQ preview — no fake stats)
- [ ] `/how-it-works`, `/about`, `/help` (honest content, no invented phone numbers/24/7 claims)
- [ ] `/services` + `/services/[slug]` (category listing; `[slug]` page can render empty-ready)
- [ ] `not-found.tsx` (friendly 404 with links) and `error.tsx`
- [ ] Icons as inline SVG components (no emoji, no icon package)
- [ ] Update `plan.md`, commit

**Files involved:** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/how-it-works/`, `about/`, `help/`, `services/`, `not-found.tsx`, `error.tsx`, `src/components/layout/`, `src/components/ui/`

**Check yourself:** open each URL; DevTools device mode (phone width) → no horizontal scroll; Tab through header → visible focus; `/does-not-exist` → friendly 404.

**Status:** not started.

---

## Step 4 — Authentication

- [ ] zod validation schemas (name/email/phone/password rules, §13)
- [ ] `src/lib/auth/password.ts` — bcryptjs, cost 12 (8–64 chars, ≥1 letter + 1 digit)
- [ ] `src/lib/auth/session.ts` — random token, SHA-256 stored, httpOnly/sameSite cookie, 7-day expiry
- [ ] `src/lib/auth/guards.ts` — `getCurrentUser`, `requireUser`, `requireRole`, `requireApprovedTechnician`
- [ ] `src/lib/queries/users.ts` + `sessions.ts` — all SQL parameterized
- [ ] Server Actions: register (customer), login (equal-timing dummy compare, generic error), logout
- [ ] Login lockout: 5 failed attempts → 15-min lock (`failed_login_attempts`, `locked_until`); blocked users refused
- [ ] `/login`, `/register` pages + redirect rules (§5: `next` must be relative path; signed-in users routed to role home)
- [ ] Expired-session cleanup on login; password change deletes other sessions
- [ ] Update `plan.md`, commit

**Files involved:** `src/lib/auth/*`, `src/lib/queries/users.ts`, `sessions.ts`, `src/lib/validation/*`, `src/lib/actions/auth.ts`, `src/app/login/`, `src/app/register/`

**Check yourself:** register → `SELECT email, role, left(password_hash,4) FROM users;` shows `$2`; DevTools cookies → httpOnly session cookie; `SELECT * FROM sessions;` row exists, `token_hash` ≠ cookie value; logout removes row; signed-out `/bookings` → redirects to `/login`; wrong password ×6 → locked.

**Status:** not started.

---

## Step 5 — Admin bootstrap and categories

- [ ] `scripts/create-admin.ts` — reads `ADMIN_EMAIL`/`ADMIN_PASSWORD`, validates password rules, bcrypt-hashes, inserts admin; npm script `create-admin`
- [ ] Admin login works; `/admin` dashboard with counts
- [ ] `/admin/categories` — CRUD categories + aliases (Server Actions)
- [ ] Guards on all admin routes and actions (§6.4)
- [ ] Update `plan.md`, commit

**Files involved:** `scripts/create-admin.ts`, `package.json`, `src/app/admin/page.tsx`, `src/app/admin/categories/`, `src/lib/actions/admin.ts`, `src/lib/queries/categories.ts`

**Check yourself:** `npm run create-admin` → login as admin works; add a category → new row visible in `psql`; a customer account opening `/admin` is blocked.

**Status:** not started.

---

## Step 6 — Technician onboarding

- [ ] `/register/technician` — account + profession + experience + service area; users + `technician_profiles` in one transaction; lands as `pending`
- [ ] `/technician` dashboard with approval-status banner (pending/rejected with reason)
- [ ] `/technician/profile` (resubmission resets status to `pending`), `/technician/services`, `/technician/availability`
- [ ] `/admin/technicians` — pending list with Approve / Reject (+ required reason)
- [ ] Update `plan.md`, commit

**Files involved:** `src/app/register/technician/`, `src/app/technician/*`, `src/app/admin/technicians/`, `src/lib/actions/technician.ts`, `src/lib/queries/technicians.ts`

**Check yourself:** register a technician → `SELECT approval_status FROM technician_profiles;` = `pending`; technician does NOT appear on `/technicians`; admin approves → status `approved`, technician appears; rejection shows on the dashboard with reason.

**Status:** not started.

---

## Step 7 — Search and browse

- [ ] Query normalization helper (trim, lowercase, collapse spaces, strip punctuation, 60-char limit, escape `%`/`_`)
- [ ] `/technicians` search page: URL state (`q`, `category`, `area`, `day`, `sort`, `page`), zod-validated params with safe fallbacks
- [ ] Search SQL in `src/lib/queries/search.ts`: trgm similarity (category/alias first), name/title/area, fuzzystrmatch fallback, full-text (`simple`, `ts_rank`), weighted ranking, only approved + unblocked
- [ ] Filters (category, area, weekday, max price, min rating), sort whitelist (`rating`/`experience`/`price`/`best-match`), 12 per page, empty state with "Did you mean…?" + category shortcuts, loading/error states
- [ ] `/services/[slug]` reuses results component; `/technicians/[id]` profile page (initials avatar, AVGrating query, reviews, Request booking button)
- [ ] `GET /api/search/suggest?q=…` — up to 6 categories/aliases + names, read-only, parameterized
- [ ] Search-box suggestion dropdown component
- [ ] Update `plan.md`, commit

**Files involved:** `src/app/technicians/`, `src/services/[slug]/` (i.e. `src/app/services/[slug]/`), `src/app/technicians/[id]/`, `src/app/api/search/suggest/route.ts`, `src/lib/queries/search.ts`, `src/lib/validation/search.ts`, `src/components/technicians/`, `src/components/forms/search*`

**Check yourself:** search `plamber` and `bijuli` → right professions; `/api/search/suggest?q=plum` returns JSON; `'; DROP TABLE users; --` → no crash, `users` intact; weekday filter + rating sort work; URL reflects filters; optional `EXPLAIN ANALYZE` shows index use.

**Status:** not started.

---

## Step 8 — Customer account

- [ ] `/profile` — edit name/phone/email, change password (deletes other sessions)
- [ ] `/addresses` — add/edit/delete, one default per user (unique partial index already enforces it)
- [ ] Update `plan.md`, commit

**Files involved:** `src/app/profile/`, `src/app/addresses/`, `src/lib/actions/*`, `src/lib/queries/users.ts`, `addresses.ts`

**Check yourself:** changes appear in `users`/`addresses`; only one default address per user; changing password logs out other sessions.

**Status:** not started.

---

## Step 9 — Booking flow

- [ ] `src/lib/booking-status.ts` — single source of allowed status transitions + labels (pending never = "confirmed")
- [ ] `src/lib/trade-questions.ts` — per-trade extra questions (§9.3)
- [ ] `/booking/[technicianId]` — 7-step form A–G with per-step validation, back keeps data, no double-submit
- [ ] Address snapshot copy stored in `address_snapshot` (later edits don't leak in); "save address" is explicit opt-in
- [ ] Server-side checks: past date rejected, weekday/window must match availability, recipient fields when "other"
- [ ] Transaction: booking + `booking_status_history` + notification for technician
- [ ] `/bookings` (status filter) and `/bookings/[id]` (timeline, cancel when allowed)
- [ ] Update `plan.md`, commit

**Files involved:** `src/app/booking/[technicianId]/`, `src/app/bookings/`, `src/app/bookings/[id]/`, `src/lib/utils/booking-status.ts`, `datetime.ts`, `phone.ts`, `format.ts`, `trade-questions.ts`, `src/lib/queries/bookings.ts`, `notifications.ts`, `addresses.ts`, `src/lib/actions/booking.ts`, `src/components/bookings/`, `src/components/forms/`

**Check yourself:** after submit → new rows in `bookings`, `booking_status_history`, `notifications`; past date rejected server-side; later address edit does not change snapshot; customer B cannot open customer A's booking.

**Status:** not started.

---

## Step 10 — Technician job handling and notifications

- [ ] `/technician/requests` — pending requests with Accept / Reject (optional reason)
- [ ] Slot rule: one accepted/in-progress booking per technician/date/window (unique index + transaction)
- [ ] Accept → `in_progress` → `completed`; cancel with required reason (accepted→cancelled by technician)
- [ ] Customer cancel (pending/accepted → cancelled, optional reason)
- [ ] `/technician/bookings/[id]` with status buttons
- [ ] Header unread count + `/notifications` list with mark-as-read
- [ ] Update `plan.md`, commit

**Files involved:** `src/app/technician/requests/`, `src/app/technician/bookings/[id]/`, `src/app/notifications/`, `src/lib/actions/booking.ts`, `src/components/bookings/`

**Check yourself:** every status change adds `booking_status_history` + notification (same transaction); double-accept same slot → second fails; illegal transition (pending → completed) refused with 0 rows updated.

**Status:** not started.

---

## Step 11 — Reviews

- [ ] Review form on `/bookings/[id]` when completed and not yet reviewed (rating 1–5 required, comment ≤500 optional)
- [ ] Average rating + count on technician profile and search cards (computed via `AVG`/`COUNT`, not stored)
- [ ] Review enforcement: own booking only, completed only, one per booking (`reviews.booking_id` unique), server-validated

- [ ] Update `plan.md`, commit

**Files involved:** `src/app/bookings/[id]/`, `src/app/technicians/[id]/`, `src/lib/queries/reviews.ts`, `src/lib/actions/booking.ts` (or `review.ts`), `src/components/bookings/`

**Check yourself:** review blocked before `completed`; second review for same booking refused; `SELECT avg(rating) FROM reviews WHERE technician_id='…';` matches profile display.

**Status:** not started.

---

## Step 12 — Admin operations

- [ ] `/admin/bookings` — all bookings, status filter, cancel (any non-final)
- [ ] `/admin/users` — list, block/unblock (blocking deletes sessions), delete only when no bookings
- [ ] Self-protection: admin cannot block/delete themselves or the last admin
- [ ] Update `plan.md`, commit

**Files involved:** `src/app/admin/bookings/`, `src/app/admin/users/`, `src/lib/actions/admin.ts`, `src/lib/queries/users.ts`, `bookings.ts`

**Check yourself:** blocking a user kills sessions + login; deleting a user with bookings refused with clear message; last admin cannot be blocked or deleted.

**Status:** not started.

---

## Step 13 — Security and robustness pass

- [ ] Go through §10 checklist item by item (parameterized queries, whitelists, UUID validation, guards everywhere, CSP/headers in `next.config.ts`, no secrets committed, no raw error leaks)
- [ ] Run all 10 manual attack tests from §10 and record pass/fail in README
- [ ] Fix anything that fails; re-run until all pass
- [ ] Update `plan.md`, commit

**Files involved:** `next.config.ts`, `src/lib/queries/*` (review), `README.md`, `plan.md`

**Check yourself:** every §10 checkbox ticked; all 10 attack tests recorded pass/fail in README; repo search for `${` inside SQL strings finds nothing user-controlled.

**Status:** not started.

---

## Step 14 — Polish and docs

- [ ] Responsive + accessibility pass (focus rings, `aria-live` errors, labelled inputs, no console errors, no horizontal overflow)
- [ ] Full journey smoke test: technician registers → admin approves → customer searches → books → accept → in progress → completed → review
- [ ] README rewrite: install, DB setup, run, create-admin, commands, folder map, test-account instructions, security summary
- [ ] Fresh-clone test: follow README → app runs
- [ ] Final `plan.md` tidy-up, commit

**Files involved:** `README.md`, all UI files touched in the pass, `plan.md`

**Check yourself:** fresh clone → follow README → app runs end-to-end.

**Status:** not started.

---

## Decisions and notes

- Stack strictly per spec §3; no extra libraries without asking the owner first.
- npm ≥11 install-scripts: `allowScripts` lives in `package.json` (approving `esbuild` was required for `tsx`).
- Next.js 16 defaults kept: `cacheComponents` + `partialPrefetching` stay enabled in `next.config.ts`.
- Test accounts (customer/technician) are registered through the app during Steps 4–6 checks — never seeded.
- `plan.md` is a plan + progress log only: no code here.

## Changes log

| Date | Change | By |
|---|---|---|
| 2026-11-01 | File created from spec §14; Steps 0–1 statuses filled from actual session results | AI session |
| 2026-11-01 | `.env.example` un-ignored in `.gitignore` | AI session |
| 2026-11-01 | Git repo initialized (`main`), remote `origin` = github.com/pralhad00/hireAtech.git, first commit `f11cd14` | AI session |
| 2026-11-01 | Owner pushed to GitHub; `.opencode/` + `.claude/` git-ignored as local tool state (commit `8ea0ff9`) | AI session |
| 2026-11-01 | Step 2: `db/setup.sql`, `db/schema.sql`, `db/seed.sql`, `scripts/run-sql.ts` (+4 npm scripts), `src/lib/db.ts`, `/api/health`, real `.env.local`. Role `hireatech_app` created with generated password; verified tables/extensions/seed and limited-user rights; health 200. Extra npm script `db:setup` added beyond spec (kept rights repeate­dly grantable) | AI session |
| 2026-11-01 | Read-only `postgres` MCP server added in `opencode.json` (local, git-ignored) — used for verification, not app runtime | AI session |
| 2026-11-01 | Full DB verification: structure, constraints (role/FK/experience/slot/review-unique), sequence refs, cascade rules, seed idempotency. Transient add/remove exercise by owner request: 4 demo users + 2 tech profiles inserted then deleted (via `hireatech_app`, committed). Tables back to seed-only state. Owner still to run service-stop health test | AI session |
| 2026-11-01 | Installed `impeccable` design skill (v0.1.18 engine) into `.opencode/skills/impeccable` — stays local per the owner's rule (git-ignored). Spec §11 design tokens remain the binding design rules | AI session |
| 2026-11-01 | Moved impeccable to **global** install at owner request: skill + command now live in `C:\Users\ROG14\.config\opencode\` (available in every project); project-local copy under `.opencode/` removed | AI session |
| 2026-11-01 | `PRODUCT.md` created via impeccable init (owner confirmed live: spec.md authoritative; app will be publicly deployed → HTTPS/secure cookies are a real requirement). Committed as project documentation | AI session |
