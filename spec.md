# HireATech — Project Specification

A web platform where customers hire local technicians (plumbers, electricians, carpenters, etc.). Technicians register, get approved by an admin, list their services, prices, experience and availability, and accept or reject bookings. Customers browse technicians, book an appointment, follow the booking status, and review the technician after the job is completed.

- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + PostgreSQL with **raw SQL only** (`pg` library). No ORM.
- **Replaces:** the earlier `BLUEPRINT.md` (React/Vite + mock data + localStorage). Its UI ideas, validation rules, booking steps and design tokens are carried over below. Its mock data layer is **removed**.
- **Service area:** Birtamod, Jhapa (Nepal). Currency: NPR. Phone format: Nepali mobile numbers. No postcode/ZIP anywhere.

---

## 0. Rules for the AI (read first, follow always)

The owner is a student who knows JavaScript well but is **new to Next.js, TypeScript, SQL libraries and auth**. The goal is that the owner **understands and can verify every part**, not just that the app works.

1. **Work in small steps.** Follow the build order in §14. Finish and verify one step before starting the next. Never generate the whole app at once.
2. **Explain as you go.** For every new library, file or concept, say in 1–2 plain sentences what it is and why it is used.
3. **End every step with a "Check yourself" block**: exact commands or URLs the owner can run to verify the step worked (database queries in `psql`, URLs to open, what to look for in the browser DevTools), and the expected result. §14 lists the checks per step.
4. **Raw SQL only.** No ORM or query builder (no Prisma, Drizzle, Sequelize, Knex, TypeORM, Kysely). All SQL lives in `src/lib/queries/`.
5. **Every query is parameterized** (`$1, $2, …`). Never build SQL by concatenating or interpolating user input. See §10.
6. **Security is the highest priority.** The checklist in §10 is mandatory, not optional.
7. **No demo/fake data.** Do not create fake technicians, customers or bookings. Only service categories, search aliases and one admin account (via script) are seeded (§12).
8. **Do not add libraries** that are not listed in §3 without saying why and asking first.
9. If something in this spec is unclear or conflicts with itself, **ask** instead of guessing.
10. Keep the code readable: small files, clear names, comments only where the "why" is not obvious.

---

## 1. Requirements analysis

### 1.1 Users and goals

| User | Goal | Typical situation |
|---|---|---|
| **Customer** | Find a trustworthy technician fast and book a visit | "My tap is leaking" — on a phone, wants a plumber available soon, wants to see price, experience and reviews |
| **Technician** | Get found, get bookings, manage jobs | Registers, waits for approval, lists services/prices/availability, accepts or rejects requests, marks jobs done |
| **Admin** | Keep the platform trustworthy and tidy | Approves/rejects technicians, oversees bookings, manages categories and users |

### 1.2 Core journey

1. Technician registers → chooses profession → fills profile, services (with prices), experience, availability → status **pending**.
2. Admin approves → technician becomes visible in search.
3. Customer searches/browses → opens a technician profile → sees services, prices, experience, availability, reviews.
4. Customer signs in (or registers) → submits a booking request (status **pending**).
5. Technician **accepts or rejects**. Customer sees the status change and gets an in-app notification.
6. Technician marks the job **in progress**, then **completed**.
7. Customer leaves a **review** (1–5 stars + optional comment) for the completed booking.

There is **no** "post a job and wait for offers" feature. Customers always pick a technician.

### 1.3 Search requirements (teacher priority)

- Search must be **intuitive**: one prominent search box, forgiving of typos, filters that make sense, results that explain themselves.
- Must support **phonetic / similar-sounding search** ("plamber", "plumbar" → Plumber; "bijuli" → Electrician).
- Details in §8.

### 1.4 Non-functional requirements

- **Security first** (§10). **Never crash:** friendly error pages, no raw error messages shown to users.
- **Intuitive UI/UX** (§11): clear labels, visible states (loading/empty/error/success), mobile-first, keyboard friendly.

---

## 2. Roles and permissions

One `users` table with a `role` column: `customer`, `technician`, `admin`.

| Capability | Visitor | Customer | Technician | Admin |
|---|---|---|---|---|
| Browse/search approved technicians, view profiles and reviews | ✓ | ✓ | ✓ | ✓ |
| Register / log in | ✓ | | | |
| Manage own profile, change password | | ✓ | ✓ | ✓ |
| Manage saved addresses | | ✓ | | |
| Create booking, cancel own booking, review completed booking | | ✓ | | |
| Edit technician profile, services, availability | | | ✓ | |
| Accept/reject/progress/complete/cancel bookings assigned to them | | | ✓ | |
| Approve/reject technicians | | | | ✓ |
| View/cancel any booking | | | | ✓ |
| Manage categories and aliases | | | | ✓ |
| Block/unblock/delete users | | | | ✓ |

**Authorization is enforced on the server** for every page and every Server Action/route handler (§10). Hiding a button is never the only protection.

---

## 3. Tech stack and dependencies

