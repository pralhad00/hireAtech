# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

| Role | Who they are | Situation / job |
|---|---|---|
| Customer | Locals in Birtamod, Jhapa (Nepal), often on a phone | "My tap is leaking" — find a trustworthy technician fast, see price/experience/reviews, book a visit, follow the status, review afterwards |
| Technician | Local tradespeople (plumber, electrician, carpenter, …) | Get found, get bookings; register, wait for admin approval, list services/prices/availability, accept or reject requests, mark jobs done |
| Admin | Platform owner's admin account | Keep the platform trustworthy: approve/reject technicians, oversee bookings, manage categories and users |

Other audiences are not confirmed; do not invent any.

## Product Purpose

HireATech is a web platform where customers hire local technicians. Technicians register and are approved by an admin before they appear in search; customers browse, book, follow the booking status, and review after completion. Success means a full journey working end-to-end (register → approve → search → book → accept → in progress → completed → review) with a search experience intuitive enough that misspellings and local words still find the right profession.

## Positioning

- A **local, Birtamod-specific** booking platform — not a national listings site. Service area, NPR pricing, Nepali phone numbers, no postcodes.
- **Forgiving search is the teacher's priority and the product's differentiator:**
- **Trust through an approval chain:** admin-approved technicians, server-enforced booking status history, and reviews only on completed bookings — customers always pick a specific technician (there is no "post a job and wait for offers").
- **Honesty as policy:** no fake stats, testimonials, invented phone numbers, or 24/7 promises anywhere; pending requests are never labelled "confirmed"; "online payment — coming soon" is shown disabled rather than faked.

## Operating Context

- Service area: Birtamod, Jhapa (Nepal). ; Nepali mobile numbers (10 digits starting 96/97/98); no postcode/ZIP anywhere, but there will be list of common areas. 
- Users search with English trade names like leakage in draining pipe, fridge light is not working like that. 
- the owner needs to know what you are doing in simple english while writing the code: product work proceeds in small verified steps ("Check yourself" blocks after each step, per spec §14 / plan.md). The owner understands and verifies every part.
- everything is done after making plan and checklist of the work. like you have a plan.md file where you plan the mian things like creating home page, creating auth for customer, and than when we are in each phase of the plan we have planning for that work.
## Capabilities and Constraints

- **Confirmed:** three roles (customer/technician/admin) in one `users` table; hand-built auth (bcryptjs cost 12, hashed session tokens in httpOnly cookies, lockout 5 fails/15 min); zod validation server-side; booking 7-step form with status lifecycle `pending → accepted → in_progress → completed` plus `rejected`/`cancelled`; in-app notifications only (no SMS/email); reviews 1–5 stars + ≤500-char comment, one per booking; cash payment only.
- **Technical constraints (mandatory, from spec §0/§10):** PostgreSQL with raw SQL only — no ORM/query builder; every query parameterized via `pg`; all SQL in `src/lib/queries/`; state changes only through Server Actions; no libraries beyond spec §3 without asking; DB/auth code starts with `import "server-only"`; friendly error pages, never raw errors.
- **Within the product:** technician photos out of scope (initials avatars only); no file uploads, maps, chat, real payments, verification documents (§16).
- **Deployment (confirmed with owner Nov 2026):** the app will be publicly deployed. HTTPS-only with `secure` session cookies is therefore a real requirement, not theoretical.
- **Deliberately undecided:** concrete hosting provider/target.

## Brand Commitments

- **Name:** HireATech.
- **Verbal identity (binding):** honest, plain, calm copy — never overstate; no invented proof; status language exact ("Awaiting technician response", never "confirmed").
- **Visual tokens (binding, spec §11 as amended Nov 2026, owner-approved — Industrial Modernism):** primary olive `#414A2F`, off-white bg `#F2F0E8`, charcoal ink `#25271F`, white surfaces, light olive `#68734C`, warm border `#DCD9CC`, muted `#77786F` (large labels only; `#5E5F57` for small text), neutral surface `#E9E7DE`, success `#287A50`, warning `#B77A35`, error `#B7443D`. Sharp 0–4px radii, 1px borders, borders over shadows; 4px spacing base. No gradients, no purple/indigo, no glass/shadows, no emoji as icons, no piles of cards. Icons: Lucide (`lucide-react`). Typography: Space Grotesk display + Plus Jakarta Sans body, never Inter. Photography-led with honest photo slots until real assets exist. Full contract: `DESIGN.md`.

## Evidence on Hand

- **No real content:** no testimonials, stats, customer stories, press, photos, or logos exist. Future work must never fabricate any of these (spec §0 rule 7; AGENTS.md hard rule).
- **Real assets in repo:** `spec.md` (source of truth), `plan.md` (verified build progress), database seeded only with 6 service categories + 31 search aliases (real seed data, per §12). Test accounts are registered through the app, never seeded.

## Product Principles

1. **Nothing fake, ever** — empty states, honest placeholders and "coming soon" are the design language when reality is absent.
2. **Trust is verifiable, not claimed** — approval status, booking status history and reviews come from real product mechanisms, not badges or promises.
3. **Search forgives the visitor** — typos, sound-alikes and local Nepali words must still reach the right technician.
4. **Hard to break, boring to trust** — security and correct server-side enforcement outrank visual flourish; errors stay friendly and specific enough to act on.
5. **Small verified steps** — the build grows in increments the owner can check and explain.

## Accessibility & Inclusion

- Keyboard friendly with visible focus rings; forms use labelled inputs, errors announced (`role="alert"`/`aria-live`), focus moves to the first error.
- Mobile-first (customers arrive on phones); no horizontal overflow at any breakpoint; body text ≥16px on mobile, ≥14px for secondary text.
- Keep AA contrast; status is signalled by text plus colour, never colour alone.
