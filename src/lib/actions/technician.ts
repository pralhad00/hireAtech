"use server";

import { technicianRegisterSchema, TechnicianRegisterInput } from "@/lib/validation/auth";
import { technicianProfileSchema, TechnicianProfileInput } from "@/lib/validation/auth";
import { technicianServiceSchema, TechnicianServiceInput } from "@/lib/validation/auth";
import { hashPassword } from "@/lib/auth/password";
import { findUserByEmail } from "@/lib/queries/users";
import { createUserSession } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/guards";

type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: { message: string; fieldErrors?: Record<string, string[]> } };

function zodFieldErrors(error: unknown): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  const issues = Array.isArray(error) ? error : [];
  for (const issue of issues) {
    const path = Array.isArray((issue as { path?: unknown[] }).path)
      ? ((issue as { path: unknown[] }).path.join("."))
      : "";
    const msg = (issue as { message?: string }).message ?? "Invalid";
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(msg);
  }
  return fieldErrors;
}

/**
 * Register a new technician.
 * Creates the users row (role = technician) and the technician_profiles row
 * (approval_status = pending) in one transaction.
 * The first selected category is stored as the primary category on the profile.
 */
export async function registerTechnicianAction(input: TechnicianRegisterInput): Promise<ActionResult<{ userId: string }>> {
  const parsed = technicianRegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { message: "Validation failed", fieldErrors: zodFieldErrors(parsed.error.issues) } };
  }

  const { fullName, email, phone, experienceYears, categoryIds, password } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return {
      ok: false,
      error: { message: "An account with this email already exists", fieldErrors: { email: ["Email already registered"] } },
    };
  }

  const passwordHash = await hashPassword(password);
  const primaryCategoryId = categoryIds[0];

  await query("BEGIN");
  try {
    const userResult = await query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, 'technician')
       RETURNING id, email`,
      [email, passwordHash, fullName, phone],
    );
    const user = userResult.rows[0];

    await query(
      `INSERT INTO technician_profiles (user_id, category_id, experience_years, service_area, approval_status)
       VALUES ($1, $2, $3, NULL, 'pending')`,
      [user.id, primaryCategoryId, experienceYears],
    );

    await query("COMMIT");

    await createUserSession(user.id);
    return { ok: true, data: { userId: user.id } };
  } catch {
    await query("ROLLBACK");
    return { ok: false, error: { message: "Registration failed. Please try again." } };
  }
}

/**
 * Update the signed-in technician's profile (phone, headline, bio, experience, category).
 * Name is intentionally not editable.
 */
export async function updateTechnicianProfileAction(input: TechnicianProfileInput): Promise<ActionResult> {
  const parsed = technicianProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { message: "Validation failed", fieldErrors: zodFieldErrors(parsed.error.issues) } };
  }

  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    return { ok: false, error: { message: "Not authenticated as a technician." } };
  }

  const { phone, headline, bio, experienceYears, categoryId } = parsed.data;

  await query("BEGIN");
  try {
    await query(
      `UPDATE users SET phone = $1 WHERE id = $2 AND role = 'technician'`,
      [phone, user.id],
    );
    await query(
      `UPDATE technician_profiles
       SET headline = $1, bio = $2, experience_years = $3, category_id = $4
       WHERE user_id = $5`,
      [headline || null, bio || null, experienceYears, categoryId, user.id],
    );
    await query("COMMIT");
    return { ok: true, data: undefined };
  } catch {
    await query("ROLLBACK");
    return { ok: false, error: { message: "Failed to update profile." } };
  }
}

/**
 * Create or update a technician service.
 * If `id` is provided, updates that service (must belong to the technician).
 */
export async function upsertTechnicianServiceAction(input: TechnicianServiceInput & { id?: string }): Promise<ActionResult> {
  const parsed = technicianServiceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { message: "Validation failed", fieldErrors: zodFieldErrors(parsed.error.issues) } };
  }

  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    return { ok: false, error: { message: "Not authenticated as a technician." } };
  }

  const { id } = input;
  const { title, description, price, priceType, isActive } = parsed.data;

  if (id) {
    await query(
      `UPDATE technician_services
       SET title = $1, description = $2, price = $3, price_type = $4, is_active = $5
       WHERE id = $6 AND technician_id = $7`,
      [title, description || null, price ?? null, priceType, isActive, id, user.id],
    );
  } else {
    await query(
      `INSERT INTO technician_services (technician_id, title, description, price, price_type, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, title, description || null, price ?? null, priceType, isActive],
    );
  }

  return { ok: true, data: undefined };
}