| Piece | Purpose |
|---|---|
| **Node.js + npm** | Runs JavaScript outside the browser; installs libraries |
| **Next.js (App Router)** | Pages, routing and backend code in one project |
| **React** | UI components (bundled with Next.js) |
| **TypeScript** | Typed JavaScript; catches mistakes early |
| **Tailwind CSS** | Styling with utility classes; design tokens live in its theme config |
| **`pg`** (+ `@types/pg`) | PostgreSQL driver; runs parameterized raw SQL through a connection pool |
| **`bcryptjs`** | Password hashing (pure JS, no native build problems) |
| **`zod`** | Server-side validation of all incoming data |
| **`server-only`** | Makes the build fail if server code (DB, auth) is accidentally imported into client code |
| **`lucide-react`** | UI icons (amended Nov 2026, owner-approved). Tree-shakeable; imported per-icon, never the whole package |
| **shadcn/ui** (+ its generated-component dependency family: `class-variance-authority`, `clsx`, `tailwind-merge`, Radix UI primitives) | Copy-in UI component base (amended Nov 2026, owner-approved). Components are generated into `src/components/ui/` and owned by this repo — not a runtime UI kit. Components are restyled to the §11 Industrial Modernism tokens (no shadcn defaults like shadows/pill radii) |
| **`framer-motion`** | Motion library (amended Nov 2026, owner-approved) for subtle, purposeful micro-interactions only (accordion expand, menu transitions, state feedback). Still banned: scroll parallax, entrance-animation spam, decorative floaters (§11) |
| **`tsx`** (dev) | Runs TypeScript scripts (`create-admin`, `run-sql`) |
| **ESLint** | Comes with Next.js; catches bad patterns |

- Use the versions that are current when scaffolding. Do not add UI kits beyond **shadcn/ui** (amended), state libraries (Redux, Zustand), auth libraries (Auth.js, Better Auth, Passport) or any ORM. (`lucide-react` is the one approved icon library, now also shadcn/ui's default icon set; `clsx`, `tailwind-merge`, `class-variance-authority` and Radix UI primitives are approved **only** as shadcn/ui's dependency family. No others.)
- Icons: **Lucide** (`lucide-react`), used sparingly (§11). Fonts: `next/font` — Space Grotesk (geometric grotesk, display) plus Plus Jakarta Sans (body); **not Inter**.
- State: React state and small Context only where needed (e.g. booking stepper). Server data comes from Server Components and Server Actions.

### 3.1 How the browser talks to the server

- **Server Components** (default): pages that read from the database directly on the server.
- **Server Actions**: functions marked `"use server"`, called from forms, used for **every state-changing operation** (register, login, book, accept, etc.).
- **Route Handlers** (`app/api/.../route.ts`): only two, both read-only `GET`: `/api/health` and `/api/search/suggest`.
- Server Actions return `{ ok: true, data } | { ok: false, error: { message, fieldErrors? } }`.

### 3.2 Environment variables (`.env.local`, never committed; provide `.env.example`)

```
DATABASE_URL=postgres://hireatech_app:CHANGE_ME@localhost:5432/hireatech
DATABASE_ADMIN_URL=postgres://postgres:CHANGE_ME@localhost:5432/hireatech
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=CHANGE_ME_LONG_PASSWORD
```

- `DATABASE_URL`: used by the running app; a **limited** Postgres user (§10).
- `DATABASE_ADMIN_URL`: used only by `scripts/run-sql.ts` to create tables/extensions.
- `ADMIN_*`: read only by `scripts/create-admin.ts`.

---

## 4. Folder structure

```text
hireatech/
├── .env.example
├── README.md                       # how to install, set up DB, run, create admin, test
├── CLAUDE.md                       # copy §0 rules and §10 checklist here
├── next.config.ts                  # security headers
├── db/
│   ├── schema.sql                  # all tables, indexes, extensions (§7)
│   └── seed.sql                    # categories + aliases only (§12)
├── scripts/
│   ├── run-sql.ts                  # npm run db:schema / db:seed / db:reset (dev only)
│   └── create-admin.ts             # npm run create-admin
└── src/
    ├── app/
    │   ├── layout.tsx, globals.css, not-found.tsx, error.tsx
    │   ├── page.tsx                           # Home
    │   ├── how-it-works/ about/ help/
    │   ├── services/ and services/[slug]/
    │   ├── technicians/ and technicians/[id]/
    │   ├── login/ register/ register/technician/ forgot-password/
    │   ├── booking/[technicianId]/ bookings/ bookings/[id]/
    │   ├── profile/ addresses/ notifications/
    │   ├── technician/ (dashboard, profile, services, availability, requests, bookings/[id])
    │   ├── admin/ (dashboard, technicians, bookings, categories, users)
    │   └── api/health/route.ts  api/search/suggest/route.ts
    ├── components/                 # ui/, forms/, layout/, feedback/, technicians/, bookings/
    └── lib/
        ├── db.ts                   # pg Pool + query helper (server-only)
        ├── auth/                   # password.ts, session.ts, guards.ts
        ├── queries/                # ALL SQL lives here: users, sessions, categories, technicians, search, bookings, reviews, notifications, addresses
        ├── actions/                # Server Actions grouped by area (auth, booking, technician, admin, …)
        ├── validation/             # zod schemas (phone, email, dates, booking, etc.)
        ├── trade-questions.ts      # per-trade extra booking questions (§9.3)
        └── utils/                  # booking-status.ts, datetime.ts, phone.ts, format.ts
```

**Boundaries:** pages/components = UI only. `queries/` = the only place SQL appears. `actions/` = validate → authorize → call queries → return result. `lib/` files that touch DB/auth start with `import "server-only"`.

---

## 5. Pages and routes

