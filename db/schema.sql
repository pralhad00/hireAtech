-- hireatech schema (spec §7). Run as admin: npm run db:schema
-- Raw SQL only. No migrations yet: re-appliable from scratch via db:reset.

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

-- Search indexes (§8): names, service titles, areas
CREATE INDEX users_name_trgm ON users USING gin (full_name gin_trgm_ops);
CREATE INDEX tech_services_title_trgm ON technician_services USING gin (title gin_trgm_ops);
CREATE INDEX tech_area_trgm ON technician_profiles USING gin (service_area gin_trgm_ops);