/** Delete a technician service (must belong to the technician). */
export async function deleteTechnicianServiceAction(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    return { ok: false, error: { message: "Not authenticated as a technician." } };
  }

  await query(
    `DELETE FROM technician_services WHERE id = $1 AND technician_id = $2`,
    [id, user.id],
  );
  return { ok: true, data: undefined };
}

/** Create or update a technician availability slot. */
export async function upsertTechnicianAvailabilityAction(dayOfWeek: number, timeWindow: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    return { ok: false, error: { message: "Not authenticated as a technician." } };
  }

  const validDay = dayOfWeek >= 0 && dayOfWeek <= 6;
  const validWindow = ["morning", "afternoon", "evening"].includes(timeWindow);
  if (!validDay || !validWindow) {
    return { ok: false, error: { message: "Invalid day or time window." } };
  }

  await query(
    `INSERT INTO technician_availability (technician_id, day_of_week, time_window)
     VALUES ($1, $2, $3)
     ON CONFLICT (technician_id, day_of_week, time_window) DO NOTHING`,
    [user.id, dayOfWeek, timeWindow],
  );
  return { ok: true, data: undefined };
}

/** Delete a technician availability slot. */
export async function deleteTechnicianAvailabilityAction(dayOfWeek: number, timeWindow: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    return { ok: false, error: { message: "Not authenticated as a technician." } };
  }

  await query(
    `DELETE FROM technician_availability WHERE technician_id = $1 AND day_of_week = $2 AND time_window = $3`,
    [user.id, dayOfWeek, timeWindow],
  );
  return { ok: true, data: undefined };
}

/** Accept a pending booking request. */
export async function acceptBookingAction(bookingId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    return { ok: false, error: { message: "Not authenticated as a technician." } };
  }

  await query("BEGIN");
  try {
    const existing = await query(
      `SELECT id FROM bookings
       WHERE technician_id = $1 AND preferred_date = (SELECT preferred_date FROM bookings WHERE id = $2)
         AND time_window = (SELECT time_window FROM bookings WHERE id = $2)
         AND status IN ('accepted','in_progress')
         AND id <> $2`,
      [user.id, bookingId],
    );
    if (existing.rows.length > 0) {
      await query("ROLLBACK");
      return { ok: false, error: { message: "You already have a booking in this time slot." } };
    }

    const result = await query(
      `UPDATE bookings
       SET status = 'accepted', updated_at = now()
       WHERE id = $1 AND technician_id = $2 AND status = 'pending'
       RETURNING id`,
      [bookingId, user.id],
    );
    if (result.rows.length === 0) {
      await query("ROLLBACK");
      return { ok: false, error: { message: "Booking not found or already handled." } };
    }

    await query("COMMIT");
    return { ok: true, data: undefined };
  } catch {
    await query("ROLLBACK");
    return { ok: false, error: { message: "Failed to accept booking." } };
  }
}

/** Reject a pending booking request with an optional reason. */
export async function rejectBookingAction(bookingId: string, reason?: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "technician") {
    return { ok: false, error: { message: "Not authenticated as a technician." } };
  }

  const result = await query(
    `UPDATE bookings
     SET status = 'rejected', status_note = $1, updated_at = now()
     WHERE id = $2 AND technician_id = $3 AND status = 'pending'
     RETURNING id`,
    [reason ?? null, bookingId, user.id],
  );

  if (result.rows.length === 0) {
    return { ok: false, error: { message: "Booking not found or already handled." } };
  }

  return { ok: true, data: undefined };
}