Access: **Public**, **Auth** (any signed-in user), **Customer**, **Technician**, **Admin**.

### Public

| Route | Job |
|---|---|
| `/` | Landing page: hero with search box, category grid, 3-step "how it works", service-area note, FAQ preview. No fake stats or testimonials. |
| `/services` | All active categories |
| `/services/[slug]` | Approved technicians in one category (reuses search results component) |
| `/technicians` | Search + filters + sort + pagination (§8) |
| `/technicians/[id]` | Profile: photo-less avatar (initials), profession, bio, experience, area, services with prices, weekly availability, average rating, reviews, **Request booking** button |
| `/login`, `/register` | Sign in / customer sign-up |
| `/register/technician` | Technician sign-up (account + profession + experience + service area); lands as `pending` |
| `/forgot-password` | Placeholder page only (no email sending); honest message |
| `/how-it-works`, `/about`, `/help` | Honest information pages; no invented phone numbers or 24/7 promises |
| not-found | Friendly 404 with links to Services and How it works |

### Customer (signed in)

| Route | Job |
|---|---|
| `/booking/[technicianId]` | 7-step booking form (§9.2) |
| `/bookings` | My bookings with status filter |
| `/bookings/[id]` | Details, status timeline, Cancel (when allowed), Leave review (when completed and not yet reviewed) |
| `/profile` | Edit name, phone, email; change password |
| `/addresses` | Add/edit/delete saved addresses; choose default |
| `/notifications` | In-app status updates, mark as read |

### Technician (role `technician`)

| Route | Job |
|---|---|
| `/technician` | Dashboard: approval status banner (pending/rejected with reason), counts of new requests and upcoming jobs |
| `/technician/profile` | Edit profession, headline, bio, experience, service area. If rejected, allows resubmission (status returns to `pending`) |
| `/technician/services` | Add/edit/remove services with title, description, price and price type |
| `/technician/availability` | Choose weekdays and time windows (morning/afternoon/evening) |
| `/technician/requests` | Pending booking requests with Accept / Reject |
| `/technician/bookings/[id]` | Job details; Mark in progress / Mark completed / Cancel with reason |

Technicians that are not `approved` can edit their profile but cannot receive bookings and do not appear in search.

### Admin (role `admin`)

| Route | Job |
|---|---|
| `/admin` | Counts: users, pending technicians, bookings by status |
| `/admin/technicians` | Pending list with Approve / Reject (+ reason); list of approved |
| `/admin/bookings` | All bookings, filter by status; can cancel |
| `/admin/categories` | Add/edit/deactivate categories; manage search aliases |
| `/admin/users` | List users; block/unblock; delete only if the user has no bookings |

### Redirect rules

- Signed-out user opening an Auth/Customer/Technician/Admin route → `/login?next=<original path>`; after login go back (validate `next` is a relative path starting with `/` to prevent open redirects).
- Signed-in user opening `/login` or `/register` → their home (`customer` → `/bookings`, `technician` → `/technician`, `admin` → `/admin`).
- Wrong role for a route → 404 or "not allowed" page (no data leaked).
- Invalid or unknown IDs in URLs → the not-found page, never a crash.

---

## 6. Authentication and sessions

Written by hand (no auth library) so every piece is visible and explainable.

### 6.1 Registration
- Validate with zod → check email not already used (case-insensitive) → hash password with **bcryptjs (cost 12)** → insert user. Technician registration inserts `users` + `technician_profiles` in **one transaction**.
- Role is decided by **which action runs**, never by a value sent from the browser.
- Password rules: 8–64 characters (bcrypt only uses the first 72 bytes), at least one letter and one number.

### 6.2 Login
- Look up user by `lower(email)`. If not found, still run a bcrypt compare against a dummy hash (equal timing).
- Wrong email or wrong password → the **same** message: "Incorrect email or password."
- After **5 failed attempts**, lock the account for 15 minutes (`failed_login_attempts`, `locked_until`). Reset on success.
- Blocked users (`is_blocked`) cannot log in.
- On success: create a **new** session (never reuse an old token).

### 6.3 Sessions
- Token = 32 random bytes (`crypto.randomBytes`), hex. **Only the SHA-256 hash is stored** in `sessions.token_hash`; the raw token exists only in the cookie.
- Cookie: `httpOnly`, `sameSite=lax`, `secure` in production, `path=/`, expires in 7 days. Same expiry stored in the DB.
- Each request: read cookie → hash → look up session joined with user → reject if expired, missing or user blocked.
- Logout deletes the session row and clears the cookie. Changing password deletes the user's other sessions. Blocking a user deletes all their sessions.
- Expired sessions are cleaned up opportunistically (e.g. on login).

### 6.4 Guards (`src/lib/auth/guards.ts`)
- `getCurrentUser()` → user or null.
- `requireUser()`, `requireRole(role)`, `requireApprovedTechnician()` → redirect or throw.
- **Call a guard at the top of every protected page and every Server Action.** Server Actions are public HTTP endpoints; they must never assume the page already checked.
- Ownership is checked in SQL, e.g. `WHERE id = $1 AND customer_id = $2`.

---

## 7. Database schema (`db/schema.sql`)

