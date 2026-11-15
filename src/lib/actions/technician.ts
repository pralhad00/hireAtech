"use server";

import { technicianRegisterSchema, TechnicianRegisterInput } from "@/lib/validation/auth";
import { hashPassword } from "@/lib/auth/password";
import { findUserByEmail } from "@/lib/queries/users";
import { createUserSession } from "@/lib/auth/session";
import { query } from "@/lib/db";

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; fieldErrors?: Record<string, string[]> } };

/**
 * Register a new technician.
 * Creates the users row (role = technician) and the technician_profiles row
 * (approval_status = pending) in one transaction.
 * The first selected category is stored as the primary category on the profile.
 * Additional categories can be managed later on the technician dashboard.
 */
export async function registerTechnicianAction(input: TechnicianRegisterInput): Promise<ActionResult<{ userId: string }>> {
  const parsed = technicianRegisterSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
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

  // Primary category = first selected; the rest can be added on the dashboard later.
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
    return {
      ok: false,
      error: { message: "Registration failed. Please try again." },
    };
  }
}
