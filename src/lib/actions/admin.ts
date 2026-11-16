"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { requireRole, getCurrentUser } from "@/lib/auth/guards";
import { pool } from "@/lib/db";
import { setTechnicianApprovalStatus } from "@/lib/queries/technicians";
import { createNotification } from "@/lib/queries/notifications";
import {
  createCategory,
  updateCategory,
  setCategoryActive,
  createCategoryAlias,
  deleteCategoryAlias,
  slugExists,
} from "@/lib/queries/categories";

const technicianIdSchema = z.string().uuid("Invalid technician id.");
const rejectSchema = z.object({
  technicianId: z.string().uuid("Invalid technician id."),
  reason: z.string().trim().min(1, "Rejection reason is required").max(500),
});
const cancelBookingSchema = z.object({
  bookingId: z.string().uuid("Invalid booking id."),
  reason: z.string().trim().max(500).optional(),
});

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; fieldErrors?: Record<string, string[]> } };

const NON_FINAL_STATUSES = ["pending", "accepted", "in_progress"];

/**
 * Approve a pending technician. Sets approval_status to 'approved',
 * clears any rejection reason, and notifies the technician.
 */
export async function approveTechnician(
  technicianUserId: unknown,
): Promise<ActionResult> {
  await requireRole(["admin"]);

  const parsed = technicianIdSchema.safeParse(technicianUserId);
  if (!parsed.success) {
    return {
      ok: false,
      error: { message: "Invalid technician id." },
    };
  }

  await setTechnicianApprovalStatus(parsed.data, "approved", null);

  await createNotification(
    parsed.data,
    "Your technician application has been approved. You can now receive bookings.",
  );

  return { ok: true, data: undefined };
}

/**
 * Reject a pending technician. Sets approval_status to 'rejected',
 * stores the reason, and notifies the technician.
 */
export async function rejectTechnician(input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);

  const parsed = rejectSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
  }

  await setTechnicianApprovalStatus(
    parsed.data.technicianId,
    "rejected",
    parsed.data.reason,
  );

  await createNotification(
    parsed.data.technicianId,
    `Your technician application was not approved. Reason: ${parsed.data.reason}`,
  );

  return { ok: true, data: undefined };
}

/**
 * Cancel a booking as admin. Any non-final booking (pending / accepted /
 * in_progress) can be cancelled. Runs inside a single transaction:
 * update booking + write status history + notify both parties.
 */
export async function cancelBooking(input: unknown): Promise<ActionResult> {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return { ok: false, error: { message: "Admin access required." } };
  }

  const parsed = cancelBookingSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
  }

  const { bookingId, reason } = parsed.data;

  // Check the booking exists and is cancellable.
  const existing = await pool.query(
    `SELECT id, status, customer_id, technician_id FROM bookings WHERE id = $1`,
    [bookingId],
  );
  const booking = existing.rows[0];
  if (!booking) {
    return { ok: false, error: { message: "Booking not found." } };
  }
  if (!NON_FINAL_STATUSES.includes(booking.status)) {
    return {
      ok: false,
      error: { message: `Cannot cancel a ${booking.status} booking.` },
    };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update the booking.
    await client.query(
      `UPDATE bookings
        SET status = 'cancelled',
            status_note = $2,
            updated_at = now()
       WHERE id = $1`,
      [bookingId, reason ?? "Cancelled by admin."],
    );

    // Write status history.
    await client.query(
      `INSERT INTO booking_status_history (booking_id, status, changed_by, note)
       VALUES ($1, 'cancelled', $2, $3)`,
      [bookingId, admin.id, reason ?? "Cancelled by admin."],
    );

    // Notify both parties.
    await client.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)`,
      [booking.customer_id, "Your booking was cancelled by the administrator."],
    );
    await client.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)`,
      [booking.technician_id, "A booking assigned to you was cancelled by the administrator."],
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  return { ok: true, data: undefined };
}

/** Slug validation: lowercase, alphanumeric + hyphens, 3–60 chars. */
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters").max(60),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  icon: z.string().trim().max(50).optional().or(z.literal("")),
  isActive: z.coerce.boolean(),
});

const aliasSchema = z.object({
  categoryId: z.string().uuid("Invalid category id."),
  alias: z.string().trim().min(1, "Alias is required").max(60),
});

const categoryIdSchema = z.string().uuid("Invalid category id.");

/**
 * Create a new service category. Slug must be unique.
 */
export async function createCategoryAction(input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
  }

  const { name, slug, tagline, description, icon, isActive } = parsed.data;

  if (!slugRegex.test(slug)) {
    return {
      ok: false,
      error: {
        message: "Slug must be lowercase letters, numbers and hyphens only.",
        fieldErrors: { slug: ["Invalid slug format"] },
      },
    };
  }

  if (await slugExists(slug, null)) {
    return {
      ok: false,
      error: { message: "A category with this slug already exists.", fieldErrors: { slug: ["Slug already taken"] } },
    };
  }

  await createCategory({
    name,
    slug,
    tagline: tagline || null,
    description: description || null,
    icon: icon || null,
    isActive,
  });

  updateTag("categories");
  return { ok: true, data: undefined };
}

/**
 * Update an existing category.
 */
export async function updateCategoryAction(
  id: unknown,
  input: unknown,
): Promise<ActionResult> {
  await requireRole(["admin"]);

  const idParsed = categoryIdSchema.safeParse(id);
  if (!idParsed.success) {
    return { ok: false, error: { message: "Invalid category id." } };
  }

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
  }

  const { name, slug, tagline, description, icon, isActive } = parsed.data;

  if (!slugRegex.test(slug)) {
    return {
      ok: false,
      error: {
        message: "Slug must be lowercase letters, numbers and hyphens only.",
        fieldErrors: { slug: ["Invalid slug format"] },
      },
    };
  }

  if (await slugExists(slug, idParsed.data)) {
    return {
      ok: false,
      error: { message: "A category with this slug already exists.", fieldErrors: { slug: ["Slug already taken"] } },
    };
  }

  await updateCategory(idParsed.data, {
    name,
    tagline: tagline || null,
    description: description || null,
    icon: icon || null,
    isActive,
  });

  updateTag("categories");
  return { ok: true, data: undefined };
}

/**
 * Activate or deactivate a category. Deactivating hides it from search.
 */
export async function setCategoryActiveAction(
  id: unknown,
  isActive: unknown,
): Promise<ActionResult> {
  await requireRole(["admin"]);

  const idParsed = categoryIdSchema.safeParse(id);
  if (!idParsed.success) {
    return { ok: false, error: { message: "Invalid category id." } };
  }

  const active = z.coerce.boolean().safeParse(isActive);
  if (!active.success) {
    return { ok: false, error: { message: "Invalid active flag." } };
  }

  await setCategoryActive(idParsed.data, active.data);

  updateTag("categories");
  return { ok: true, data: undefined };
}

/**
 * Add a search alias to a category.
 */
export async function createCategoryAliasAction(input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);

  const parsed = aliasSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
  }

  await createCategoryAlias(parsed.data.categoryId, parsed.data.alias);
  return { ok: true, data: undefined };
}

/**
 * Delete a search alias.
 */
export async function deleteCategoryAliasAction(aliasId: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);

  const parsed = categoryIdSchema.safeParse(aliasId);
  if (!parsed.success) {
    return { ok: false, error: { message: "Invalid alias id." } };
  }

  await deleteCategoryAlias(parsed.data);
  return { ok: true, data: undefined };
}