PostgreSQL. Primary keys are UUIDs (`gen_random_uuid()`), timestamps are `timestamptz`. Validate that any ID from a URL is a valid UUID **before** querying.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;        -- similar-spelling search
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;  -- soundex / metaphone / levenshtein

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('customer','technician','admin')),
  is_blocked boolean NOT NULL DEFAULT false,
  failed_login_attempts int NOT NULL DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_unique ON users (lower(email));

CREATE TABLE sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_idx ON sessions (user_id);

CREATE TABLE service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  icon text,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE category_aliases (          -- words people type for a category
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  alias text NOT NULL,
  UNIQUE (category_id, alias)
);
CREATE INDEX category_aliases_trgm ON category_aliases USING gin (alias gin_trgm_ops);

CREATE TABLE technician_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES service_categories(id),
  headline text,
  bio text,
  experience_years int NOT NULL CHECK (experience_years BETWEEN 0 AND 60),
  service_area text NOT NULL,
  approval_status text NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending','approved','rejected')),
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE technician_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id uuid NOT NULL REFERENCES technician_profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric(10,2) CHECK (price IS NULL OR price >= 0),   -- NPR; NULL when price_type = 'quote'
  price_type text NOT NULL CHECK (price_type IN ('per_visit','per_hour','fixed','quote')),
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE technician_availability (
  technician_id uuid NOT NULL REFERENCES technician_profiles(user_id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),   -- 0 = Sunday
  time_window text NOT NULL CHECK (time_window IN ('morning','afternoon','evening')),
  PRIMARY KEY (technician_id, day_of_week, time_window)
);

CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label text NOT NULL,
  province text NOT NULL,
  district text NOT NULL,
  municipality text NOT NULL,
  ward text NOT NULL,
  area text NOT NULL,
  landmark text,
  is_default boolean NOT NULL DEFAULT false
);
CREATE UNIQUE INDEX one_default_address_per_user ON addresses (user_id) WHERE is_default;

CREATE SEQUENCE booking_ref_seq;

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,                 -- HAT-2026-0001 (built from booking_ref_seq)
  customer_id uuid NOT NULL REFERENCES users(id),
  technician_id uuid NOT NULL REFERENCES technician_profiles(user_id),
  service_id uuid REFERENCES technician_services(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','rejected','in_progress','completed','cancelled')),
  job_summary text NOT NULL,
  job_description text NOT NULL,
  job_details jsonb NOT NULL DEFAULT '{}'::jsonb,           -- trade-specific answers (§9.3)
  recipient_type text NOT NULL CHECK (recipient_type IN ('self','other')),
  recipient_name text NOT NULL,
  recipient_phone text NOT NULL,
  address_snapshot jsonb NOT NULL,                          -- frozen COPY of the address at booking time
  preferred_date date NOT NULL,
  time_window text NOT NULL CHECK (time_window IN ('morning','afternoon','evening')),
  payment_preference text NOT NULL DEFAULT 'cash' CHECK (payment_preference = 'cash'),
  status_note text,                                         -- reject/cancel reason
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- A technician can have only one accepted/in-progress job per date + time window:
CREATE UNIQUE INDEX one_active_booking_per_slot
  ON bookings (technician_id, preferred_date, time_window)
  WHERE status IN ('accepted','in_progress');
CREATE INDEX bookings_customer_idx ON bookings (customer_id, created_at DESC);
CREATE INDEX bookings_technician_idx ON bookings (technician_id, status);

CREATE TABLE booking_status_history (
  id bigserial PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status text NOT NULL,
  changed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  note text,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,   -- one review per booking
  customer_id uuid NOT NULL REFERENCES users(id),
  technician_id uuid NOT NULL REFERENCES technician_profiles(user_id),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text CHECK (comment IS NULL OR char_length(comment) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON notifications (user_id, is_read, created_at DESC);

-- Search indexes (§8)
CREATE INDEX users_name_trgm ON users USING gin (full_name gin_trgm_ops);
CREATE INDEX tech_services_title_trgm ON technician_services USING gin (title gin_trgm_ops);
CREATE INDEX tech_area_trgm ON technician_profiles USING gin (service_area gin_trgm_ops);
```

Notes:
- The average rating and review count are **computed with a query** (`AVG`, `COUNT` on `reviews`), not stored.
- Each technician has **one profession** (`category_id`).
- Deleting a user who has bookings is blocked by the foreign keys; the admin UI must offer **Block** instead and explain why.
- Multi-step changes (create booking + history + notification; register technician; accept booking) run inside **one transaction** (`BEGIN … COMMIT`, `ROLLBACK` on error).

---

## 8. Search (teacher priority)

### 8.1 What users can do
- One search box (home hero, header, `/technicians`) plus filters and sorting. All state lives in the URL so results are shareable and the Back button works:
  `/technicians?q=plamber&category=plumber&area=birtamod&day=1&sort=rating&page=2`
- **Filters:** profession (category), service area, available on a weekday, maximum price (per visit/hour), minimum rating.
- **Sort:** Best match (default when `q` is present), Highest rated, Most experienced, Lowest price.
- **Result card:** initials avatar, name, profession, headline, experience, area, "from NPR X" (lowest active service price), average rating and count (or "New" if none), availability days.
- Pagination: 12 per page.
- **Empty state:** say nothing matched, show "Did you mean …?" (nearest alias/category) and category shortcuts. Never a blank screen.
- Loading and error states on every results view.

### 8.2 How matching works (all in SQL)
1. **Normalize** the query: trim, lowercase, collapse spaces, drop punctuation, limit to 60 characters. Escape `%` and `_` before any `ILIKE`.
2. **Category/alias match (highest weight):** the query is compared to `service_categories.name` and `category_aliases.alias` with `pg_trgm` `similarity()` (threshold about 0.3). This is what makes "plamber" or "bijuli" find the right profession.
3. **Name, service title and area match:** `similarity()` / `ILIKE` on technician name, service titles, `service_area`, headline.
4. **Phonetic fallback:** `fuzzystrmatch` (`soundex`, `dmetaphone`) as a secondary signal. These are English-oriented and weaker for romanized Nepali words, so the **alias table** is the main tool for local words.
5. **Full-text:** `to_tsvector('simple', …)` over headline and bio (use the `simple` config so no English stemming), ranked with `ts_rank`.
6. **Ranking score** = weighted sum: category/alias match > name match > service title match > full-text rank, plus a small boost for rating and for being available.
7. Only technicians with `approval_status = 'approved'` and `users.is_blocked = false` are ever returned.

### 8.3 Safety rules for the search query
- The search text and every filter value are **query parameters** (`$n`), never concatenated.
- Dynamic parts (which filters are present, the `ORDER BY`) are built from **fixed whitelists** in code, never from user input. Example: `sort=rating` maps to a hard-coded `ORDER BY` string.
- Validate all search params with zod; invalid values fall back to defaults.

### 8.4 Suggestions endpoint
- `GET /api/search/suggest?q=…` returns up to 6 matching categories/aliases and technician names (read-only, parameterized, same normalization). Used by the search box dropdown.

---

## 9. Bookings

### 9.1 Status lifecycle

`pending` → `accepted` | `rejected` | `cancelled`
`accepted` → `in_progress` | `cancelled`
`in_progress` → `completed`

| Transition | Who may do it | Rules |
|---|---|---|
| create → `pending` | Customer | Technician must be approved and not blocked |
| `pending` → `accepted` | That technician | Fails if the slot is already taken (unique index) |
| `pending` → `rejected` | That technician | Optional reason |
| `pending`/`accepted` → `cancelled` | Booking's customer | Optional reason |
| `accepted` → `cancelled` | That technician | Reason required |
| `accepted` → `in_progress` | That technician | |
| `in_progress` → `completed` | That technician | |
| any non-final → `cancelled` | Admin | |

- Final states: `rejected`, `completed`, `cancelled`. No transition out of them.
- The allowed-transition table lives in **one** place (`utils/booking-status.ts`) and the **server enforces it** (update with `WHERE id = $1 AND status = $2`; if 0 rows updated, return an error).
- A customer can **never** mark a booking accepted, in progress or completed.
- Every change writes a `booking_status_history` row and a notification for the other party, inside the same transaction.
- Labels: pending = "Awaiting technician response" (never "confirmed"), accepted = "Accepted", etc.

### 9.2 Booking form (`/booking/[technicianId]`, signed-in customer)

Stepper with validation before each next step; Back keeps entered data; duplicate submit prevented (disable button, loading state); on failure data is kept and a retry is offered.

- **A. Service:** technician summary; optionally choose one of their listed services (shows price).
- **B. Job details:** summary (short), description (20–1000 chars), trade-specific questions (§9.3).
- **C. Recipient:** "For me" (prefilled from profile) or "For someone else" (name + phone; does not overwrite the profile).
- **D. Address:** pick a saved address (default preselected) or enter a new one; checkbox "save this address to my profile" is an explicit opt-in. The booking stores a **snapshot copy** in `address_snapshot`.
- **E. Date and time:** date from today onward; time window morning/afternoon/evening, labelled "preference — the technician confirms when accepting". The server rejects dates in the past and weekday/window combinations the technician does not offer.
- **F. Payment:** cash. "Online payment — coming soon" shown disabled with an honest note. No card fields, ever.
- **G. Review and submit:** summary with an Edit link per section. On success show "Request sent — awaiting technician response" and link to the booking.

### 9.3 Trade-specific questions (`src/lib/trade-questions.ts`)

Shared fields for every trade: problem summary, description, optional access notes. Extra fields by category slug (dropdown-driven; optional fields stay optional). Categories without a config entry use only the shared fields. Answers are stored in `bookings.job_details` and validated with zod against this config.

| Trade | Fields |
|---|---|
| electrician | issueType (light / switch_socket / wiring / breaker_power / appliance_connection / other), affectedArea, urgency |
| plumber | issueType (leak / blocked_drain / tap / toilet / tank_pump / pipe_installation / other), issueLocation, waterUnavailable |
| carpenter | jobType (repair / door_window / furniture / custom_install / other), material, approximateSize |
| appliance-repair | applianceType, brandModel, problemCategory, powersOn |
| painting | targetScope (room_area / exterior), approxSize, paintType (new / repaint), surfaceNotes |
| general-maintenance | taskCategory, details, approxItems |

### 9.4 Reviews
- Only the **booking's own customer**, only when status is `completed`, only **once** (`reviews.booking_id` is unique).
- Rating 1–5 required; comment optional, max 500 characters. Shown as plain text (React escapes it).
- Technician profile shows average rating, count and the latest reviews (paginated).

### 9.5 Notifications (in-app only; no SMS or email)
- Created on: new booking (→ technician), every status change (→ the other party), technician approved/rejected (→ technician).
- Header shows an unread count; `/notifications` lists them and marks them read.

---

## 10. Security requirements (mandatory)

### Teacher's rules
- RDBMS (PostgreSQL). **No ORM.** Raw SQL with parameterized queries. Authentication system. Password hashing. SQL-injection protection through prepared/parameterized statements.

### Checklist

**SQL injection**
- [ ] Every query uses `$1, $2, …` placeholders and `pg`'s `query(text, values)`. No template-string interpolation of variables into SQL anywhere.
- [ ] Dynamic `ORDER BY` / column names come from hard-coded whitelists only.
- [ ] All SQL is in `src/lib/queries/`. A repo search for `${` inside SQL strings must find nothing user-controlled.
- [ ] IDs from URLs and forms are validated as UUIDs before use.

**Authentication and passwords**
- [ ] bcryptjs hashing (cost 12); plain passwords are never stored, logged or returned.
- [ ] Generic login error; equal-timing check for unknown emails; lockout after 5 failures for 15 minutes.
- [ ] Session tokens random, stored hashed, httpOnly + sameSite cookie, expiry, deleted on logout, rotated on login.

**Authorization**
- [ ] Guard at the start of every protected page and every Server Action.
- [ ] Ownership checks in SQL (customer sees only own bookings, technician only theirs, admin all).
- [ ] Role and status values are never taken from client input where they decide privileges.
- [ ] Admin cannot block/delete themselves or the last admin.

**Input and output**
- [ ] zod validation on the server for every action and every search param; length limits everywhere.
- [ ] No `dangerouslySetInnerHTML`. User text is always rendered through React (escaped).
- [ ] `next` redirect parameter accepted only if it is a relative path.

**CSRF and requests**
- [ ] State changes only through Server Actions (POST, Origin-checked by Next.js). Route handlers are read-only `GET`.

**Errors and secrets**
- [ ] Users see friendly generic errors; SQL errors, stack traces and secrets go only to server logs. Passwords and tokens are never logged.
- [ ] Secrets only in `.env.local` (git-ignored); `.env.example` has placeholders.
- [ ] `error.tsx`, `not-found.tsx` and `loading.tsx` exist so pages never show raw crashes.

**Database and platform**
- [ ] The running app uses a **limited Postgres user** (`SELECT/INSERT/UPDATE/DELETE` on tables and `USAGE` on sequences; no superuser, no `DROP`/`CREATE`).
- [ ] Security headers in `next.config.ts`: `X-Content-Type-Options: nosniff`, `Referrer-Policy`, frame protection (`frame-ancestors 'none'` / `X-Frame-Options: DENY`), and a Content-Security-Policy that works with Next.js.
- [ ] `db:reset` refuses to run when `NODE_ENV=production`.
- [ ] If deployed: HTTPS only, `secure` cookies.

### Manual attack tests (run before declaring done)
1. Login with email `' OR 1=1 --` → must fail normally, no error leak.
2. Search for `'; DROP TABLE users; --`, `%`, `_`, and a 10,000-character string → no crash, no injection.
3. Register a script tag as name (`<script>alert(1)</script>`) → shown as plain text everywhere.
4. As a customer open `/admin`, `/technician` → blocked.
5. As customer A open customer B's `/bookings/[id]` → not found.
6. Call booking actions for the wrong role or wrong owner → rejected.
7. Wrong password 6 times → account locked.
8. Inspect cookies in DevTools → `httpOnly` set; open the database → `password_hash` starts with `$2`; `sessions.token_hash` is not the cookie value.
9. Double-accept a booking slot → second is rejected.
10. Submit a past date or a non-offered weekday → rejected by the server even if the browser check is bypassed.

---

## 11. Design system and UX (Tailwind)

> **Amended Nov 2026 (owner-approved):** the original terracotta "warm workshop"
> system was replaced by the **Industrial Modernism** system below. The full
> design contract lives in `DESIGN.md`; this section records the binding
> values. All other spec sections and §0 rules remain unchanged.

### Tokens (define in the Tailwind theme / global CSS)

**Primary palette**

| Token | Value | Use |
|---|---|---|
| primary | `#414A2F` | Olive green — primary brand color, buttons, important elements |
| bg | `#F2F0E8` | Warm off-white — main page background |
| ink | `#25271F` | Dark charcoal — headings, body text, dark surfaces |
| surface | `#FFFFFF` | Cards, inputs, contrasting surfaces |

**Supporting palette**

| Token | Value | Use |
|---|---|---|
| primary-soft | `#68734C` | Light olive — secondary brand elements |
| border | `#DCD9CC` | Warm borders and separators |
| muted | `#77786F` | Muted text — large labels (≥18px bold / ≥24px) and non-essential marks; **not** small body text (contrast ~3.9:1 on bg) |
| muted-strong | `#5E5F57` | Small secondary text — passes AA ≥4.5:1 on bg and surface |
| bg-subtle | `#E9E7DE` | Neutral surface — subtle background variation |

**Functional palette** (meaningful states only, never decoration)

| Token | Value | Use |
|---|---|---|
| success | `#287A50` | Successful actions, confirmations |
| warning | `#B77A35` | Warnings, pending attention |
| error | `#B7443D` | Errors, destructive actions |

Color rules: off-white dominates backgrounds; charcoal gives text contrast;
white separates surfaces; supporting colors never compete with the primary
palette; no extra accent colors beyond this table. Text is charcoal/ink
(`ink` or `muted-strong`) on light surfaces — `muted` only at large sizes.
Status badges are text-first with a colour signal (coloured dot/left rule),
never colour-only.

### Typography

- Display/headings/navigation/buttons: **Space Grotesk** (geometric grotesk; weights 400/500/600/700) — sharp, technical, marketplace-native; wide uppercase for impact.
- Body/descriptions/forms/long text: **Plus Jakarta Sans** (weights 400/500/600).
- Both self-hosted via `next/font` — no font CDN. **Never Inter.**
- Large, bold, confident headings; hierarchy via size and weight.
- Scale (desktop; responsive down on mobile): display 48–56px, page headings
  32–40px, section headings 24–28px, component headings 18–20px, body 15–16px,
  labels 13–14px, supporting text 12px. Body 16px on mobile; 14px minimum for
  secondary text.

### Borders, shapes and surfaces

- Prefer square corners: standard border radius **0–4px**. No pill-shaped
  buttons or containers.
- 1px solid borders; visible separators; borders and alignment instead of
  shadows.
- Solid surfaces only (white, off-white, olive, charcoal). Avoid nested
  containers; do not put every element inside a card.
- **Strictly avoid:** drop shadows, gradient backgrounds, glass/glassmorphism,
  glow, floating decorative elements, excessive blur, excessive rounding.

Spacing is on the 4px base: 4 / 8 / 16 / 24 / 32 / 48 / 64. Container side
padding: 32px desktop, 24px tablet, 16px mobile; max content width 1200px.

### Photography and visual assets

- Photography-led brand: professional photography of Nepalese technicians in
  real residential/commercial settings, natural lighting, realistic equipment.
- No generic Western stock photography, no AI-generated imagery, no
  decorative image effects.
- Until real photo assets exist, use **honest photo slots** — bordered
  charcoal/off-white blocks with truthful captions describing what the photo
  will show. Never substitute invented imagery (§0).
- Technician profiles keep **initials avatars** (photos per technician remain
  out of scope; no file uploads).

### Component rules

- Buttons: primary (olive, white text), secondary (white/transparent,
  charcoal border and text), ghost; sharp corners; visible hover, focus,
  disabled and loading states. Every action button disables while working.
- Inputs: solid white/off-white background, 1px border, sharp corners,
  visible label above, error text below (never color-only).
- Icons: **Lucide** (`lucide-react`), sparse and purposeful — consistent
  sizing, no decorative icon beside every heading, never emoji, never a mix
  of icon sets. Typography and layout lead; icons support.
- Breakpoints: mobile `< 640px`, tablet `640–1023px`, desktop `≥ 1024px`. No
  horizontal overflow at any size.
- Avoid decorative treatments: no gradients, no purple/indigo, no glass
  effects, no piles of identical cards (structured rows/grids instead).
- Status badges use text plus colour (including `warning` for pending
  states).

### UX rules
- Mobile-first; the search box is the most prominent element on the home page.
- Every list and form shows loading, empty, error and success states.
- Forms: validate on blur/submit, errors announced with `role="alert"` / `aria-live`, focus moves to the first error.
- Every action button shows a loading/disabled state to prevent double submits.
- Keyboard friendly, visible focus rings, sensible page titles.
- Status badges use text plus colour.

---

## 12. Seed data (`db/seed.sql`) and admin account

**Seeded:** the six categories and their search aliases only. **Not seeded:** technicians, customers, bookings, reviews. Test accounts are created by registering through the app.

Categories: `electrician`, `plumber`, `carpenter`, `appliance-repair`, `painting`, `general-maintenance` (each with name, tagline, short description, icon key).

Starter aliases (the team should review and extend these, especially local-language terms):

| Category | Aliases |
|---|---|
| electrician | electric, electrical, bijuli, bijuli mistri, wiring, switch, socket |
| plumber | plumbing, plumbar, plamber, pani, tap, pipe, leak |
| carpenter | carpentry, furniture, door, window |
| appliance-repair | appliance, fridge, refrigerator, washing machine, tv |
| painting | painter, paint, rang, rangrogan |
| general-maintenance | maintenance, handyman, repair, mistri |

**First admin:** `npm run create-admin` reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`, validates the password rules, hashes it with bcryptjs and inserts a user with role `admin`. No admin credentials or hashes are committed to the repo.

**Scripts (cross-platform, in `package.json`):**
- `db:schema` → run `db/schema.sql` via `scripts/run-sql.ts`
- `db:seed` → run `db/seed.sql`
- `db:reset` → drop and recreate everything (**development only**)
- `create-admin`

---

## 13. Validation rules (zod, server-side; browser checks are convenience only)

- Required fields with friendly messages.
- Name 2–80 chars. Email valid, max 254. Phone: Nepali mobile, 10 digits starting `96`, `97` or `98` (`^9[678]\d{8}$`).
- Password 8–64 chars, at least one letter and one number.
- Experience 0–60 years. Price ≥ 0 (NPR); required unless price type is `quote`.
- Booking: summary 5–100 chars, description 20–1000 chars, date not in the past, valid time window, recipient name and phone required when "for someone else".
- Review: rating integer 1–5, comment ≤ 500 chars.
- Trim all strings; reject unexpected fields.

---

## 14. Build order with checkpoints

After each step the AI gives a **Check yourself** block. Minimum checks are listed here. Do not start the next step until the owner confirms the checks pass. Commit to Git after each step.

**Step 0 — Tools.** Node.js, npm, Git, PostgreSQL installed.
Check: `node -v`, `npm -v`, `git --version`, `psql --version` each print a version.

**Step 1 — Project scaffold.** Create the Next.js app (TypeScript, Tailwind, ESLint, App Router, `src/` dir). Install dependencies from §3. Add `.env.example`, `.gitignore` entry for `.env.local`.
Check: `npm run dev` → `http://localhost:3000` shows the starter page. `npm run lint` passes.

**Step 2 — Database.** Create database `hireatech` and the limited user `hireatech_app`. Write `schema.sql`, `seed.sql`, `scripts/run-sql.ts`, `lib/db.ts`, and `/api/health`.
Check: in `psql`: `\dt` lists all tables; `SELECT slug FROM service_categories;` returns 6 rows; `SELECT count(*) FROM category_aliases;` is above 0; open `http://localhost:3000/api/health` → `{"db":"ok"}`. Stop the Postgres service and reload `/api/health` → clean error, no stack trace.

**Step 3 — Layout and public pages.** Tailwind tokens, fonts, header/footer/mobile menu, Home, How it works, About, Help, Services, not-found, error pages.
Check: open each URL; resize to phone width (DevTools device mode) with no horizontal scroll; press Tab through the header and see focus; open `/does-not-exist` → friendly 404.

**Step 4 — Authentication.** Register (customer), login, logout, sessions, guards, redirects, lockout.
Check: after registering, run `SELECT email, role, left(password_hash, 4) FROM users;` → hash starts with `$2`; DevTools → Application → Cookies shows an `httpOnly` session cookie; `SELECT * FROM sessions;` has a row and its `token_hash` differs from the cookie value; logout removes the row; opening `/bookings` signed out redirects to `/login`; wrong password 6 times locks the account.

**Step 5 — Admin bootstrap and categories.** `create-admin` script, admin login, `/admin`, categories + aliases management.
Check: run `npm run create-admin`, log in as admin; add a category and see the new row in `psql`; a customer account cannot open `/admin`.

**Step 6 — Technician onboarding.** Technician registration, profile, services, availability, pending status, admin approval/rejection.
Check: register a technician → `SELECT approval_status FROM technician_profiles;` shows `pending`; the technician does not appear on `/technicians`; approve as admin → status `approved` and technician appears.

**Step 7 — Search and browse.** `/technicians`, `/services/[slug]`, filters, sorting, pagination, suggestions endpoint, technician profile page.
Check: search `plamber` and `bijuli` → correct professions; `/api/search/suggest?q=plum` returns JSON; search `'; DROP TABLE users; --` → no crash and `users` still exists; filter by weekday and sort by rating work; the URL changes with filters. Optional: run `EXPLAIN ANALYZE` on the search query in `psql` and see index use.

**Step 8 — Customer account.** Profile edit, change password, addresses CRUD with default.
Check: changes appear in `users` / `addresses`; only one default address per user; changing password logs out other sessions.

**Step 9 — Booking flow.** `/booking/[technicianId]` (A–G), `/bookings`, `/bookings/[id]`.
Check: after submit, `bookings`, `booking_status_history` and `notifications` each have a new row; a past date is rejected even if the browser check is bypassed; the saved address in the booking does not change when the address is later edited; customer B cannot open customer A's booking.

**Step 10 — Technician job handling and notifications.** Requests page, accept/reject, in progress, completed, cancel with reason, customer cancel, notifications UI.
Check: each status change adds a `booking_status_history` row and a notification; accepting two bookings for the same technician/date/window → second fails; illegal transitions (e.g. `pending` → `completed`) are refused.

**Step 11 — Reviews.** Review form on completed bookings, ratings on profiles and search results.
Check: review not possible before `completed`; second review for the same booking is refused; `SELECT avg(rating) FROM reviews WHERE technician_id = '…';` matches what the profile shows.

**Step 12 — Admin operations.** All bookings, user block/unblock/delete rules.
Check: blocking a user deletes their sessions and they cannot log in; deleting a user with bookings is refused with a clear message; the last admin cannot be blocked or deleted.

**Step 13 — Security and robustness pass.** Go through §10 checklist and run all 10 manual attack tests; add security headers; review every query for parameterization.
Check: record the result of each attack test (pass/fail) in the README.

**Step 14 — Polish and docs.** Responsive and accessibility pass, no console errors, README with setup, commands, folder map, test accounts instructions, and the security summary.
Check: fresh clone → follow README → app runs.

---

## 15. Definition of done

- All routes in §5 work with correct access rules; deep links and refresh work.
- Full journey works: technician registers → admin approves → customer searches → books → technician accepts → in progress → completed → customer reviews.
- No ORM; every query is parameterized; §10 checklist and all 10 attack tests pass.
- Search is forgiving of typos and sound-alike spellings and finds local terms through aliases.
- Pending requests are never labelled "confirmed".
- Loading, empty, error and success states appear on every interactive page; no console errors; no horizontal overflow; keyboard friendly.
- No demo technicians, customers or bookings exist in the repo or seed files.

## 16. Out of scope

Real payments, SMS/email, maps/geolocation, chat, file/photo uploads, real password-reset emails, "post a job and receive offers", technician verification documents, multiple languages.
